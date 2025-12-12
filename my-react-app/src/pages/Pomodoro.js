import { useState, useEffect } from "react";
import "../styles/Main.css";  


export default function Pomodoro() {
  const STUDY_TIME = 45 * 60; // 45 minuta
  const BREAK_TIME = 15 * 60; // 15 minuta

  const [timeLeft, setTimeLeft] = useState(STUDY_TIME);
  const [isStudy, setIsStudy] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer = null;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            const nextMode = !isStudy;
            setIsStudy(nextMode);
            return nextMode ? STUDY_TIME : BREAK_TIME;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, isStudy]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="column right-col">

      <h2>{isStudy ? "VRIJEME UČENJA" : "VRIJEME ODMORA"}</h2>

      <div style={{ fontSize: "3rem", margin: "20px 0" }}>
        {formatTime(timeLeft)}
      </div>

      <button onClick={() => setIsRunning(!isRunning)} className="btn">
        {isRunning ? "Pauziraj" : "Pokreni"}
      </button>

      <button
        onClick={() => {
          setIsRunning(false);
          setIsStudy(true);
          setTimeLeft(STUDY_TIME);
        }}
        className="btn" > Reset </button>

      <div>
        <br></br>
        <p><i><b>Mali koraci svaki dan vode do velikih rezultata.</b></i></p>
      </div>

    </div>
  );
}