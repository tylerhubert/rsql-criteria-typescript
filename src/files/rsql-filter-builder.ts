import { RSQLFilterList, Operators, RSQLFilterExpression } from '..';
import { RSQLFilter, RSQLColumn, RSQLCompleteExpression } from './rsql-expression-parts';

export class RSQLFilterBuilder implements RSQLFilter, RSQLColumn, RSQLCompleteExpression {
  private filters: RSQLFilterList = new RSQLFilterList();
  private columnName: string;
  private operator: Operators;
  private value: string | Array<string | number> | Date | number | undefined;
  private connector: 'and' | 'or' = 'and';

  constructor() {
    this.columnName = '';
    this.operator = Operators.Equal;
    this.value = undefined;
  }

  column(columnName: string): RSQLColumn {
    this.columnName = columnName;
    return this;
  }
  clear(): void {
    this.filters = new RSQLFilterList();
    this.columnName = '';
    this.operator = Operators.Equal;
    this.value = undefined;
    this.connector = 'and';
  }

  equalTo(value: string | Date | number): RSQLCompleteExpression {
    this.operator = Operators.Equal;
    this.value = value;
    return this;
  }

  notEqualTo(value: string | number | Date): RSQLCompleteExpression {
    this.operator = Operators.NotEqual;
    this.value = value;
    return this;
  }

  contains(value: string | number | Date): RSQLCompleteExpression {
    this.operator = Operators.Contains;
    this.value = value;
    return this;
  }

  doesNotContain(value: string | number | Date): RSQLCompleteExpression {
    this.operator = Operators.DoesNotContain;
    this.value = value;
    return this;
  }

  greaterThan(value: string | number | Date): RSQLCompleteExpression {
    this.operator = Operators.GreaterThan;
    this.value = value;
    return this;
  }

  greaterThanOrEqualTo(value: string | number | Date): RSQLCompleteExpression {
    this.operator = Operators.GreaterThanEqualTo;
    this.value = value;
    return this;
  }

  lessThan(value: string | number | Date): RSQLCompleteExpression {
    this.operator = Operators.LessThan;
    this.value = value;
    return this;
  }

  lessThanOrEqualTo(value: string | number | Date): RSQLCompleteExpression {
    this.operator = Operators.LessThanEqualTo;
    this.value = value;
    return this;
  }

  in(value: Array<string | number>): RSQLCompleteExpression {
    this.operator = Operators.In;
    this.value = value;
    return this;
  }

  notIn(value: Array<string | number>): RSQLCompleteExpression {
    this.operator = Operators.NotIn;
    this.value = value;
    return this;
  }

  isNull(): RSQLCompleteExpression {
    this.operator = Operators.IsNull;
    this.value = undefined;
    return this;
  }

  isNotNull(): RSQLCompleteExpression {
    this.operator = Operators.IsNotNull;
    this.value = undefined;
    return this;
  }

  isEmpty(): RSQLCompleteExpression {
    this.operator = Operators.IsEmpty;
    this.value = undefined;
    return this;
  }

  isNotEmpty(): RSQLCompleteExpression {
    this.operator = Operators.IsNotEmpty;
    this.value = undefined;
    return this;
  }

  and(): RSQLFilter {
    this.addToList(new RSQLFilterExpression(this.columnName, this.operator, this.value));
    this.connector = 'and';
    return this;
  }

  or(): RSQLFilter {
    this.addToList(new RSQLFilterExpression(this.columnName, this.operator, this.value));
    this.connector = 'or';
    return this;
  }

  toList(): RSQLFilterList {
    this.addToList(new RSQLFilterExpression(this.columnName, this.operator, this.value));
    return this.filters;
  }

  private addToList(filter: RSQLFilterExpression): void {
    if (this.connector === 'and') {
      this.filters.and(filter);
    } else {
      this.filters.or(filter);
    }
  }
}
