const Shh = require('web3-shh');
const {subscribe, decode, post, ABI} = require('../src/index');

const provider = Shh.givenProvider || 'ws://some.local-or-remote.node:8546'; // TODO: change url

async function start() {
  const shh = new Shh(provider);

  const postABI = {abi: ABI.REGISTER, parms: {}};
  const callbackABI = {abi: ABI.CREDENCIAL, parms: {}};
  const base64 = await subscribe(shh, postABI, callbackABI, (data) => {
    console.log(4, data);
    if (data.post) {
      // TODO: make callback payload
      post(shh, data.post, { payload: 'Callback!!!!!' });
    }
    process.exit();
  });

  console.log(1, decode(base64));
}

start();