# Whisper Connect

# Features
Whisper Connect is an easy and simple decentralized (without kind of a google cloud services) p2p connect solution. Desktop browser login via mobile app. or create transaction for smart contracts and send a signature and message via whisper too. and it can push messaging service too. so the users can use any dApps or a DID services (like a ethereum login), and exchange DIDs and VCs too.

# Installation
```
npm install @did-kr-cg/whisper-connect --save
yarn add install @did-kr-cg/whisper-connect
```

# Test code
## web.js
  - edit
```javascript
const provider = Shh.givenProvider || 'ws://some.local-or-remote.node:8546'; // TODO: change url
```
  - run
node ./examples/web.js


## mobile.js
  - edit
```javascript
const provider = Shh.givenProvider || 'ws://some.local-or-remote.node:8546'; // TODO: change url
```
  - run
node ./examples/mobile.js symKeyID=copy_from_web.js(post.symKeyID) sig=copy_from_web.js(post.sig)