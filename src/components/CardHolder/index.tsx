import React, { FC, useEffect, useState } from "react";
import "./CardHolder.css";

interface CardHolderProps {
  isHighlighted?: boolean;
}

const CardHolder: FC<CardHolderProps> = ({ isHighlighted }) => {
  const [highlighted, sethighlighted] = useState("");
  useEffect(() => {
    if (isHighlighted) {
      sethighlighted(" cardholder__highlight");
    } else {
      sethighlighted("");
    }
  }, [isHighlighted]);
  return <div className={"cardholder" + highlighted}></div>;
};

export default CardHolder;
