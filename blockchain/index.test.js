const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain',() =>{
    let bc, bc2;
    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('Start with genisis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('add new block', () => {
        const data = 'foo';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length-1].Data).toEqual(data);
    });

    it('Validated a valid chain', ()=> {
        bc2.addBlock("foo");
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('Invalidates a chain with a corrupt genesis block', () => {
        bc2.chain[0].Data = 'Change data';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('replaces with valid chain', () => {
        bc2.addBlock('kamal');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    });

    it('Chain with lesser length',() => {
        bc.addBlock('foobar');
        bc.replaceChain(bc2.chain);
        expect(bc.chain).not.toEqual(bc2.chain);
    });

});