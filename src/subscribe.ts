import { Notification } from 'web3-shh';
import { createJWT, decodeJWT, verifyJWT, Signer } from 'did-jwt';
import { Resolver, ParsedDID, DIDDocument } from 'did-resolver';
import { hexToUtf8 } from 'web3-utils'
// import { AbiCoder } from 'web3-eth-abi';
import { AbiItem } from 'web3-utils'
const Web3EthAbi = require('web3-eth-abi');

interface Account {
  address: string,
  signer: Signer,
}

interface Options {
  abiEnable: boolean,
  urlEnable: boolean,
}

async function shhc (did: string, parsed: ParsedDID, resolver: Resolver): Promise<null | DIDDocument> {
  const fullId = parsed.id.match(/^(.*)?(0x[0-9a-fA-F]{40})$/);
  if (!fullId) {
    throw new Error(`Not a valid shhc DID: ${did}`);
  }
  return {
    '@context': 'https://w3id.org/did/v1',
    id: did,
    publicKey: [{
      id: '',
      controller: '',
      type: 'Secp256k1VerificationKey2018',
      ethereumAddress: parsed.id,
    }],
   }
}

async function subscribe(shh: any, account: Account, abi: AbiItem, options: Options, notification: any = null) {
  const sym = await shh.newSymKey();
  const sig = await shh.newKeyPair();
  const topic = Web3EthAbi.encodeFunctionSignature(abi);
  const nonce = Math.floor(Math.random() * 1000000);

  shh.subscribe('messages', { symKeyID: sym, topics: [topic] })
    .on('data', async (data: Notification) => {
      if (notification) {
        try {
          const resolver = new Resolver({ shhc });
          const decode = await verifyJWT(hexToUtf8(data.payload), {resolver: resolver, audience: `did:shhc:${account.address}`});
          notification(decode && decode.payload && decode.payload.response && decode.payload.response.nonce === nonce ? decode.payload : null);
        } catch (error) {
          notification(null);
        }
      }
      shh.clearSubscriptions();
    });

  const jwt = await createJWT(
    {
      aud: `did:shhc:${account.address}`,
      request: options.abiEnable ? {
        ch: {
          url: options.urlEnable ? shh.currentProvider.url : undefined,
          sym,
          sig,
          topic,
        },
        nonce,
        abi,
      } : {
        ch: {
          url: options.urlEnable ? shh.currentProvider.url : undefined,
          sym,
          sig,
          topic,
        },
        nonce,
      },
    },
    {
      alg: 'ES256K',
      issuer: `did:shhc:${account.address}`,
      signer: account.signer,
      expiresIn: 120,
    }
  );
  const decode = decodeJWT(jwt);
  const qr = {request: decode.payload.request, iss: decode.payload.iss};
  return {jwt, qr};
}

export { subscribe }