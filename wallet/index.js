const chainUtil = require('../chain-util');
const Transaction = require('./transactions');
const {INITIAL_BALANCE} = require('../config'); 

class wallet {
    constructor () {
        this.balance = INITIAL_BALANCE;
        this.keyPair = chainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString(){
        return `Wallet -
        publicKey   : ${this.publicKey.toString().substring(0,10)}
        balance     : ${this.balance}`
    }

    sign(datahash){
        return this.keyPair.sign(datahash);
    }

    createTransaction(recipient,amount,transactionPool){
        if(amount > this.balance){
            console.log(`Amount: ${amount} exceeding balance : ${this.balance}`);
            return;
        }
        let transaction = transactionPool.exisitingTransaction(this.publicKey);
        
        if(transaction){
            transaction.update(this,recipient,amount);
        }
        else{
            transaction = Transaction.newTransaction(this,recipient,amount);
            transactionPool.updateTransaction(transaction);
        }
        return transaction;
    }
    static blockchainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = wallet;