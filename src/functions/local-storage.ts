


export const setLocalStorage = (key: string, obj: {}) => {
  localStorage.setItem(key, JSON.stringify(obj));
};

export const getLocalStorage = <T>(key: string): T => {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  } else {
    return {} as T;
  }
};
export const removeLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};
