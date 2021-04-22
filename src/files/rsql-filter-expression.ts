import { RSQLFilterExpressionOptions } from './rsql-filter-expression-options';
import { Operators } from './rsql-filter-operators';
import { CustomOperator } from '..';
import { RSQLBuildOptions } from './rsql-build-options';

export class RSQLFilterExpression {
  public field: string;
  public operator: Operators | undefined;
  public customOperator: CustomOperator | undefined;
  public value:
    | string
    | Array<string | number | boolean>
    | Date
    | number
    | boolean
    | undefined
    | null;
  public options: RSQLFilterExpressionOptions;

  constructor(
    field: string,
    operator: Operators | CustomOperator,
    value: string | Array<string | number | boolean> | Date | number | boolean | undefined | null,
    options: RSQLFilterExpressionOptions = { includeTimestamp: false }
  ) {
    this.field = field;
    if (typeof operator === 'object' && this.instanceOfCustomOperator(operator)) {
      this.operator = undefined;
      this.customOperator = operator as CustomOperator;
    } else {
      this.operator = operator as Operators;
      this.customOperator = undefined;
    }

    this.value = value;
    this.options = options;
  }

  /**
   * Builds the individual filter expression into the proper format.
   */
  public build(buildOptions: RSQLBuildOptions = { encodeString: true }): string {
    let filterString = '';
    let shouldQuote = false;
    // convert the value into an appropriate string.
    let valueString = '';
    if (typeof this.value === 'string') {
      valueString = this.value;
      valueString = valueString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      shouldQuote = true;
    }
    if (typeof this.value === 'number') {
      valueString = this.value.toString();
    }
    if (typeof this.value === 'boolean') {
      valueString = this.value ? 'true' : 'false';
    }
    if (this.value instanceof Array) {
      const quotedValues = this.value
        .filter((i) => i !== undefined)
        .map((i) => {
          if (typeof i === 'number') {
            return i;
          } else if (typeof i === 'string') {
            const val = i.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            return this.buildValueString(val, true, buildOptions);
          } else {
            return this.buildValueString(i, true, buildOptions);
          }
        });
      valueString = quotedValues.join(',');
    }
    if (this.value instanceof Date) {
      if (this.options.includeTimestamp) {
        valueString = this.buildDateString(this.value, true) + this.buildTimestamp(this.value);
      } else {
        valueString = this.buildDateString(this.value, false);
      }

      shouldQuote = true;
    }
    if (this.value === null) {
      valueString = 'null';
    }
    // construct the filter string
    filterString += this.field;

    if (this.customOperator !== undefined) {
      filterString += this.customOperator.convertToRSQLString(this.value, valueString, shouldQuote);
    } else {
      switch (this.operator) {
        case Operators.Equal:
          filterString +=
            '=in=' + this.buildValueString(valueString, shouldQuote, buildOptions);
          break;
        case Operators.NotEqual:
          filterString +=
            '!=' + this.buildValueString(valueString, shouldQuote, buildOptions);
          break;
        case Operators.Like:
          filterString +=
            '==' + this.buildValueString(valueString, true, buildOptions);
          break;
        case Operators.GreaterThan:
          filterString += this.buildOperandString('>', buildOptions) + valueString;
          break;
        case Operators.GreaterThanEqualTo:
          filterString += this.buildOperandString('>=', buildOptions) + valueString;
          break;
        case Operators.LessThan:
          filterString += this.buildOperandString('<', buildOptions) + valueString;
          break;
        case Operators.LessThanEqualTo:
          filterString += this.buildOperandString('<=', buildOptions) + valueString;
          break;
        case Operators.StartsWith:
          filterString +=
            '==' + this.buildValueString(`${valueString}*`, true, buildOptions);
          break;
        case Operators.EndsWith:
          filterString +=
            '==' + this.buildValueString(`*${valueString}`, true, buildOptions);
          break;
        case Operators.Contains:
          filterString +=
            '==' + this.buildValueString(`*${valueString}*`, true, buildOptions);
          break;
        case Operators.DoesNotContain:
          filterString +=
            '!=' + this.buildValueString(`*${valueString}*`, true, buildOptions);
          break;
        case Operators.In:
          filterString += '=in=(' + valueString + ')';
          break;
        case Operators.NotIn:
          filterString += '=out=(' + valueString + ')';
          break;
        case Operators.IsEmpty:
          filterString += '==' + this.buildValueString('""', false, buildOptions);
          break;
        case Operators.IsNotEmpty:
          filterString += '!=' + this.buildValueString('""', false, buildOptions);
          break;
        case Operators.IsNull:
          filterString += '==null';
          break;
        case Operators.IsNotNull:
          filterString += '!=null';
          break;
      }
    }

    return filterString;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private instanceOfCustomOperator(object: any): object is CustomOperator {
    return 'convertToRSQLString' in object;
  }

  private buildDateString(dateObject: Date, useUTC: boolean): string {
    let year;
    let month;
    let date;

    if (useUTC) {
      year = dateObject.getUTCFullYear();
      month = dateObject.getUTCMonth() + 1;
      date = dateObject.getUTCDate();
    } else {
      year = dateObject.getFullYear();
      month = dateObject.getMonth() + 1;
      date = dateObject.getDate();
    }

    const yearString = this.numberToString(year, 4);
    const monthString = this.numberToString(month, 2);
    const dateString = this.numberToString(date, 2);

    return [yearString, monthString, dateString].join('-');
  }

  /**
   * Returns a timestamp in the ISO 8601 format for the given Date object, using UTC values (i.e. 'T'HH:mm:ss.SSS'Z').
   */
  private buildTimestamp(dateObject: Date): string {
    const hours = dateObject.getUTCHours();
    const minutes = dateObject.getUTCMinutes();
    const seconds = dateObject.getUTCSeconds();
    const millis = dateObject.getUTCMilliseconds();

    const hoursString = this.numberToString(hours, 2);
    const minutesString = this.numberToString(minutes, 2);
    const secondsString = this.numberToString(seconds, 2);
    const millisString = this.numberToString(millis, 3);

    return 'T' + [hoursString, minutesString, secondsString].join(':') + '.' + millisString + 'Z';
  }

  /**
   * Returns a string of the given number, ensuring the total number of digits
   * is as specified by left-padding with zeros if necessary.
   * e.g. numberToString(8, 3) === '008'
   */
  private numberToString(num: number, digitCount: number): string {
    let s = String(num);

    while (s.length < digitCount) {
      s = '0' + s;
    }

    return s;
  }

  private buildValueString(valueString: string | boolean, shouldQuote: boolean, buildOptions: RSQLBuildOptions): string {
    return (buildOptions.encodeString
      ? encodeURIComponent(shouldQuote ? quote(valueString) : valueString.toString())
      : shouldQuote
      ? quote(valueString)
      : valueString.toString());
  }

  private buildOperandString(operandString: string, buildOptions: RSQLBuildOptions): string {
    return buildOptions.encodeString ? encodeURIComponent(operandString) : operandString;
  }
}

export function quote(value: string | boolean): string {
  return `"${value}"`;
}
