# RSQL Criteria builder for Typescript

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/tylerhubert/rsql-criteria-typescript.svg?branch=master)](https://travis-ci.org/tylerhubert/rsql-criteria-typescript)
[![Coverage Status](https://coveralls.io/repos/github/tylerhubert/rsql-criteria-typescript/badge.svg?branch=master)](https://coveralls.io/github/tylerhubert/rsql-criteria-typescript?branch=master)


### Installation
Install via NPM
```bash
npm install rsql-criteria-typescript
```

### Usage
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

These can be overridden by passing in the prefixes you would like when creating the `RSQLCriteria` object.
```javascript
let rsql: RSQLCriteria = new RSQLCriteria('filterBy', 'order');
```


### Acknowledgements
Created with [Typescript Library Starter](https://github.com/alexjoverm/typescript-library-starter.git)