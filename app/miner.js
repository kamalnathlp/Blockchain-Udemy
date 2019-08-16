const Transaction = require('../wallet/transactions');
const Wallet = require('../wallet/index');
class Miner{
    constructor(blockchain,transactionPool,wallet,p2pserver){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pserver = p2pserver;
    }

    mine(){
        const validTransactions = this.transactionPool.validTransactions();
        
        // include a reward for the miner
        validTransactions.push(
            Transaction.rewardTransaction(this.wallet,Wallet.blockchainWallet())
        );
        
        // create a block consists of valid transactions
        const block = this.blockchain.addBlock(validTransactions);
        // synchronize the chains in the peer-peer server
        this.p2pserver.syncChain();
        // clear the transaction pool
        this.transactionPool.clear();
        // broadcast to every miner to clear the transaction pool
        this.p2pserver.broadcastclearTransaction();

        return block;
    }
}

module.exports = Miner;