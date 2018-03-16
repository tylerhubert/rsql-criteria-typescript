import { RSQLFilterList } from '..';

export interface RSQLFilter {
  column(columnName: string): RSQLColumn;
  clear(): void;
}

export interface RSQLColumn {
  equalTo(value: string | Date | number): RSQLCompleteExpression;
  notEqualTo(value: string | Date | number): RSQLCompleteExpression;
  contains(value: string | Date | number): RSQLCompleteExpression;
  doesNotContain(value: string | Date | number): RSQLCompleteExpression;
  greaterThan(value: string | Date | number): RSQLCompleteExpression;
  greaterThanOrEqualTo(value: string | Date | number): RSQLCompleteExpression;
  lessThan(value: string | Date | number): RSQLCompleteExpression;
  lessThanOrEqualTo(value: string | Date | number): RSQLCompleteExpression;
  in(value: Array<string | number>): RSQLCompleteExpression;
  notIn(value: Array<string | number>): RSQLCompleteExpression;
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
