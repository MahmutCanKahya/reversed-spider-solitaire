export type CardType = {
  rank: string;
  suit: "heart" | "diamond" | "spade" | "club";
  isDown: boolean;
  deck: number;
  isSelected: boolean;
  isHighlighted: boolean;
  isMatched: boolean;
};

export type GameType = {
  cards: CardType[];
  decks: CardType[][];
  selectedCard: CardType;
  selectedDeck: CardType[];
  selected: CardType[];
  hands: number;
  x: number;
  y: number;
  trueMatch: boolean;
  highlightedDeck: CardType[];
  highlightedCard: CardType;
  score: number;
  numberOfMoves: number;
};
