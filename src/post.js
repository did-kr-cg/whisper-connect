const Web3Utils = require('web3-utils');
const msgpack = require('msgpack-lite');

async function post(shh, topic, symKeyID, sig, payload) {
  const result = await shh.post({
    topic,
    symKeyID,
    sig,
    ttl: 10,
    powTime: 3,
    powTarget: 0.5,
    payload: Web3Utils.bytesToHex(msgpack.encode(payload)),
  });
  return result;
}

exports.post = post;