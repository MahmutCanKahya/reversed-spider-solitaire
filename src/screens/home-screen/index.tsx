import { getHighScore } from "functions/high-score";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import routes from "utils/route-config.json";
import "./index.scss";

function HomeScreen() {
  const history = useHistory();
  const [highScore, setHighScore] = useState<number>(0);
  useEffect(() => {
    const score = getHighScore();
    setHighScore(score);
  }, []);
  return (
    <div className="wrapper">
      <div className="best-score-wrapper">
        <p>Best Score: {highScore}</p>
      </div>
      <div className="play-button" onClick={() => history.push(routes.game)}>
        <p>PLAY GAME</p>
      </div>
    </div>
  );
}

export default HomeScreen;
