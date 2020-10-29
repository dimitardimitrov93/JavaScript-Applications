const assert = require('chai').assert;
const sum = require('./04. Sum of Numbers');

describe('Sum of numbers', function () {
    it('Should return a positive result from the addition positive numbers.', () => {

        let testArr = [2, 4, 8];

        let result = sum(testArr);

        assert.equal(result, 14);
    });

    it('Should return a positive result from the addition numbers and numbers as strings.', () => {
        let testArr = [2, 4, '8'];

        let result = sum(testArr);

        assert.equal(result, 14);
    });
    
    it('Should return a result that is a number.', () => {
        let testArr = ['2', '8', 3];

        let result = sum(testArr);

        assert.equal(typeof result, 'number');
    });
});