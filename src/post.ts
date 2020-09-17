import { Shh } from 'web3-shh';
import { utf8ToHex } from 'web3-utils'
import { createJWT, Signer } from 'did-jwt';

interface Account {
  address: string,
  signer: Signer
}

interface Options {
  payload: any,
  request: any,
  response: any,
}

async function post(shh: Shh, account: Account, options: Options): Promise<string> {
  const jwt = await createJWT(
    {
      aud: options.payload.iss,
      request: options.request,
      response: {
        nonce: options.payload.request.nonce,
        ...options.response,
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
    symKeyID: options.payload.request.ch.sym,
    sig: options.payload.request.ch.sig,
    topic: options.payload.request.ch.topic,
    ttl: 10,
    powTime: 3,
    powTarget: 0.5,
    payload: utf8ToHex(jwt),
  });
  return result;
}

export { post }
