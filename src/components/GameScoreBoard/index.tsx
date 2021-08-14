import React from "react";
import "./index.scss";

interface GameScoreBoardProps {
  score: number;
  moves: number;
}

const GameScoreBoard: React.FC<GameScoreBoardProps> = ({ score, moves }) => {
  return (
    <div className="score-board">
      <div className="column">
        <div className="text-left">Score: </div>
        <div className="text-left">Moves: </div>
      </div>
      <div className="column">
        <div className="text-right">{score}</div>

        <div className="text-right">{moves}</div>
      </div>
    </div>
  );
};

export default GameScoreBoard;
