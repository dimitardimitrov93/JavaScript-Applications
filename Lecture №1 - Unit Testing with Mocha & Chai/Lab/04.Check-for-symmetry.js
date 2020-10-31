function isSymmetric(arr) {
    if (!Array.isArray(arr))
        return false; // Non-arrays are non-symmetric
    let reversed = arr.slice(0).reverse(); // Clone and reverse
    let equal = (JSON.stringify(arr) == JSON.stringify(reversed));
    return equal;
}

console.log(isSymmetric([5,'hi',{a:5},new Date(),{a:5},'hi',5]));

module.exports = isSymmetric;