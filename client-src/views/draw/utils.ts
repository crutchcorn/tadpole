export const VecRound = (a: number[], d = 2) => {
  return a.map((v) => +v.toFixed(d));
};
