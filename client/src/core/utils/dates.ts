const pad = (input: number): string => input.toString().padStart(2, '0');
export const getToday = () => new Date();
export const getDateString = (date: Date) => {
  return `${pad(date.getDate())}-${(pad((date.getMonth() + 1)))}-${date.getFullYear()}`;
};
export const getTimeString = (date: Date) => {
  return `${pad(date.getHours())}:${(pad(date.getMinutes()))}:${pad(date.getSeconds())}`;
};
