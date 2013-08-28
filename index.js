var fs = require('fs'),
    path = require('path'),
    libycb = require('ycb');

// support json5
require('json5/lib/require');

function init(dir){
  var ycb, config = {}, confs = {}, files = [], confBundle, ext;

  if (dir instanceof Array) {
    // build confs array from passed file references
    dir.forEach(function(file){
      file = path.resolve(path.dirname(module.parent.filename), file) + '.json5';
      ext = path.extname(file);
      if(ext === '.json' || ext === '.json5'){
        confs[path.basename(file, ext)] = file;
      }
    });

  } else {
    // get the absolute path to the dir
    dir = path.resolve(path.dirname(module.parent.filename), dir);
    // read the conf files in the dir
    files = fs.readdirSync(dir);
    files.forEach(function(file){
      ext = path.extname(file);
      if(ext === '.json' || ext === '.json5'){
        confs[path.basename(file, ext)] = path.join(dir, file);
      }
    });
  }

  // throw error if no dimensions found
  if(!confs.dimensions){
    throw new Error('no dimensions.json5 found at ' + dir);
  }

  // build the ycb configuration bundle
  confBundle = require(confs.dimensions);
  delete confs.dimensions;
  for(var conf in confs){
    confBundle = confBundle.concat(require(confs[conf]));
  }
  ycb = new libycb.Ycb(confBundle);

  return function conferge(opts, cache){
    var cacheKey = '';

    if(!opts || Object.keys(opts).length === 0){
      cacheKey = 'master';
    } else {
      for(var key in opts){
        cacheKey += '[' + key + ':' + opts[key] + ']';
      }
    }

    if(cache === false){
      init(dir);
    } else if(config[cacheKey]) {
      return config[cacheKey];
    }
    config[cacheKey] = ycb.read(opts);

    return config[cacheKey];
  };
}

module.exports = init;
