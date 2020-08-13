const Web3Utils = require('web3-utils');
const Web3EthAbi = require('web3-eth-abi');
const msgpack = require('msgpack-lite');

async function subscribe(shh, post, callback = null, notification = null) {
  const symKeyID = await shh.newSymKey();
  const sig = await shh.newKeyPair();
  const topic = Web3EthAbi.encodeFunctionSignature(post.abi);

  shh.subscribe('messages', { symKeyID, topics: [topic] })
    .on('data', (data) => {
      if (notification) {
        notification(msgpack.decode(Web3Utils.hexToBytes(data.payload)));
      }
      shh.clearSubscriptions();
    });

  const json = {
    provider: shh.currentProvider.url,
    post: {
      symKeyID,
      sig,
      topic,
      ...post,
    },
    callback,
  };
  return msgpack.encode(json).toString('base64');
}

exports.subscribe = subscribe;
