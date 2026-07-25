/** True if [aStart, aEnd) overlaps [bStart, bEnd) for night-style stays. */
export function datesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
) {
  return aStart < bEnd && bStart < aEnd;
}

/** @deprecated use datesOverlap */
export const dataOverlap = datesOverlap;

export function nightsBetween(checkIn: Date, checkOut: Date) {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.max(0, Math.round(ms / (24 * 60 * 60 * 1000)));
}

/** @deprecated use nightsBetween */
export const nightBetween = nightsBetween;
