import { resetGame } from "functions/reversed-spider-solitaire";
import React, { useState } from "react";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import { GameType } from "utils/types";
import hintOff from "../../assets/hint-off.svg";
import hintOn from "../../assets/hint-on.svg";
import leftArrow from "../../assets/left-arrow.svg";
import "./index.scss";

interface GameNavBarProps {
  setgame: React.Dispatch<React.SetStateAction<GameType>>;
  hint: boolean;
}

const GameNavBar: React.FC<GameNavBarProps> = ({ hint, setgame }) => {
  const history = useHistory();
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);
  return (
    <div className="game-top">
      <Modal
        isOpen={isResetModalVisible}
        onRequestClose={() => setIsResetModalVisible(false)}
        contentLabel="WellDone"
      >
        <div className="content">
          <div className="title">
            Are you sure you want to restart the game?
          </div>

          <div
            className="button"
            onClick={() => {
              setIsResetModalVisible(false);
              resetGame(setgame);
            }}
          >
            <div className="button-text">Reset Game</div>
          </div>
        </div>
      </Modal>

      <div className="left-content">
        <img
          src={leftArrow}
          alt="left-arrow"
          onClick={() => history.goBack()}
        />
      </div>
      <div className="title">REVERSED SPIDER SOLITAIRE</div>
      <div className="right-content">
        <div className="reset" onClick={() => setIsResetModalVisible(true)}>
          RESET GAME
        </div>
        <div
          className="hint"
          onClick={() =>
            setgame((prevstate) => ({ ...prevstate, hint: !prevstate.hint }))
          }
        >
          <div className={`hint-text ${hint ? "on" : "off"}`}>
            {hint ? "Hint ON" : "Hint OFF"}
          </div>
          <img src={hint ? hintOn : hintOff} alt="hint" />
        </div>
      </div>
    </div>
  );
};

export default GameNavBar;
