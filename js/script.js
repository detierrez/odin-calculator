import { round, operate } from "./math.js";
const log = console.log.bind(console);

const divTopDisplay = document.querySelector("#top-display");
const divBotDisplay = document.querySelector("#bot-display");
const btnBackspace = document.querySelector("button[data-backspace]");
const btnInvert = document.querySelector("button[data-invert]");
const btnClear = document.querySelector("button[data-clear]");
const btnEqual = document.querySelector("button[data-equal]");
const btnMinus = document.querySelector("button[data-minus]");
const btnDot = document.querySelector("button[data-dot]");
const operatorButtons = document.querySelectorAll("button[data-operator]");
const digitButtons = document.querySelectorAll("button[data-digit]");
const allButtons = document.querySelectorAll("button");

const MAX_DIGITS = 10;
const MAX_NUMBER = 10 ** MAX_DIGITS - 1;
const MIN_NUMBER = -MAX_NUMBER;

btnBackspace.addEventListener("click", deleteRightSymbol);
btnInvert.addEventListener("click", invertNumberBotSign);
btnMinus.addEventListener("click", toggleLeadingMinus);
btnClear.addEventListener("click", clearDisplay);
btnEqual.addEventListener("click", enterEqual);
btnDot.addEventListener("click", enterDot);
operatorButtons.forEach((btn) => {
  btn.addEventListener("click", enterOperator);
});
digitButtons.forEach((btn) => {
  btn.addEventListener("click", enterDigit);
});
allButtons.forEach((btn) => {
  btn.addEventListener("click", updateDisplay);
});

let numberTop = null;
let numberBot = null;
let operator = "+";
let hasLeadingMinus = false;
let hasTrailingDot = false;

updateDisplay();

function clearDisplay() {
  numberTop = null;
  numberBot = null;
  hasLeadingMinus = false;
}

function enterDigit(event) {
  let digit = event.target.textContent;
  if (isNull(numberBot)) {
    numberBot = +digit;
    if (hasLeadingMinus) {
      numberBot *= -1;
      hasLeadingMinus = false;
    }
    return;
  }

  let strNumber = numberBot.toString();
  let signAdjust = strNumber[0] === "-" ? 1 : 0;
  if (strNumber.length < MAX_DIGITS + signAdjust) {
    numberBot = +(strNumber + (hasTrailingDot ? "." : "") + digit);
    hasTrailingDot = false;
  }
}

function enterDot() {
  if (isNull(numberBot)) {
    numberBot = 0;
    hasTrailingDot = true;
    return;
  }

  if (numberBot.toString().includes(".")) {
    return;
  }

  hasTrailingDot = true;
}

// deletes the right symbol in the bottom display. Could be a digit, "." or "-";
function deleteRightSymbol() {
  if (isNull(numberBot)) {
    hasLeadingMinus = false;
    return;
  }

  if (hasTrailingDot) {
    hasTrailingDot = false;
    return;
  }

  let slicedNumber = numberBot.toString().slice(0, -1);

  if (slicedNumber === "") {
    numberBot = null;
    return;
  }

  if (slicedNumber === "-") {
    hasLeadingMinus = true;
    numberBot = null;
    return;
  }

  if (slicedNumber.slice(-1) === ".") {
    hasTrailingDot = true;
    numberBot = +slicedNumber.slice(0, -1);
    return;
  }

  numberBot = +slicedNumber;
}

function enterEqual() {
  if (isNull(numberTop)) return;

  if (isNull(numberBot)) {
    numberBot = numberTop;
    numberTop = null;
    return;
  }

  numberBot = calculate();
  numberTop = null;
}

function enterOperator(event) {
  let pressedOperator = event.target.textContent;
  if (isNull(numberTop) || isNull(numberBot)) {
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

function toggleLeadingMinus() {
  if (isNull(numberTop) && isNull(numberBot)) {
    hasLeadingMinus = !hasLeadingMinus;
  }
}

function invertNumberBotSign() {
  if (isNull(numberBot)) {
    hasLeadingMinus = !hasLeadingMinus;
    return;
  }

  numberBot *= -1;
}

function updateDisplay() {
  divTopDisplay.textContent = getTopDisplayString();
  divBotDisplay.textContent = getBotDisplayString();
}

function getTopDisplayString() {
  return isNull(numberTop) ? "" : `${numberTop} ${operator}`;
}

function getBotDisplayString() {
  if (isNull(numberBot)) {
    return hasLeadingMinus ? "-" : "";
  }

  let trailigDot = hasTrailingDot ? "." : "";
  let overflowSign = "";
  overflowSign = numberBot === MAX_NUMBER ? "≥ " : overflowSign;
  overflowSign = numberBot === MIN_NUMBER ? "≤" : overflowSign;
  return `${overflowSign}${numberBot}${trailigDot}`;
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

function isNull(x) {
  return x === null;
}
