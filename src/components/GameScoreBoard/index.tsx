import { getTime, setTime } from "functions/time";
import moment from "moment";
import React, { useEffect, useState } from "react";
import "./index.scss";

interface GameScoreBoardProps {
  score: number;
  moves: number;
}

const GameScoreBoard: React.FC<GameScoreBoardProps> = ({ score, moves }) => {
  const [gameTime, setGameTime] = useState<number>(getTime());
  const formattedTime = moment.utc(gameTime * 1000).format("HH:mm:ss");

  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime((seconds) => seconds + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (getTime() === -1) {
      setGameTime(0);
      setTime(0);
    } else {
      setTime(gameTime);
    }
  }, [gameTime]);
  return (
    <div className="score-board">
      <div className="column">
        <div className="text-left">Time: </div>
        <div className="text-left">Score: </div>
        <div className="text-left">Moves: </div>
      </div>

      <div className="column">
        <div className="text-right">
          {gameTime === 0 ? "00:00:00" : formattedTime}
        </div>

        <div className="text-right">{score}</div>

        <div className="text-right">{moves}</div>
      </div>
    </div>
  );
};

export default GameScoreBoard;
