const Transaction = require('../wallet/transactions');

class transactionPool{
    constructor (){
        this.transactions = []
    }

    updateTransaction(transaction){
        const transactionId = this.transactions.find(t => t.id === transaction.id);
        
        if(transactionId){
            this.transactions[this.transactions.indexOf(transactionId)] = transaction;
        }else{
            this.transactions.push(transaction);
        }        
    }

    exisitingTransaction(address){
        return this.transactions.find(t => t.input.address === address);
    }

    validTransactions(){
        return this.transactions.filter(transaction => {
            const outputTotal = transaction.outputs.reduce((total,output)=>{
                return total + output.amount;
            },0);

            if(transaction.input.amount !== outputTotal){
                console.log(`Invalid transaction from ${transaction.input.address}.`);
                return;
            }

            if(!Transaction.verifyTransaction(transaction)){
                console.log(`Invalid Signature from ${transaction.input.address}.`);
                return;
            }
            return transaction;
        });
    }

    clear(){
        this.transactions = [];
    }
}

module.exports = transactionPool;