import { RSQLFilterList } from '../src/rsql-filter-list';
import { RSQLFilterExpression } from '../src/rsql-filter-expression';
import { Operators } from '../src/rsql-filter-operators';

describe('RSQLFilterList', () => {
  it('should create a string with just one filter expression in it', () => {
    let list = new RSQLFilterList();
    list.add(new RSQLFilterExpression('code', Operators.Equal, '123'));
    expect(list.build()).toEqual('code=="123"');
  });

  it('should bring together two expression with an AND by default', () => {
    let list = new RSQLFilterList();
    list.add(new RSQLFilterExpression('code', Operators.Equal, '123'));
    list.add(
      new RSQLFilterExpression('description', Operators.NotEqual, '456')
    );
    expect(list.build()).toEqual('(code=="123" and description!="456")');
  });

  it('should bring together two expression with an OR when set', () => {
    let list = new RSQLFilterList('or');
    list.add(new RSQLFilterExpression('code', Operators.Equal, '123'));
    list.add(
      new RSQLFilterExpression('description', Operators.NotEqual, '456')
    );
    expect(list.build()).toEqual('(code=="123" or description!="456")');
  });

  it('should bring together two expression with an OR when set via the method call', () => {
    let list = new RSQLFilterList();
    list.setCombineOperator('or');
    list.add(new RSQLFilterExpression('code', Operators.Equal, '123'));
    list.add(
      new RSQLFilterExpression('description', Operators.NotEqual, '456')
    );
    expect(list.build()).toEqual('(code=="123" or description!="456")');
  });

  it('should return the proper combination operation when asked for.', () => {
    let list = new RSQLFilterList();
    expect(list.getCombineOperator()).toEqual('and');
    let list2 = new RSQLFilterList('or');
    expect(list2.getCombineOperator()).toEqual('or');
  });

  it('should bring together two lists with an OR when set via the method call', () => {
    let list = new RSQLFilterList('or');
    let ex1 = new RSQLFilterList();
    ex1.add(new RSQLFilterExpression('firstName', Operators.Equal, 'John'));
    ex1.add(new RSQLFilterExpression('lastName', Operators.Equal, 'Doe'));
    let ex2 = new RSQLFilterList();
    ex2.add(new RSQLFilterExpression('firstName', Operators.Equal, 'Jane'));
    ex2.add(new RSQLFilterExpression('lastName', Operators.Equal, 'Deer'));
    list.add(ex1);
    list.add(ex2);
    expect(list.build()).toEqual(
      '((firstName=="John" and lastName=="Doe") or (firstName=="Jane" and lastName=="Deer"))'
    );
  });
});
