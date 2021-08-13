import React from "react";
import { useHistory } from "react-router-dom";
import routes from "../../utils/route-config.json";
import {
    BestScoreText,
    BestScoreWrapper,
    ButtonText,
    PlayButton,
    Wrapper
} from "./styles";

function HomeScreen() {
  const history = useHistory();
  return (
    <Wrapper>
      <BestScoreWrapper>
        <BestScoreText>Best Score: 1040</BestScoreText>
      </BestScoreWrapper>
      <PlayButton onClick={() => history.push(routes.game)}>
        <ButtonText>PLAY GAME</ButtonText>
      </PlayButton>
    </Wrapper>
  );
}

export default HomeScreen;
