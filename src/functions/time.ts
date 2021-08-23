import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "./local-storage";

export const setTime = (time: number) => {
  try {
    setLocalStorage("time", time);
  } catch (error) {
    console.log(error);
  }
};

export const getTime = (): number => {
  try {
    const _gameTime = getLocalStorage<number>("time");
    if (typeof _gameTime !== "number") {
      return 1;
    }
    return _gameTime;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const removeGameTime = () => {
  try {
    removeLocalStorage("time");
    setTime(-1);
  } catch (error) {
    console.log(error);
  }
};
