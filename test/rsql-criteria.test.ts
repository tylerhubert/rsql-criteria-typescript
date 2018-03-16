import { RSQLCriteria } from '../src/files/rsql-criteria';
import { RSQLFilterList } from '../src/files/rsql-filter-list';
import { RSQLFilterExpression } from '../src/files/rsql-filter-expression';
import { Operators } from '../src/files/rsql-filter-operators';

describe('RSQLCriteria test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy();
  });

  it('RSQLCriteria is instantiable', () => {
    expect(new RSQLCriteria()).toBeInstanceOf(RSQLCriteria);
  });

  it('should build nothing if there are no filters or order by clause', () => {
    let criteria = new RSQLCriteria();
    expect(criteria.build()).toEqual('');
  });

  it('should build a where clause when filters are passed in', () => {
    let criteria = new RSQLCriteria();
    criteria.filters.and(new RSQLFilterExpression('code', Operators.Equal, 'abc'));
    expect(criteria.build()).toEqual(`$where=code==${encodeURIComponent('"abc"')}`);
  });

  it('should build an orderBy clause when order by expressions are passed in', () => {
    let criteria = new RSQLCriteria();
    criteria.orderBy.add('code', 'asc');
    expect(criteria.build()).toEqual('$orderBy=code asc');
  });

  it('should build a combined string of filters and order by clauses', () => {
    let criteria = new RSQLCriteria();
    criteria.orderBy.add('code', 'asc');
    criteria.filters.and(new RSQLFilterExpression('code', Operators.Equal, 'abc'));
    expect(criteria.build()).toEqual(
      `$where=code==${encodeURIComponent('"abc"')}&$orderBy=code asc`
    );
  });

  it('should build an orderBy clause when order by expressions are passed in with an overridden orderBy keyword', () => {
    let criteria = new RSQLCriteria('$where', '$order');
    criteria.orderBy.add('code', 'asc');
    expect(criteria.build()).toEqual('$order=code asc');
  });

  it('should build a where clause when filters are passed in with a customized where keyword', () => {
    let criteria = new RSQLCriteria('$filter');
    criteria.filters.and(new RSQLFilterExpression('code', Operators.Equal, 'abc'));
    expect(criteria.build()).toEqual(`$filter=code==${encodeURIComponent('"abc"')}`);
  });

  it('should add in pageSize when that has been set.', () => {
    let criteria = new RSQLCriteria();
    criteria.pageSize = 10;
    expect(criteria.build()).toEqual('$pageSize=10&$includeTotalCount=true');
  });

  it('should not add in totalCount when that has been turned off.', () => {
    let criteria = new RSQLCriteria();
    criteria.pageSize = 10;
    criteria.includeTotalCount = false;
    expect(criteria.build()).toEqual('$pageSize=10');
  });

  it('should add in pageNumber when that has been set.', () => {
    let criteria = new RSQLCriteria();
    criteria.pageNumber = 3;
    expect(criteria.build()).toEqual('$pageNumber=3');
  });

  it('should include all pagination parts when they are set.', () => {
    let criteria = new RSQLCriteria();
    criteria.pageSize = 10;
    criteria.pageNumber = 2;
    expect(criteria.build()).toEqual('$pageSize=10&$includeTotalCount=true&$pageNumber=2');
  });

  it('should override the pageSizeKeyword when that has been set.', () => {
    let criteria = new RSQLCriteria('$where', '$orderBy', '$take');
    criteria.pageSize = 10;
    expect(criteria.build()).toEqual('$take=10&$includeTotalCount=true');
  });

  it('should override the includeTotalCountKeyword when that has been set.', () => {
    let criteria = new RSQLCriteria('$where', '$orderBy', '$take', 'total');
    criteria.pageSize = 10;
    expect(criteria.build()).toEqual('$take=10&total=true');
  });

  it('should override the includeTotalCountKeyword when that has been set.', () => {
    let criteria = new RSQLCriteria('$where', '$orderBy', '$take', 'total', '$skip');
    criteria.pageSize = 10;
    criteria.pageNumber = 2;
    expect(criteria.build()).toEqual('$take=10&total=true&$skip=2');
  });
});
