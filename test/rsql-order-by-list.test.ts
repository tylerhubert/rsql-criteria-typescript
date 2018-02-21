import { RSQLOrderByList } from '../src/files/rsql-order-by-list';
import { RSQLOrderByExpression } from '../src/files/rsql-order-by-expression';

describe('RSQLOrderByList', () => {
  it('should create a single order by clause via an new RSQLOrderByExpression', () => {
    let orderBy = new RSQLOrderByList();
    orderBy.addExpression(new RSQLOrderByExpression('code', 'desc'));
    expect(orderBy.build()).toEqual('code desc');
  });

  it('should create a single order by clause', () => {
    let orderBy = new RSQLOrderByList();
    orderBy.add('code', 'asc');
    expect(orderBy.build()).toEqual('code asc');
  });

  it('should chain multiple order by statements together', () => {
    let orderBy = new RSQLOrderByList();
    orderBy.addExpression(new RSQLOrderByExpression('code', 'desc'));
    orderBy.add('description', 'asc');
    expect(orderBy.build()).toEqual('code desc, description asc');
  });

  it('should return an empty string when there are no order by clauses', () => {
    let orderBy = new RSQLOrderByList();
    expect(orderBy.build()).toEqual('');
  });
});
