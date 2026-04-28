import { useCallback, useEffect, useRef, useState } from "react";
import type { SpeechRecognitionErrorEvent, SpeechRecognitionEvent, SpeechRecognitionInstance } from "../types";

/**
 * 音声認識で確定した 1 行分のテキスト。
 *
 * {@link useSpeechRecognition} が `isFinal: true` を受け取るたびに生成される。
 * 直近 {@link MAX_LINES} 件のみ保持される。
 */
export interface FinalLine {
  /** 行ごとの一意な連番 ID */
  id: number;
  /** 認識が確定したテキスト */
  text: string;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  finalLines: FinalLine[];
  start: () => void;
  stop: () => void;
  isSupported: boolean;
}

const MAX_LINES = 3;

/**
 * Web Speech API（`webkitSpeechRecognition`）を使ったリアルタイム音声認識フック。
 *
 * 認識中のテキスト（`transcript`）と確定済み行（`finalLines`）を返す。
 * Chrome/Edge 以外では `isSupported: false` となり、`start()` は何もしない。
 *
 * @returns 音声認識の状態と制御関数
 *
 * @example
 * ```tsx
 * const { isListening, transcript, finalLines, start, stop, isSupported } = useSpeechRecognition();
 * ```
 */
export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const isSupported = "webkitSpeechRecognition" in window;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalLines, setFinalLines] = useState<FinalLine[]>([]);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const shouldListenRef = useRef(false);
  const lineIdRef = useRef(0);

  const stop = useCallback(() => {
    shouldListenRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setTranscript("");
    setFinalLines([]);
    lineIdRef.current = 0;
  }, []);

  const start = useCallback(() => {
    if (!isSupported) return;

    // Stop any existing instance before creating a new one
    recognitionRef.current?.stop();
    recognitionRef.current = null;

    shouldListenRef.current = true;
    setTranscript("");
    setFinalLines([]);
    lineIdRef.current = 0;

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "ja-JP";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = result[0].transcript.trim();
          if (text) {
            const id = ++lineIdRef.current;
            setFinalLines((prev) => [...prev.slice(-(MAX_LINES - 1)), { id, text }]);
          }
          setTranscript("");
        } else {
          interim += result[0].transcript;
        }
      }
      if (interim) {
        setTranscript(interim);
      }
    };

    recognition.onend = () => {
      // Only restart if this is still the active instance
      if (shouldListenRef.current && recognitionRef.current === recognition) {
        try {
          recognition.start();
        } catch {
          // Ignore if already started
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") {
        // Expected during silence — will auto-restart via onend
        return;
      }
      if (event.error === "not-allowed") {
        shouldListenRef.current = false;
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isSupported]);

  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  return { isListening, transcript, finalLines, start, stop, isSupported };
};
