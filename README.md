# conferge

Load and merge [ycb](https://github.com/yahoo/ycb) config files ready to be queried.

## usage

```
var conferge = require('conferge');

\\ files can be either a relative directory path where files will be read from
var files = 'directory';
\\ or an array of actual filenames
var files = [ 'directory/dimension', 'directory/app' ];

\\ load all .json[5]
var config = conferge(files);

\\ config can then be queried as a ycb object
var opts = {};
console.log(config(opts));
```

See the tests for more details.

By default ycb calculations are cached for a quicker second retrieval. Bypass the
cache by passing `false` as the second argument.
