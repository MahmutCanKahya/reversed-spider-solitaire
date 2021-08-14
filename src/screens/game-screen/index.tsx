import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import hintOff from "../../assets/hint-off.svg";
import hintOn from "../../assets/hint-on.svg";
import leftArrow from "../../assets/left-arrow.svg";
import Card from "../../components/Card";
import CardHolder from "../../components/CardHolder";
import {
  distributeRemCards,
  drag,
  dragEnter,
  dragStart,
  drop,
  initGame,
  selectCard,
} from "../../functions/reversed-spider-solitaire";
import { CardType, GameType } from "../../utils/types";
import "./index.scss";

function GameScreen() {
  const [cards, setcards] = useState<{
    decks?: CardType[][];
    cards?: CardType[];
  }>({});
  const [game, setgame] = useState<GameType>({
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
  });
  useEffect(() => {
    const val = initGame();
    setcards(val);
    setgame((prevState: GameType) => ({
      ...prevState,
      cards: val.cards,
      decks: val.decks,
    }));
  }, []);
  const history = useHistory();
  console.log(game);
  return (
    <div className="game-wrapper">
      <div className="game-top">
        <div className="left-content">
          <img
            src={leftArrow}
            alt="left-arrow"
            onClick={() => history.goBack()}
          />
        </div>
        <div className="right-content">
          <div
            className="hint"
            onClick={() =>
              setgame((prevstate) => ({ ...prevstate, hint: !prevstate.hint }))
            }
          >
            <div className="hint-text">
              {game.hint ? "Hint ON" : "Hint OFF"}
            </div>
            <img src={game.hint ? hintOn : hintOff} alt="hint" />
          </div>
        </div>
      </div>
      <div className="onesuite">
        {cards.hasOwnProperty("decks") &&
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
                    draggable={true}
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
                      selectCard(card, deck, null, game, setgame);
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
          {Array.apply(null, Array(game.hands)).map(() => {
            return <div className="card__complatedcards"></div>;
          })}
        </div>
        <div className="score-board">
          <div className="text-row">
            <div className="text-left">Score: </div>
            <div className="text-left">Moves: </div>
          </div>
          <div className="text-row">
            <div className="text-right">{game.score}</div>

            <div className="text-right">{game.numberOfMoves}</div>
          </div>
        </div>
        <div>
          {cards.hasOwnProperty("decks") && game.decks[10].length > 0 && (
            <div
              onClick={(e) => {
                distributeRemCards(game, setgame);
              }}
              style={{
                display: "flex",
                flexDirection: "row",
              }}
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
