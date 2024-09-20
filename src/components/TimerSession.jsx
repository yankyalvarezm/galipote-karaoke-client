import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useSongs } from "../context/Songs.context";

const TimerSession = () => {
  const {
    isRunning,
    setIsRunning,
    startTime,
    setStartTime,
    seconds,
    setSeconds,
    activeSession,
    toggleSessionStart,
    setSessionStart,
    socket, // Utiliza el socket del contexto
  } = useSongs();

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      if (startTime === null) {
        setStartTime(Date.now() - seconds * 1000);
      }
      interval = setInterval(() => {
        setSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, seconds, setSeconds, activeSession]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return [
      hours,
      minutes < 10 ? "0" + minutes : minutes,
      seconds < 10 ? "0" + seconds : seconds,
    ].join(":");
  };

  const startTimer = () => {
    if (!activeSession) return;
    setStartTime(Date.now() - seconds * 1000);
    setSessionStart(activeSession._id, true);
    setIsRunning(true);
    if (!isRunning) {
      socket.emit("toggleIsRunning", { isRunning: true });
      console.log("Session Started:", isRunning);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    setSessionStart(activeSession._id, false);
    if (isRunning) {
      socket.emit("toggleIsRunning", { isRunning: false });
      console.log("Session Ended:", isRunning);
    }
  };

  return (
    <div className="timer-flex">
      <Button
        onClick={startTimer}
        variant="success"
        className="start-btn"
        disabled={isRunning}
      >
        Start
      </Button>
      <Button
        onClick={stopTimer}
        variant="light"
        className="stop-btn"
        disabled={!isRunning}
      >
        Stop
      </Button>
      <div className="form-floating mb-3 form-live">
        <input
          type="text"
          className="form-control"
          id="floatingInput"
          placeholder="00:00:00"
          value={formatTime(seconds)}
          readOnly
        />
        <label htmlFor="floatingInput">Live</label>
      </div>
    </div>
  );
};

export default TimerSession;
