function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    // if (expr.length % 2 === 0) throw new RangeError("ExpressionError: Brackets must be paired");
    // if (countExprInBrackets(expr) === Infinity) throw new RangeError("TypeError: Division by zero.");

    function countExprInBrackets(str) {
        return Function(`'use strict'; return (${str})`)()
    }

    return countExprInBrackets(expr);

}

module.exports = {
    expressionCalculator
}