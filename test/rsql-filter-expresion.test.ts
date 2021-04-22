import { RSQLFilterExpression } from '../src/files/rsql-filter-expression';
import { Operators } from '../src/files/rsql-filter-operators';
import { TestOperator } from './test-operator';

describe('RSQLFilterExpression', () => {
  it('should handle the Equals operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.Equal, '123');
    expect(ex.build()).toEqual(`code=in=${encodeURIComponent('"123"')}`);

    ex = new RSQLFilterExpression('code', Operators.Equal, false);
    expect(ex.build()).toEqual(`code=in=false`);

    ex = new RSQLFilterExpression('code', Operators.Equal, 'ab"c');
    expect(ex.build()).toEqual(`code=in=%22ab%5C%22c%22`);
    expect(ex.build({ encodeString: false })).toEqual(`code=in="ab\\"c"`);

    ex = new RSQLFilterExpression('code', Operators.Equal, 'ab%22c');
    expect(ex.build({ encodeString: false })).toEqual(`code=in="ab%22c"`);

    ex = new RSQLFilterExpression('code', Operators.Equal, 'ab\\c');
    expect(ex.build()).toEqual(`code=in=%22ab%5C%5Cc%22`);

    ex = new RSQLFilterExpression('code', Operators.Equal, 'ab\\"c');
    expect(ex.build()).toEqual(`code=in=%22ab%5C%5C%5C%22c%22`);

    ex = new RSQLFilterExpression('code', Operators.Equal, 123);
    expect(ex.build()).toEqual(`code=in=123`);
    expect(ex.build({ encodeString: false })).toEqual(`code=in=123`);
  });

  it('should handle the Equals operator when our value is null', () => {
    const ex = new RSQLFilterExpression('code', Operators.Equal, null);
    expect(ex.build()).toEqual(`code=in=null`);
  });

  it('should handle the NotEquals operator when our value is null', () => {
    const ex = new RSQLFilterExpression('code', Operators.NotEqual, null);
    expect(ex.build()).toEqual(`code!=null`);
  });

  it('should handle the NotEquals operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.NotEqual, '123');
    expect(ex.build()).toEqual(`code!=${encodeURIComponent('"123"')}`);
    expect(ex.build({ encodeString: false })).toEqual(`code!="123"`);

    ex = new RSQLFilterExpression('code', Operators.NotEqual, true);
    expect(ex.build()).toEqual(`code!=true`);
    expect(ex.build({ encodeString: false })).toEqual(`code!=true`);
  });

  it('should handle the Like operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.Like, 'abc');
    expect(ex.build()).toEqual(`code==${encodeURIComponent('"abc"')}`);

    ex = new RSQLFilterExpression('code', Operators.Like, 'ab_d');
    expect(ex.build()).toEqual(`code==${encodeURIComponent('"ab_d"')}`);

    ex = new RSQLFilterExpression('code', Operators.Like, 'ab%5Fd');
    expect(ex.build({ encodeString: false })).toEqual(`code=="ab%5Fd"`);
  });

  it('should handle the IsNull operator', () => {
    const ex = new RSQLFilterExpression('code', Operators.IsNull, '123');
    expect(ex.build()).toEqual('code==null');
  });

  it('should handle the IsNotNull operator', () => {
    const ex = new RSQLFilterExpression('code', Operators.IsNotNull, '123');
    expect(ex.build()).toEqual('code!=null');
  });

  it('should handle the GreaterThan operator', () => {
    const ex = new RSQLFilterExpression('code', Operators.GreaterThan, 123);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}123`);
    expect(ex.build({encodeString: false})).toEqual(`code>123`);
  });

  it('should handle the GreaterThanEqualTo operator', () => {
    const ex = new RSQLFilterExpression('code', Operators.GreaterThanEqualTo, 123);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>=')}123`);
    expect(ex.build({encodeString: false})).toEqual(`code>=123`);
  });

  it('should handle the LessThan operator', () => {
    const ex = new RSQLFilterExpression('code', Operators.LessThan, 123);
    expect(ex.build()).toEqual(`code${encodeURIComponent('<')}123`);
    expect(ex.build({encodeString: false})).toEqual(`code<123`);
  });

  it('should handle the LessThanEqualTo operator', () => {
    const ex = new RSQLFilterExpression('code', Operators.LessThanEqualTo, 123);
    expect(ex.build()).toEqual(`code${encodeURIComponent('<=')}123`);
    expect(ex.build({encodeString: false})).toEqual(`code<=123`);
  });

  it('should handle the StartsWith operator', () => {
    const ex = new RSQLFilterExpression('code', Operators.StartsWith, '123');
    expect(ex.build()).toEqual(`code==${encodeURIComponent('"123*"')}`);
    expect(ex.build({ encodeString: false })).toEqual(`code=="123*"`);
  });

  it('should handle the EndsWith operator', () => {
    const ex = new RSQLFilterExpression('code', Operators.EndsWith, '123');
    expect(ex.build()).toEqual(`code==${encodeURIComponent('"*123"')}`);
    expect(ex.build({ encodeString: false })).toEqual(`code=="*123"`);
  });

  it('should handle the Contains operator', () => {
    const ex = new RSQLFilterExpression('code', Operators.Contains, '123');
    expect(ex.build()).toEqual(`code==${encodeURIComponent('"*123*"')}`);
    expect(ex.build({ encodeString: false })).toEqual(`code=="*123*"`);
  });

  it('should handle the DoesNotContain operator', () => {
    const ex = new RSQLFilterExpression('code', Operators.DoesNotContain, '123');
    expect(ex.build()).toEqual(`code!=${encodeURIComponent('"*123*"')}`);
    expect(ex.build({ encodeString: false })).toEqual(`code!="*123*"`);
  });

  it('should handle the IsEmpty operator', () => {
    const ex = new RSQLFilterExpression('code', Operators.IsEmpty, '123');
    expect(ex.build()).toEqual('code==%22%22');
    expect(ex.build({encodeString: false})).toEqual('code==""');
  });

  it('should handle the IsNotEmpty operator', () => {
    const ex = new RSQLFilterExpression('code', Operators.IsNotEmpty, '123');
    expect(ex.build()).toEqual('code!=%22%22');
    expect(ex.build({encodeString: false})).toEqual('code!=""');
  });

  it('should handle the In operator', () => {
    let ex = new RSQLFilterExpression('code', Operators.In, ['123', '456']);
    expect(ex.build()).toEqual(
      `code=in=(${encodeURIComponent('"123"')},${encodeURIComponent('"456"')})`
    );
    expect(ex.build({ encodeString: false })).toEqual(`code=in=("123","456")`);

    ex = new RSQLFilterExpression('code', Operators.In, ['ab"c', 'ab\\c', 'ab\\"c']);
    expect(ex.build()).toEqual(`code=in=(%22ab%5C%22c%22,%22ab%5C%5Cc%22,%22ab%5C%5C%5C%22c%22)`);

    ex = new RSQLFilterExpression('code', Operators.In, ['ab%22c', 'ab%5Cc', 'ab%5C%22c']);
    expect(ex.build({ encodeString: false })).toEqual(
      `code=in=("ab%22c","ab%5Cc","ab%5C%22c")`
    );
  });

  it('should handle the In operator with only numbers', () => {
    const ex = new RSQLFilterExpression('code', Operators.In, [123, 456]);
    expect(ex.build()).toEqual('code=in=(123,456)');
    expect(ex.build({ encodeString: false })).toEqual('code=in=(123,456)');
  });

  it('should handle the In operator with numbers, strings, and booleans', () => {
    const ex = new RSQLFilterExpression('code', Operators.In, ['123', 456, true]);
    expect(ex.build()).toEqual(
      `code=in=(${encodeURIComponent('"123"')},456,${encodeURIComponent('"true"')})`
    );
    expect(ex.build({ encodeString: false })).toEqual(`code=in=("123",456,"true")`);
  });

  it('should handle the NotIn operator', () => {
    const ex = new RSQLFilterExpression('code', Operators.NotIn, ['123', false, '456']);
    expect(ex.build()).toEqual(
      `code=out=(${encodeURIComponent('"123"')},${encodeURIComponent(
        '"false"'
      )},${encodeURIComponent('"456"')})`
    );
  });

  it('should handle Date objects when timestamps are not desired', () => {
    // date months are 0 indexed
    let date = new Date(2018, 9, 21);
    let ex = new RSQLFilterExpression('code', Operators.GreaterThan, date);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}2018-10-21`);

    // years should always have four digits, and months and dates should always have two
    date = new Date(0, 8, 9);
    date.setFullYear(0);
    ex = new RSQLFilterExpression('code', Operators.GreaterThan, date);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}0000-09-09`);

    date = new Date(4, 8, 9);
    date.setFullYear(9);
    ex = new RSQLFilterExpression('code', Operators.GreaterThan, date);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}0009-09-09`);

    date = new Date(4, 8, 10);
    date.setFullYear(10);
    ex = new RSQLFilterExpression('code', Operators.GreaterThan, date);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}0010-09-10`);

    date = new Date(4, 9, 9);
    date.setFullYear(99);
    ex = new RSQLFilterExpression('code', Operators.GreaterThan, date);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}0099-10-09`);

    date = new Date(4, 9, 10);
    date.setFullYear(100);
    ex = new RSQLFilterExpression('code', Operators.GreaterThan, date);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}0100-10-10`);

    date = new Date(4, 9, 9);
    date.setFullYear(999);
    ex = new RSQLFilterExpression('code', Operators.GreaterThan, date);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}0999-10-09`);

    date = new Date(4, 9, 9);
    date.setFullYear(1000);
    ex = new RSQLFilterExpression('code', Operators.GreaterThan, date);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}1000-10-09`);
  });

  it('should handle Date objects when timestamps are desired', () => {
    const options = { includeTimestamp: true };

    // date months are 0 indexed
    let date = buildUTCDate(2018, 9, 21, 0, 0, 0, 0);
    let ex = new RSQLFilterExpression('code', Operators.GreaterThan, date, options);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}2018-10-21T00:00:00.000Z`);

    date = buildUTCDate(2018, 9, 21, 1, 7, 2, 1);
    ex = new RSQLFilterExpression('code', Operators.GreaterThan, date, options);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}2018-10-21T01:07:02.001Z`);

    date = buildUTCDate(2018, 9, 21, 10, 17, 20, 75);
    ex = new RSQLFilterExpression('code', Operators.GreaterThan, date, options);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}2018-10-21T10:17:20.075Z`);

    date = buildUTCDate(2018, 9, 21, 23, 59, 59, 999);
    ex = new RSQLFilterExpression('code', Operators.GreaterThan, date, options);
    expect(ex.build()).toEqual(`code${encodeURIComponent('>')}2018-10-21T23:59:59.999Z`);
  });

  it('should handle adding custom operations', () => {
    const ex = new RSQLFilterExpression('code', new TestOperator(), 'abc');
    expect(ex.build()).toEqual(`code=custom=${encodeURIComponent('"abc"')}`);
  });
});

function buildUTCDate(
  year: number,
  month: number,
  date: number,
  hours: number,
  minutes: number,
  seconds: number,
  millis: number
): Date {
  const dateObject = new Date(year, month, date);

  dateObject.setUTCFullYear(year);
  dateObject.setUTCMonth(month);
  dateObject.setUTCDate(date);
  dateObject.setUTCHours(hours);
  dateObject.setUTCMinutes(minutes);
  dateObject.setUTCSeconds(seconds);
  dateObject.setUTCMilliseconds(millis);

  return dateObject;
}
