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
  const options = { abi: ABI.REGISTER, parms: {} };
  const jwt = await subscribe(shh, account, options, async (data) => {
    // TODO: recover data.payload = {sig: '', msg: ''}
    // msg (JSON.stringify or string like JWT) -> hash -> encodeAbi (myFunction(bytes32 _type, bytes32 _hash))
    // recover(sig, encodeAbi)
    console.log(4, data);
    if (data && data.post) {
      // TODO: make a payload.
      // msg = (JSON.stringify) -> hash -> encodeAbi (myFunction(bytes32 _type, bytes32 _hash))-> sign -> signature
      // msg = (string like JWT) -> hash -> encodeAbi (myFunction(bytes32 _type, bytes32 _hash)), sig = null
      const payload = {
        parms: { type: Web3Utils.soliditySha3('type'), sig: 'signature', msg: 'data to sign (callback)', nonce: data.post.nonce }
      };
      await post(shh, account, {aud: data.iss, ...data.post}, payload );
    }
    process.exit();
  });
  // console.log(1, jwt, jwt.length);
  console.log(1, didJWT.decodeJWT(jwt));
}

start();