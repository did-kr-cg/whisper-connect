/*
pragma solidity >=0.4.22 <0.7.0;

contract WC {
     // _type = sha256(type), _hash = sha256(byte2hex(msgpock({nonce, timestamp, parms}))
    function register(bytes32 _type, bytes32 _hash) public {
      // dummy function
    }
    function authenticate(bytes32 _type, bytes32 _hash) public {
      // dummy function
    }
    function credencial(bytes32 _type, bytes32 _hash) public {
      // dummy function
    }
    function presentation(bytes32 _type, bytes32 _hash) public {
      // dummy function
    }
}
*/

const abi = [
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_type',
				type: 'bytes32'
			},
			{
				internalType: 'bytes32',
				name: '_hash',
				type: 'bytes32'
			}
		],
		name: 'authenticate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_type',
				type: 'bytes32'
			},
			{
				internalType: 'bytes32',
				name: '_hash',
				type: 'bytes32'
			}
		],
		name: 'credencial',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_type',
				type: 'bytes32'
			},
			{
				internalType: 'bytes32',
				name: '_hash',
				type: 'bytes32'
			}
		],
		name: 'presentation',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_type',
				type: 'bytes32'
			},
			{
				internalType: 'bytes32',
				name: '_hash',
				type: 'bytes32'
			}
		],
		name: 'register',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
];

const ABI = {};
for(let i = 0; i < abi.length; i++) {
  ABI[abi[i].name.toUpperCase()] = abi[i];
}

exports.ABI = ABI;