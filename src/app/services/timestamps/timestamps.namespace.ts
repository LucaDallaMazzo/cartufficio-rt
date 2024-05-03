export namespace TIMESTAMPS {
  export const DAYTS = 24 * 60 * 60 * 1000;
  export const WEEKTS = 7 * TIMESTAMPS.DAYTS;
  export const MONTHTS = 30 * TIMESTAMPS.DAYTS;
  export const YEARTS = 365 * TIMESTAMPS.DAYTS;
  export function weeks(num: number) {
    return num * TIMESTAMPS.WEEKTS;
  }
  export function days(num: number) {
    return num * TIMESTAMPS.DAYTS;
  }
  export function months(num: number) {
    return num * TIMESTAMPS.MONTHTS;
  }
  export function years(num: number) {
    return num * TIMESTAMPS.YEARTS;
  }
}
