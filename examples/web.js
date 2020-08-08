const Shh = require('web3-shh');
const {subscribe, decode, post} = require('../src/index');

const provider = Shh.givenProvider || 'ws://some.local-or-remote.node:8546'; // TODO: change url
const abi_1 = {
  name: 'myMethod_1',
  type: 'function',
  inputs: [{
    type: 'uint256',
    name: 'myNumber'
  }]
};
const abi_2 = {
  name: 'myMethod_2',
  type: 'function',
  inputs: [{
    type: 'string',
    name: 'myString'
  }]
};

async function start() {
  const shh = new Shh(provider);
  const base64 = await subscribe(shh, abi_1, {abi: abi_2}, (data) => {
    console.log(4, data);
    if (data.post) {
      // TODO: make callback payload
      post(shh, data.post.abi, data.post.symKeyID, data.post.sig, { payload: 'Callback!!!!!' });
    }
    process.exit();
  });
  console.log(1, decode(base64));
}

start();