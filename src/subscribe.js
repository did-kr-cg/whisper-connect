const didJWT = require('did-jwt');
const Resolver = require('did-resolver');
const Web3Utils = require('web3-utils');
const Web3EthAbi = require('web3-eth-abi');

function wrapDidDocument (did, issuer) {
  const doc = {
    '@context': 'https://w3id.org/did/v1',
    id: did,
    publicKey: [{
      type: 'Secp256k1VerificationKey2018',
      ethereumAddress: issuer,
    }],
   }
  return doc;
}

async function _subscribe(shh, account, request, option, notification = null) {
  const sym = await shh.newSymKey();
  const sig = await shh.newKeyPair();
  const topic = Web3EthAbi.encodeFunctionSignature(request.abi);
  const nonce = Math.floor(Math.random() * 1000000);
  request.nonce = nonce;
  if (!option.abiEnable) {
    delete request.abi;
  }

  shh.subscribe('messages', { symKeyID: sym, topics: [topic] })
    .on('data', async (data) => {
      if (notification) {
        try {
          const resolver = new Resolver.Resolver({
            shhc: async (did, parsed) => {
              const fullId = parsed.id.match(/^(.*)?(0x[0-9a-fA-F]{40})$/);
              if (!fullId){
                throw new Error(`Not a valid shhc DID: ${did}`);
              }
              return wrapDidDocument(did, parsed.id);
            }
          });
          const decode = await didJWT.verifyJWT(Web3Utils.hexToUtf8(data.payload), {resolver: resolver, audience: `did:shhc:${account.address}`});
          notification(decode && decode.payload && decode.payload.response && decode.payload.response.nonce === nonce ? decode.payload : null);
        } catch (error) {
          notification(null);
        }
      }
      shh.clearSubscriptions();
    });

  const jwt = await didJWT.createJWT(
    {
      aud: `did:shhc:${account.address}`,
      request: {
        ch: {
          url: option.urlEnable ? shh.currentProvider.url : undefined,
          sym,
          sig,
          topic,
        },
        ...request,
      },
    },
    {
      alg: 'ES256K',
      issuer: `did:shhc:${account.address}`,
      signer: account.signer,
      expiresIn: 120,
    }
  );
  const decode = didJWT.decodeJWT(jwt);
  const qr = {request: decode.payload.request, iss: decode.payload.iss};
  return {jwt, qr};
}

exports.subscribe = _subscribe;
