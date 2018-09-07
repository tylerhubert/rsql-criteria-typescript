import { RSQLFilterList } from '..';

export interface RSQLFilter {
  column(columnName: string): RSQLColumn;
  group(expression: RSQLCompleteExpression): RSQLCompleteExpression;
  clear(): void;
}

export interface RSQLColumn {
  equalTo(value: string | Date | number | boolean): RSQLCompleteExpression;
  notEqualTo(value: string | Date | number | boolean): RSQLCompleteExpression;
  like(value: string): RSQLCompleteExpression;
  contains(value: string | Date | number): RSQLCompleteExpression;
  doesNotContain(value: string | Date | number): RSQLCompleteExpression;
  startsWith(value: string): RSQLCompleteExpression;
  endsWith(value: string): RSQLCompleteExpression;
  greaterThan(value: string | Date | number): RSQLCompleteExpression;
  greaterThanOrEqualTo(value: string | Date | number): RSQLCompleteExpression;
  lessThan(value: string | Date | number): RSQLCompleteExpression;
  lessThanOrEqualTo(value: string | Date | number): RSQLCompleteExpression;
  in(value: Array<string | number | boolean>): RSQLCompleteExpression;
  notIn(value: Array<string | number | boolean>): RSQLCompleteExpression;
  isNull(): RSQLCompleteExpression;
  isNotNull(): RSQLCompleteExpression;
  isEmpty(): RSQLCompleteExpression;
  isNotEmpty(): RSQLCompleteExpression;
}

export interface RSQLCompleteExpression {
  and(): RSQLFilter;
  or(): RSQLFilter;
  toList(): RSQLFilterList;
}
