const EC = require('elliptic').ec;
const encr = require('crypto-js/sha256');
const uuidV1 = require('uuid/v1');
const ec = new EC('secp256k1');

class chainUtil {
    static genKeyPair(){
        return ec.genKeyPair();
    }

    static id(){
        return uuidV1();
    }

    static hash(data){
        return encr(JSON.stringify(data)).toString();
    }

    static verifySignature(publicKey,signature,datahash){
        return ec.keyFromPublic(publicKey,'hex').verify(datahash,signature);
    }
}

module.exports = chainUtil;