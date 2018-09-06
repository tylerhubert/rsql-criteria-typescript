import { RSQLFilterExpression } from '../src/files/rsql-filter-expression';
import { Operators } from '../src/files/rsql-filter-operators';

describe('RSQLFilterExpression', () => {
  it('should handle the Equals operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.Equal, '123');
    expect(ex.build()).toEqual(`code=in=${encodeURIComponent('"123"')}`);

    ex = new RSQLFilterExpression('code', Operators.Equal, false);
    expect(ex.build()).toEqual(`code=in=false`);

    ex = new RSQLFilterExpression('code', Operators.Equal, 'ab"c');
    expect(ex.build()).toEqual(`code=in=%22ab%5C%22c%22`);

    ex = new RSQLFilterExpression('code', Operators.Equal, 'ab\\c');
    expect(ex.build()).toEqual(`code=in=%22ab%5C%5Cc%22`);

    ex = new RSQLFilterExpression('code', Operators.Equal, 'ab\\"c');
    expect(ex.build()).toEqual(`code=in=%22ab%5C%5C%5C%22c%22`);

    ex = new RSQLFilterExpression('code', Operators.Equal, 123);
    expect(ex.build()).toEqual(`code=in=123`);
  });

  it('should handle the Equals operator when our value is null', () => {
    let ex = new RSQLFilterExpression('code', Operators.Equal, null);
    expect(ex.build()).toEqual(`code=in=null`);
  });

  it('should handle the NotEquals operator when our value is null', () => {
    let ex = new RSQLFilterExpression('code', Operators.NotEqual, null);
    expect(ex.build()).toEqual(`code!=null`);
  });

  it('should handle the NotEquals operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.NotEqual, '123');
    expect(ex.build()).toEqual(`code!=${encodeURIComponent('"123"')}`);

    ex = new RSQLFilterExpression('code', Operators.NotEqual, true);
    expect(ex.build()).toEqual(`code!=true`);
  });

  it('should handle the Like operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.Like, 'abc');
    expect(ex.build()).toEqual(`code==${encodeURIComponent('"abc"')}`);

    ex = new RSQLFilterExpression('code', Operators.Like, 'ab_d');
    expect(ex.build()).toEqual(`code==${encodeURIComponent('"ab_d"')}`);
  });

  it('should handle the IsNull operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.IsNull, '123');
    expect(ex.build()).toEqual('code==null');
  });

  it('should handle the IsNotNull operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.IsNotNull, '123');
    expect(ex.build()).toEqual('code!=null');
  });

  it('should handle the GreaterThan operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.GreaterThan, 123);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}123`);
  });

  it('should handle the GreaterThan operator for a date object', () => {
    // dates months are 0 indexed
    let today = new Date(2018, 10, 25);
    let ex = new RSQLFilterExpression('code', Operators.GreaterThan, today);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}2018-11-25`);
  });

  it('should handle the GreaterThanEqualTo operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.GreaterThanEqualTo, 123);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>=')}123`);
  });

  it('should handle the LessThan operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.LessThan, 123);
    expect(ex.build()).toEqual(`code${encodeURIComponent('<')}123`);
  });

  it('should handle the LessThanEqualTo operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.LessThanEqualTo, 123);
    expect(ex.build()).toEqual(`code${encodeURIComponent('<=')}123`);
  });

  it('should handle the StartsWith operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.StartsWith, '123');
    expect(ex.build()).toEqual(`code==${encodeURIComponent('"123*"')}`);
  });

  it('should handle the EndsWith operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.EndsWith, '123');
    expect(ex.build()).toEqual(`code==${encodeURIComponent('"*123"')}`);
  });

  it('should handle the Contains operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.Contains, '123');
    expect(ex.build()).toEqual(`code==${encodeURIComponent('"*123*"')}`);
  });

  it('should handle the DoesNotContain operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.DoesNotContain, '123');
    expect(ex.build()).toEqual(`code!=${encodeURIComponent('"*123*"')}`);
  });

  it('should handle the IsEmpty operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.IsEmpty, '123');
    expect(ex.build()).toEqual('code==%22%22');
  });

  it('should handle the IsNotEmpty operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.IsNotEmpty, '123');
    expect(ex.build()).toEqual('code!=%22%22');
  });

  it('should handle the In operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.In, ['123', '456']);
    expect(ex.build()).toEqual(
      `code=in=(${encodeURIComponent('"123"')},${encodeURIComponent('"456"')})`
    );

    ex = new RSQLFilterExpression('code', Operators.In, ['ab"c', 'ab\\c', 'ab\\"c']);
    expect(ex.build()).toEqual(`code=in=(%22ab%5C%22c%22,%22ab%5C%5Cc%22,%22ab%5C%5C%5C%22c%22)`);
  });

  it('should handle the In operator with only numbers', () => {
    let ex = new RSQLFilterExpression('code', Operators.In, [123, 456]);
    expect(ex.build()).toEqual('code=in=(123,456)');
  });

  it('should handle the In operator with numbers, strings, and booleans', () => {
    let ex = new RSQLFilterExpression('code', Operators.In, ['123', 456, true]);
    expect(ex.build()).toEqual(
      `code=in=(${encodeURIComponent('"123"')},456,${encodeURIComponent('"true"')})`
    );
  });

  it('should handle the NotIn operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.NotIn, ['123', false, '456']);
    expect(ex.build()).toEqual(
      `code=out=(${encodeURIComponent('"123"')},${encodeURIComponent(
        '"false"'
      )},${encodeURIComponent('"456"')})`
    );
  });
});
