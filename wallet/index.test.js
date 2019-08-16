const tpool = require('./transactionPool');
const Wallet = require('./index');


describe('Wallet',()=>{
    let tp,wallet;

    beforeEach(()=>{
        wallet = new Wallet();
        tp = new tpool();
    });


    describe('creating a transaction', ()=>{
        let transaction,sendAmount,recipient;

        beforeEach(()=>{
            sendAmount = 20;
            recipient = '12n3-5tk5';
            transaction = wallet.createTransaction(recipient,sendAmount,tp);
        });

        describe('and doing the same transaction',()=>{
            beforeEach(()=>{
                wallet.createTransaction(recipient,sendAmount,tp);
            });

            it(`doubles the send Amount subracted from the wallet balance`,()=>{
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount * 2);
            });
        

        it(`clones the sendAmountoutput for the receipint`,()=>{
            expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount,sendAmount]);
        });
    });
    });

});