import { RSQLFilterList, CustomOperator } from '..';
import { RSQLFilterExpressionOptions } from './rsql-filter-expression-options';

export interface RSQLFilter {
  column(columnName: string): RSQLColumn;
  group(expression: RSQLCompleteExpression): RSQLCompleteExpression;
  clear(): void;
}

export interface RSQLColumn {
  equalTo(
    value: string | Date | number | boolean,
    options: RSQLFilterExpressionOptions
  ): RSQLCompleteExpression;
  notEqualTo(
    value: string | Date | number | boolean,
    options: RSQLFilterExpressionOptions
  ): RSQLCompleteExpression;
  like(value: string, options: RSQLFilterExpressionOptions): RSQLCompleteExpression;
  contains(
    value: string | Date | number,
    options: RSQLFilterExpressionOptions
  ): RSQLCompleteExpression;
  doesNotContain(
    value: string | Date | number,
    options: RSQLFilterExpressionOptions
  ): RSQLCompleteExpression;
  startsWith(value: string, options: RSQLFilterExpressionOptions): RSQLCompleteExpression;
  endsWith(value: string, options: RSQLFilterExpressionOptions): RSQLCompleteExpression;
  greaterThan(
    value: string | Date | number,
    options: RSQLFilterExpressionOptions
  ): RSQLCompleteExpression;
  greaterThanOrEqualTo(
    value: string | Date | number,
    options: RSQLFilterExpressionOptions
  ): RSQLCompleteExpression;
  lessThan(
    value: string | Date | number,
    options: RSQLFilterExpressionOptions
  ): RSQLCompleteExpression;
  lessThanOrEqualTo(
    value: string | Date | number,
    options: RSQLFilterExpressionOptions
  ): RSQLCompleteExpression;
  in(
    value: Array<string | number | boolean>,
    options: RSQLFilterExpressionOptions
  ): RSQLCompleteExpression;
  notIn(
    value: Array<string | number | boolean>,
    options: RSQLFilterExpressionOptions
  ): RSQLCompleteExpression;
  isNull(options: RSQLFilterExpressionOptions): RSQLCompleteExpression;
  isNotNull(options: RSQLFilterExpressionOptions): RSQLCompleteExpression;
  isEmpty(options: RSQLFilterExpressionOptions): RSQLCompleteExpression;
  isNotEmpty(options: RSQLFilterExpressionOptions): RSQLCompleteExpression;
  custom(
    op: CustomOperator,
    value: string | Array<string | number | boolean> | Date | number | boolean | undefined
  ): RSQLCompleteExpression;
}

export interface RSQLCompleteExpression {
  and(): RSQLFilter;
  or(): RSQLFilter;
  toList(): RSQLFilterList;
}
