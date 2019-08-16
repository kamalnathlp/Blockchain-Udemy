const ChainUtil = require('../chain-util');
const {DIFFICULTY, MINE_RATE} = require('../config');


class Block{
    constructor(timestamp, lastHash, hash, Data, nonce, difficulty){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.Data = Data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString(){
        return `Block-
        Time        : ${this.timestamp}
        last Hash   : ${this.lastHash.substring(0,10)}
        hash        : ${this.hash.substring(0,10)}
        Data        : ${this.Data}
        Difficulty  : ${this.difficulty}
        Nonce       : ${this.nonce}
        `
    }

    static genesis(){
        return new this('time','f3jf-3t6j','hash',[],DIFFICULTY);
    }

    static mineblock(lastblock, data){
        let hash, timestamp;
        const lastHash = lastblock.hash; 
        let {difficulty} = lastblock; 
        let nonce = 0;

        do
        {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDif(lastblock,timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        }   while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));  
        
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty){
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block){
        const {timestamp, lastHash, Data, nonce, difficulty}  = block;
        return Block.hash(timestamp, lastHash, Data, nonce, difficulty);
    }

    static adjustDif(lastblock,currentTime){
        let {difficulty} = lastblock;
        difficulty = lastblock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;

    }
}

module.exports = Block;