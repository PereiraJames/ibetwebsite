import React, { useState, useEffect } from "react";
import "../css/CountdownTimer.css";

const CountdownTimer = () => {
  // Set your target date here in 'DD-MMM-YYYY HH:MM' format
  const targetDate = "08-Nov-2025 10:00"; // Change this to your desired target date and time

  const calculateTimeLeft = () => {
    const target = new Date(`${targetDate}:00`);
    const now = new Date();
    const difference = target - now;

    let timeLeft = {};

    if (difference > 0) {
      // Countdown (target is in the future)
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPast: false,
      };
    } else {
      // Count up (target time has passed)
      const timePassed = Math.abs(difference);
      timeLeft = {
        days: Math.floor(timePassed / (1000 * 60 * 60 * 24)),
        hours: Math.floor((timePassed / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((timePassed / 1000 / 60) % 60),
        seconds: Math.floor((timePassed / 1000) % 60),
        isPast: true,
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft);
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="countdown-container">
      <div className="countdown-timer-text">
        {Object.entries(timeLeft)
          .filter(([key]) => key !== "isPast") // Remove isPast from rendering
          .map(([unit, value], index) => (
            <div key={unit} className="time-unit">
              <span>{value}</span>
              <p>{unit.charAt(0).toUpperCase() + unit.slice(1)}</p>
            </div>
          ))}
      </div>
      <p className="timer-status">
        {timeLeft.isPast
          ? "since Mark started regretting"
          : "left of Mark's Freedom"}
      </p>
    </div>
  );
};

export default CountdownTimer;
