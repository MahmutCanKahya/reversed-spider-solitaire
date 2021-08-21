import * as _ from "lodash";
import { INIT_GAME } from "screens/game-screen";
import cardInfo from "../utils/card-config.json";
import { CardType, GameType } from "../utils/types";
import { getHighScore, removeCurrentGame, setHighScore } from "./local-storage";

// Oyunun başlangıcı için 8 destelik kart oluşturulur.
//Bu kartlar karıştırılır ve yeni destelere ayrılır.

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

export const resetGame = (
  setgame: React.Dispatch<React.SetStateAction<GameType>>
) => {
  removeCurrentGame();
  const reset = initGame();
  setgame({ ...INIT_GAME, decks: reset.decks, cards: reset.cards });
};

//Oyun içerisinde seçilen ve hoverlanan kartın state üzerinde silinmesi
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
    }));
  }
};

//Seçili olan kartları bulundugu desteden hedeflenen desteye pushlar.
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

  // hareket eden kartları mevcut konumundan siler
  var movedCards = tempDeck[from].splice(cardIdx);

  //hareket eden kartları yeni desteye pushlar
  movedCards.forEach((card) => {
    tempDeck[to].push(card);
  });
  try {
    //hareket ettikten sonra geriye kalan kartın yüzü çevrilir
    if (tempDeck[from][tempDeck[from].length - 1].isDown === true) {
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

// String olarak girilen kart tipinin sayı olarak karışılığını döndürür.
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

// Destenin kurala uygun dizilip dizilmediğinin kontrolü
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

// Formatın doğru olup olmadıgını tutar format doğruysa tamamlanan el sayısı artırılır ve
// arda kalan kartlarda sonuncusu açık kalması için isDown false olur
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

    // Eğer sıralama doğruysa ve destede başka kart varsa sonuncuyu açık göstermek için isDown false
    if (tempDecks[curDeckIdx].length != 0) {
      tempDecks[curDeckIdx][tempDecks[curDeckIdx].length - 1].isDown = false;
    }
    setGameStatus(cardInfo.points.deskComplate, false, game, setgame);

    setgame((prevState) => ({
      ...prevState,
      decks: tempDecks,
      hands: curHands + 1,
    }));
    // Tamamlanan el sayısı 8 olunca oyun biter.
    if (curHands + 1 === 8) {
      const curScore = game.score + cardInfo.points.deskComplate;

      const highScore = getHighScore();
      if (curScore > highScore) {
        setHighScore(curScore);
        console.log("Welldone High Score");
      } else {
        console.log("Game Over");
      }
    }
  }
};

// Parametre olarak girilen kart destesi içinden seçilen karttan sonraki kartlar ayrılır
// ve altta kalan kartlar karşılaştırılır
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

// selçilmiş olan kartın başka bir kartın üzerine eklenip eklenmeyeceğinin kontrolü yapılır;
export const checkMove = (
  target: CardType,
  deck: CardType[],
  game: GameType
): boolean => {
  if (
    /*  target.suit === game.selectedCard.suit && */
    getRank(target.rank) - getRank(game.selectedCard.rank) ===
    -1
  ) {
    if (deck.indexOf(target) === deck.length - 1) {
      return true;
    }
  }
  return false;
};

//hamle ve skor sayısı değiştirme
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

//Seçilen bir kart yoksa seçili olarak işaretlenir. Eğer seçili kart varsa ilk seçilen
//kartı 2. seçilen karta sürüklenip sürüklenemeceği kontrol edilir.
export const selectCard = (
  card: CardType,
  deck: CardType[],
  holder: boolean,
  game: GameType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>
) => {
  //Eğer deste kart  hiç yoksa ve seçilen kart boş değilsse seçilen kartı holdera aktarır
  if (holder && !isObjectEmpty(game.selectedCard)) {
    /* if (game.selectedCard.rank === "A") { */
    moveCards(deck, game.selectedDeck, game.selectedCard, setgame, game);
    isHandComplete(deck, game, setgame);
    removeSelection(game, setgame);
    /* } */
  }
  var tempCard = card;

  if (game.hint && card.isDown === false) {
    for (let i = 0; i < game.decks.length - 1; i++) {
      if (
        game.decks[i].length === 0 &&
        /* card.rank === "A" && */
        checkMovable(card, deck)
      ) {
        moveCards(game.decks[i], deck, card, setgame, game);
        isHandComplete(game.decks[i], game, setgame);
        removeSelection(game, setgame);
      }
      for (let j = 0; j < game.decks[i].length; j++) {
        const curCard = game.decks[i][j];
        if (
          getRank(curCard.rank) - getRank(card.rank) === -1 &&
          checkMovable(card, deck) &&
          checkMove(curCard, game.decks[i], {
            ...game,
            selectedCard: card,
            selectedDeck: deck,
          }) &&
          curCard.isDown === false
        ) {
          moveCards(game.decks[i], deck, card, setgame, game);
          isHandComplete(game.decks[i], game, setgame);
          removeSelection(game, setgame);
          return;
        }
      }
    }
    return;
  }

  if (isObjectEmpty(game.selectedCard)) {
    if (holder) {
      return;
    }
    if (card.isDown) {
      return;
    }
    //eğer seçilen bir card yoksa, seçilen kart destede hareket ettiriliyormu diye
    //kontrol edilir ve bu seçili kart listesini seçili olarak işaretler
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
    /* */
  } else {
    // Eğer selected card var ise bu seçili kart 2. seçilen kartın üstüne taşınıyormu
    //diye kontrol eder ve kartı taşır.
    if (checkMove(tempCard, deck, game)) {
      moveCards(deck, game.selectedDeck, game.selectedCard, setgame, game);
      isHandComplete(deck, game, setgame);
      removeSelection(game, setgame);
    } else {
      removeSelection(game, setgame);
    }
  }
};

//sürükleme başladıgında sürüklenen itemin x y eksenlerini setler
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
  setgame((prevState) => ({
    ...prevState,
    x: x,
    y: y,
  }));
  if (game.selectedCard === card) {
    return;
  }

  //sürüklenecek kart selected olarak seçilir
  removeSelection(game, setgame);
  selectCard(card, deck, false, game, setgame);
};

//sürüklenen kartlar sürükleniyor olarak gözükmesini sağlayan css setlenir
export const drag = (
  event: React.DragEvent<HTMLDivElement>,
  game: GameType
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
//bir kartın üzerine gelince çalışan yer
export const dragEnter = (
  game: GameType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>,
  card: CardType,
  deck: CardType[]
) => {
  var tempDecks = [...game.decks];
  if (isObjectEmpty(card) && !isObjectEmpty(game.selectedCard)) {
    tempDecks.forEach((deck) =>
      deck.forEach((tempCard) => {
        tempCard.isHighlighted = false;
        tempCard.isMatched = false;
      })
    );
  } else if (!isObjectEmpty(card) && card != game.selectedCard) {
    if (game.selected.indexOf(card) != -1) return;

    var deckIdx = tempDecks.indexOf(deck);
    var cardIdx = tempDecks[deckIdx].indexOf(card);

    //son elemanın üstüne getirilmediyse fonksiyondan çıkar
    if (cardIdx != tempDecks[deckIdx].length - 1) return;

    tempDecks.map((deck) =>
      deck.map((tempCard) => {
        tempCard.isHighlighted = false;
        tempCard.isMatched = false;
      })
    );

    tempDecks[deckIdx][cardIdx].isHighlighted = true;

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

//sürükleme işlemi bitince yapılacak işlemler
export const drop = (
  event: any,
  card: CardType,
  game: GameType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>
) => {
  if (isObjectEmpty(game.highlightedCard)) {
    //eğer boş bir destenin üstüne bırakılıyorsa ve bu bıraklan kart 'A' ise işleme devam eder
    /* if (card.rank == "A") { */
    if (
      !isObjectEmpty(game.selectedCard) &&
      isObjectEmpty(game.highlightedCard)
    ) {
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
      /*  } */
    }
  }
  // eğer deste boş değilse bu sürüklenen destenin üstüne gelebiliyormu diye kontrol eder.
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

//son kalan kartları 10 desteye birer birer dağıtır.
//son olarak dağıttıktan sonra destenin tamamlanıp tamamlanmadıgı kontrolü için ishand
// fonksiyonu çağrılır
export const distributeRemCards = (
  game: GameType,
  setgame: React.Dispatch<React.SetStateAction<GameType>>
) => {
  if (game.decks[10].length !== 0) {
    var tempDecks = [...game.decks];
    tempDecks.forEach((tempDeck) => {
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

//Obje boşmu kontrolü
export const isObjectEmpty = (obj: any): boolean => {
  return Object.keys(obj).length == 0;
};
