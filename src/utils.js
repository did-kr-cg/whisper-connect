
const { JWT, JWK } = require('jose');
const Base58 = require('base-58');
const KeyEncoder = require('key-encoder');
const DEFAULT_PUBKEY_TYPE = 'Secp256k1VerificationKey2018'

function getDIDFromKey(key) {
  const pemPub = key.toPEM(false);
  const keyEncoder = new KeyEncoder.default('secp256k1');
  const hexPubKey = keyEncoder.encodePublic(pemPub, 'pem', 'raw');
  return `did:key:${Base58.encode(Buffer.from(hexPubKey))}`;
}

function getKeyIdFromKey(key) {
  return `${getDIDFromKey(key)}#veri-key1`;
}

function getWallet() {
  const initKey = JWK.generateSync('EC', 'secp256k1');
  const key = JWK.asKey({
    crv: initKey.crv,
    x: initKey.x,
    y: initKey.y,
    d: initKey.d,
    kty: initKey.kty,
    kid: getKeyIdFromKey(initKey)
  });
  const did = getDIDFromKey(initKey);
  return { key, did };
}

function getDIDDocument(did) {
  const base58PubKey = did.replace('did:key:', '');
  const keyId = `${did}#veri-key1`;

  const authentication = {
    type: DEFAULT_PUBKEY_TYPE,
    publicKey: base58PubKey,
  }

  return {
    '@context': ['https://w3id.org/did/v0.11'],
    id: did,
    publicKey: [{
      id: keyId,
      type: DEFAULT_PUBKEY_TYPE,
      controller: did,
      publicKeyBase58: base58PubKey,
    }],
    authentication: [authentication],
  }
}

function pubkeyHexToPem(pubkeyHex) {
  const keyEncoder = new KeyEncoder.default('secp256k1');
  const rawPubKey = pubkeyHex.includes('0x') ? pubkeyHex.slice(2) : pubkeyHex;
  return keyEncoder.encodePublic(rawPubKey, 'raw', 'pem');
}

function getPemFromBase58PubKey(base58PubKey) {
  const buff = Buffer.from(Base58.decode(base58PubKey));
  const pubKeyHex = buff.toString('utf8');
  return pubkeyHexToPem(pubKeyHex);
}

function getPemPubKey(pubKey) {
  if (pubKey.publicKeyBase58) {
    return getPemFromBase58PubKey(pubKey.publicKeyBase58);
  } else if (pubKey.ethereumAddress) {
    return pubkeyHexToPem(pubKey.ethereumAddress);
  }
  return null;
}

function verifyJwt(jwt) {
  const { header, payload } = JWT.decode(jwt, { complete: true });
  const didDoc = getDIDDocument(payload.iss);
  if (didDoc.publicKey && didDoc.publicKey.length>0 && didDoc.publicKey[0].id !== header.kid) {
    return null;
  }
  try {
    const pemKey = getPemPubKey(didDoc.publicKey[0]);
    const jwk = JWK.asKey(pemKey);
    JWT.verify(jwt, jwk, { clockTolerance: '1 min' });
    return { header, payload };
  } catch (error) {
    console.log(error);
  }
  return null;
}

exports.getWallet = getWallet;
exports.getDIDDocument = getDIDDocument;
exports.verifyJwt = verifyJwt;
