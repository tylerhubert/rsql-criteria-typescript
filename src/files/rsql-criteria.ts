import { RSQLFilterList } from './rsql-filter-list';
import { RSQLOrderByList } from './rsql-order-by-list';
import { RSQLBuildOptions } from './rsql-build-options';

/**
 * Main class for bringing together API filtering, sorting and pagination.
 */
export class RSQLCriteria {
  public orderBy: RSQLOrderByList;
  public filters: RSQLFilterList;
  public pageSize?: number;
  public includeTotalCount = true;
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
   * Brings together the two criteria filters, ignoring the order by and pagination
   * from the passed in criteria.  Only keeps it from the original RSQLCriteria.
   */
  public and(criteria2: RSQLCriteria): void {
    this.filters.and(criteria2.filters);
  }

  /**
   * Brings together the two criteria filters, ignoring the order by and pagination
   * from the passed in criteria.  Only keeps it from the original RSQLCriteria.
   */
  public or(criteria2: RSQLCriteria): void {
    this.filters.or(criteria2.filters);
  }

  /**
   * Builds the query string that will be needed to send down to the server side API.
   * Combines the keywords with their appropriate clauses to create the string.
   */
  public build(options: RSQLBuildOptions = { encodeString: true }): string {
    const queryStringParts: string[] = [];
    const whereClause = this.filters.build(options);
    if (whereClause !== '') {
      queryStringParts.push(`${this.whereKeyword}=${whereClause}`);
    }
    const orderByClause = this.orderBy.build();
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
