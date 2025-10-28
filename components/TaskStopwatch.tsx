import React, { useState, useEffect } from 'react';

const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Ensure all parts are two digits
    return [hours, minutes, seconds]
        .map(v => v.toString().padStart(2, '0'))
        .join(":");
};


export const TaskStopwatch = ({ startTime, completedTime }) => {
    // State to hold the current elapsed time in milliseconds
    const [elapsedMs, setElapsedMs] = useState(0);

    // Effect to set up the interval timer
    useEffect(() => {
        if (completedTime) return
        // Calculate initial elapsed time
        const initialElapsed = Math.max(0, Date.now() - startTime);
        setElapsedMs(initialElapsed);

        // Set up the interval to update the time every 50ms for smooth display
        const intervalId = setInterval(() => {
            const currentElapsed = Math.max(0, Date.now() - startTime);
            setElapsedMs(currentElapsed);
        }, 45); 

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [startTime]);

    useEffect(() => {
      if (completedTime) {
        setElapsedMs(completedTime - startTime);
      }
    }, [])


    // Convert milliseconds to total seconds for formatting
    const totalSeconds = elapsedMs / 1000;

    return (
        <span className={"text-2xl font-mono " + (completedTime ? "text-green-500" : "text-red-600")}>
            {formatTime(totalSeconds) + ":" + (elapsedMs % 1000).toString().padStart(3, '0').slice(0, 2)}
        </span>
    );
};
