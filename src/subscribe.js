const { JWT } = require('jose');
const Web3Utils = require('web3-utils');
const Web3EthAbi = require('web3-eth-abi');
const utils = require('./utils');

async function _subscribe(shh, wallet, options, notification = null) {
  const symKeyID = await shh.newSymKey();
  const sig = await shh.newKeyPair();
  const topic = Web3EthAbi.encodeFunctionSignature(options.abi);

  shh.subscribe('messages', { symKeyID, topics: [topic] })
    .on('data', (data) => {
      if (notification) {
        const decode = utils.verifyJwt(Web3Utils.hexToUtf8(data.payload));
        notification(decode ? decode.payload : null);
      }
      shh.clearSubscriptions();
    });
  const payload = {
    provider: shh.currentProvider.url,
    post: {
      symKeyID,
      sig,
      topic,
      ...options,
    },
  };
  return JWT.sign(payload, wallet.key, {
    issuer: wallet.did,
    expiresIn: '2 m',
    kid: true,
    header: {
      alg: 'ES256K',
      typ: 'JWT',
    }
  });
}

exports.subscribe = _subscribe;
