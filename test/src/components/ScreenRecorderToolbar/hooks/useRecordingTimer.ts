import { useEffect, useRef, useState } from "react";

/**
 * 録画経過時間を `"MM:SS"` 形式の文字列で返すフック。
 *
 * `recording` が `true` になると 0 秒からカウントを開始し、
 * `false` になるとタイマーをリセットして `"00:00"` に戻る。
 *
 * @param recording - 録画中かどうか
 * @returns `"MM:SS"` 形式の経過時間文字列
 */
export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const useRecordingTimer = (recording: boolean): string => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (recording) {
      setSeconds(0);
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSeconds(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [recording]);

  return formatTime(seconds);
};
