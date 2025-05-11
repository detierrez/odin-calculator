import { round, operate } from "./math.js";
const log = console.log.bind(console);

const divTopDisplay = document.querySelector("#top-display");
const divBotDisplay = document.querySelector("#bot-display");
const btnBackspace = document.querySelector("button[data-backspace]");
const btnInvert = document.querySelector("button[data-invert]");
const btnClear = document.querySelector("button[data-clear]");
const btnEqual = document.querySelector("button[data-equal]");
const btnMinus = document.querySelector("button[data-minus]");
const operatorButtons = document.querySelectorAll("button[data-operator]");
const digitButtons = document.querySelectorAll("button[data-digit]");
const allButtons = document.querySelectorAll("button");

const MAX_DIGITS = 10;
const MAX_NUMBER = 10 ** MAX_DIGITS - 1;
const MIN_NUMBER = -MAX_NUMBER;

btnBackspace.addEventListener("click", deleteDigit);
btnClear.addEventListener("click", clearDisplay);
btnInvert.addEventListener("click", invertSign);
btnEqual.addEventListener("click", enterEqual);
digitButtons.forEach((btn) => {
  btn.addEventListener("click", enterDigit);
});

operatorButtons.forEach((btn) => {
  btn.addEventListener("click", enterOperator);
});
btnMinus.addEventListener("click", applySign);

allButtons.forEach((btn) => {
  btn.addEventListener("click", updateDisplay);
});

let numberTop = null;
let numberBot = null;
let operator = "+";
let isNegative = false;

updateDisplay();

function clearDisplay() {
  numberTop = null;
  numberBot = null;
  isNegative = false;
}

function invertSign() {
  if (numberBot === null) {
    isNegative = !isNegative;
    return;
  }

  numberBot *= -1;
}

function enterDigit(event) {
  let strDigit = event.target.textContent;
  if (numberBot === null) {
    numberBot = +strDigit;
    if (isNegative) {
      numberBot *= -1;
      isNegative = false;
    }
    return;
  }

  let strNumber = numberBot.toString();
  let signAdjust = strNumber[0] === "-" ? 1 : 0;
  if (strNumber.length < MAX_DIGITS + signAdjust) {
    numberBot = +(strNumber + strDigit);
  }
}

function deleteDigit() {
  if (numberBot === null) {
    if (isNegative) {
      isNegative = false;
    }
    return;
  }

  let slicedNumber = numberBot.toString().slice(0, -1);
  if (slicedNumber === "" || slicedNumber === "-") {
    numberBot = null;
    if (slicedNumber === "-") {
      isNegative = true;
    }
    return;
  }

  numberBot = +slicedNumber;
}

function enterEqual() {
  if (numberTop === null) return;

  if (numberBot === null) {
    numberBot = numberTop;
    numberTop = null;
    return;
  }

  numberBot = calculate();
  numberTop = null;
}

function enterOperator(event) {
  let pressedOperator = event.target.textContent;
  if (numberTop === null || numberBot === null) {
    operator = pressedOperator;
    if (numberBot !== null) {
      numberTop = numberBot;
      numberBot = null;
    }
    return;
  }

  numberTop = calculate();
  numberBot = null;
  operator = pressedOperator;
}

function applySign() {
  if (numberTop === null && numberBot === null) {
    isNegative = !isNegative;
  }
}

function updateDisplay() {
  divTopDisplay.textContent =
    numberTop === null ? "" : `${numberTop} ${operator}`;

  let sign = isNegative ? "-" : "";
  let overflowSign =
    numberBot === MAX_NUMBER ? "≥ " : numberBot === MIN_NUMBER ? "≤" : "";
  divBotDisplay.textContent =
    numberBot === null ? sign : `${overflowSign}${numberBot}`;
}

function calculate() {
  let result = operate(numberTop, numberBot, operator);
  if (result >= MAX_NUMBER) return MAX_NUMBER;
  if (result <= MIN_NUMBER) return MIN_NUMBER;

  let resultStr = Math.round(result).toString();
  let signAdjust = resultStr[0] === "-" ? 1 : 0;
  let integerDigits = resultStr.length - signAdjust;
  let decimalDigits = MAX_DIGITS - integerDigits;
  return round(result, decimalDigits);
}
