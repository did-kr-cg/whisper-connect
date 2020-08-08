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
  const base64 = await subscribe(shh, abi_2, null, (data) => {
    console.log(5, data);
    process.exit();
  });
  console.log(2, decode(base64))
  await post(shh, abi_1, symKeyID, sig, {payload: 'POST!!!!!', ...decode(base64)});
  console.log(3, 'POST!!!!!');
}

if (parms.symKeyID && parms.sig) {
  start(parms.symKeyID, parms.sig);
} else {
  console.log('error!!')
}
