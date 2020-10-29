const assert = require('chai').assert;
const rgbToHexColor = require('./06.RGB-to-HEX');

describe('rgbToHexColor() functionality tests', () => {
    it('Should return undefined if any of the input parameters are not in the expected range.', () => {
        assert.equal(rgbToHexColor(-1, 222, 255), undefined);
        assert.equal(rgbToHexColor(256, 222, 255), undefined);
        assert.equal(rgbToHexColor(1, -1, 255), undefined);
        assert.equal(rgbToHexColor(1, 256, 255), undefined);
        assert.equal(rgbToHexColor(0, 244, -1), undefined);
        assert.equal(rgbToHexColor(0, 244, 256), undefined);
        assert.equal(rgbToHexColor('0', 1, 253), undefined);
        assert.equal(rgbToHexColor(0, '11', 254), undefined);
        assert.equal(rgbToHexColor(0, 222, '254'), undefined);
    });

    it('Should return the same color in hexadecimal format as a string if all the input parameters are correct', () => {
        assert.equal(rgbToHexColor(255, 158, 170), '#FF9EAA');
        assert.equal(rgbToHexColor(0, 222, 11), '#00DE0B');
    });
});