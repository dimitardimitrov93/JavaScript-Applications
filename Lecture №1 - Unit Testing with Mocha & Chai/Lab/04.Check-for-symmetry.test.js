const assert = require('chai').assert;
const isSymmetric = require('./04.Check-for-symmetry');

describe('isSymmetric() functionality tests.', function () {
    it('Should return false for any input that isn’t of the correct type.', () => {
        assert.equal(isSymmetric(1), false);
        assert.equal(isSymmetric('1'), false);
        assert.equal(isSymmetric({test: 1}), false);
        assert.equal(isSymmetric(NaN), false);
        assert.equal(isSymmetric(undefined), false);
        assert.equal(isSymmetric(null), false);
        assert.equal(isSymmetric(false), false);
        assert.equal(isSymmetric(true), false);
        assert.equal(isSymmetric(() => 'test'), false);
        assert.equal(isSymmetric(''), false);
        assert.equal(isSymmetric(), false);
        assert.equal(isSymmetric({}), false);
        assert.equal(isSymmetric(/./), false);
    });

    it('Should return true if the input array is symmetrical (first half is the same as the second half mirrored).', () => {
        assert.equal(isSymmetric([2, 4, 4, 2]), true);
        assert.equal(isSymmetric([1, 4, 6, 4, 1]), true);
        assert.equal(isSymmetric([]), true);
        assert.equal(isSymmetric([2, 'string', {test: 1}, new Date(), {test: 1}, 'string', 2]), true);
    });
    
    it('Should return false if the input array is not symmetrical (first half is not the same as the second half mirrored).', () => {
        assert.equal(isSymmetric([2, 4, 3, 1]), false);
        assert.equal(isSymmetric([{test: 1}, {test: 2}]), false);
        assert.equal(isSymmetric([-2, 4, 4, 2]), false);
    });

    it('Should return true if the input array is not symmetrical (first half is the same as the second half mirrored).', () => {
        assert.equal(isSymmetric([1]), true);
    });

    it('Should return false if the input array is symmetrical (first half is not the same as the second half mirrored).', () => {
        assert.equal(isSymmetric([]), true);
    });
});

// Takes an array as argument
// Returns false for any input that isn’t of the correct type
// Returns true if the input array is symmetric (first half is the same as the second half mirrored)
// Otherwise, returns false