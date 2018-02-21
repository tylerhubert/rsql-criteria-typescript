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
    criteria.filters.add(new RSQLFilterExpression('code', Operators.Equal, 'abc'));
    expect(criteria.build()).toEqual('$where=code=="abc"');
  });

  it('should build an orderBy clause when order by expressions are passed in', () => {
    let criteria = new RSQLCriteria();
    criteria.orderBy.add('code', 'asc');
    expect(criteria.build()).toEqual('$orderBy=code asc');
  });

  it('should build a combined string of filters and order by clauses', () => {
    let criteria = new RSQLCriteria();
    criteria.orderBy.add('code', 'asc');
    criteria.filters.add(new RSQLFilterExpression('code', Operators.Equal, 'abc'));
    expect(criteria.build()).toEqual('$where=code=="abc"&$orderBy=code asc');
  });

  it('should build an orderBy clause when order by expressions are passed in with an overridden orderBy keyword', () => {
    let criteria = new RSQLCriteria('$where', '$order');
    criteria.orderBy.add('code', 'asc');
    expect(criteria.build()).toEqual('$order=code asc');
  });

  it('should build a where clause when filters are passed in with a customized where keyword', () => {
    let criteria = new RSQLCriteria('$filter');
    criteria.filters.add(new RSQLFilterExpression('code', Operators.Equal, 'abc'));
    expect(criteria.build()).toEqual('$filter=code=="abc"');
  });
});
