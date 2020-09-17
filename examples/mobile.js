const Shh = require('web3-shh');
const didJWT = require('did-jwt');
const Web3Utils = require('web3-utils');
const Web3EthAbi = require('web3-eth-abi');
const { subscribe, post, ABI } = require('../lib/index');

const provider = 'ws://ec2-18-223-169-124.us-east-2.compute.amazonaws.com:3002'

const parms = { symKeyID: null, sig: null, nonce: null, iss: null };
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const arg = args[i].split('=');
  switch (arg[0]) {
    case 'sym':
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

  const {jwt} = await subscribe(shh, account, ABI.CREDENCIAL, {abiEnable: false, urlEnable: false}, (data) => {
    console.log(5, data);
    process.exit();
  });
  console.log(2, didJWT.decodeJWT(jwt));
  const qr = {
    iss: iss,
    request: {
      ch: {
        sym: symKeyID,
        sig,
        topic: Web3EthAbi.encodeFunctionSignature(ABI.REGISTER),
      },
      nonce: parseInt(nonce),
    }
  };
  const response = { type: Web3Utils.soliditySha3('type'), sig: 'signature', msg: 'data to sign (post)' };
  const request = didJWT.decodeJWT(jwt).payload.request;
  await post(shh, account, {payload: qr, response, request} );
  console.log(3, qr);
}

if (parms.symKeyID && parms.sig) {
  start(parms.symKeyID, parms.sig, parms.nonce, parms.iss, provider);
} else {
  console.log('error!!');
}
