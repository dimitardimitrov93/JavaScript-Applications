const assert = require('chai').assert;
const createCalculator = require('./07.Add-Subtract');

describe('createCalculator() functionality tests', () => {
    it('Should return an object after execution.', () => {
        assert.equal(createCalculator() instanceof Object, true);
    });

    it('The returned object should have properties: add, subtract & get which are functions', () => {
        assert.equal(typeof createCalculator().add, 'function');
        assert.equal(typeof createCalculator().subtract, 'function');
        assert.equal(typeof createCalculator().get, 'function');
    });

    it('Function add() should return positive value from the addition of a positive number', () => {
        let calculator = createCalculator();
        calculator.add(5);
        assert.equal(calculator.get(), 5);
    });

    it('Function add() should return positive integer value from the addition of a number passed as string argument', () => {
        let calculator = createCalculator();
        calculator.add('5');
        assert.equal(typeof calculator.get(), 'number');
    });

    it('Function add() should return negative value from the addition of two negative numbers', () => {
        let calculator = createCalculator();
        calculator.add(-5);
        calculator.add(-5);
        assert.equal(calculator.get(), -10);
    });

    it('Function subtract() should return positive value from the subtraction of two positive numbers', () => {
        let calculator = createCalculator();
        calculator.add(10);
        calculator.subtract(5);
        assert.equal(calculator.get(), 5);
    });

    it('Function subtract() should return an integer value from the subtraction of a number passed as string argument', () => {
        let calculator = createCalculator();
        calculator.add(10);
        calculator.subtract('5');
        assert.equal(calculator.get(), 5);
    });

    it('Function get() should return an integer value', () => {
        let calculator = createCalculator();
        calculator.add(10);
        calculator.subtract(-5);
        assert.equal(typeof calculator.get(), 'number');
    });
});