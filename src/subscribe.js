const Web3Utils = require('web3-utils');
const msgpack = require('msgpack-lite');

async function subscribe(shh, topic, abi, callback = null, notification = null) {
  const symKeyID = await shh.newSymKey();
  const sig = await shh.newKeyPair();

  shh.subscribe('messages', { symKeyID, topics: [topic] })
    .on('data', (data) => {
      if (notification) {
        notification(msgpack.decode(Web3Utils.hexToBytes(data.payload)));
      }
      shh.clearSubscriptions();
    });

  return {
    provider: shh.currentProvider.url,
    post: {
      symKeyID,
      sig,
      topic,
      abi,
    },
    callback,
  };  
}

exports.subscribe = subscribe;
