let display = document.getElementById('display');

const precedence = { '+': 2, '-': 2, '*': 3, '/': 3 };

const operate = (op, a, b) => {
    a = Number(a);
    b = Number(b);
    if (op === '/' && b === 0) {
        throw new Error('Division by zero');
    }
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        default: return 0;
    }
};

const appendValue = (val) => {
    if (val === 'C') {
        display.value = ''; // Очистить, если нажата "C"
    } else {
        display.value += val; // Добавить значение к текущему
    }
};

const calculate = () => {
    try {
        const tokens = display.value.match(/(\d+(\.\d*)?|\.\d+|[+\-*/()])/g) || [];
        const rpn = [];
        const stack = [];

        for (const token of tokens) {
            if (!isNaN(parseFloat(token))) rpn.push(token);
            else if (precedence[token]) {
                while (stack.length && precedence[token] <= (precedence[stack[stack.length - 1]] || 0)) {
                    rpn.push(stack.pop());
                }
                stack.push(token);
            } else if (token === '(') stack.push(token);
            else if (token === ')') {
                while (stack.length && stack[stack.length - 1] !== '(') rpn.push(stack.pop());
                stack.pop();
            }
        }

        while (stack.length) rpn.push(stack.pop());
        const evalStack = [];
        for (const token of rpn) {
            if (!isNaN(parseFloat(token))) {
                evalStack.push(parseFloat(token));
            } else {
                const b = evalStack.pop();
                const a = evalStack.pop();
                evalStack.push(operate(token, a, b));
            }
        }
        if (evalStack[0] !== undefined) {
            display.value = evalStack[0]; 
        } else {
            display.value = ''; 
        }
    } catch (e) {
        display.value = 'Error';
    }
};