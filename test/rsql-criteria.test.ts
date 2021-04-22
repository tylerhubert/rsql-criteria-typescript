import { RSQLFilterBuilder } from "../src";
import { RSQLCriteria } from "../src/files/rsql-criteria";
import { RSQLFilterExpression } from "../src/files/rsql-filter-expression";
import { Operators } from "../src/files/rsql-filter-operators";

describe("RSQLCriteria test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy();
  });

  it("RSQLCriteria is instantiable", () => {
    expect(new RSQLCriteria()).toBeInstanceOf(RSQLCriteria);
  });

  it("should build nothing if there are no filters or order by clause", () => {
    const criteria = new RSQLCriteria();
    expect(criteria.build()).toEqual("");
  });

  it("should build a where clause when filters are passed in", () => {
    const criteria = new RSQLCriteria();
    criteria.filters.and(new RSQLFilterExpression("code", Operators.Equal, "abc"));
    expect(criteria.build()).toEqual(`$where=code=in=${encodeURIComponent('"abc"')}`);
  });

  it("should build an orderBy clause when order by expressions are passed in", () => {
    const criteria = new RSQLCriteria();
    criteria.orderBy.add("code", "asc");
    expect(criteria.build()).toEqual(`$orderBy=${encodeURIComponent("code asc")}`);
  });

  it("should build a combined string of filters and order by clauses", () => {
    const criteria = new RSQLCriteria();
    criteria.orderBy.add("code", "asc");
    criteria.filters.and(new RSQLFilterExpression("code", Operators.Equal, "abc"));
    expect(criteria.build()).toEqual(
      `$where=code=in=${encodeURIComponent('"abc"')}&$orderBy=${encodeURIComponent("code asc")}`
    );
  });

  it("should build an orderBy clause when order by expressions are passed in with an overridden orderBy keyword", () => {
    const criteria = new RSQLCriteria("$where", "$order");
    criteria.orderBy.add("code", "asc");
    expect(criteria.build()).toEqual("$order=" + encodeURIComponent("code asc"));
  });

  it("should build a where clause when filters are passed in with a customized where keyword", () => {
    const criteria = new RSQLCriteria("$filter");
    criteria.filters.and(new RSQLFilterExpression("code", Operators.Equal, "abc"));
    expect(criteria.build()).toEqual(`$filter=code=in=${encodeURIComponent('"abc"')}`);
  });

  it("should add in pageSize when that has been set.", () => {
    const criteria = new RSQLCriteria();
    criteria.pageSize = 10;
    expect(criteria.build()).toEqual("$pageSize=10&$includeTotalCount=true");
  });

  it("should not add in totalCount when that has been turned off.", () => {
    const criteria = new RSQLCriteria();
    criteria.pageSize = 10;
    criteria.includeTotalCount = false;
    expect(criteria.build()).toEqual("$pageSize=10");
  });

  it("should add in pageNumber when that has been set.", () => {
    const criteria = new RSQLCriteria();
    criteria.pageNumber = 3;
    expect(criteria.build()).toEqual("$pageNumber=3");
  });

  it("should include all pagination parts when they are set.", () => {
    const criteria = new RSQLCriteria();
    criteria.pageSize = 10;
    criteria.pageNumber = 2;
    expect(criteria.build()).toEqual("$pageSize=10&$includeTotalCount=true&$pageNumber=2");
  });

  it("should override the pageSizeKeyword when that has been set.", () => {
    const criteria = new RSQLCriteria("$where", "$orderBy", "$take");
    criteria.pageSize = 10;
    expect(criteria.build()).toEqual("$take=10&$includeTotalCount=true");
  });

  it("should override the includeTotalCountKeyword when that has been set.", () => {
    const criteria = new RSQLCriteria("$where", "$orderBy", "$take", "total");
    criteria.pageSize = 10;
    expect(criteria.build()).toEqual("$take=10&total=true");
  });

  it("should override the includeTotalCountKeyword when that has been set.", () => {
    const criteria = new RSQLCriteria("$where", "$orderBy", "$take", "total", "$skip");
    criteria.pageSize = 10;
    criteria.pageNumber = 2;
    expect(criteria.build()).toEqual("$take=10&total=true&$skip=2");
  });

  it("should allow you to combine two RSQLCriteria instances with an and", () => {
    const criteria1 = new RSQLCriteria();
    criteria1.pageSize = 10;
    criteria1.pageNumber = 1;
    criteria1.orderBy.add("code", "asc");
    criteria1.filters.and(new RSQLFilterExpression("code", Operators.Contains, "a"));

    const criteria2 = new RSQLCriteria();
    criteria2.filters.and(new RSQLFilterExpression("description", Operators.Contains, "b"));

    criteria1.and(criteria2);
    expect(criteria1.build()).toEqual(
      `$where=(code==${encodeURIComponent('"*a*"')}${encodeURIComponent(
        " and "
      )}description==${encodeURIComponent('"*b*"')})&$orderBy=${encodeURIComponent(
        "code asc"
      )}&$pageSize=10&$includeTotalCount=true&$pageNumber=1`
    );
  });

  it('should allow you to combine two RSQLCriteria instances with an "and" while disregarding blank filters', () => {
    const criteria1 = new RSQLCriteria();
    criteria1.pageSize = 10;
    criteria1.pageNumber = 1;
    criteria1.orderBy.add("code", "asc");
    criteria1.filters.and(new RSQLFilterExpression("code", Operators.Contains, "a"));

    const criteria2 = new RSQLCriteria();

    criteria1.and(criteria2);
    expect(criteria1.build()).toEqual(
      `$where=code==${encodeURIComponent('"*a*"')}&$orderBy=${encodeURIComponent(
        "code asc"
      )}&$pageSize=10&$includeTotalCount=true&$pageNumber=1`
    );
  });

  it("should allow you to combine two RSQLCriteria instances with an or", () => {
    const criteria1 = new RSQLCriteria();
    criteria1.pageSize = 10;
    criteria1.pageNumber = 1;
    criteria1.orderBy.add("code", "asc");
    criteria1.filters.and(new RSQLFilterExpression("code", Operators.Contains, "a"));

    const criteria2 = new RSQLCriteria();
    criteria2.filters.and(new RSQLFilterExpression("description", Operators.Contains, "b"));

    criteria1.or(criteria2);
    expect(criteria1.build()).toEqual(
      `$where=(code==${encodeURIComponent('"*a*"')}${encodeURIComponent(
        " or "
      )}description==${encodeURIComponent('"*b*"')})&$orderBy=${encodeURIComponent(
        "code asc"
      )}&$pageSize=10&$includeTotalCount=true&$pageNumber=1`
    );
  });

  it('should allow you to combine two RSQLCriteria instances with an "or" while disregarding blank filters', () => {
    const criteria1 = new RSQLCriteria();
    criteria1.pageSize = 10;
    criteria1.pageNumber = 1;
    criteria1.orderBy.add("code", "asc");
    criteria1.filters.and(new RSQLFilterExpression("code", Operators.Contains, "a"));

    const criteria2 = new RSQLCriteria();

    criteria1.or(criteria2);
    expect(criteria1.build()).toEqual(
      `$where=code==${encodeURIComponent('"*a*"')}&$orderBy=${encodeURIComponent(
        "code asc"
      )}&$pageSize=10&$includeTotalCount=true&$pageNumber=1`
    );
  });

  it("should pass down the build options appropriately", () => {
    const criteria1 = new RSQLCriteria();
    criteria1.filters.and(
      new RSQLFilterBuilder()
        .column("foo")
        .equalTo("bar")
        .or()
        .column("bar")
        .equalTo("baz")
        .toList()
    );
    expect(criteria1.build()).toEqual(`$where=(foo=in=%22bar%22%20or%20bar=in=%22baz%22)`);
    expect(criteria1.build({ encodeString: false })).toEqual(
      `$where=(foo=in="bar" or bar=in="baz")`
    );
  });
});
