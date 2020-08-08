const Web3Utils = require('web3-utils');
const Web3EthAbi = require('web3-eth-abi');
const msgpack = require('msgpack-lite');

async function post(shh, abi, symKeyID, sig, payload) {
  const result = await shh.post({
    topic: Web3EthAbi.encodeFunctionSignature(abi),
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