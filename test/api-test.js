var assert = require('assert');

var streamPair = require('../');

describe('StreamPair', function() {
  var pair = null;

  beforeEach(function() {
    pair = streamPair.create();
  });

  it('should send data to other side', function(done) {
    pair.write('hello');
    assert.equal(pair.other.read().toString(), 'hello');

    pair.other.on('end', done);
    pair.end(function() {
      pair.other.resume();
    });
  });
});
