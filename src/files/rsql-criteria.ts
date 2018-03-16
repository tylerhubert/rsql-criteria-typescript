import { RSQLFilterList } from './rsql-filter-list';
import { RSQLOrderByList } from './rsql-order-by-list';

/**
 * Main class for bringing together API filtering, sorting and pagination.
 */
export class RSQLCriteria {
  public orderBy: RSQLOrderByList;
  public filters: RSQLFilterList;
  public pageSize?: number;
  public includeTotalCount: boolean = true;
  public pageNumber?: number;

  constructor(
    private whereKeyword: string = '$where',
    private orderByKeyword: string = '$orderBy',
    private pageSizeKeyword: string = '$pageSize',
    private includeTotalCountKeyword: string = '$includeTotalCount',
    private pageNumberKeyword: string = '$pageNumber'
  ) {
    this.filters = new RSQLFilterList();
    this.orderBy = new RSQLOrderByList();
  }

  /**
   * Builds the query string that will be needed to send down to the server side API.
   * Combines the keywords with their appropriate clauses to create the string.
   */
  public build(): string {
    let queryStringParts: string[] = [];
    let whereClause = this.filters.build();
    if (whereClause !== '') {
      queryStringParts.push(`${this.whereKeyword}=${whereClause}`);
    }
    let orderByClause = this.orderBy.build();
    if (orderByClause !== '') {
      queryStringParts.push(`${this.orderByKeyword}=${orderByClause}`);
    }
    if (this.pageSize !== undefined) {
      queryStringParts.push(`${this.pageSizeKeyword}=${this.pageSize}`);
      if (this.includeTotalCount) {
        queryStringParts.push(`${this.includeTotalCountKeyword}=true`);
      }
    }
    if (this.pageNumber !== undefined) {
      queryStringParts.push(`${this.pageNumberKeyword}=${this.pageNumber}`);
    }
    return queryStringParts.join('&');
  }
}
