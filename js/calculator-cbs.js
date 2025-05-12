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
let operator = "+";
let numberTop = null;
let numberBot = null;
let isOnlyMinus = false;
let hasTrailingDot = false;

export function clearDisplay() {
  setNumberTop(null);
  setNumberBot(null);
}

function setNumberTop(n) {
  numberTop = n;
}

function setNumberBot(n) {
  numberBot = n;
  isOnlyMinus = false;
  hasTrailingDot = false;
}

export function enterEqual() {
  if (isNull(numberTop)) return;

  if (isNull(numberBot)) {
    setNumberBot(numberTop);
    setNumberTop(null);
    return;
  }

  setNumberBot(calculate());
  setNumberTop(null);
}

// adds a digit after another digit, "." or empty "".
export function enterDigit(digit) {
  if (isNull(numberBot)) {
    let sign = isOnlyMinus ? "-" : "";
    setNumberBot(+`${sign}${digit}`);
    return;
  }

  if (numberBot === "💀") {
    setNumberBot(null);
    return;
  }

  let strNumber = numberBot.toString();
  let signAdjust = strNumber[0] === "-" ? 1 : 0;
  if (strNumber.length < MAX_DIGITS + signAdjust) {
    let dot = hasTrailingDot ? "." : "";
    setNumberBot(+`${strNumber}${dot}${digit}`);
  }
}

export function enterDot() {
  if (isNull(numberBot)) {
    setNumberBot(0);
    hasTrailingDot = true;
    return;
  }

  if (numberBot === "💀") {
    setNumberBot(null);
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
    isOnlyMinus = false;
    return;
  }
  
  if (numberBot === "💀") {
    setNumberBot(null);
    return;
  }

  if (hasTrailingDot) {
    hasTrailingDot = false;
    return;
  }

  let slicedNumber = numberBot.toString().slice(0, -1);

  if (slicedNumber === "") {
    setNumberBot(null);
    return;
  }

  if (slicedNumber === "-") {
    setNumberBot(null);
    isOnlyMinus = true;
    return;
  }

  if (slicedNumber.slice(-1) === ".") {
    setNumberBot(+slicedNumber.slice(0, -1));
    hasTrailingDot = true;
    return;
  }

  setNumberBot(+slicedNumber);
}

export function enterOperator(newOperator) {
  if (isNull(numberTop) || isNull(numberBot)) {
    operator = newOperator;
    hasTrailingDot = false;
    if (numberBot !== null) {
      setNumberTop(numberBot);
      setNumberBot(null);
    }
    return;
  }

  setNumberTop(calculate());
  setNumberBot(null);
  operator = newOperator;
}

export function toggleLeadingMinus() {
  if (isNull(numberTop) && isNull(numberBot)) {
    isOnlyMinus = !isOnlyMinus;
  }
}

export function invertNumberBotSign() {
  if (isNull(numberBot)) {
    isOnlyMinus = !isOnlyMinus;
    return;
  }

  if (numberBot === "💀") {
    setNumberBot(null);
    return;
  }

  numberBot *= -1;
}

function calculate() {
  let result = operate(numberTop, numberBot, operator);
  if (isNaN(result)) return "💀";
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
    return isOnlyMinus ? "-" : "";
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
