const { JWT } = require('jose');
const Shh = require('web3-shh');
const Web3Utils = require('web3-utils');
const Web3EthAbi = require('web3-eth-abi');
const { subscribe, post, utils, ABI } = require('../src/index');

const provider = 'ws://ec2-18-223-169-124.us-east-2.compute.amazonaws.com:3002' // Shh.givenProvider || 'ws://some.local-or-remote.node:8546'; // TODO: change url

const parms = { symKeyID: null, sig: null };
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
  }
}

async function start(symKeyID, sig, client_id) {
  const shh = new Shh(client_id);
  const wallet = utils.getWallet();

  const options = { abi: ABI.CREDENCIAL };
  const jwt = await subscribe(shh, wallet, options, (data) => {
    console.log(5, data);
    process.exit();
  });
  console.log(2, JWT.decode(jwt, { complete: true }));

  const dataPost = {topic: Web3EthAbi.encodeFunctionSignature(ABI.REGISTER), symKeyID, sig};
  // TODO: make a payload.
  // msg = (JSON.stringify) -> hash -> encodeAbi (myFunction(bytes32 _type, bytes32 _hash))-> sign -> signature
  // msg = (string like JWT) -> hash -> encodeAbi (myFunction(bytes32 _type, bytes32 _hash)), sig = null
  const payload = {
    parms: { type: Web3Utils.soliditySha3('type'), sig: 'signature', msg: 'data to sign (post)'},
    post: JWT.decode(jwt).post,
  };
  await post(shh, wallet, dataPost, payload);
  console.log(3, payload);
}

if (parms.symKeyID && parms.sig) {
  start(parms.symKeyID, parms.sig, provider);
} else {
  console.log('error!!');
}
