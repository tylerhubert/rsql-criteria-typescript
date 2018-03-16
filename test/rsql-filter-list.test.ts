import { RSQLFilterList } from '../src/files/rsql-filter-list';
import { RSQLFilterExpression } from '../src/files/rsql-filter-expression';
import { Operators } from '../src/files/rsql-filter-operators';

describe('RSQLFilterList', () => {
  it('should create a string with just one filter expression in it', () => {
    let list = new RSQLFilterList();
    list.and(new RSQLFilterExpression('code', Operators.Equal, '123'));
    expect(list.build()).toEqual('code=="123"');
  });

  it('should bring together two expression with an AND by default', () => {
    let list = new RSQLFilterList();
    list.and(new RSQLFilterExpression('code', Operators.Equal, '123'));
    list.and(new RSQLFilterExpression('description', Operators.NotEqual, '456'));
    expect(list.build()).toEqual('(code=="123" and description!="456")');
  });

  it('should bring together two expression with an OR', () => {
    let list = new RSQLFilterList();
    list.or(new RSQLFilterExpression('code', Operators.Equal, '123'));
    list.or(new RSQLFilterExpression('description', Operators.NotEqual, '456'));
    expect(list.build()).toEqual('(code=="123" or description!="456")');
  });

  it('should bring together two lists with an OR when that is stated', () => {
    let list = new RSQLFilterList();
    let ex1 = new RSQLFilterList();
    ex1.and(new RSQLFilterExpression('firstName', Operators.Equal, 'John'));
    ex1.and(new RSQLFilterExpression('lastName', Operators.Equal, 'Doe'));
    let ex2 = new RSQLFilterList();
    ex2.and(new RSQLFilterExpression('firstName', Operators.Equal, 'Jane'));
    ex2.and(new RSQLFilterExpression('lastName', Operators.Equal, 'Deer'));
    list.or(ex1);
    list.or(ex2);
    expect(list.build()).toEqual(
      '((firstName=="John" and lastName=="Doe") or (firstName=="Jane" and lastName=="Deer"))'
    );
  });

  it('should chain statements together with the appropriate combination.', () => {
    let list = new RSQLFilterList();
    list.and(new RSQLFilterExpression('firstName', Operators.Equal, 'abc'));
    list.and(new RSQLFilterExpression('lastName', Operators.Equal, 'def'));
    list.or(new RSQLFilterExpression('code', Operators.Equal, '123'));
    list.or(new RSQLFilterExpression('description', Operators.NotEqual, '456'));
    expect(list.build()).toEqual(
      '(firstName=="abc" and lastName=="def" or code=="123" or description!="456")'
    );
  });
});
