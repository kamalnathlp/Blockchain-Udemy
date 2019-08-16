const tpool = require('./transactionPool');
const Wallet = require('./index');
const  Blockchain = require('../blockchain');
const {INITIAL_BALANCE} = require('../config');

describe('Wallet',()=>{
    let tp,wallet,bc;

    beforeEach(()=>{
        wallet = new Wallet();
        tp = new tpool();
        bc = new Blockchain();
    });


    describe('creating a transaction', ()=>{
        let transaction,sendAmount,recipient;

        beforeEach(()=>{
            sendAmount = 20;
            recipient = '12n3-5tk5';
            transaction = wallet.createTransaction(recipient,sendAmount,bc,tp);
        });

        describe('and doing the same transaction',()=>{
            beforeEach(()=>{
                wallet.createTransaction(recipient,sendAmount,bc,tp);
                //console.log(transaction.outputs);
            });

            it(`doubles the send Amount subracted from the wallet balance`,()=>{
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount * 2);
            });
        

        it(`clones the sendAmountoutput for the receipint`,()=>{
            //console.log(transaction.outputs);
            expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount,sendAmount]);
        });
    });
    });


    describe('calculating a balance', ()=>{
        beforeEach(()=>{
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;
            for(let i=0;i<repeatAdd;i++){
                senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);
            }
            bc.addBlock(tp.transactions);
        });

        it('calculates the balance for blockchain transaction matching the recipient', ()=>{
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance*repeatAdd));
        });

        it('calculates the balance for blockchain transaction matching the sender', ()=>{
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance*repeatAdd));
        });
    });
});