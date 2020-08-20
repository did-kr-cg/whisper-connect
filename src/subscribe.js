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

async function _subscribe(shh, account, options, notification = null) {
  const symKeyID = await shh.newSymKey();
  const sig = await shh.newKeyPair();
  const topic = Web3EthAbi.encodeFunctionSignature(options.abi);
  const nonce = Math.floor(Math.random() * 1000000);

  shh.subscribe('messages', { symKeyID, topics: [topic] })
    .on('data', async (data) => {
      if (notification) {
        try {
          const resolver = new Resolver.Resolver({
            shhc: async (did, parsed) => {
              const fullId = parsed.id.match(/^(.*)?(0x[0-9a-fA-F]{40})$/);
              if (!fullId){
                throw new Error(`Not a valid fido DID: ${did}`);
              }
              return wrapDidDocument(did, parsed.id);
            }
          });
          const decode = await didJWT.verifyJWT(Web3Utils.hexToUtf8(data.payload), {resolver: resolver, audience: `did:shhc:${account.address}`});
          notification(decode && decode.payload.parms.nonce === nonce ? decode.payload : null);          
        } catch (error) {
          notification(null);
        }
      }
      shh.clearSubscriptions();
    });
  const payload = {
    provider: shh.currentProvider.url,
    post: {
      symKeyID,
      sig,
      topic,
      nonce,
      ...options,
    },
  };

  const jwt = await didJWT.createJWT(
    {
      aud: `did:shhc:${account.address}`,
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

  return jwt;
}

exports.subscribe = _subscribe;
