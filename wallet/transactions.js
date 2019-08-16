const chainUtil = require('../chain-util');
const {MINING_REWARD} = require('../config');


class Transaction{
    constructor(){
        this.id     = chainUtil.id();
        this.input  = null;
        this.outputs = [];
    }

    update(senderWallet,recipient,amount){
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

        if (amount > senderOutput.amount){
            console.log(`Amount ${amount} exceeds balance.`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({amount, address : recipient});
        Transaction.signTransaction(this,senderWallet);
        return this;
    }

    static transactionwithOutputs(senderWallet,outputs){
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction,senderWallet);
        return transaction;
    }
    
    
    static newTransaction(senderWallet, recipient,amount){

        if (amount > senderWallet.balance){
            console.log(`Amount : ${amount} exceeds balance`);
            return;
        }

        return Transaction.transactionwithOutputs(senderWallet, 
            [{amount : senderWallet.balance - amount,
            address : senderWallet.publicKey},
            {amount, address : recipient}]
            );
    }

    static rewardTransaction(mineWallet,blockchainWallet){
        return Transaction.transactionwithOutputs(blockchainWallet,[{
            amount : MINING_REWARD,
            address: mineWallet.publicKey
        }]);   
    }

    static signTransaction(transaction,senderWallet){
        transaction.input= {
            timestamp : Date.now(),
            amount : senderWallet.balance,
            address : senderWallet.publicKey,
            signature : senderWallet.sign(chainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction){
        return chainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            chainUtil.hash(transaction.outputs)
        );
    }
}

module.exports = Transaction;