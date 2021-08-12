import * as _ from "lodash";
import cardInfo from "../utils/card-config.json";
import { CardType, GameType } from "../utils/types";

export const initGame = (): { decks: CardType[][]; cards: CardType[] } => {
  let cards: CardType[] = [],
    decks;
  cardInfo["rank"].map((rank) => {
    for (let i = 1; i <= 8; i++) {
      cards.push({
        rank: rank,
        suit: "spade",
        isDown: true,
        deck: i,
        isSelected: false,
        isHighlighted: false,
        isMatched: false,
      });
    }
  });
  let shuffledCards = _.shuffle(cards);
  const firstSplit = _.chunk(shuffledCards.slice(0, 24), 6); //ilk 4lü deste 6 lı
  const secondSplit = _.chunk(shuffledCards.slice(24, 54), 5); //son 6lı deste 5  erli
  decks = [...firstSplit, ...secondSplit];
  decks[10] = shuffledCards.slice(54);
  for (let i = 0; i <= 9; i++) {
    decks[i][decks[i].length - 1].isDown = false;
  }
  return {
    decks: decks,
    cards: shuffledCards,
  };
};

export const removeSelection = (
  game: GameType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>
) => {
  if (
    !isObjectEmpty(game.selectedCard) ||
    !isObjectEmpty(game.highlightedCard)
  ) {
    var decks = [...game.decks];
    for (let i = 0; i < decks.length; i++) {
      for (let j = 0; j < decks[i].length; j++) {
        decks[i][j].isSelected = false;
        decks[i][j].isHighlighted = false;
        decks[i][j].isMatched = false;
      }
    }
    setgame((prevState) => ({
      ...prevState,
      selected: [],
      decks: decks,
      selectedCard: {} as CardType,
      selectedDeck: [],
      highlightedCard: {} as CardType,
      highlightedDeck: [],
      trueMatch: false,
    }));
  }
};

// Function to transfer cards from one deck to another
export const moveCards = function (
  toDeck: CardType[],
  fromDeck: CardType[],
  fromCard: CardType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>,
  game: GameType
) {
  setGameStatus(cardInfo.points.move, true, game, setgame);
  var tempDeck = [...game.decks];
  var to = tempDeck.indexOf(toDeck);
  var from = tempDeck.indexOf(fromDeck);
  var cardIdx = tempDeck[from].indexOf(fromCard);

  var movedCards = tempDeck[from].splice(cardIdx);

  movedCards.forEach((card) => {
    tempDeck[to].push(card);
  });
  try {
    if (tempDeck[from][tempDeck[from].length - 1].isDown == true) {
      tempDeck[from][tempDeck[from].length - 1].isDown = false;
    }
  } catch (err) {
    console.log(err);
  }
  setgame((prevState) => ({
    ...prevState,
    decks: tempDeck,
  }));
};

// Function to return rank
export const getRank = (rank: string) => {
  if (rank === "K" || rank === "Q" || rank === "J" || rank === "A") {
    switch (rank) {
      case "K":
        return 13;
      case "Q":
        return 12;
      case "J":
        return 11;
      case "A":
        return 1;
    }
  } else {
    return parseInt(rank);
  }
};
// Util function to check K Q J 10 .... 3 2 A Set is formed or not
export const checkDeck = (deck: CardType[]) => {
  var ranks = deck.map((card) => {
    return getRank(card.rank);
  });
  const expectedArray = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  if (_.isEqual(expectedArray.reverse(), ranks.slice(-13))) {
    return ranks.length - 13;
  }
  return false;
};
// Function to check K Q J 10 .... 3 2 A Set is formed or not
export const isHandComplete = (
  deck: CardType[],
  game: GameType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>
) => {
  var len = checkDeck(deck);
  if (len !== false) {
    var tempDecks = [...game.decks];
    var curDeckIdx = tempDecks.indexOf(deck);
    tempDecks[curDeckIdx].splice(len);
    var curHands = game.hands;
    if (tempDecks[curDeckIdx].length != 0) {
      tempDecks[curDeckIdx][tempDecks[curDeckIdx].length - 1].isDown = false;
    }

    setGameStatus(cardInfo.points.deskComplate, false, game, setgame);

    setgame((prevState) => ({
      ...prevState,
      decks: tempDecks,
      hands: curHands + 1,
    }));
    // Game over case
    if (curHands + 1 === 8) console.log("Game Over");
  }
};

// Function to check whether given card/cards can be selected to move or not
export const checkMovable = (card: CardType, deck: CardType[]) => {
  var tempDeck = [...deck];
  var movingCards = tempDeck.slice(deck.indexOf(card));
  var ranks = movingCards.map((curCard) => {
    return getRank(curCard.rank);
  });
  var curRank = getRank(card.rank);
  for (let i = 1; i < ranks.length; i++) {
    if (curRank - ranks[i] != -1) return false;
    curRank = ranks[i];
  }
  return true;
};

// Function to check whether current move to drop currently selected card to
// a target is valid or not
export const checkMove = (
  target: CardType,
  deck: CardType[],
  game: GameType
) => {
  if (
    target.suit === game.selectedCard.suit &&
    getRank(target.rank) - getRank(game.selectedCard.rank) == -1
  ) {
    if (deck.indexOf(target) === deck.length - 1) {
      return true;
    }
  }
  return false;
};

// Function to mantain Selection of cards
// ( Also handles cases of select and drop in case of click events )
export const selectCard = (
  card: CardType,
  deck: CardType[],
  holder: any,
  game: GameType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>
) => {
  // Handle drop of card on CardHolder(Blank) by click functionality

  if (holder && !isObjectEmpty(game.selectedCard)) {
    if (game.selectedCard.rank === "K") {
      moveCards(deck, game.selectedDeck, game.selectedCard, setgame, game);
      isHandComplete(deck, game, setgame);
      removeSelection(game, setgame);
    }
  }
  var tempCard = card;
  // Handling select card by on click and drag and drop
  if (isObjectEmpty(game.selectedCard)) {
    if (holder) return;
    if (card.isDown) {
      return;
    }

    if (checkMovable(card, deck)) {
      tempCard.isSelected = true;
      var tempDeck = [...deck];
      var selected = tempDeck.slice(deck.indexOf(card));
      selected.forEach((curCard) => {
        curCard.isSelected = true;
      });
      setgame((prevState) => ({
        ...prevState,
        selected: selected,
        selectedCard: card,
        selectedDeck: deck,
      }));
    }
    /* const x = game.decks.forEach((dck) => {
      return dck.forEach((crd) => {
        if (
          checkMove(crd, dck, {
            ...game,
            selected: selected,
            selectedCard: card,
            selectedDeck: deck,
          })
        ) {
          console.log("girdi");
          moveCards(dck, deck, card, setgame, game);

          isHandComplete(deck, game, setgame);
          removeSelection(game, setgame);
          return;
        }
      });
    }); */
  } else {
    // Handling moving of cards by click functionality
    if (checkMove(tempCard, deck, game)) {
      moveCards(deck, game.selectedDeck, game.selectedCard, setgame, game);
      isHandComplete(deck, game, setgame);
      removeSelection(game, setgame);
    } else {
      removeSelection(game, setgame);
    }
  }
};

export const setGameStatus = (
  score: number,
  move: boolean,
  game: GameType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>
) => {
  const currentScore = game.score;
  const currentMoves = game.numberOfMoves;

  const newScore = currentScore + score;
  const newMoves = move ? currentMoves + 1 : currentMoves;
  setgame((prevstate) => ({
    ...prevstate,
    score: newScore,
    numberOfMoves: newMoves,
  }));
};

export const dragStart = (
  event: any,
  card: CardType,
  deck: CardType[],
  game: GameType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>
) => {
  const x = event.pageX;
  const y = event.pageY;
  event.dataTransfer?.setData("text", event.target.id);
  event.dataTransfer?.setDragImage(new Image(0, 0), -10, -10);
  console.log(event);
  setgame((prevState) => ({
    ...prevState,
    x: x,
    y: y,
  }));
  if (game.selectedCard === card) {
    return;
  }
  removeSelection(game, setgame);
  selectCard(card, deck, null, game, setgame);
};

export const drag = (
  event: any,
  card: CardType,
  game: GameType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>
) => {
  game.selected.forEach((card) => {
    var child = document.getElementById(
      card.rank + " " + card.suit + " " + card.deck
    )?.children[0] as any;
    var movex = event.pageX - game.x;
    var movey = event.pageY - game.y;
    if (event.pageX == 0) {
      var css = "z-index:9999;transform:translate(0px,0px);display:none;";
    } else {
      var css =
        "z-index:9999;pointer-events: none; transform: scale(1.05, 1.05) rotate(0deg) translate(" +
        movex +
        "px, " +
        movey +
        "px);";
    }
    child.style.cssText = css;
  });
};

export const dragEnter = (
  event: any,
  game: GameType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>,
  card: CardType,
  deck: CardType[]
) => {
  var tempDecks = [...game.decks];
  if (card === null && !isObjectEmpty(game.selectedCard)) {
    tempDecks.forEach((deck) =>
      deck.forEach((tempCard) => {
        tempCard.isHighlighted = false;
        tempCard.isMatched = false;
      })
    );
  } else if (card !== null && card != game.selectedCard) {
    if (game.selected.indexOf(card) != -1) return;
    var deckIdx = tempDecks.indexOf(deck);
    var cardIdx = tempDecks[deckIdx].indexOf(card);
    if (cardIdx != tempDecks[deckIdx].length - 1) return;
    tempDecks.forEach((deck) =>
      deck.forEach((tempCard) => {
        tempCard.isHighlighted = false;
        tempCard.isMatched = false;
      })
    );
    tempDecks[deckIdx][cardIdx].isHighlighted = true;

    console.log(getRank(tempDecks[deckIdx][cardIdx].rank));
    console.log(getRank(game.selectedCard.rank));
    if (
      getRank(tempDecks[deckIdx][cardIdx].rank) -
        getRank(game.selectedCard.rank) ===
      -1
    ) {
      tempDecks[deckIdx][cardIdx].isMatched = true;
    }
  }
  setgame((prevState) => ({
    ...prevState,
    highlightedCard: card,
    highlightedDeck: deck,
    decks: tempDecks,
  }));
};

export const drop = (
  event: any,
  card: CardType,
  game: GameType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>
) => {
  // Case when deck is empty ( Drop event occurs on CardHolder )
  if (isObjectEmpty(game.highlightedCard)) {
    if (card.rank == "K") {
      if (checkMovable(game.selectedCard, game.selectedDeck)) {
        moveCards(
          game.highlightedDeck,
          game.selectedDeck,
          game.selectedCard,
          setgame,
          game
        );
        isHandComplete(game.highlightedDeck, game, setgame);
        removeSelection(game, setgame);
      } else {
        removeSelection(game, setgame);
      }
    }
  }
  // Drop on cards Case
  if (checkMove(game.highlightedCard, game.highlightedDeck, game)) {
    if (checkMovable(game.selectedCard, game.selectedDeck)) {
      game.selected.forEach((card) => {
        var child = document.getElementById(
          card.rank + " " + card.suit + " " + card.deck
        )?.children[0] as any;
        var css = "z-index:0;pointer-events:auto;display:none;";
        child.style.cssText = css;
      });
      moveCards(
        game.highlightedDeck,
        game.selectedDeck,
        game.selectedCard,
        setgame,
        game
      );
      isHandComplete(game.highlightedDeck, game, setgame);
      removeSelection(game, setgame);
      return;
    } else {
      game.selected.forEach((card) => {
        var child = document.getElementById(
          card.rank + " " + card.suit + " " + card.deck
        )?.children[0] as any;
        var css = "z-index:0;pointer-events:auto;";
        child.style.cssText = css;
      });
      removeSelection(game, setgame);
    }
  } else {
    game.selected.forEach((card) => {
      var child = document.getElementById(
        card.rank + " " + card.suit + " " + card.deck
      )?.children[0] as any;
      var css = "z-index:0;pointer-events:auto;";
      child.style.cssText = css;
    });
    removeSelection(game, setgame);
  }
};

const isObjectEmpty = (obj: any): boolean => {
  return Object.keys(obj).length == 0;
};

// Add remaining cards to decks
export const distributeRemCards = (
  game: GameType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>
) => {
  if (game.decks[10].length !== 0) {
    var tempDecks = [...game.decks];
    tempDecks.forEach(async (tempDeck) => {
      if (tempDecks[10].length > 0) {
        var tempCard = tempDecks[10].pop();
        if (tempCard !== undefined) {
          tempCard.isDown = false;
          tempDeck.push(tempCard);
        }

        setgame((prevState) => ({
          ...prevState,
          decks: tempDecks,
        }));
      }
    });

    tempDecks.forEach((tempDeck) => {
      isHandComplete(tempDeck, game, setgame);
    });
  }
};
