const assert = require('chai').assert;
const isOddOrEven = require('./solution');

describe('isOddOrEven() functionality tests:', () => {
    it('Should return undefined if the input parameter is not a string.', () => {
        assert.equal(isOddOrEven(1), undefined);
        assert.equal(isOddOrEven([]), undefined);
        assert.equal(isOddOrEven({}), undefined);
    });

    it(`Should return 'even' if the input parameter is a string with an even length.`, () => {
        assert.equal(isOddOrEven('strawberry'), 'even');
        assert.equal(isOddOrEven('watermelon'), 'even');
        assert.equal(isOddOrEven('banana'), 'even');
    });

    it(`Should return 'odd' if the input parameter is a string with an odd length.`, () => {
        assert.equal(isOddOrEven('peach'), 'odd');
        assert.equal(isOddOrEven('apple'), 'odd');
        assert.equal(isOddOrEven('fig'), 'odd');
    });
});