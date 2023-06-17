import * as DateFns from "date-fns";

/** Format DateString to Date
 * @param dateStr - date in string format
 * @returns - date in Date format
 */
export const formatToDate = (dateStr: string): Date => {
  const formattedDate: Date = DateFns.parseISO(dateStr);

  if (!DateFns.isValid(formattedDate)) {
    throw new Error(
      `${dateStr} is invalid.Input should be yyyy-mm-dd or yyyyMMddd.`
    );
  }

  return formattedDate;
};

/** Compare date is before
 * @param date - compare date
 * @param compareDate - date to be compared
 * @returns - boolean if date is before
 */
export const isBefore = (
  date: Date | string,
  compareDate: Date | string
): boolean => {
  const formattedDate = date instanceof Date ? date : formatToDate(date);
  const formattedCompareDate =
    compareDate instanceof Date ? compareDate : formatToDate(compareDate);

  return DateFns.isBefore(formattedDate, formattedCompareDate);
};
