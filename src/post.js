const { JWT } = require('jose');
const Web3Utils = require('web3-utils');

async function _post(shh, wallet, post, payload) {
  const jwt = JWT.sign(payload, wallet.key, {
    issuer: wallet.did,
    expiresIn: '2 m',
    kid: true,
    header: {
      alg: 'ES256K',
      typ: 'JWT',
    }
  });
  const result = await shh.post({
    topic: post.topic,
    symKeyID: post.symKeyID,
    sig: post.sig,
    ttl: 10,
    powTime: 3,
    powTarget: 0.5,
    payload: Web3Utils.utf8ToHex(jwt),
  });
  return result;
}

exports.post = _post;