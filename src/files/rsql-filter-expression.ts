import { isBoolean, isNumber, isString } from 'util';
import { Operators } from './rsql-filter-operators';
import { CustomOperator } from '..';

export class RSQLFilterExpression {
  public field: string;
  public operator: Operators | undefined;
  public customOperator: CustomOperator | undefined;
  public value: string | Array<string | number | boolean> | Date | number | boolean | undefined;

  constructor(
    field: string,
    operator: Operators | CustomOperator,
    value: string | Array<string | number | boolean> | Date | number | boolean | undefined
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
  }

  /**
   * Builds the individual filter expression into the proper format.
   */
  public build(): string {
    let filterString = '';
    let shouldQuote = false;
    // convert the value into an appropriate string.
    let valueString: string = '';
    if (isString(this.value)) {
      valueString = this.value;
      valueString = valueString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      shouldQuote = true;
    }
    if (isNumber(this.value)) {
      valueString = this.value.toString();
    }
    if (isBoolean(this.value)) {
      valueString = this.value ? 'true' : 'false';
    }
    if (this.value instanceof Array) {
      let quotedValues = this.value.filter(i => i !== undefined).map(i => {
        if (isNumber(i)) {
          return i;
        } else if (isString(i)) {
          let val = i.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
          return encodeURIComponent(quote(val));
        } else {
          return encodeURIComponent(quote(i));
        }
      });
      valueString = quotedValues.join(',');
    }
    if (this.value instanceof Date) {
      let year = this.value.getFullYear();
      let month = this.value.getMonth() + 1;
      let date = this.value.getDate();

      // Ensure that all year values have four digits, and that month and
      // date values have two digits, by adding leading zeros as necessary
      let yearString = String(year);
      let monthString = String(month);
      let dateString = String(date);

      if (year === 0) {
        yearString = '0000';
      } else if (year < 10) {
        yearString = `000${yearString}`;
      } else if (year < 100) {
        yearString = `00${yearString}`;
      } else if (year < 1000) {
        yearString = `0${yearString}`;
      }

      if (month < 10) {
        monthString = `0${monthString}`;
      }

      if (date < 10) {
        dateString = `0${dateString}`;
      }

      valueString = [yearString, monthString, dateString].join('-');
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
            '=in=' + encodeURIComponent(shouldQuote ? quote(valueString) : valueString);
          break;
        case Operators.NotEqual:
          filterString += '!=' + encodeURIComponent(shouldQuote ? quote(valueString) : valueString);
          break;
        case Operators.Like:
          filterString += '==' + encodeURIComponent(quote(valueString));
          break;
        case Operators.GreaterThan:
          filterString += encodeURIComponent('>') + valueString;
          break;
        case Operators.GreaterThanEqualTo:
          filterString += encodeURIComponent('>=') + valueString;
          break;
        case Operators.LessThan:
          filterString += encodeURIComponent('<') + valueString;
          break;
        case Operators.LessThanEqualTo:
          filterString += encodeURIComponent('<=') + valueString;
          break;
        case Operators.StartsWith:
          filterString += '==' + encodeURIComponent(quote(`${valueString}*`));
          break;
        case Operators.EndsWith:
          filterString += '==' + encodeURIComponent(quote(`*${valueString}`));
          break;
        case Operators.Contains:
          filterString += '==' + encodeURIComponent(quote(`*${valueString}*`));
          break;
        case Operators.DoesNotContain:
          filterString += '!=' + encodeURIComponent(quote(`*${valueString}*`));
          break;
        case Operators.In:
          filterString += '=in=(' + valueString + ')';
          break;
        case Operators.NotIn:
          filterString += '=out=(' + valueString + ')';
          break;
        case Operators.IsEmpty:
          filterString += '==' + encodeURIComponent('""');
          break;
        case Operators.IsNotEmpty:
          filterString += '!=' + encodeURIComponent('""');
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

  private instanceOfCustomOperator(object: any): object is CustomOperator {
    return 'convertToRSQLString' in object;
  }
}

export function quote(value: string | boolean): string {
  return `"${value}"`;
}
