import { isNumber, isString } from 'util';
import { Operators } from './rsql-filter-operators';

export class RSQLFilterExpression {
  public field: string;
  public operator: Operators;
  public value: string | Array<string> | Date | number | undefined;

  constructor(
    field: string,
    operator: Operators,
    value: string | Array<string> | Date | number | undefined
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
      let quotedValues = this.value.map(i => this.quote(i));
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
        filterString += '==' + this.quote(valueString);
        break;
      case Operators.NotEqual:
        filterString += '!=' + this.quote(valueString);
        break;
      case Operators.IsNull:
        filterString += '==null';
        break;
      case Operators.IsNotNull:
        filterString += '!=null';
        break;
      case Operators.GreaterThan:
        filterString += `>${valueString}`;
        break;
      case Operators.GreaterThanEqualTo:
        filterString += `>=${valueString}`;
        break;
      case Operators.LessThan:
        filterString += `<${valueString}`;
        break;
      case Operators.LessThanEqualTo:
        filterString += `<=${valueString}`;
        break;
      case Operators.StartsWith:
        filterString += '==' + this.quote(`${valueString}*`);
        break;
      case Operators.EndsWith:
        filterString += '==' + this.quote(`*${valueString}`);
        break;
      case Operators.Contains:
        filterString += '==' + this.quote(`*${valueString}*`);
        break;
      case Operators.DoesNotContain:
        filterString += '!=' + this.quote(`*${valueString}*`);
        break;
      case Operators.IsEmpty:
        filterString += '==""';
        break;
      case Operators.IsNotEmpty:
        filterString += '!=""';
        break;
      case Operators.In:
        filterString += '=in=(' + valueString + ')';
        break;
      case Operators.NotIn:
        filterString += '=out=(' + valueString + ')';
    }

    return filterString;
  }

  private quote(value: string): string {
    return `"${value}"`;
  }
}
