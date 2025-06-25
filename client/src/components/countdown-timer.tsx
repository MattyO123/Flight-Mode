import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endDate: string;
  className?: string;
}

export default function CountdownTimer({ endDate, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className={`grid grid-cols-4 gap-4 ${className}`}>
      <div className="text-center">
        <div className="text-3xl font-bold countdown-timer text-gold-400">
          {timeLeft.days}
        </div>
        <div className="text-xs text-gray-400">DAYS</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold countdown-timer text-gold-400">
          {timeLeft.hours}
        </div>
        <div className="text-xs text-gray-400">HOURS</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold countdown-timer text-gold-400">
          {timeLeft.minutes}
        </div>
        <div className="text-xs text-gray-400">MINS</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold countdown-timer text-gold-400">
          {timeLeft.seconds}
        </div>
        <div className="text-xs text-gray-400">SECS</div>
      </div>
    </div>
  );
}
