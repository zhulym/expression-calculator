function expressionCalculator(expr) {
    let result = expr.split(' ').join('');    //     '1+(21+3)*3'
    let bracketsIdx = [];

    while (result.length > 0) {
        bracketsIdx = result.split('').filter(el => el === '(' || el === ')')
        if (bracketsIdx.length % 2 !== 0) throw "ExpressionError: Brackets must be paired";
        bracketsIdx = [];
        findBracketsIdx(result);

        if (bracketsIdx.length === 1) throw "ExpressionError: Brackets must be paired";

        if (bracketsIdx.length === 0) {
            const result = countPartOfExpr();
            if (result === Infinity) throw "TypeError: Division by zero."
            return result;
        }

        let replace = result.slice(bracketsIdx[1], bracketsIdx[0] + 1);
        result = result.replace(replace, countPartOfExpr());
        bracketsIdx = [];
        if (result === Infinity) throw "TypeError: Division by zero."
    };

    function findBracketsIdx(expression) {               // находим индексы внутренних скобок и по ним вычленяем первое выражение
        for (let i = 0; i < expression.length; i++) {
            if (expression[i] === ')') {
                bracketsIdx.push(i);
                for (let j = i; j >= 0; j--) {
                    if (expression[j] === '(') {
                        bracketsIdx.push(j);
                        break;
                    }
                }
                break;
            }
        }
    }

    function countPartOfExpr() {
        let getExpr = result.slice(bracketsIdx[1] + 1, bracketsIdx[0]);    // "36-3*2/6+5"
        let operators = [];
        let arrNum;

        function findNum(num) {               // получили массив чисел без операторов ["36", "3", "2", "6", "5"]
            arrNum = num.split('*');
            function divideArr(operator) {
                arrNum = arrNum.map(el => el.split(operator));
                arrNum = arrNum.flat();
            }
            divideArr('/');               // поочерёдно мутируем массив пока не рассплитится по всем операторам
            divideArr('+');
            divideArr('-');
        }

        findNum(getExpr);

        for (let i = 0; i < getExpr.length; i++) {  // получили массив операторов ["-", "*", "/", "+"]
            if (getExpr[i] == '*' || getExpr[i] == '/' || getExpr[i] == '+' || getExpr[i] == '-') {
                operators.push(getExpr[i]);
            }
        }

        for (let i = 0; i < operators.length; i++) {
            const operatorPosition = i + i + 1;         // находим позицию операторов в исходном выражении  ["36", "3", "2", "6", "5"] ,  ["-", "*", "/", "+"]
            arrNum.splice(operatorPosition, 0, operators[i]);   // вставляем операторы в выражение каждый след оператор будет в позиции i+i+1     0-1  1-3  2-5  3-7
        }
        // ["36", "-", "3", "*", "2", "/", "6", "+", "5"] 
        for (let i = 1; i < arrNum.length; i++) {
            if (arrNum[i] === '*') {
                let result1 = arrNum[i - 1] * arrNum[i + 1];
                arrNum.splice(i - 1, 3, result1);
                i = 0;
            }
        }
        for (let i = 1; i < arrNum.length; i++) {
            if (arrNum[i] === '/') {
                if (arrNum[i + 1] === 0) {
                    throw "TypeError: Division by zero.";
                }
                let result1 = (arrNum[i - 1] / arrNum[i + 1]).toFixed(4);
                arrNum.splice(i - 1, 3, result1);
                i = 0;
            }
        }
        for (let i = 1; i < arrNum.length; i++) {
            if (arrNum[i] === '+') {
                let result1 = +(arrNum[i - 1]) + +(arrNum[i + 1]);
                arrNum.splice(i - 1, 3, result1);
                i = 0;
            }
        }
        for (let i = 1; i < arrNum.length; i++) {
            if (arrNum[i] === '-') {
                let result1 = arrNum[i - 1] - arrNum[i + 1];
                arrNum.splice(i - 1, 3, result1);
                i = 0;
            }
        }
        return Number(arrNum.toString());
    }
    return result;
}

module.exports = {
    expressionCalculator
}