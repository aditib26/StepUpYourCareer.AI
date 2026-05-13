"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  onRecorded: (audio: Blob) => void;
  disabled?: boolean;
  isProcessing?: boolean;
}

export default function VoiceRecorder({ onRecorded, disabled, isProcessing }: Props) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    };
  }, []);

  async function start() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const rec = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        stream.getTracks().forEach((t) => t.stop());
        onRecorded(blob);
      };

      rec.start();
      recorderRef.current = rec;
      setRecording(true);
      setSeconds(0);
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err) {
      setError("Microphone access denied. Please allow microphone access in your browser.");
    }
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    setRecording(false);
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex flex-col items-center gap-4">
      {error && <p className="text-xs text-danger text-center">{error}</p>}

      <button
        onClick={recording ? stop : start}
        disabled={disabled || isProcessing}
        className={cn(
          "relative w-24 h-24 rounded-full flex items-center justify-center transition-all",
          recording
            ? "bg-danger/20 border-2 border-danger shadow-[0_0_40px_rgba(239,68,68,0.4)]"
            : "bg-gradient-primary border-2 border-primary shadow-glow hover:scale-105",
          (disabled || isProcessing) && "opacity-50 pointer-events-none"
        )}
      >
        {isProcessing ? (
          <Loader2 className="w-9 h-9 text-white animate-spin" />
        ) : recording ? (
          <>
            <MicOff className="w-9 h-9 text-danger" />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-danger"
              animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
          </>
        ) : (
          <Mic className="w-9 h-9 text-white" />
        )}
      </button>

      <div className="text-center">
        {isProcessing ? (
          <p className="text-sm text-text-secondary">Processing your answer...</p>
        ) : recording ? (
          <>
            <p className="text-2xl font-mono font-bold text-danger tabular-nums">
              {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
            </p>
            <p className="text-xs text-muted mt-1">Click to stop recording</p>
          </>
        ) : (
          <p className="text-xs text-muted">Click the mic to answer</p>
        )}
      </div>
    </div>
  );
}
