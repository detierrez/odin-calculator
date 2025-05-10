import { round, operate } from "./math.js";
const log = console.log.bind(console);

const divBotDisplay = document.querySelector("#primary-display");
const divTopDisplay = document.querySelector("#secondary-display");
const btnEqual = document.querySelector("button[data-equal]");
const btnClear = document.querySelector("button[data-clear]");
const btnBackspace = document.querySelector("button[data-backspace]");
const digitButtons = document.querySelectorAll("button[data-digit]");
const operatorButtons = document.querySelectorAll("button[data-operator]");
const allButtons = document.querySelectorAll("button");
const btnMinus = document.querySelector("button[data-minus]");
const btnInvert = document.querySelector("button[data-invert]");

const MAX_DIGITS = 10;

btnBackspace.addEventListener("click", deleteDigit);
btnClear.addEventListener("click", clearDisplay);
btnEqual.addEventListener("click", enterEqual);
btnInvert.addEventListener("click", invertSign);
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
  console.log({ number1: numberTop, number2: numberBot, operator });
  divTopDisplay.textContent =
    numberTop === null ? "" : `${numberTop} ${operator}`;

  let sign = isNegative ? "-" : "";
  divBotDisplay.textContent = numberBot === null ? sign : `${numberBot}`;
}

function calculate() {
  let result = operate(numberTop, numberBot, operator);
  let integerDigits = Math.round(result).toString().length;
  if (integerDigits > MAX_DIGITS) {
    return 9_999_999_999;
  }
  let decimalDigits = Math.max(0, 9 - integerDigits);
  return round(result, decimalDigits);
}
