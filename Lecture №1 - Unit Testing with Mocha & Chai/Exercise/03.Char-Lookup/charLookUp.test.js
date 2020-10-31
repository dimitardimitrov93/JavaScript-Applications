const assert = require('chai').assert;
const lookupChar = require('./charLookUp');

describe('lookupChar() functionality tests:', () => {
    it(`Should return 'undefined' if any of the input arguments is invalid.`, () => {
        assert.equal(lookupChar(['tomato'], 1), undefined);
        assert.equal(lookupChar('aubergine', '1'), undefined);
        assert.equal(lookupChar('lime', 1.4), undefined);
    });

    it(`Should return 'Incorrect index' if any of the input index is outside the string's length.`, () => {
        assert.equal(lookupChar('tomato', -1), 'Incorrect index');
        assert.equal(lookupChar('aubergine', 9), 'Incorrect index');
    });

    it(`Should return the character at the specified index if all the inpus are valid.`, () => {
        assert.equal(lookupChar('tomato', 0), 't');
        assert.equal(lookupChar('olive', 2), 'i');
        assert.equal(lookupChar('aubergine', 8), 'e');
    });
});