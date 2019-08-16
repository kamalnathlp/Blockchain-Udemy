const Block = require('./block');
const {DIFFICULTY} = require('../config');

describe('Block',() => {
    let data, lastBlock, block;

    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineblock(lastBlock, data);
    });

    it('match data with the last block data',() => {
        
        expect(block.Data).toEqual(data);
    });

    it('match lastHash with the last block hash',() => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generates the hash that match difficuty', () => {
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
        console.log(block.toString());
    });
    it('lowers the difficulty for  slowly mined block', () =>{
        expect(Block.adjustDif(block, block.timestamp+360000)).toEqual(block.difficulty - 1);
    });
    it('raises the difficulty for highly mined block', () =>{
        expect(Block.adjustDif(block, block.timestamp+1)).toEqual(block.difficulty + 1);
    });
});