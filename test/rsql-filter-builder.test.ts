import { RSQLFilterBuilder } from '../src/files/rsql-filter-builder';
import { RSQLFilter } from '../src';
import { TestOperator } from './test-operator';

describe('RSQLFilterBuilder', () => {
  it('should build a single filter properly', () => {
    const builder: RSQLFilterBuilder = new RSQLFilterBuilder();
    const list = builder.column('blah').equalTo('123').toList();
    expect(list.build()).toEqual(`blah=in=${encodeURIComponent('"123"')}`);
  });

  it('should build a single filter properly by casting the result of the RSQLFilterBuilder to the RSQLFilter interface', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').equalTo('123').toList();
    expect(list.build()).toEqual(`blah=in=${encodeURIComponent('"123"')}`);
  });

  it('should build a set of filters with an and', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder
      .column('blah')
      .equalTo('123')
      .and()
      .column('name')
      .equalTo('John')
      .toList();
    expect(list.build()).toEqual(
      `(blah=in=${encodeURIComponent('"123"')}${encodeURIComponent(
        ' and '
      )}name=in=${encodeURIComponent('"John"')})`
    );
    expect(list.build({encodeString: false})).toEqual(
      `(blah=in="123" and name=in="John")`
    );
  });

  it('should build a set of filters with an or', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').equalTo('123').or().column('name').equalTo('John').toList();
    expect(list.build()).toEqual(
      `(blah=in=${encodeURIComponent('"123"')}${encodeURIComponent(
        ' or '
      )}name=in=${encodeURIComponent('"John"')})`
    );

    expect(list.build({encodeString: false})).toEqual(
      `(blah=in="123" or name=in="John")`
    );
  });

  it('should handle the clear function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    let list = builder.column('blah').equalTo('123').or().column('name').equalTo('John').toList();
    expect(list.build()).toEqual(
      `(blah=in=${encodeURIComponent('"123"')}${encodeURIComponent(
        ' or '
      )}name=in=${encodeURIComponent('"John"')})`
    );

    builder.clear();
    list = builder.column('blah').equalTo('123').toList();
    expect(list.build()).toEqual(`blah=in=${encodeURIComponent('"123"')}`);
  });

  it('should handle the clear function for complex functions', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    let list = builder.column('blah').equalTo('123').or().column('name').equalTo('John').toList();
    expect(list.build()).toEqual(
      `(blah=in=${encodeURIComponent('"123"')}${encodeURIComponent(
        ' or '
      )}name=in=${encodeURIComponent('"John"')})`
    );

    builder.clear();
    list = builder.column('blah2').equalTo('123').or().column('name2').equalTo('John').toList();
    expect(list.build()).toEqual(
      `(blah2=in=${encodeURIComponent('"123"')}${encodeURIComponent(
        ' or '
      )}name2=in=${encodeURIComponent('"John"')})`
    );
  });

  it('should build the proper string for the equalTo function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    let list = builder.column('blah').equalTo('123').toList();
    expect(list.build()).toEqual(`blah=in=${encodeURIComponent('"123"')}`);

    builder.clear();
    list = builder.column('blah').equalTo(true).toList();
    expect(list.build()).toEqual(`blah=in=true`);
  });

  it('should build the proper string for the equalTo function with special character', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    let list = builder.column('blah').equalTo('12_3').toList();
    expect(list.build()).toEqual(`blah=in=${encodeURIComponent('"12_3"')}`);

    builder.clear();
    list = builder.column('blah').equalTo('12%5F3').toList();
    expect(list.build({ encodeString: false })).toEqual(`blah=in="12%5F3"`);
  });

  it('should build the proper string for the notEqualTo function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').notEqualTo('123').toList();
    expect(list.build()).toEqual(`blah!=${encodeURIComponent('"123"')}`);
  });

  it('should build the proper string for the like function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').like('123').toList();
    expect(list.build()).toEqual(`blah==${encodeURIComponent('"123"')}`);
  });

  it('should build the proper string for the contains function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').contains('123').toList();
    expect(list.build()).toEqual(`blah==${encodeURIComponent('"*123*"')}`);
  });

  it('should build the proper string for the doesNotContains function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').doesNotContain('123').toList();
    expect(list.build()).toEqual(`blah!=${encodeURIComponent('"*123*"')}`);
  });

  it('should build the proper string for the startsWith function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').startsWith('123').toList();
    expect(list.build()).toEqual(`blah==${encodeURIComponent('"123*"')}`);
  });

  it('should build the proper string for the endsWith function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').endsWith('123').toList();
    expect(list.build()).toEqual(`blah==${encodeURIComponent('"*123"')}`);
  });

  it('should build the proper string for the greaterThan function for a number', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').greaterThan(123).toList();
    expect(list.build()).toEqual(`blah${encodeURIComponent('>')}123`);
    expect(list.build({encodeString: false})).toEqual(`blah>123`);
  });

  it('should build the proper string for the greaterThanOrEqualTo function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').greaterThanOrEqualTo('123').toList();
    expect(list.build()).toEqual(`blah${encodeURIComponent('>=')}123`);
    expect(list.build({encodeString: false})).toEqual(`blah>=123`);
  });

  it('should build the proper string for the lessThan function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').lessThan('123').toList();
    expect(list.build()).toEqual(`blah${encodeURIComponent('<')}123`);
    expect(list.build({encodeString: false})).toEqual(`blah<123`);
  });

  it('should build the proper string for the lessThanOrEqualTo function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').lessThanOrEqualTo('123').toList();
    expect(list.build()).toEqual(`blah${encodeURIComponent('<=')}123`);
    expect(list.build({encodeString: false})).toEqual(`blah<=123`);
  });

  it('should build the proper string for the in function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').in([123, 'abc']).toList();
    expect(list.build()).toEqual(`blah=in=(123,${encodeURIComponent('"abc"')})`);
  });

  it('should build the proper string for the notIn function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').notIn(['abc', 123]).toList();
    expect(list.build()).toEqual(`blah=out=(${encodeURIComponent('"abc"')},123)`);
  });

  it('should build the proper string for the isNull function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').isNull().toList();
    expect(list.build()).toEqual('blah==null');
  });

  it('should build the proper string for the isNotNull function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').isNotNull().toList();
    expect(list.build()).toEqual('blah!=null');
  });

  it('should build the proper string for the isEmpty function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').isEmpty().toList();
    expect(list.build()).toEqual(`blah==${encodeURIComponent('""')}`);
  });

  it('should build the proper string for the isNotEmpty function', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').isNotEmpty().toList();
    expect(list.build()).toEqual(`blah!=${encodeURIComponent('""')}`);
  });

  it('should handle the group capabilities', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder
      .column('blah')
      .equalTo('123')
      .or()
      .column('name')
      .equalTo('John')
      .or()
      .group(
        new RSQLFilterBuilder()
          .column('test1')
          .equalTo('test1')
          .and()
          .column('test2')
          .equalTo('test2')
      )
      .toList();
    expect(list.build()).toEqual(
      `(blah=in=${encodeURIComponent('"123"')}${encodeURIComponent(
        ' or '
      )}name=in=${encodeURIComponent('"John"')}${encodeURIComponent(
        ' or '
      )}(test1=in=${encodeURIComponent('"test1"')}${encodeURIComponent(
        ' and '
      )}test2=in=${encodeURIComponent('"test2"')}))`
    );
  });

  it('should allow the use of custom operations', () => {
    const builder: RSQLFilter = new RSQLFilterBuilder();
    const list = builder.column('blah').custom(new TestOperator(), 'support').toList();
    expect(list.build()).toEqual(`blah=custom=${encodeURIComponent('"support"')}`);
  });
});
