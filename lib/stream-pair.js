'use strict';

var util = require('util');
var Duplex = require('stream').Duplex;
var PassThrough = require('stream').PassThrough;

function Side() {
  Duplex.call(this);

  this.buffer = new PassThrough();

  this.other = null;
  this.once('finish', function() {
    this.other.buffer.end();
  });

  var self = this;
  this.buffer.once('finish', function() {
    self.push(null);
  });
}
util.inherits(Side, Duplex);

Side.prototype._read = function _read() {
  var chunk = this.buffer.read();
  if (chunk)
    return this.push(chunk);

  // Retry once there will be data on other stream
  var self = this;
  this.buffer.once('readable', function() {
    self._read();
  });
};

Side.prototype._write = function _write(data, enc, cb) {
  this.other.buffer.write(data, enc, cb);
};

exports.create = function create() {
  var a = new Side();
  var b = new Side();

  a.other = b;
  b.other = a;

  return a;
};
