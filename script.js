let displayValue = ''; // value displayed on screen
let expressionValue = ''; //value to be evaluated

var sqrtIndex = -1;
var evalIndex = -1;


// Array to store history items
let history = [];

// Function to add an item to the history
function addToHistory(expression, result) {
    // Add the new item to the beginning of the array
    history.unshift({ expression, result });

    // Limit the history to the last three items
    if (history.length > 3) {
        history.pop(); // Remove the oldest item
    }

    // Update the history display
    updateHistoryDisplay();
}

// Function to update the history display
function updateHistoryDisplay() {
    const historyDisplay = document.getElementById('history');
    historyDisplay.innerHTML = ''; // Clear the previous content

    // Loop through the history items and create list items to display them
    history.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.expression} = ${item.result}`;
        historyDisplay.appendChild(listItem);
    });
}





function appendToDisplay(value) {
    const operators = ['+', '-', '*', '/', '^'];
    
    
    // console.log(sqrtIndex);


    // Count the number of operators in the displayValue
    const operatorCount = displayValue.split('').filter(char => operators.includes(char)).length;

    // Count the number of decimal points in the displayValue
    const decimalPointCount = displayValue.split('').filter(char => char === '.').length;

    // Check if the value is a decimal point
    if (value === '.') { //checking if we have to put . or not
        // If the last character is an operator or if the first input of user is decimal point, add '0' before the decimal point
        if (operators.includes(displayValue.slice(-1)) || displayValue === '') {
            displayValue += '0' + value;
            expressionValue += '0' + value;
        } 
        // If there's already a decimal point in the current number, return
        else if (decimalPointCount > operatorCount || displayValue.endsWith('.') || displayValue.endsWith('%') || displayValue.endsWith('π') || displayValue.endsWith('(') || displayValue.endsWith(')') || displayValue.endsWith('!') ) {
            return;
        } 
        // If it's the first decimal point in the current number, add it
        else {
            displayValue += value;
            expressionValue += value;
        }
    }
    // pie button
    else if (value === '3.14') { 
        if(operators.includes(displayValue.slice(-1)) || displayValue === ''){
            displayValue += 'π';
            expressionValue += value;
        }
        else if (displayValue.slice(-1) === '.' || displayValue.endsWith('(')){ // for decimal point it should not allow to print pie
            return; 
        }
        else {
            displayValue += '*' + 'π';
            expressionValue += '*' + value;
        }
    }
    // for percentage
    else if (value === '0.01') {
        if(operators.includes(displayValue.slice(-1)) || displayValue === '') { //there should not be a operatr=or before %
            return;
        }
        else if (displayValue.slice(-1) === '.'){
            return;
        }
        else if(displayValue.slice(-1) === '%') {
            return;
        }
        else{
            displayValue += '%'; 
            expressionValue += '*' + value;
        }
    }



    // for sqaure root
    else if(value === 'sqrt') {
    
        if(operators.includes(displayValue.slice(-1)) || displayValue === ''){
            displayValue += value + '(';
        }
        else if(displayValue.slice(-1) === '.'){
            return;
        }
        else {
            displayValue += '*' + value + '(';
            expressionValue += '*';
        }

        sqrtIndex = displayValue.lastIndexOf('sqrt('); //storing index of sqrt() position in displayValue 
        evalIndex = expressionValue.length;
        // console.log(evalIndex);

        // console.log(sqrtIndex);
    }
    // If 'sqrt(' exists, find the index position of '(' after 'sqrt('
    else if(value === ')' && sqrtIndex !== -1){ // to avoid going in this condition as initial value of sqrtIndex without sqrt condition will be 
        //console.log(sqrtIndex);
        // console.log(evalIndex);

        displayValue += value;
        let sqrtToDoExpression = '';
        let sqrtToDo = '';
        let sqrtResult = '';
        let sqrtValRemove = '';


        let closeBracketIndex = displayValue.length - 1;
        let openBracketIndex = displayValue.indexOf('(', sqrtIndex);

        sqrtValRemove = displayValue.substring(openBracketIndex + 1, closeBracketIndex);
        
        // let sqrtToDo = evaluateExpression(sqrtValRemove); // using displayValue change to evaluationValue
        sqrtToDoExpression = expressionValue.substring(evalIndex, expressionValue.length);
        sqrtToDo = evaluateExpression(sqrtToDoExpression);

        // console.log(sqrtIndex);
        // console.log(expressionValue.length);
        // console.log(sqrtToDoExpression);
        // console.log(sqrtToDo);

        sqrtResult = Math.sqrt(parseFloat(sqrtToDo));

        sqrtResult = roundToTen(sqrtResult); // round sqrtResult to 10 decimal points
        let strSqrtResult = sqrtResult.toString();

        let sqrtValRemoveIndex = expressionValue.lastIndexOf(sqrtValRemove);
        // console.log(sqrtValRemoveIndex);

        expressionValue = expressionValue.substring(0, sqrtValRemoveIndex) + strSqrtResult; 

        sqrtIndex = -1;
        //console.log(sqrtIndex);
    }



    

    // factorial 
    else if(value === '!'){
        if(operators.includes(displayValue.slice(-1)) || displayValue === ''){
            return;
        }
        if(displayValue.slice(-1) === '.' || displayValue.endsWith('(') || displayValue.endsWith(')') || displayValue.slice(-1) === 'π' || displayValue.slice(-1) === '%'){
            return;
        }
        else{
            
            // finding factorial when number inputed is first value
            var flag = 0;
            let numbers = expressionValue.split(/[-+*/^]/); // Split expression by operators
            let operatorsArray = expressionValue.split('').filter(char => operators.includes(char));
            // Check if there is only one number and nothing before it
            // console.log(numbers);
            // console.log(operatorsArray);
            if (numbers.length === 1 && operatorsArray.length === 0) {
                flag = 1;
            }
            if (flag == 1){
                var factNum = calculateFactorial(parseInt(expressionValue));
                expressionValue = factNum
                displayValue += value;
            }
            // console.log(factNum);
            

            // finding factorial when number inputed is not first value
            if (flag == 0){
                let lastIndex = -1; // Initialize the index of the last operator
                // Iterate through the string n from right to left
                for (let i = expressionValue.length - 1; i >= 0; i--) {
                // Check if the current character is an operator
                    if (operators.includes(expressionValue[i])) {
                        lastIndex = i; // Update the last known index
                        break; // Exit the loop after finding the first operator from the right
                    }
                }
                if (lastIndex !== -1) {
                    var fact = expressionValue.substring(lastIndex + 1);

                    var factNum = calculateFactorial(parseInt(fact));
                }


                displayValue += value;

                // remove fact and concat '*factNum'
                replacementString = factNum; // string to replace it with
                let factToReplaceIndex = displayValue.lastIndexOf(fact); // index of fact (string to replace)
                expressionValue = expressionValue.substring(0, factToReplaceIndex) + replacementString + expressionValue.substring(factToReplaceIndex + fact.length);
            }
        }
    }
    else if (value === '(') {
        if (operators.includes(displayValue.slice(-1)) || displayValue === ''){
            displayValue += value;
            expressionValue += value;
        }
        else if (displayValue.endsWith('(')) {
            return;
        }
        else {
            displayValue += '*' + value;
            expressionValue += '*' + value;
        }
    }

    // For other values (operators and numbers), simply append to the display
    else{ // appending all other values
        displayValue += value;
        expressionValue += value;
    }

    document.getElementById('display').value = displayValue;

    console.log(expressionValue);
}







function calculateFactorial(num) {
    try {
        if (isNaN(num) || num < 0) {
            throw 'Invalid Input';
        }
        let result = 1;
        for (let i = 2; i <= num; i++) {
            result *= i;
        }
        return result;
    } catch (error) {
        displayValue = '';
        document.getElementById('display').value = 'Error';
    }
}





function clearDisplay() {
    displayValue = '';
    expressionValue = '';
    sqrtIndex = -1
    document.getElementById('display').value = '';
}

function backspace() {
    // Check if the displayValue is not empty
    if (displayValue.length > 0) {
        // Remove the last character from the displayValue
        displayValue = displayValue.slice(0, -1);
        expressionValue = expressionValue.slice(0, -1);
        // Update the display
        document.getElementById('display').value = displayValue;
    }
}





function calculate() {
    sqrtIndex = -1

    try {
        
        // Parsing the expression and calculating the result
        let result = evaluateExpression(expressionValue);

        // Round the result to a certain number of decimal places
        result = roundToTen(result); // Round to ten decimal places

        // Check if the result is not a number or not finite
        if (isNaN(result) || !isFinite(result)) {
            throw 'Invalid Input';
        }

        // display the calculated result
        displayVal = result.toString();
        // console.log(displayValue);
        document.getElementById('display').value = displayVal;

        // Add the calculation to the history
        addToHistory(displayValue, result);

    } catch (error) {
        displayValue = '';
        expressionValue = '';
        document.getElementById('display').value = 'Error';
    }
   
}



// Function to round a number to two decimal places
function roundToTen(num) {
    return +(Math.round(num + 'e+10') + 'e-10');
}






// Function to evaluate the mathematical expression
function evaluateExpression(expression) {

    // Regex to match numbers, operators, and parentheses
    //const tokens = expression.match(/\d+(\.\d+)?|[-+*/^()]|\w+(?=\()/g) || [];
    const tokens = expression.match(/(?:-?\d+(\.\d+)?|\w+(?=\())|[+\-*^()/]/g) || [];

    console.log(tokens);

    // Operator precedence map
    const precedence = {
        '^': 4,
        '/': 3,
        '*': 3,
        '+': 2,
        '-': 2,
        '(': 1,
    };

    const outputQueue = [];
    const operatorStack = [];

    // Shunting-yard algorithm to convert infix expression to postfix
    tokens.forEach(token => {
        if (parseFloat(token)) {
            outputQueue.push(parseFloat(token));
        } else if ('^*/+-'.indexOf(token) !== -1) {
            let topOperator = operatorStack[operatorStack.length - 1];
            while (topOperator && precedence[topOperator] >= precedence[token]) {
                outputQueue.push(operatorStack.pop());
                topOperator = operatorStack[operatorStack.length - 1];
            }
            operatorStack.push(token);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop(); // Discard the '('
        }
    });

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }


    // Evaluate the postfix expression
    const evaluationStack = [];
    outputQueue.forEach(token => {
        if (typeof token === 'number') {
            evaluationStack.push(token);
        } else {
            const operand2 = evaluationStack.pop();
            const operand1 = evaluationStack.pop();
            switch (token) {
                case '+':
                    evaluationStack.push(operand1 + operand2);
                    break;
                case '-':
                    evaluationStack.push(operand1 - operand2);
                    break;
                case '*':
                    evaluationStack.push(operand1 * operand2);
                    break;
                case '/':
                    evaluationStack.push(operand1 / operand2);
                    break;
                case '^':
                    evaluationStack.push(Math.pow(operand1, operand2));
                    break;
            }
        }
    });

    return evaluationStack[0];
}
