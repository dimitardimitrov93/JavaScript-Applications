function solve(arrInput, startIndexInput, endIndexInput) {

    if (!Array.isArray(arrInput)) {
        return NaN;
    } else if (arrInput.length < 1) {
        return 0;
    }

    let arr = arrInput
        .slice()
        .map(x => Number(x));

    let startIndex = Math.max(0, startIndexInput);
    let endIndex = Math.min(arr.length - 1, endIndexInput);

    let result = arr.slice(startIndex, endIndex + 1).reduce((a, b) => a + b);

    return result;
}

let resultsArr = [];
resultsArr.push(solve([10, '20', 30, '40', 50, 60], 3, 300));
resultsArr.push(solve([1.1, 2.2, 3.3, 4.4, 5.5], -3, 1));
resultsArr.push(solve([10, 'twenty', 30, 40], 0, 2));
resultsArr.push(solve([], 1, 2));
resultsArr.push(solve('text', 0, 2));

console.log(resultsArr.join('\n'));
