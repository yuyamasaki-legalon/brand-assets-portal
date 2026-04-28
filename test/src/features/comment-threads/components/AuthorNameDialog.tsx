import {
  Button,
  ButtonGroup,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FormControl,
  TextField,
} from "@legalforce/aegis-react";
import { type ChangeEvent, type KeyboardEvent, useEffect, useState } from "react";

const STORAGE_KEY = "sandbox-comment-author-name";
const LEGACY_STORAGE_KEY = "comment-poc-author-name";

export const getStoredAuthor = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
};

export const setStoredAuthor = (name: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, name);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
};

interface AuthorNameDialogProps {
  open: boolean;
  initialValue?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
}

export const AuthorNameDialog = ({ open, initialValue = "", onOpenChange, onSubmit }: AuthorNameDialogProps) => {
  const [name, setName] = useState(initialValue);

  useEffect(() => {
    if (open) {
      setName(initialValue);
    }
  }, [initialValue, open]);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    setStoredAuthor(trimmed);
    onSubmit(trimmed);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent width="medium" data-comment-ui>
        <DialogHeader>
          <ContentHeader>
            <ContentHeader.Title>コメント用のニックネーム</ContentHeader.Title>
            <ContentHeader.Description>
              一度入力すると、このブラウザでは次回以降も同じ名前を使います。
            </ContentHeader.Description>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <FormControl>
            <FormControl.Label>ニックネーム</FormControl.Label>
            <TextField
              value={name}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
              placeholder="例: PdM 佐藤 / Designer A"
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <FormControl.Caption>ログインは不要です。投稿時刻とニックネームのみ保存します。</FormControl.Caption>
          </FormControl>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button color="information" disabled={!name.trim()} onClick={handleSubmit}>
              保存
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
