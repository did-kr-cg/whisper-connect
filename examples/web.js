const Shh = require('web3-shh');
const {subscribe, post} = require('../index');

const provider = Shh.givenProvider || 'ws://some.local-or-remote.node:8546'; // TODO: change url
const parms = { topic: '0xffaadd11', provider, symKey: null, keyPair: null };
const shh = new Shh(parms.provider);

async function start() {
  const json = await subscribe(shh, parms.topic, {test: 'TODO 1'}, { topic: '0xffaadd11', abi: { test: 'TODO 2' }}, (data) => {
    console.log(3, data);
    if (data.post) {
      post(shh, data.post.topic, data.post.symKeyID, data.post.sig, { payload: 'Callback!!!!!' });
    }
    process.exit();
  });
  console.log(1, json);
}

start();