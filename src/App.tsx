import _ from "lodash";
import React, { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card";
import CardHolder from "./components/CardHolder";
import {
  distributeRemCards,
  drag,
  dragEnter,
  dragStart,
  drop,
  initGame,
  selectCard,
} from "./functions/reversed-spider-solitaire";
import { CardType, GameType } from "./utils/types";

function App() {
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
    trueMatch: false,
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
  console.log(game);
  return (
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
                dragEnter(e, game, setgame, {} as CardType, deck);
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
                  onDrag={(e) => {
                    drag(e, card, game, setgame);
                  }}
                  onDragEnter={(e) => {
                    if (card.isDown == false) {
                      dragEnter(e, game, setgame, card, deck);
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
                    trueMatch={game.trueMatch}
                  />
                </div>
              ))}
            </div>
          )
        )}
      {cards.hasOwnProperty("decks") && game.decks[10].length > 0 && (
        <div
          onClick={(e) => {
            distributeRemCards(game, setgame);
          }}
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            top: "75vh",
            left: " 99vw",
          }}
        >
          {_.chunk(game.decks[10], 10).map(() => {
            return <div className="card__remcards"></div>;
          })}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          top: "75vh",
          left: " 7vw",
        }}
      >
        {Array.apply(null, Array(game.hands)).map(() => {
          return <div className="card__complatedcards"></div>;
        })}
      </div>
    </div>
  );
}

export default App;
