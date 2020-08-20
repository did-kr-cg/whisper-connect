const Shh = require('web3-shh');
const didJWT = require('did-jwt');
const Web3Utils = require('web3-utils');
const Web3EthAbi = require('web3-eth-abi');
const { subscribe, post, ABI } = require('../src/index');

const provider = Shh.givenProvider || 'ws://some.local-or-remote.node:8546'; // TODO: change url

const parms = { symKeyID: null, sig: null, nonce: null, iss: null };
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const arg = args[i].split('=');
  switch (arg[0]) {
    case 'symKeyID':
      parms.symKeyID = arg[1];
      break;
    case 'sig':
      parms.sig = arg[1];
      break;
    case 'nonce':
      parms.nonce = arg[1];
      break;
    case 'iss':
      parms.iss = arg[1];
      break;
  }
}

async function start(symKeyID, sig, nonce, iss, provider) {
  const shh = new Shh(provider);
  const account = {
    address: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
    signer: didJWT.SimpleSigner('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'),
  };

  const jwt = await subscribe(shh, account, { abi: ABI.CREDENCIAL }, (data) => {
    console.log(5, data);
    process.exit();
  });
  console.log(2, didJWT.decodeJWT(jwt));

  const options = {topic: Web3EthAbi.encodeFunctionSignature(ABI.REGISTER), symKeyID, sig, nonce};
  // TODO: make a payload.
  // msg = (JSON.stringify) -> hash -> encodeAbi (myFunction(bytes32 _type, bytes32 _hash))-> sign -> signature
  // msg = (string like JWT) -> hash -> encodeAbi (myFunction(bytes32 _type, bytes32 _hash)), sig = null
  const payload = {
    parms: { type: Web3Utils.soliditySha3('type'), sig: 'signature', msg: 'data to sign (post)', nonce: parseInt(nonce) },
    post: didJWT.decodeJWT(jwt).payload.post,
  };
  await post(shh, account, {aud: iss, ...options}, payload);
  console.log(3, payload);
}

if (parms.symKeyID && parms.sig) {
  start(parms.symKeyID, parms.sig, parms.nonce, parms.iss, provider);
} else {
  console.log('error!!');
}
