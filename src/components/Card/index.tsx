import React, { FC, useEffect, useState } from "react";
import cardInfo from "../../utils/card-config.json";
import { CardType } from "../../utils/types";
import "./Card.css";

interface CardProps {
  card: CardType;
  isSelected: boolean;
  isDown: boolean;
  isHighlighted: boolean;
  trueMatch: boolean;
}

export const Card: FC<CardProps> = ({
  card,
  isSelected,
  isDown,
  isHighlighted,
  trueMatch,
}) => {
  const [down, setdown] = useState("");
  const [select, setselect] = useState("");
  const [highlight, sethighlight] = useState("");
  useEffect(() => {
    if (isDown) {
      setdown(" card__down");
    } else {
      setdown(" " + card.suit);
    }
    if (isSelected) {
      setselect(" card__selected");
    } else {
      setselect("");
    }
    if (card.isMatched) {
      sethighlight(" card__highlighted_green");
    } else if (isHighlighted) {
      sethighlight(" card__highlighted");
    } else {
      sethighlight("");
    }
  }, [isDown, isSelected, isHighlighted, card.suit]);
  return (
    <div className={"card" + down + select + highlight}>
      <div className="card__content card__rank-left">{card.rank}</div>
      <div className="card__content card__suite-left">
        {cardInfo.symbol[card.suit]}
      </div>
      <div className="card__content card__suite-right">
        {cardInfo.symbol[card.suit]}
      </div>
      <div className="card__content card__rank-right">{card.rank}</div>
    </div>
  );
};

export default Card;
