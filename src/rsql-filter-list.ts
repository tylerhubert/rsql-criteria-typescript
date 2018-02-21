import { RSQLFilterExpression } from './rsql-filter-expression';

export class RSQLFilterList {
  private filters: Array<RSQLFilterExpression | RSQLFilterList>;

  constructor(private combineOperator: 'and' | 'or' = 'and') {
    this.filters = [];
  }

  public setCombineOperator(combineOperator: 'and' | 'or'): void {
    this.combineOperator = combineOperator;
  }

  public getCombineOperator(): 'and' | 'or' {
    return this.combineOperator;
  }

  public add(filter: RSQLFilterExpression | RSQLFilterList) {
    this.filters.push(filter);
  }

  /**
   * Builds the filter string for this list of filters.
   * If there is more than one filter expression, it puts
   * parenthesis around the expression.
   */
  public build(): string {
    let filterString = '';
    let includeParens = this.filters.length > 1;
    let includeConnector = false;
    if (includeParens) {
      filterString += '(';
    }
    for (let filter of this.filters) {
      if (includeConnector) {
        filterString += ` ${this.combineOperator} `;
      }
      filterString += filter.build();
      includeConnector = true;
    }
    if (includeParens) {
      filterString += ')';
    }

    return filterString;
  }
}
