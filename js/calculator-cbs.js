import { round, operate } from "./math.js";

const divTopDisplay = document.querySelector("#top-display");
const divBotDisplay = document.querySelector("#bot-display");

const MAX_DIGITS = 10;
const MAX_NUMBER = 10 ** MAX_DIGITS - 1;
const MIN_NUMBER = -MAX_NUMBER;

/*
What's shown in the display is determined by these variables.
- The top display shows numberTop and the operator that's gonna be applied.
If numberTop is null, nothing is shown no matter the operator.
- The bot display shows numberBot w/wo a trailing "." or just a "-".
- onlyMinus is for when the screen shows only "-", only happens 
if numberBot is null.
- trailingDot is for cases like "123.", but not "123.4".
*/
let numberTop = null;
let numberBot = null;
let operator = "+";
let hasOnlyMinus = false;
let hasTrailingDot = false;

export function clearDisplay() {
  numberTop = null;
  numberBot = null;
  hasOnlyMinus = false;
  hasTrailingDot = false;
}

export function enterEqual() {
  if (isNull(numberTop)) return;

  if (isNull(numberBot)) {
    numberBot = numberTop;
    numberTop = null;
    return;
  }

  numberBot = calculate();
  numberTop = null;
}

// adds a digit after another, or ".", or empty "".
export function enterDigit(digit) {
  if (isNull(numberBot)) {
    numberBot = +digit;
    if (hasOnlyMinus) {
      hasOnlyMinus = false;
      numberBot *= -1;
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

export function enterDot() {
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
export function deleteRightSymbol() {
  if (isNull(numberBot)) {
    hasOnlyMinus = false;
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
    hasOnlyMinus = true;
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

export function enterOperator(newOperator) {
  if (isNull(numberTop) || isNull(numberBot)) {
    operator = newOperator;
    if (numberBot !== null) {
      numberTop = numberBot;
      numberBot = null;
    }
    return;
  }

  numberTop = calculate();
  numberBot = null;
  operator = newOperator;
}

export function toggleLeadingMinus() {
  if (isNull(numberTop) && isNull(numberBot)) {
    hasOnlyMinus = !hasOnlyMinus;
  }
}

export function invertNumberBotSign() {
  if (isNull(numberBot)) {
    hasOnlyMinus = !hasOnlyMinus;
    return;
  }

  numberBot *= -1;
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

export function updateDisplay() {
  divTopDisplay.textContent = getTopDisplayString();
  divBotDisplay.textContent = getBotDisplayString();
}

function getTopDisplayString() {
  let operator_ = operator;
  operator_ = operator_ === "-" ? "−" : operator_;
  operator_ = operator_ === "*" ? "×" : operator_;
  operator_ = operator_ === "/" ? "÷" : operator_;
  return isNull(numberTop) ? "" : `${numberTop} ${operator_}`;
}

function getBotDisplayString() {
  if (isNull(numberBot)) {
    return hasOnlyMinus ? "-" : "";
  }

  let trailigDot = hasTrailingDot ? "." : "";
  let overflowSign = "";
  overflowSign = numberBot === MAX_NUMBER ? "≥ " : overflowSign;
  overflowSign = numberBot === MIN_NUMBER ? "≤" : overflowSign;
  return `${overflowSign}${numberBot}${trailigDot}`;
}

function isNull(x) {
  return x === null;
}
