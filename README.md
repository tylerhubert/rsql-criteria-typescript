# RSQL Criteria builder for Typescript

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/tylerhubert/rsql-criteria-typescript.svg?branch=master)](https://travis-ci.org/tylerhubert/rsql-criteria-typescript)
[![Coverage Status](https://coveralls.io/repos/github/tylerhubert/rsql-criteria-typescript/badge.svg?branch=master)](https://coveralls.io/github/tylerhubert/rsql-criteria-typescript?branch=master)


## Installation
Install via NPM
```bash
npm install rsql-criteria-typescript
```

## Usage
Import into the needed files via 
```javascript
import { RSQLCriteria, RSQLFilterExpression, Operators } from 'rsql-criteria-typescript';
```

Add your own criteria and call `build()` to create it!
```javascript
let rsql: RSQLCriteria = new RSQLCriteria();
rsql.filters.add(new RSQLFilterExpression('code', Operators.Equal, 'abc'));
console.log(rsql.build());
```

There are build methods on most things, so feel free to use whatever part you need.

The `RSQLCriteria.build()` method will generate a query string with the following defaults:
* Filter expressions will be prefixed with `$where`.  ex: `$where=code=="abc"`
* Order By expressions will be prefixed with `$orderBy`.  ex: `$orderBy=code asc, description desc`
* Page Size pagination setting will be prefixed with $pageSize.  ex: `$pageSize=10`
* Page Number pagination setting will be prefixed with $pageNumber.  ex: `$pageNumber=1`
* Include Total Count pagination setting will be prefixed with $includeTotalCount.  ex: `$includeTotalCount=true`

These can be overridden by passing in the prefixes you would like when creating the `RSQLCriteria` object.
```javascript
let rsql: RSQLCriteria = new RSQLCriteria('filterBy', 'order');
```

### RSQLFilterBuilder
A filter builder is included as well.  You can choose to use this if you prefer this method of constructing
the filter expressions.

```javascript
let builder: RSQLFilter = new RSQLFilterBuilder();
let list = builder.column('blah').equalTo('123').toList();
let queryStringPart = list.build();
// returns blah=="123"
```


### Builder with Custom Operators

```javascript
let value: 123;
let builder: RSQLFilter = new RSQLFilterBuilder();
let list = builder.column('blah').custom('=myCustomOp=', `someFunctionOnServer(${value})`).toList();
let queryStringPart = list.build();
// returns =myCustomOp="someFunctionOnServer(123)"
```


Or a more complex example that shows chaining of the expressions:
```javascript
let rsql: RSQLCriteria = new RSQLCriteria();
let builder: RSQLFilter = new RSQLFilterBuilder();
rsql.filters.and(builder.column('blah').equalTo('123')
                    .or().column('test').equalTo('456').toList());
rsql.build();
// returns $where=(blah=="123" or test=="456")
 ```

### Combining multiple RSQLCriteria Instances
You can combine multiple RSQLCriteria instances by the `and` or `or` functions that are available.  The major thing to know about this is that the criteria that you call `and` or `or` on will be the one that the pagination and order by parts will be taken from.  The combination is a way to combine the filters together in a nice fashion.
```javascript
let criteria1 = new RSQLCriteria();
criteria1.pageSize = 10;
let criteria2 = new RSQLCriteria();
criteria2.pageSize = 5;
criteria1.and(criteria2);
criteria1.build();
//returns $pageSize=10 instead of pageSize = 5
```


### A note on function names
This library has been tested against a SQL Server backend and some irregularities have been found.  A RSQL `==` operation turns into a `LIKE` in SQL Server so that wildcard characters are available for use.  However, in most other languages an `equals` operation is an exact match.  To handle this, the `Operators.Equal` and `RSQLFilterBuilder.equalTo` methods will create an `=in=` RSQL string.  This doesn't allow wildcards to be used in and will intuitively make more sense for those of us that are used to equals meaning exactly equal to.  Wildcard characters are still allowed to be passed in, but they will be interpretted as the characters themselves and not wildcards.

To allow wildcards to be used, another operation and function are available.  `Operators.Like` and `RSQLFilterBuilder.like` will use the RSQL `==` and allow wildcard characters to be passed along.

### Other examples
Other examples can be found in the tests folder.  Many usages already have tests wrapped around them.


## Acknowledgements
Created with [Typescript Library Starter](https://github.com/alexjoverm/typescript-library-starter.git)
