import { getLocalStorage, setLocalStorage } from "./local-storage";

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
    if (typeof _highScore !== "number") {
      return 0;
    }
    return _highScore;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
