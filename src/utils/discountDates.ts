// Proste sprawdzenie Black Friday / Holiday (bank holidays PL)
export const isBlackFriday = (date: Date): boolean => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return day === 28 && month === 11; // 28.11 Black Friday
};

export const isHolidaySale = (date: Date): boolean => {
  // Bank holidays PL: 1.11, 11.11, 25-26.12 etc.
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return [1, 11].includes(day) || (month === 12 && day >= 25);
};
