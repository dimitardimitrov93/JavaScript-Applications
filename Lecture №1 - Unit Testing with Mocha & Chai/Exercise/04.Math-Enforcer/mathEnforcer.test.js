const assert = require('chai').assert;
const mathEnforcer = require('./mathEnforcer');

describe('mathEnforcer functionality tests:', () => {
    it(`mathEnforcer.addFive() function should return 'undefined' if the passed argument is not a number.`, () => {
        assert.equal(mathEnforcer.addFive('5'), undefined);
        assert.equal(mathEnforcer.addFive([5]), undefined);
    });

    it(`mathEnforcer.addFive() function should return a number if the passed argument is a number.`, () => {
        assert.equal(mathEnforcer.addFive(5), 10);
        assert.equal(mathEnforcer.addFive(-5), 0);
        assert.equal(mathEnforcer.addFive(0.5), 5.5);
    });

    it(`mathEnforcer.subtractTen() function should return 'undefined' if the passed argument is not a number.`, () => {
        assert.equal(mathEnforcer.subtractTen('5'), undefined);
        assert.equal(mathEnforcer.subtractTen([5]), undefined);
    });

    it(`mathEnforcer.subtractTen() function should return a number if the passed argument is a number.`, () => {
        assert.equal(mathEnforcer.subtractTen(15), 5);
        assert.equal(mathEnforcer.subtractTen(10.5), 0.5);
        assert.equal(mathEnforcer.subtractTen(0), -10);
        assert.equal(mathEnforcer.subtractTen(-10), -20);
    });

    it(`mathEnforcer.sum() function should return 'undefined' if the passed argument is not a number.`, () => {
        assert.equal(mathEnforcer.sum('5', 5), undefined);
        assert.equal(mathEnforcer.sum(5, '5'), undefined);
    });

    it(`mathEnforcer.sum() function should return a number if the passed argument is a number.`, () => {
        assert.equal(mathEnforcer.sum(5, 5), 10);
        assert.equal(mathEnforcer.sum(5.5, 5.5), 11);
        assert.equal(mathEnforcer.sum(-5, -5), -10);
    });
});