import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-size: 100%;
  background-image: url("../../../spider-solitaire.png");
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  background-color: #c53a3d;
`;
export const Background = styled.img`
  width: 100%;
  height: 100%;
`;

export const PlayButton = styled.div`
  border-radius: 32px;
  background-color: #202020;
  width: 300px;
  height: 85px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  position: absolute;
  bottom: 8%;
  right: calc(50% + -150px);

  &:hover {
    background-color: #20202080;
  }
`;
export const ButtonText = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #c53a3d;
`;

export const BestScoreWrapper = styled.div`
  width: 100vw;
  position: absolute;
  left: 0;
  top: 3%;
`;

export const BestScoreText = styled.div`
  font-size: 56px;
  font-weight: bold;
  color: #202020;
  text-align: center;
`;
