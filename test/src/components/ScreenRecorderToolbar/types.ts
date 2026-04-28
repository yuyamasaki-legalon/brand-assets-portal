/**
 * 録画の状態を表す。
 *
 * - `"idle"` — 待機中（録画していない）
 * - `"recording"` — 録画中
 * - `"stopping"` — 停止処理中（MediaRecorder の後処理待ち）
 */
export type RecordingState = "idle" | "recording" | "stopping";

/**
 * 録画オーバーレイ上で使用するツールモード。
 *
 * - `"select"` — 要素の選択
 * - `"highlight"` — 蛍光ペンで画面上をハイライト
 * - `"memo"` — クリック位置にメモを配置
 */
export type ToolMode = "select" | "highlight" | "memo";

/**
 * オーバーレイ上に配置されるメモ。
 *
 * ユーザーが `"memo"` ツールでクリックした位置に生成され、
 * テキストを入力して画面上に残すことができる。
 */
export type Memo = {
  /** 一意な識別子 */
  id: string;
  /** オーバーレイ左端からの X 座標 (px) */
  x: number;
  /** オーバーレイ上端からの Y 座標 (px) */
  y: number;
  /** メモのテキスト内容 */
  text: string;
};

/**
 * マウスカーソルのオーバーレイ内座標。
 *
 * ハイライト描画時のブラシ位置追跡に使用する。
 */
export type CursorPosition = {
  x: number;
  y: number;
};

/**
 * ツールバーのトグルオプション。
 *
 * 録画中に字幕やマイクの ON/OFF を切り替えるために使用する。
 */
export type ToolbarOptions = {
  /** 音声認識による字幕表示を有効にするか */
  subtitles: boolean;
  /** マイク入力（音声キャプチャ）を有効にするか */
  mic: boolean;
};

// ─── Web Speech API 型宣言 ─────────────────────────────────────────
//
// `lib.dom.d.ts` に含まれない Web Speech API (Chrome/Edge) の
// 最小サブセットをここで宣言する。
// @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
// ────────────────────────────────────────────────────────────────────

/**
 * 音声認識の個別候補。
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionAlternative
 */
export interface SpeechRecognitionResultItem {
  /** 認識されたテキスト */
  transcript: string;
  /** 認識の確信度（0〜1） */
  confidence: number;
}

/**
 * 1 回の発話に対する認識結果。
 *
 * 複数の候補（{@link SpeechRecognitionResultItem}）をインデックスで保持する。
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionResult
 */
export interface SpeechRecognitionResult {
  /** 結果が確定済みか。`false` の場合は中間結果 */
  isFinal: boolean;
  /** 候補数 */
  length: number;
  [index: number]: SpeechRecognitionResultItem;
}

/**
 * {@link SpeechRecognitionResult} のリスト。
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionResultList
 */
export interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

/**
 * `onresult` コールバックに渡されるイベント。
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionEvent
 */
export interface SpeechRecognitionEvent {
  /** 今回更新された結果の開始インデックス */
  resultIndex: number;
  /** 認識結果のリスト */
  results: SpeechRecognitionResultList;
}

/**
 * `onerror` コールバックに渡されるエラーイベント。
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionErrorEvent
 */
export interface SpeechRecognitionErrorEvent {
  /** エラー種別（例: `"no-speech"`, `"not-allowed"`） */
  error: string;
  /** エラーの詳細メッセージ */
  message: string;
}

/**
 * `SpeechRecognition` インスタンスの操作インターフェース。
 *
 * @example
 * ```ts
 * const recognition = new window.webkitSpeechRecognition();
 * recognition.lang = "ja-JP";
 * recognition.continuous = true;
 * recognition.interimResults = true;
 * recognition.onresult = (e) => { ... };
 * recognition.start();
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
 */
export interface SpeechRecognitionInstance {
  /** `true` にすると発話終了後も認識セッションを継続する */
  continuous: boolean;
  /** `true` にすると確定前の中間結果（`isFinal: false`）も `onresult` に流れる */
  interimResults: boolean;
  /** 認識対象の言語（BCP 47 形式、例: `"ja-JP"`, `"en-US"`） */
  lang: string;
  /** 音声認識を開始する */
  start: () => void;
  /** 音声認識を停止する */
  stop: () => void;
  /** 認識結果を受け取るコールバック */
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  /** 認識セッション終了時のコールバック */
  onend: (() => void) | null;
  /** エラー発生時のコールバック */
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

declare global {
  interface Window {
    /** Chrome/Edge が公開する prefix 付き SpeechRecognition コンストラクタ */
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}
