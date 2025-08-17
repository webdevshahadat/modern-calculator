// script.js
(function(){
  const display = document.getElementById('display');
  const keys = document.querySelector('.keys');

  let first = null;
  let operator = null;
  let waitingForSecond = false;

  function setDisplay(value){
    display.textContent = value;
  }

  function getDisplay(){
    return display.textContent;
  }

  function inputDigit(d){
    const current = getDisplay();
    if (waitingForSecond){
      setDisplay(d);
      waitingForSecond = false;
    } else {
      setDisplay(current === '0' ? d : current + d);
    }
  }

  function inputDecimal(){
    if (waitingForSecond){
      setDisplay('0.');
      waitingForSecond = false;
      return;
    }
    const current = getDisplay();
    if (!current.includes('.')) setDisplay(current + '.');
  }

  function clearAll(){
    first = null;
    operator = null;
    waitingForSecond = false;
    setDisplay('0');
  }

  function toggleSign(){
    const current = getDisplay();
    if (current === '0') return;
    setDisplay(current.startsWith('-') ? current.slice(1) : '-' + current);
  }

  function toPercent(){
    const current = parseFloat(getDisplay());
    setDisplay(String(current / 100));
  }

  function backspace(){
    if (waitingForSecond) return;
    const current = getDisplay();
    if (current.length <= 1 || (current.length === 2 && current.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(current.slice(0, -1));
    }
  }

  function handleOperator(nextOp){
    const current = parseFloat(getDisplay());
    if (first === null){
      first = current;
    } else if (!waitingForSecond){
      first = compute(first, operator, current);
      setDisplay(String(first));
    }
    operator = nextOp;
    waitingForSecond = true;
  }

  function compute(a, op, b){
    switch(op){
      case 'add': return a + b;
      case 'subtract': return a - b;
      case 'multiply': return a * b;
      case 'divide': return b === 0 ? (a >= 0 ? Infinity : -Infinity) : a / b;
      default: return b;
    }
  }

  function equals(){
    if (operator === null || waitingForSecond) return;
    const second = parseFloat(getDisplay());
    const result = compute(first, operator, second);
    setDisplay(String(result));
    first = result;
    operator = null;
    waitingForSecond = false;
  }

  keys.addEventListener('click', (e)=>{
    const btn = e.target.closest('button.key');
    if (!btn) return;

    const val = btn.dataset.value;
    const action = btn.dataset.action;

    if (val !== undefined){
      inputDigit(val);
      return;
    }
    switch(action){
      case 'decimal': inputDecimal(); break;
      case 'clear': clearAll(); break;
      case 'sign': toggleSign(); break;
      case 'percent': toPercent(); break;
      case 'add': handleOperator('add'); break;
      case 'subtract': handleOperator('subtract'); break;
      case 'multiply': handleOperator('multiply'); break;
      case 'divide': handleOperator('divide'); break;
      case 'equals': equals(); break;
    }
  });

  // Keyboard support
  document.addEventListener('keydown', (e)=>{
    const { key } = e;
    if (/^[0-9]$/.test(key)) { inputDigit(key); return; }
    if (key === '.') { inputDecimal(); return; }
    if (key === 'Enter' || key === '=') { e.preventDefault(); equals(); return; }
    if (key === '+' ) { handleOperator('add'); return; }
    if (key === '-' ) { handleOperator('subtract'); return; }
    if (key === '*' ) { handleOperator('multiply'); return; }
    if (key === '/' ) { handleOperator('divide'); return; }
    if (key.toLowerCase() === 'c') { clearAll(); return; }
    if (key === 'Backspace') { backspace(); return; }
  });
})();