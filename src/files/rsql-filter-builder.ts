import { RSQLFilterList, Operators, RSQLFilterExpression, CustomOperator } from '..';
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
  private connector: 'and' | 'or' = 'and';

  constructor() {
    this.columnName = '';
  }

  /**
   * Start of the Filter Expression
   * @param columnName name of the column you would like to filter on
   */
  column(columnName: string): RSQLColumn {
    this.columnName = columnName;
    return this;
  }

  group(expression: RSQLCompleteExpression): RSQLCompleteExpression {
    this.addToList(expression.toList());
    return this;
  }

  /**
   * Reset the RSQLFilterBuilder to its original state.
   */
  clear(): void {
    this.filters = new RSQLFilterList();
    this.columnName = '';
    this.connector = 'and';
  }

  equalTo(value: string | Date | number | boolean): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.Equal, value));
    return this;
  }

  notEqualTo(value: string | number | Date | boolean): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.NotEqual, value));
    return this;
  }

  like(value: string): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.Like, value));
    return this;
  }

  contains(value: string | number | Date): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.Contains, value));
    return this;
  }

  doesNotContain(value: string | number | Date): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.DoesNotContain, value));
    return this;
  }

  startsWith(value: string): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.StartsWith, value));
    return this;
  }

  endsWith(value: string): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.EndsWith, value));
    return this;
  }

  greaterThan(value: string | number | Date): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.GreaterThan, value));
    return this;
  }

  greaterThanOrEqualTo(value: string | number | Date): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.GreaterThanEqualTo, value));
    return this;
  }

  lessThan(value: string | number | Date): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.LessThan, value));
    return this;
  }

  lessThanOrEqualTo(value: string | number | Date): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.LessThanEqualTo, value));
    return this;
  }

  in(value: Array<string | number | boolean>): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.In, value));
    return this;
  }

  notIn(value: Array<string | number | boolean>): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.NotIn, value));
    return this;
  }

  isNull(): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.IsNull, undefined));
    return this;
  }

  isNotNull(): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.IsNotNull, undefined));
    return this;
  }

  isEmpty(): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.IsEmpty, undefined));
    return this;
  }

  isNotEmpty(): RSQLCompleteExpression {
    this.addToList(new RSQLFilterExpression(this.columnName, Operators.IsNotEmpty, undefined));
    return this;
  }

  custom(
    op: CustomOperator,
    value: string | Array<string | number | boolean> | Date | number | boolean | undefined
  ) {
    this.addToList(new RSQLFilterExpression(this.columnName, op, value));
    return this;
  }

  and(): RSQLFilter {
    this.connector = 'and';
    return this;
  }

  or(): RSQLFilter {
    this.connector = 'or';
    return this;
  }

  /**
   * Returns the RSQLFilterList instance that this builder has been adding things to.
   * This can be added to other lists or set as the filters on the RSQLCriteria class.
   */
  toList(): RSQLFilterList {
    return this.filters;
  }

  private addToList(filter: RSQLFilterExpression | RSQLFilterList): void {
    if (this.connector === 'and') {
      this.filters.and(filter);
    } else {
      this.filters.or(filter);
    }
  }
}
