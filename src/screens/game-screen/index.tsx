import welldone from "assets/well-done-gif.gif";
import GameNavBar from "components/GameNavBar";
import GameScoreBoard from "components/GameScoreBoard";
import {
  getCurrentGame,
  getHighScore,
  saveGame
} from "functions/local-storage";
import _, { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import Card from "../../components/Card";
import CardHolder from "../../components/CardHolder";
import {
  distributeRemCards,
  drag,
  dragEnter,
  dragStart,
  drop,
  initGame,
  removeSelection,
  resetGame,
  selectCard
} from "../../functions/reversed-spider-solitaire";
import { CardType, GameType } from "../../utils/types";
import "./index.scss";

export const INIT_GAME = {
  cards: [],
  decks: [],
  selectedCard: {} as CardType,
  selectedDeck: [],
  selected: [],
  hands: 0,
  x: -1,
  y: -1,
  highlightedDeck: [],
  highlightedCard: {} as CardType,
  numberOfMoves: 0,
  score: 500,
  hint: false,
};

function GameScreen() {
  const [game, setgame] = useState<GameType>(INIT_GAME);
  const [highScore, setHighScore] = useState<number>(0);
  useEffect(() => {
    const localdata = getCurrentGame();
    const highScore = getHighScore();
    console.log(highScore);
    setHighScore(highScore);
    console.log(localdata);
    if (isEmpty(localdata)) {
      const val = initGame();
      setgame((prevState: GameType) => ({
        ...prevState,
        cards: val.cards,
        decks: val.decks,
      }));
    } else {
      setgame(localdata);
    }
  }, []);

  // Hint açıldıgında seçili kart varsa resetler.
  useEffect(() => {
    removeSelection(game, setgame);
  }, [game.hint]);
  const history = useHistory();

  useEffect(() => {
    saveGame(game);
  }, [game]);
  console.log(game);
  return (
    <div className="game-wrapper">
      <Modal isOpen={game.hands === 8} contentLabel="WellDone">
        <div className="content">
          <img width={"30%"} src={welldone} alt="well done"></img>
          <div className="title">Well Done You Won</div>
          <div className="score">
            <div className="column">
              <div className="score-title">Your Score: </div>
              <div className="score-title">High Score:</div>
            </div>
            <div className="column">
              <div className="score-title2"> {game?.score}</div>
              <div className="score-title2"> {highScore}</div>
            </div>
          </div>
          <div
            className="button"
            onClick={() => {
              resetGame(setgame);
            }}
          >
            <div className="button-text">PLAY AGAIN</div>
          </div>
        </div>
      </Modal>
      <GameNavBar setgame={setgame} hint={game.hint} />
      <div className="onesuite">
        {/* Eğer deste varsa 10 desteyi yanyana sıralar. */}
        {game.decks &&
          game.decks.slice(0, 10).map((deck, index) =>
            deck.length == 0 ? (
              <div
                id="holder"
                key={index + "0"}
                onClick={() => {
                  selectCard({} as CardType, deck, true, game, setgame);
                }}
                onDragEnter={(e) => {
                  dragEnter(game, setgame, {} as CardType, deck);
                }}
              >
                <CardHolder key={index + " 1"} />
              </div>
            ) : (
              <div key={index + " 2"}>
                {deck.map((card, key) => (
                  <div
                    key={card.rank + " " + card.suit + " " + card.deck + " 0"}
                    id={card.rank + " " + card.suit + " " + card.deck}
                    className="card__wrapper card__stack"
                    draggable={game.hint ? false : true}
                    onDragStart={(e) => {
                      dragStart(e, card, deck, game, setgame);
                    }}
                    onDrag={(e: React.DragEvent<HTMLDivElement>) => {
                      drag(e, game);
                    }}
                    onDragEnter={(e) => {
                      if (card.isDown === false) {
                        dragEnter(game, setgame, card, deck);
                      }
                    }}
                    onDragEnd={(e) => {
                      drop(e, card, game, setgame);
                    }}
                    onClick={(e) => {
                      selectCard(card, deck, false, game, setgame);
                      game.decks.slice(0, 10).map((dec) => {
                        return dec.find((card) => !card.isDown);
                      });
                    }}
                  >
                    <Card
                      key={card.rank + " " + card.suit + " " + card.deck}
                      card={card}
                      isDown={card.isDown}
                      isHighlighted={card.isHighlighted}
                      isSelected={card.isSelected}
                    />
                  </div>
                ))}
              </div>
            )
          )}
      </div>
      <div className="game-bottom">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {Array.apply(null, Array(game.hands)).map((i, idx) => {
            return (
              <div key={idx} style={{ marginRight: "-6vw" }}>
                <Card
                  isDown={false}
                  isHighlighted={false}
                  isSelected={false}
                  card={{
                    isDown: false,
                    suit: "spade",
                    deck: 1,
                    rank: "A",
                    isSelected: false,
                    isHighlighted: false,
                    isMatched: false,
                  }}
                ></Card>
              </div>
            );
          })}
        </div>
        <GameScoreBoard score={game.score} moves={game.numberOfMoves} />
        <div >
          {game.decks && game.decks[10]?.length > 0 && (
            <div
              onClick={(e) => {
                distributeRemCards(game, setgame);
              }}
              
              className="remainderCards"
            >
              {_.chunk(game.decks[10], 10).map((item, idx) => {
                return <div key={idx} className="card__remcards"></div>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameScreen;
