const express = require('express');
const bodyparser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pserver = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transactionPool');
const Miner = require('./miner');
const HTTP_PORT = process.env.HTTP_PORT || 3031;

const app = express();
const bc = new Blockchain();

const wallet = new Wallet();
const tp = new TransactionPool();

const p2pserver = new P2pserver(bc,tp);
const miner = new Miner(bc,tp,wallet,p2pserver);

app.use(bodyparser.json());

app.get('/blocks', (req,res) => {
    res.json(bc.chain);
});

app.get('/transactions',(req,res)=>{
    res.json(tp.transactions);
});

app.post('/transact',(req,res)=>{
    const {recipient,amount} = req.body;
    const transaction = wallet.createTransaction(recipient,amount,bc,tp);
    p2pserver.broadcastTransaction(transaction);
    res.redirect('/transactions');
});


app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added ${block.toString()}`);

    p2pserver.syncChain();

    res.redirect('/blocks');
});

app.get('/publicKey',(req,res)=>{
    res.json({publicKey : wallet.publicKey})
});

app.get('/mineTransactions',(req,res)=>{
    const block = miner.mine();
    console.log(`New Block Added: ${block.toString()}`);
    res.redirect('/blocks');
});
app.listen(HTTP_PORT, () => console.log(`App Listening to ${HTTP_PORT}`));
p2pserver.listen();