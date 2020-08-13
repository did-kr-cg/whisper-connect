const Shh = require('web3-shh');
const Web3EthAbi = require('web3-eth-abi');
const {subscribe, decode, post, ABI} = require('../src/index');

const provider = Shh.givenProvider || 'ws://some.local-or-remote.node:8546'; // TODO: change url

const parms = { symKeyID: null, sig: null };
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
  }
}

async function start(symKeyID, sig) {
  const shh = new Shh(provider);

  const postABI = {abi: ABI.CREDENCIAL};
  const callbackABI = null;
  const base64 = await subscribe(shh, postABI, callbackABI, (data) => {
    console.log(5, data);
    process.exit();
  });

  console.log(2, decode(base64))
  const dataPost = {topic: Web3EthAbi.encodeFunctionSignature(ABI.REGISTER), symKeyID, sig};
  await post(shh, dataPost, {payload: 'POST!!!!!', ...decode(base64)});
  console.log(3, 'POST!!!!!');
}

if (parms.symKeyID && parms.sig) {
  start(parms.symKeyID, parms.sig);
} else {
  console.log('error!!')
}
