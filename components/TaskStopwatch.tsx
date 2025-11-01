import React, { useState, useEffect } from 'react';

const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return [hours, minutes, seconds]
        .map(v => v.toString().padStart(2, '0'))
        .join(":");
};

export const TaskStopwatch = ({ startTime, completedTime }: { startTime: number | undefined, completedTime: number | undefined }) => {
    if (!startTime) {
      return null;
    }
    const [elapsedMs, setElapsedMs] = useState(0);

    useEffect(() => {
        if (completedTime) return
        const initialElapsed = Math.max(0, Date.now() - startTime);
        setElapsedMs(initialElapsed);

        const intervalId = setInterval(() => {
            const currentElapsed = Math.max(0, Date.now() - startTime);
            setElapsedMs(currentElapsed);
        }, 45); 

        return () => clearInterval(intervalId);
    }, [startTime]);

    useEffect(() => {
      if (completedTime) {
        setElapsedMs(completedTime - startTime);
      }
    }, [completedTime])


    const totalSeconds = elapsedMs / 1000;

    return (
        <span className={"text-2xl font-mono " + (completedTime ? "text-green-500" : "text-red-600")}>
            {formatTime(totalSeconds) + ":" + (elapsedMs % 1000).toString().padStart(3, '0').slice(0, 2)}
        </span>
    );
};
