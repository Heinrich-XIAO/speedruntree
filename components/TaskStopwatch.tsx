"use client";
import React, { useEffect, useRef } from "react";

const formatTime = (totalMs: number) => {
  if (totalMs < 0) totalMs = 0;

  const totalSeconds = totalMs / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const hundredths = Math.floor((totalMs % 1000) / 10); // 0–99

  return (
    hours.toString().padStart(2, "0") + ":" +
    minutes.toString().padStart(2, "0") + ":" +
    seconds.toString().padStart(2, "0") + "." +
    hundredths.toString().padStart(2, "0")
  );
};

export const TaskStopwatch = ({
  startTime,
  completedTime,
}: {
  startTime: number | undefined;
  completedTime: number | undefined;
}) => {
  if (!startTime) return null;

  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (completedTime) {
      if (spanRef.current) spanRef.current.textContent = formatTime(completedTime - startTime);
      return;
    }

    let frame: number;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      if (spanRef.current) spanRef.current.textContent = formatTime(elapsed);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [startTime, completedTime]);

  const initialElapsed = completedTime ? completedTime - startTime : Date.now() - startTime;

  return (
    <span
      ref={spanRef}
      className={
        "text-2xl font-mono " +
        (completedTime ? "text-green-500" : "text-red-600")
      }
    >
      {formatTime(initialElapsed)}
    </span>
  );
};

