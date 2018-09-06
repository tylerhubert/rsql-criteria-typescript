import { RSQLFilterList, Operators, RSQLFilterExpression } from '..';
import { RSQLFilter, RSQLColumn, RSQLCompleteExpression } from './rsql-expression-parts';

/**
 * Allows for the building of RSQLFilterExpressions in a readable way.
 *
 * @example
 * let builder: RSQLFilter = new RSQLFilterBuilder();
 * let list = builder.column('blah').equalTo('123').toList();
 * let queryStringPart = list.build();
 * // returns blah=="123"
 *
 * @example
 * let rsql: RSQLCriteria = new RSQLCriteria();
 * let builder: RSQLFilter = new RSQLFilterBuilder();
 * rsql.filters.and(builder.column('blah').equalTo('123')
 *                     .or().column('test').equalTo('456').toList());
 * rsql.build();
 * // returns $where=(blah=="123" or test=="456")
 */
export class RSQLFilterBuilder implements RSQLFilter, RSQLColumn, RSQLCompleteExpression {
  private filters: RSQLFilterList = new RSQLFilterList();
  private columnName: string;
  private operator: Operators;
  private value: string | Array<string | number | boolean> | Date | number | boolean | undefined;
  private connector: 'and' | 'or' = 'and';

  constructor() {
    this.columnName = '';
    this.operator = Operators.Equal;
    this.value = undefined;
  }

  /**
   * Start of the Filter Expression
   * @param columnName name of the column you would like to filter on
   */
  column(columnName: string): RSQLColumn {
    this.columnName = columnName;
    return this;
  }

  /**
   * Reset the RSQLFilterBuilder to its original state.
   */
  clear(): void {
    this.filters = new RSQLFilterList();
    this.columnName = '';
    this.operator = Operators.Equal;
    this.value = undefined;
    this.connector = 'and';
  }

  equalTo(value: string | Date | number | boolean): RSQLCompleteExpression {
    this.operator = Operators.Equal;
    this.value = value;
    return this;
  }

  notEqualTo(value: string | number | Date | boolean): RSQLCompleteExpression {
    this.operator = Operators.NotEqual;
    this.value = value;
    return this;
  }

  like(value: string): RSQLCompleteExpression {
    this.operator = Operators.Like;
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

  startsWith(value: string): RSQLCompleteExpression {
    this.operator = Operators.StartsWith;
    this.value = value;
    return this;
  }

  endsWith(value: string): RSQLCompleteExpression {
    this.operator = Operators.EndsWith;
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

  in(value: Array<string | number | boolean>): RSQLCompleteExpression {
    this.operator = Operators.In;
    this.value = value;
    return this;
  }

  notIn(value: Array<string | number | boolean>): RSQLCompleteExpression {
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

  /**
   * Returns the RSQLFilterList instance that this builder has been adding things to.
   * This can be added to other lists or set as the filters on the RSQLCriteria class.
   */
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
