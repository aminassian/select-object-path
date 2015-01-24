[![npm package version][badge-image-npm-package-version]][badge-url-npm-package-version]
[![npm package count download][badge-image-npm-package-count-download]][badge-url-npm-package-count-download]
[![travis status][badge-image-travis-build]][badge-url-travis-build]
[![coveralls status][badge-image-coveralls]][badge-url-coveralls]


![select-object-path][icon-image64x64] select-object-path v1.0.1
=================================================

Introduction
------------------------------------------

select and extract path from json object

Installation
------------------------------------------

This package is available on [npm](https://www.npmjs.com/package/select-object-path) as: ``select-object-path``

```bash
$ npm install select-object-path
```

Usage
------------------------------------------

Param to function ``sop.select`` must repect json-schema [select.in.schema.json](https://raw.githubusercontent.com/aminassian/select-object-path/master/schema/select.in.schema.json). 

```js
var sop = require('select-object-path');
var result = sop.select({
    "select" : "-*,ccc", // exclude all except ccc
    "object": {
        "aaa": {
            "bbb" : {
                "ccc" : null
            }
        },
        "ccc": 10
    }
});
```

``sop.select`` return result which respect json-schema [select.out.schema.json](https://raw.githubusercontent.com/aminassian/select-object-path/master/schema/select.out.schema.json).

```js
{
    "path": [
        "/aaa/bbb/ccc",
        "/ccc"
    ],
    "licence": "GPL-3.0",
    "donate": [
        "https://pledgie.com/campaigns/28037",
        "https://gratipay.com/aminassian"
    ]
}
```


Test
------------------------------------------

To run the test suite, download the source code, install the dependencies and run `npm test`.

```bash
$ git clone https://github.com/aminassian/select-object-path.git
$ cd select-object-path
$ npm install
$ npm test
```



Coverage : http://aminassian.github.io/select-object-path/coverage/index.html

Made by
------------------------------------------

The original author of select-object-path is  [Alban Minassian](https://github.com/aminassian).

If you like select-object-path and would like to support it, you are welcome to make a donation. It will surely be appreciated! Thanks!

[![donate with your pledgie account][donate-image-pledgie]][donate-url-pledgie][![donate with your gratipay account][donate-image-gratipay]][donate-url-gratipay]

License
------------------------------------------

[GPL-3.0](https://github.com/aminassian/select-object-path/blob/master/LICENCE.txt)

Logo : fa-tree from [Font-Awesome](http://fortawesome.github.io/Font-Awesome/) (licence [SIL OFL 1.1](http://scripts.sil.org/OFL))

External libraries :

- [underscore.js](http://underscorejs.org/) ([licence](https://github.com/jashkenas/underscore/blob/master/LICENSE))
- [underscore.string](http://epeli.github.io/underscore.string/) ([licence](https://github.com/epeli/underscore.string#licence))
- [js-traverse](https://github.com/substack/js-traverse) ([licence](https://github.com/substack/js-traverse/blob/master/LICENSE))
- [jayschema](https://github.com/natesilva/jayschema) ([licence](https://github.com/natesilva/jayschema/blob/master/LICENSE))


Links
------------------------------------------

- www : http://aminassian.github.io/select-object-path
- www [fr] : http://aminassian.github.io/select-object-path/index.fr.html
- coverage : http://aminassian.github.io/select-object-path/coverage/index.html
- doc api : http://aminassian.github.io/select-object-path/api/index.html
- github : https://github.com/aminassian/select-object-path
- issues : https://github.com/aminassian/select-object-path/issues
- npm : https://www.npmjs.com/package/select-object-path
- pledgie : https://pledgie.com/campaigns/28037 [donate]
- gratipay : https://gratipay.com/aminassian [donate]

Release Notes
------------------------------------------

- 1.0.1 (2015/01/24):
    - ``init`` init

------------------------------------------

Copyright © 2015 - Proudly Made In Nantes [![nantestech][nantestech-image]][nantestech-url]
[nantestech-image]: https://raw.githubusercontent.com/aminassian/select-object-path/master/img/NANTES-TECH-LOGO-NOIR-HOR.png
[nantestech-url]: http://www.nantestech.com

[icon-image32x32]: https://raw.githubusercontent.com/aminassian/select-object-path/master/img/tree_000000_32.png
[icon-image64x64]: https://raw.githubusercontent.com/aminassian/select-object-path/master/img/tree_000000_64.png
[donate-image-pledgie]: https://raw.githubusercontent.com/aminassian/select-object-path/master/img/pledgie32x32.png
[donate-url-pledgie]: https://pledgie.com/campaigns/28037
[donate-image-gratipay]: https://raw.githubusercontent.com/aminassian/select-object-path/master/img/gratipay32x32.png
[donate-url-gratipay]: https://gratipay.com/aminassian
[badge-image-npm-package-version]: https://img.shields.io/npm/v/select-object-path.svg?style=flat
[badge-url-npm-package-version]: https://npmjs.org/package/select-object-path
[badge-image-npm-package-count-download]: https://img.shields.io/npm/dm/select-object-path.svg?style=flat
[badge-url-npm-package-count-download]: https://npmjs.org/package/select-object-path
[badge-image-travis-build]: https://img.shields.io/travis/aminassian/select-object-path.svg?style=flat
[badge-url-travis-build]: https://travis-ci.org/aminassian/select-object-path
[badge-image-coveralls]: https://img.shields.io/coveralls/aminassian/select-object-path.svg?style=flat
[badge-url-coveralls]: https://coveralls.io/r/aminassian/select-object-path?branch=master