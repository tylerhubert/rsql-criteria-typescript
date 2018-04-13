import { isNumber, isString } from 'util';
import { Operators } from './rsql-filter-operators';

export class RSQLFilterExpression {
  public field: string;
  public operator: Operators;
  public value: string | Array<string | number> | Date | number | undefined;

  constructor(
    field: string,
    operator: Operators,
    value: string | Array<string | number> | Date | number | undefined
  ) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  /**
   * Builds the individual filter expression into the proper format.
   */
  public build(): string {
    let filterString = '';
    // convert the value into an appropriate string.
    let valueString: string = '';
    if (isString(this.value)) {
      valueString = this.value;
    }
    if (isNumber(this.value)) {
      valueString = this.value.toString();
    }
    if (this.value instanceof Array) {
      let quotedValues = this.value.filter(i => i !== undefined).map(i => {
        if (isNumber(i)) {
          return i;
        } else {
          return encodeURIComponent(this.quote(i));
        }
      });
      valueString = quotedValues.join(',');
    }
    if (this.value instanceof Date) {
      valueString = [
        this.value.getFullYear(),
        this.value.getMonth() + 1,
        this.value.getDate()
      ].join('-');
    }
    // construct the filter string
    filterString += this.field;
    switch (this.operator) {
      case Operators.Equal:
        filterString += '==' + encodeURIComponent(this.quote(valueString));
        break;
      case Operators.NotEqual:
        filterString += '!=' + encodeURIComponent(this.quote(valueString));
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
        filterString += '==' + encodeURIComponent(this.quote(`${valueString}*`));
        break;
      case Operators.EndsWith:
        filterString += '==' + encodeURIComponent(this.quote(`*${valueString}`));
        break;
      case Operators.Contains:
        filterString += '==' + encodeURIComponent(this.quote(`*${valueString}*`));
        break;
      case Operators.DoesNotContain:
        filterString += '!=' + encodeURIComponent(this.quote(`*${valueString}*`));
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

    return filterString;
  }

  private quote(value: string): string {
    return `"${value}"`;
  }
}
