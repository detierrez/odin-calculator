import { round, operate } from "./math.js";

const divMainDisplay = document.querySelector("#primary-display");
const divMinorDisplay = document.querySelector("#secondary-display");
const btnEqual = document.querySelector("button[data-type=equal]");
const btnClear = document.querySelector("button[data-type=clear]");
const btnBackspace = document.querySelector("button[data-type=backspace]");
const digitButtons = document.querySelectorAll("button[data-type=digit]");
const operatorButtons = document.querySelectorAll("button[data-type=operator]");

btnEqual.addEventListener("click", evaluate);
btnClear.addEventListener("click", clearScreen);
btnBackspace.addEventListener("click", eraseDigit);
digitButtons.forEach((btn) => {
  btn.addEventListener("click", enterDigit);
});
operatorButtons.forEach((btn) => {
  btn.addEventListener("click", enterOperator);
});

function evaluate() {
  const mainContent = divMainDisplay.textContent;
  const minorContent = divMinorDisplay.textContent;

  if (mainContent === "" || minorContent === "") return;

  [firstNumber, operator] = minorContent.split(" ");
  firstNumber = +firstNumber;
  secondNumber = +mainContent;

  let result = operate(firstNumber, secondNumber, operator);
  let integerDigits = Math.round(result).toString().length;
  if (integerDigits > 10) {
    result = Infinity;
  } else {
    let digits = Math.max(0, 9 - integerDigits);
    console.log(digits);
    result = round(result, digits);
  }

  divMainDisplay.textContent = result;
  divMinorDisplay.textContent = "";
}

function enterOperator(event) {
  const mainContent = divMainDisplay.textContent;
  const minorContent = divMinorDisplay.textContent;
  operator = event.target.textContent;

  if (mainContent === "" && minorContent === "") {
    return;
  } else if (isNaN(+mainContent) || mainContent === "Infinity") {
    return;
  } else if (mainContent === "") {
    divMinorDisplay.textContent = minorContent.slice(0, -1) + operator;
  } else if (minorContent === "") {
    firstNumber = +mainContent;
    divMinorDisplay.textContent = `${firstNumber} ${operator}`;
    divMainDisplay.textContent = "";
  } else {
    [firstNumber, operator] = minorContent.split(" ");
    firstNumber = +firstNumber;
    secondNumber = +mainContent;

    const result = operate(firstNumber, secondNumber, operator);

    operator = event.target.textContent;
    divMainDisplay.textContent = "";
    divMinorDisplay.textContent = `${result} ${operator}`;
  }
}

function clearScreen() {
  divMainDisplay.textContent = "";
  divMinorDisplay.textContent = "";
}

function eraseDigit() {
  const mainContent = divMainDisplay.textContent;
  if (isNaN(+mainContent) || mainContent === "Infinity") {
    divMainDisplay.textContent = "";
    return;
  }
  divMainDisplay.textContent = mainContent.slice(0, -1);
}

function enterDigit(event) {
  const digit = event.target.textContent;
  const mainContent = divMainDisplay.textContent;
  if (mainContent.length < 10) {
    divMainDisplay.textContent = mainContent + digit;
  }
}

let firstNumber;
let secondNumber;
let operator;

// let result = operate(10, 3, "÷");
// console.log(result)
// result = round(10/3, -6);
// console.log(result)
