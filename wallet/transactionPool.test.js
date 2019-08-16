const tpool = require('./transactionPool');
const Transaction = require('./transactions');
const Wallet = require('./index');
const  Blockchain = require('../blockchain');
describe('setting data for transaction Pool',()=>{
    let tp,wallet,transaction;


    beforeEach(()=>{
        tp = new tpool();
        wallet = new Wallet();
        bc = new Blockchain();
        transaction = wallet.createTransaction('r33f-3ffat',30,bc,tp);
    });

    it('adds a transaction to the pool',()=>{
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('updated a transaction in the pool',()=>{
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet,'das3-55fe',40);
        tp.updateTransaction(newTransaction);

        expect(tp.transactions.find(t=>t.id === newTransaction.id)).not.toEqual(oldTransaction);        
    });

    it('clears transaction pools',()=>{
        tp.clear();
        expect(tp.transactions).toEqual([]);
    });

    describe('mixing the valid and invalid transactions',()=>{
        let validTransaction;

        beforeEach(()=>{
            validTransaction = [...tp.transactions];
            for(let i=0;i<6;i++){
                wallet = new Wallet();
                transaction = wallet.createTransaction('f45f-dar3-34fs',30,bc,tp);
                if(i%2==0){
                    transaction.input.amount = 1234;
                }else{
                    validTransaction.push(transaction);
                }
            }
        });

        it('shows the difference between valid and corrupt transactions',()=>{
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransaction));
        });

        it('grabs valid transactions',()=>{
            expect(tp.validTransactions()).toEqual(validTransaction);
        });
    });
});