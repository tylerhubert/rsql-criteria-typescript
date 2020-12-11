/**
 * Implement this interface if you want to add your own custom operator to use with this library.
 */
export interface CustomOperator {
  /**
   * Should return a string that represents the operation and value.  Ex: '=customOperator="abc"'.  The field name will already be prepended to the string
   * before this method gets called.
   * @param value Original value that is passed into the RSQL Filter Expression
   * @param valueString Formatted value that the library uses internally.  This has dates, arrays, booleans, etc in the format that the library uses.
   * @param shouldQuote Boolean passed down to say if this value should be surrounded by quotes.
   */
  convertToRSQLString(
    value: string | Array<string | number | boolean> | Date | number | boolean | undefined | null,
    valueString: string,
    shouldQuote: boolean
  ): string;
}
