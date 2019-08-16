const Transaction = require('./transactions');
const Wallet = require('./index');
const {MINING_REWARD} = require('../config');
describe ('Transaction' , () => {
    let transaction, wallet, recipeint, amount;
    beforeEach( () =>{
        wallet = new Wallet();
        amount = 50;
        recipeint = 'r3c1p13nt';
        transaction = Transaction.newTransaction(wallet, recipeint, amount);
        // console.log(transaction.outputs);
    });

    it('outputs the amount subracted from wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance -amount);
    });

    it('outputs the amount added to the recipient', () => {
        expect(transaction.outputs.find(output => output.address === recipeint).amount).toEqual(amount);
    });

    it('inputs balance of wallet',()=>{
        expect(transaction.input.amount).toEqual(wallet.balance);
        //console.log(transaction);
    });

    if('validates input transaction valid',()=>{
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    if('validates input transaction invalid',()=>{
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe ('Transacting with an amount that exceeds the balance amount',() => {
        beforeEach(() => {
            amount = 50000;
            transaction = Transaction.newTransaction(wallet,recipeint,amount);
        });
        it('does not create the transaction', () => {
            expect(transaction).toEqual(undefined);
        });
    });

    describe('and updating a transaction',()=>{
        let nextAmount,nextRecepeint;

        beforeEach(()=>{
            nextAmount = 20;
            nextRecepeint = "jn34-jn2k";
            transaction = transaction.update(wallet,nextRecepeint,nextAmount);
        });
        it('subracts next amount sender output',()=>{
            expect(transaction.outputs.find(output=>output.address === wallet.publicKey).amount).toEqual(wallet.balance-nextAmount-amount);
        });
        it('Ouputs an amount for that next receipient',()=>{
            expect(transaction.outputs.find(output=>output.address === nextRecepeint).amount).toEqual(nextAmount);
            //console.log(transaction);
        });
    });

    describe('creating a reward transaction',()=>{
        beforeEach(()=>{
            transaction = Transaction.rewardTransaction(wallet,Wallet.blockchainWallet());
            //console.log(transaction);
        });
        it('rewards the miner wallet',()=>{
            expect(transaction.outputs.find(t => t.address=== wallet.publicKey).amount).toEqual(MINING_REWARD);

        });
    });
});