const msgpack = require('msgpack-lite');

function decode(base64) {
  return msgpack.decode(Buffer.from(base64, 'base64'));
}

exports.decode = decode;