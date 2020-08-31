const didJWT = require('did-jwt');
const Web3Utils = require('web3-utils');

async function post(shh, account, options, payload) {
  const jwt = await didJWT.createJWT(
    {
      aud: options.aud,
      name: 'whisper-connect',
      ...payload,
    },
    {
      alg: 'ES256K',
      issuer: `did:shhc:${account.address}`,
      signer: account.signer,
      expiresIn: 120,
    }
  );

  const result = await shh.post({
    symKeyID: options.symKeyID,
    sig: options.sig,
    topic: options.topic,
    ttl: 10,
    powTime: 3,
    powTarget: 0.5,
    payload: Web3Utils.utf8ToHex(jwt),
  });
  return result;
}

exports.post = post;