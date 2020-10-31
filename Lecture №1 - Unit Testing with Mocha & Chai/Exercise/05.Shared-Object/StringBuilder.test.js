const assert = require('chai').assert;
const StringBuilder = require('./StringBuilder');

describe('Class Stringbuilder should have all required functions:', () => {
    let classInstance = new StringBuilder();

    it(`append()`, () => {
        assert.equal(Object.getPrototypeOf(classInstance).hasOwnProperty('append'), true);
    });

    it(`prepend()`, () => {
        assert.equal(Object.getPrototypeOf(classInstance).hasOwnProperty('prepend'), true);
    });

    it(`insertAt()`, () => {
        assert.equal(Object.getPrototypeOf(classInstance).hasOwnProperty('insertAt'), true);
    });

    it(`remove()`, () => {
        assert.equal(Object.getPrototypeOf(classInstance).hasOwnProperty('remove'), true);
    });

    it(`toString()`, () => {
        assert.equal(Object.getPrototypeOf(classInstance).hasOwnProperty('toString'), true);
    });
});

describe('Class StringBuilder functionality tests:', () => {
    it(`Function .prepend() should add the passed string argument in front of the stored elements.`, () => {
        let classInstance = new StringBuilder('strawberry')
        classInstance.prepend('The ');
        assert.equal(classInstance.toString(), 'The strawberry');
    });

    it(`Function .prepend() should throw an error if the passed argument is not a string.`, () => {
        let classInstance = new StringBuilder('strawberry');
        assert.throws(() => { classInstance.prepend(['The ']) }, TypeError, 'Argument must be string');
    });

    it(`Function .append() should add the passed string argument at the end of the stored elements.`, () => {
        let classInstance = new StringBuilder('strawberry')
        classInstance.prepend('The ');
        classInstance.append(' is very delicious.');
        assert.equal(classInstance.toString(), 'The strawberry is very delicious.');
    });

    it(`Function .append() should throw an error if the passed argument is not a string.`, () => {
        let classInstance = new StringBuilder('strawberry');
        assert.throws(() => { classInstance.append([' is very delicious.']) }, TypeError, 'Argument must be string');
    });

    it(`Function .insertAt() should add the passed string argument at the passed index of the stored elements.`, () => {
        let classInstance = new StringBuilder('The strawberry')
        classInstance.append(' very delicious...');
        classInstance.insertAt(' is', 14);
        classInstance.remove(33, 34);
        assert.equal(classInstance.toString(), 'The strawberry is very delicious.');
    });

    it(`Function .insertAt() should throw an error if the passed argument is not a string.`, () => {
        let classInstance = new StringBuilder('strawberry');
        assert.throws(() => { classInstance.insertAt(111) }, TypeError, 'Argument must be string');
    });

    it(`Function .remove() should remove elements from the storage, starting at the given index (inclusive), length number of characters.`, () => {
        let classInstance = new StringBuilder('The strawberry is very delicious.')
        classInstance.remove(14, 19);
        assert.equal(classInstance.toString(), 'The strawberry');
        classInstance.remove(0, 4);
        assert.equal(classInstance.toString(), 'strawberry');
    });

    it(`Function .toString() should return a string with all elements joined by an empty string.`, () => {
        let classInstance = new StringBuilder('The strawberry is very delicious.')
        assert.equal(classInstance.toString(), 'The strawberry is very delicious.');
        assert.equal(typeof classInstance.toString(), 'string');
    });
});


