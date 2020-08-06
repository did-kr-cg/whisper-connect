---
eip: <to be assigned>
title: <EIP title>
author: <a list of the author's or authors' name(s) and/or username(s), or name(s) and email(s), e.g. (use with the parentheses or triangular brackets): FirstName LastName (@GitHubUsername), FirstName LastName <foo@bar.com>, FirstName (@GitHubUsername) and GitHubUsername (@GitHubUsername)>
discussions-to: <URL>
status: Draft
type: <Standards Track | Meta | Informational>
category (*only required for Standard Track): <Core | Networking | Interface | ERC>
created: <date created on, in ISO 8601 (yyyy-mm-dd) format>
---

# Abstract
This EIP is a document that defines a protocol for p2p communication via ethereum network.

# Motivation
Whisper Connect is an easy and simple decentralized (without kind of a google cloud services) p2p connect solution. Desktop browser login via mobile app. or create transaction for smart contracts and send a signature and message via whisper too. and it can push messaging service too. so the users can use any dApps or a DID services (like a ethereum login), and exchange DIDs and VCs too.

# Specification
![wc](https://user-images.githubusercontent.com/11692220/89493775-e0639680-d7ef-11ea-936f-611df36cd39c.png)

# Sample code
- Web
```javascript
const identities = {};
Promise.all([
  web3.shh.newSymKey().then((id) => {
    identities.symKey = id;
  }),
  web3.shh.newKeyPair().then((id) => {
    identities.keyPair = id;
  }),
]).then(() => {
  // TODO: ABI.json is downloaded from shh server.
  const abi1 = {
    name: 'myMethod1',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    },{
        type: 'string',
        name: 'myString'
    }]
  };
  const abi2 = {
    name: 'myMethod2',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    },{
        type: 'string',
        name: 'myString'
    }]
  };
  const qrContent = {
    provider: 'wss://...',
    post: {
      topic: web3.eth.abi.encodeFunctionSignature(abi1),
      abi: JSON.stringify(abi1),
      symKeyID: identities.symKey,
      sig: identities.keyPair,
    },
    callback: {
      topic: web3.eth.abi.encodeFunctionSignature(abi2),
      abi: JSON.stringify(abi2),
    },
  };

  // TODO: Draw QR

  web3.shh
    .subscribe('messages', {
      symKeyID: identities.symKey,
      topics: [qrContent.topic],
    })
    .on('data', (data) => {
      const payload = JSON.parse(web3.utils.hexToUtf8(data.payload));

      // TODO: process notification data and post callback, if data.payload has callback parms 
 
      console.log(web3.eth.accounts.recover(payload.parms, payload.signature));
      web3.shh.clearSubscriptions();
    });
});
```
- Mobile
```javascript
const qrContent = {
  provider: 'wss://...',
  post: {
    topic: web3.eth.abi.encodeFunctionSignature(abi1),
    abi: JSON.stringify(abi1),
    symKeyID: identities.symKey,
    sig: identities.keyPair,
  },
  callback: {
    topic: web3.eth.abi.encodeFunctionSignature(abi2),
    abi: JSON.stringify(abi2),
  },
};
const parms = getParms(); // TODO: automatic or user input array
const encodeFncCall = web3.eth.abi.encodeFunctionCall(JSON.parse(qrContent.post.abi), parms);

// TODO: it's just sample. you must use with metaTx.

web3.eth.personal.sign(encodeFncCall, '0x...addres...')
  .then((signature) => {
    web3.shh.setProvider(qrContent.provider);
    web3.shh
      .post({
        topic: qrContent.post.topic,
        symKeyID: qrContent.post.symKeyID,
        sig: qrContent.post.sig,
        ttl: 10,
        powTime: 3,
        powTarget: 0.5,
        payload: web3.utils.utf8ToHex(JSON.stringify({signature, parms})),
      })
      .then((h) => {
        console.log(`Message with hash ${h} was successfuly sent`);
        // TODO: if payload has callback parms, start subscribe.
      })
      .catch((err) => console.log('Error: ', err));
  });
```

## Copyright
Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).