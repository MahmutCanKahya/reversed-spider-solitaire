import { GameType } from "utils/types";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "./local-storage";

export const saveGame = (game: GameType) => {
  try {
    if (game.decks.length !== 0) setLocalStorage("game", game);
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentGame = (): GameType => {
  try {
    const _game = getLocalStorage<GameType>("game");
    return _game;
  } catch (error) {
    console.log(error);
    return {} as GameType;
  }
};

export const removeCurrentGame = () => {
  try {
    removeLocalStorage("game");
  } catch (error) {
    console.log(error);
  }
};
