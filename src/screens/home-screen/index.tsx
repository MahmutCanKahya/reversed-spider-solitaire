import React from "react";
import { useHistory } from "react-router-dom";
import routes from "../../utils/route-config.json";
import "./index.scss";

function HomeScreen() {
  const history = useHistory();
  return (
    <div className="wrapper">
      <div className="best-score-wrapper">
        <p>Best Score: 1040</p>
      </div>
      <div className="play-button" onClick={() => history.push(routes.game)}>
        <p>PLAY GAME</p>
      </div>
    </div>
  );
}

export default HomeScreen;
