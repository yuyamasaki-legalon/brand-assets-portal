import { useCallback, useEffect, useRef, useState } from "react";
import { type Catalog, defaultProducts } from "./catalog-types";

const emptyCatalog = (): Catalog => ({ revision: 0, products: defaultProducts, assets: [] });

// Search never falls back to a bundled snapshot. Admin loads the full catalogue
// separately so a save cannot discard drafts excluded from search.
export function useCatalog(scope: "search" | "admin" = "search") {
  const [catalog, setCatalog] = useState<Catalog>(emptyCatalog);
  const [authMode, setAuthMode] = useState<"local" | "production" | "unavailable">("unavailable");
  const [email, setEmail] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const csrfToken = useRef("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [error, setError] = useState("");
  const pendingRead = useRef<AbortController | null>(null);
  const reload = useCallback(
    async (clear = false) => {
      pendingRead.current?.abort();
      if (clear) {
        setCatalog(emptyCatalog());
        setConnected(false);
      }
      const controller = new AbortController();
      pendingRead.current = controller;
      setLoading(true);
      try {
        try {
          const authResponse = await fetch("/api/auth/session", { cache: "no-store", signal: controller.signal });
          if (!authResponse.ok || !authResponse.headers.get("content-type")?.includes("application/json"))
            throw new Error("ログイン状態を確認できません。再読み込みしてください。");
          const auth = await authResponse.json();
          if (controller.signal.aborted) return;
          if (auth.mode !== "local" && auth.mode !== "production") throw new Error("認証APIの応答が正しくありません。");
          setAuthMode(auth.mode);
          setEmail(auth.email || "");
          csrfToken.current = auth.csrfToken || "";
          const authenticated = auth.mode === "local" || auth.authenticated === true;
          const editor = authenticated && (auth.mode === "local" || auth.canEdit === true);
          setNeedsLogin(!authenticated);
          setCanEdit(editor);
          if (scope === "admin" && !authenticated) throw new Error("会社のGoogleアカウントでログインしてください。");
          if (scope === "admin" && !editor) throw new Error("CMSの管理権限がありません。");
        } catch (authError) {
          if (controller.signal.aborted) return;
          if (scope === "admin") throw authError;
          // Search is independent of the optional management session.
          setAuthMode("unavailable");
          setCanEdit(false);
          setNeedsLogin(true);
          setEmail("");
          csrfToken.current = "";
        }
        const response = await fetch(`/api/brand-assets/${scope === "admin" ? "catalog" : "search"}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        if (response.status === 401) {
          setNeedsLogin(true);
          setCanEdit(false);
          setEmail("");
          csrfToken.current = "";
        }
        if (!response.ok || !response.headers.get("content-type")?.includes("application/json"))
          throw new Error("共有カタログを取得できません。再読み込みしてください。");
        const data: Catalog = await response.json();
        if (controller.signal.aborted) return;
        if (!Array.isArray(data.products) || !Array.isArray(data.assets) || !Number.isInteger(data.revision))
          throw new Error("共有カタログの応答が正しくありません。");
        setCatalog((current) => (data.revision >= current.revision ? data : current));
        setConnected(true);
        setError("");
      } catch (e) {
        if (controller.signal.aborted) return;
        setCatalog(emptyCatalog());
        setConnected(false);
        setError(e instanceof Error ? e.message : "接続できません。");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [scope],
  );
  useEffect(() => {
    void reload();
    const timer = window.setInterval(() => void reload(), 30000);
    const refresh = () => void reload();
    window.addEventListener("focus", refresh);
    return () => {
      pendingRead.current?.abort();
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [reload]);
  const save = async (next: Catalog) => {
    if (!connected) throw new Error("管理APIに接続してから保存してください。");
    if (scope !== "admin" || !canEdit) throw new Error("CMSの変更権限がありません。");
    pendingRead.current?.abort();
    const response = await fetch("/api/brand-assets/catalog", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken.current },
      body: JSON.stringify(next),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "保存できませんでした。");
    setLoading(false);
    setCatalog((current) => (data.revision >= current.revision ? data : current));
    return data as Catalog;
  };
  const login = () => window.location.assign("/api/auth/google/start");
  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "X-CSRF-Token": csrfToken.current },
      });
      if (!response.ok && response.status !== 401) throw new Error("logout failed");
      pendingRead.current?.abort();
      csrfToken.current = "";
      setCatalog(emptyCatalog());
      setConnected(false);
      setCanEdit(false);
      setEmail("");
      setNeedsLogin(true);
      setLoading(false);
      setError("");
      if (scope === "search") await reload(true);
    } catch {
      setError("ログアウトできませんでした。再試行してください。");
    }
  };
  return { catalog, connected, loading, canEdit, error, reload, save, authMode, email, needsLogin, login, logout };
}
