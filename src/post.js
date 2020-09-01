const didJWT = require('did-jwt');
const Web3Utils = require('web3-utils');

async function post(shh, account, {payload, request, response}) {
  const jwt = await didJWT.createJWT(
    {
      aud: payload.iss,
      request,
      response: {
        nonce: payload.request.nonce,
        ...response,
      },
    },
    {
      alg: 'ES256K',
      issuer: `did:shhc:${account.address}`,
      signer: account.signer,
      expiresIn: 120,
    }
  );

  const result = await shh.post({
    symKeyID: payload.request.ch.sym,
    sig: payload.request.ch.sig,
    topic: payload.request.ch.topic,
    ttl: 10,
    powTime: 3,
    powTarget: 0.5,
    payload: Web3Utils.utf8ToHex(jwt),
  });
  return result;
}

exports.post = post;