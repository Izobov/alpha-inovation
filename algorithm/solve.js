function solve(wordList, target) {
    let rest = target;
    const result = [];
    for (let word of wordList) {
        if (!rest) break;
        if (rest.includes(word)) {
            result.push(word);
            rest = rest.replace(word, "");
        }
     }

    if (rest.length || !result.length) {
        return "None";
    }
    return result;

}
module.exports = solve;