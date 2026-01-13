
export const SLOTS = ['12:00-14:00','14:00-16:00','18:00-20:00','20:00-22:00'];
export const isValidSlot = (s) => SLOTS.includes(s);
export const isFutureDate = (d) => {
  // d: 'YYYY-MM-DD'
  const today = new Date().toISOString().slice(0,10);
  return d >= today;
};