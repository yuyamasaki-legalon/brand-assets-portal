import type { FinalLine } from "../hooks/useSpeechRecognition";
import styles from "../index.module.css";

type SubtitleBarProps = {
  finalLines: FinalLine[];
  transcript: string;
};

/**
 * 音声認識の結果を字幕として画面下部に表示するバー。
 *
 * 確定済みの行（{@link FinalLine}）と、認識途中のテキスト（`transcript`）を
 * それぞれ異なるスタイルで描画する。表示内容がない場合はレンダリングしない。
 */
export const SubtitleBar = ({ finalLines, transcript }: SubtitleBarProps) => {
  const hasContent = finalLines.length > 0 || transcript;
  if (!hasContent) return null;

  return (
    <div className={styles.subtitleBar}>
      {finalLines.map((line) => (
        <span key={line.id} className={styles.subtitleFinal}>
          {line.text}
        </span>
      ))}
      {transcript && <span className={styles.subtitleInterim}>{transcript}</span>}
    </div>
  );
};
