var conferge = require('..');
var expected = require('./expected.js');
var assert = require('chai').assert;


describe('conferge', function () {
  var colors = conferge('./colors');
  it('should return a master config', function () {
    assert.deepEqual(colors(), expected.master, 'master config');
  });

  it('should merge a dimension config', function () {
    assert.deepEqual(colors({'type':'extended'}), expected.merged, 'merged master config');
  });

  it('should combine multiple requested dimensions', function () {
    assert.deepEqual(colors({'type':'extended', 'mood':'excited'}), expected.combined, 'combined dimensions config');
  });

  var food = new conferge('./food');
  it('load multiple json5 files', function () {
    assert.deepEqual(food({'country':'USA', 'meal':'breakfast'}), expected.multiple, 'multiple configs loaded');
  });

  it('throws an error if no dimensions.json5 file is found', function () {
    try {
      var empty = conferge('./empty');
      empty();
    } catch (e) {
      assert.equal(e.message.substring(0, 25), 'no dimensions.json5 found', 'throw error on no dimensions.json5');
    }
  });

  it('can use the cache', function () {
    assert.deepEqual(colors({}), expected.master, 'master config');
  });

  it('can bypass the cache', function () {
    assert.deepEqual(colors({}, false), expected.master, 'master config');
  });

  var multi = conferge(['./food/dimensions', './empty/empty']);
  it('supports specifying config files in an array', function () {
    assert.deepEqual(multi(), expected.array, 'array config');
  });

  var exts = conferge('./json');
  it('supports json and json5 files', function () {
    assert.deepEqual(exts(), expected.master, 'array config');
  });
});
