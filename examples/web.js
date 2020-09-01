const Shh = require('web3-shh');
const didJWT = require('did-jwt');
const Web3Utils = require('web3-utils');
const { subscribe, post, ABI } = require('../src/index');

const provider = Shh.givenProvider || 'ws://some.local-or-remote.node:8546'; // TODO: change url

async function start() {
  const shh = new Shh(provider);
  const account = {
    address: '0xf3beac30c498d9e26865f34fcaa57dbb935b0d74',
    signer: didJWT.SimpleSigner('278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f'),
  };

  // console.log(signer);
  const request = { abi: ABI.REGISTER };
  const {jwt, qr} = await subscribe(shh, account, request, {abiEnable: false, urlEnable: false}, async (payload) => {
    // TODO: recover data.response = {sig: '', msg: ''}
    // msg (JSON.stringify or string like JWT) -> hash -> encodeAbi (myFunction(bytes32 _type, bytes32 _hash))
    // recover(sig, encodeAbi)
    console.log(4, payload);
    if (payload && payload.request) {
      const response = {
        parms: { type: Web3Utils.soliditySha3('type'), sig: 'signature', msg: 'data to sign (callback)' }
      };
      await post(shh, account, {payload, response} );
    }
    process.exit();
  });
  // console.log(1, jwt, jwt.length);
  // console.log(1, JSON.stringify(qr));
  console.log(1, JSON.stringify(didJWT.decodeJWT(jwt), null, 2));
}

start();