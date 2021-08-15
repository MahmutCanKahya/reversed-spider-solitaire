import { isEmpty } from "lodash";
import { GameType } from "utils/types";

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

export const setHighScore = (highScore: number) => {
  try {
    setLocalStorage("highScore", highScore);
  } catch (error) {
    console.log(error);
  }
};
export const getHighScore = (): number => {
  try {
    const _highScore = getLocalStorage<number>("highScore");
    console.log(_highScore);
    return _highScore;
    if (isEmpty(_highScore)) {
      return 0;
    }
    return _highScore;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

const setLocalStorage = (key: string, obj: {}) => {
  localStorage.setItem(key, JSON.stringify(obj));
};

const getLocalStorage = <T>(key: string): T => {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  } else {
    return {} as T;
  }
};
const removeLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};
