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

    createTransaction(recipient,amount,blockchain,transactionPool){
        this.balance = this.calculateBalance(blockchain);
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

    calculateBalance(blockchain){
        let balance = this.balance
        let transactions = []
        //console.log(blockchain.chain);

        blockchain.chain.forEach(element => element.Data.forEach(transaction=>{
            transactions.push(transaction);
        }));

        const walletInpuTs = transactions.filter(transaction=>transaction.input.address === this.publicKey);
        
        let startTime = 0;
        
        if(walletInpuTs.length > 0){
        const recentInput = walletInpuTs.reduce((prev,curr)=> prev.input.timestamp > curr.input.timestamp ? prev : curr);
        balance = recentInput.outputs.find(output => output.address === this.publicKey).amount;
        startTime = recentInput.input.timestamp;
        }
        transactions.forEach(transaction => {
            if(transaction.input.timestamp > startTime){
                transaction.outputs.find(output=>{
                    if(output.address === this.publicKey){
                        balance += output.amount;
                    }
                });
            }
        });
        return balance;
    }

    static blockchainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = wallet;