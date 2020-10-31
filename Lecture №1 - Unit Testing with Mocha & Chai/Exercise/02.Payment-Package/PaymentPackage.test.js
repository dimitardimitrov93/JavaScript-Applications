const assert = require('chai').assert;
const PaymentPackage = require('./PaymentPackage');

describe('class PaymentPackage functionality tests:', () => {
    describe('Instantiation tests:', () => {
        it('Should throw an error if instantiated without arguments', () => {
            assert.throws(() => { new PaymentPackage() }, Error, 'Name must be a non-empty string');
        });
    
        it(`Should throw an error if 'name' argument is not a string`, () => {
            assert.throws(() => { new PaymentPackage(123, 100) }, Error, 'Name must be a non-empty string');
        });
    
        it(`Should throw an error if 'name' argument is not an empty string`, () => {
            assert.throws(() => { new PaymentPackage('', 100) }, Error, 'Name must be a non-empty string');
        });
    
        it(`Should throw an error if 'value' argument is not a number`, () => {
            assert.throws(() => { new PaymentPackage('Test', '100') }, Error, 'Value must be a non-negative number');
        });
    
        it(`Should throw an error if 'value' argument is a negative number.`, () => {
            assert.throws(() => { new PaymentPackage('Test', -100) }, Error, 'Value must be a non-negative number');
        });
    });

    describe(`'VAT' and 'active' default values tests:`, () => {
        it(`'VAT' has a default value of 20`, () => {
            let classInstance = new PaymentPackage('Test', 100);
            assert.strictEqual(classInstance.VAT, 20);
        });
    
        it(`'active' has default value of 'true'`, () => {
            let classInstance = new PaymentPackage('Test', 100);
            assert.equal(classInstance.active, true);
        });
    });

    it(`Should throw an error if there is an attempt to set 'VAT' as something different than a Number`, () => {
        let classInstance = new PaymentPackage('Test', 100);
        assert.throws(() => { classInstance.VAT = 'Not a number' }, Error, 'VAT must be a non-negative number');
    });

    it(`Should throw an error if there is an attempt to set 'active' as other than Boolean`, () => {
        let classInstance = new PaymentPackage('Test', 100);
        assert.throws(() => { classInstance.active = 'Not Boolean' }, Error, 'Active status must be a boolean');
    });

    it('Properties can be changed accordingly', () => {
        let classInstance = new PaymentPackage('Test', 100);
        assert.equal(classInstance.toString(), `Package: Test\n- Value (excl. VAT): 100\n- Value (VAT 20%): 120`);
        classInstance.name = 'changedName';
        classInstance.value = 200;
        classInstance.VAT = 18;

        assert.equal(classInstance.toString(), `Package: changedName\n- Value (excl. VAT): 200\n- Value (VAT 18%): 236`);
        classInstance.active = false;
        assert.equal(classInstance.toString(), `Package: changedName (inactive)\n- Value (excl. VAT): 200\n- Value (VAT 18%): 236`);
        classInstance.active = true;
        assert.equal(classInstance.toString(), `Package: changedName\n- Value (excl. VAT): 200\n- Value (VAT 18%): 236`);
        classInstance = new PaymentPackage('changedName', 0);
        classInstance.VAT = 0;
        assert.equal(classInstance.toString(), `Package: changedName\n- Value (excl. VAT): 0\n- Value (VAT 0%): 0`);
    });
});