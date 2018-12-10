import { CustomOperator, quote } from '../src';

export class TestOperator implements CustomOperator {
  convertToRSQLString(
    value: string | number | boolean | (string | number | boolean)[] | Date,
    valueString: string,
    shouldQuote: boolean
  ): string {
    return '=custom=' + encodeURIComponent(shouldQuote ? quote(valueString) : valueString);
  }
}
