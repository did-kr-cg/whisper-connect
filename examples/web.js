const { JWT } = require('jose');
const Shh = require('web3-shh');
const Web3Utils = require('web3-utils');
const { subscribe, post, utils, ABI } = require('../src/index');

const provider = 'ws://ec2-18-223-169-124.us-east-2.compute.amazonaws.com:3002' // Shh.givenProvider || 'ws://some.local-or-remote.node:8546'; // TODO: change url

async function start() {
  const shh = new Shh(provider);
  const wallet = utils.getWallet();

  // console.log(signer);
  const options = { abi: ABI.REGISTER, parms: {} };
  const jwt = await subscribe(shh, wallet, options, (data) => {
    // TODO: recover data.payload = {sig: '', msg: ''}
    // msg (JSON.stringify or string like JWT) -> hash -> encodeAbi (myFunction(bytes32 _type, bytes32 _hash))
    // recover(sig, encodeAbi)
    console.log(4, data);
    if (data && data.post) {
      // TODO: make a payload.
      // msg = (JSON.stringify) -> hash -> encodeAbi (myFunction(bytes32 _type, bytes32 _hash))-> sign -> signature
      // msg = (string like JWT) -> hash -> encodeAbi (myFunction(bytes32 _type, bytes32 _hash)), sig = null
      const payload = {
        parms: { type: Web3Utils.soliditySha3('type'), sig: 'signature', msg: 'data to sign (callback)' }
      };
      post(shh, wallet, data.post, payload );
    }
    process.exit();
  });
  // console.log(1, jwt, jwt.length);
  console.log(1, JWT.decode(jwt, { complete: true }));
}

start();