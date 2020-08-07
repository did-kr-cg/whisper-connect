const Shh = require('web3-shh');
const {subscribe, post} = require('../src/index');

const provider = Shh.givenProvider || 'ws://some.local-or-remote.node:8546'; // TODO: change url
const parms = { topic: '0xffaadd11', symKeyID: null, sig: null };
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const arg = args[i].split('=');
  switch (arg[0]) {
    case 'symKeyID':
      parms.symKeyID = arg[1];
      break
    case 'sig':
      parms.sig = arg[1];
      break
    case 'topic':
      parms.topic = arg[1];
      break
  }
}

async function start(topic, symKeyID, sig) {
  const shh = new Shh(provider);
  const callback = { topic: '0xffaadd11', abi: { test: 'TODO 2' } };
  const json = await subscribe(shh, callback.topic, callback.abi, null, (data) => {
    console.log(4, data);
    process.exit();
  });
  await post(shh, topic, symKeyID, sig, {answer: 'POST!!!!!', ...json});
  console.log(2, 'POST!!!!!');
}

if (parms.symKeyID && parms.sig) {
  start(parms.topic, parms.symKeyID, parms.sig);
} else {
  console.log('error!!')
}
