const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const themeBtn = document.getElementById('toggleTheme');
const clickSound = new Audio('assets/click.mp3');

let currentInput = '';
let operator = '';
let operand1 = '';
let resultDisplayed = false;

// Función para dar formato a los números (separadores de miles)
function formatNumber(num) {
  return Number(num).toLocaleString('es-ES');  // Utiliza la configuración regional española para los separadores de miles
}

// Evento para los clics en los botones
buttons.forEach(button => {
  button.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();

    const value = button.textContent;

    handleInput(value);
  });
});

// Escuchar los eventos de las teclas
document.addEventListener('keydown', (event) => {
  const key = event.key;

  // Prevenir la acción predeterminada para teclas no necesarias (como teclas de navegación)
  if (['Backspace', 'Enter', 'Escape'].includes(key)) {
    event.preventDefault();
  }

  // Detectar las teclas numéricas y de operadores
  if (key >= 0 && key <= 9) {
    handleInput(key);
  } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
    handleInput(key);
  } else if (key === 'Backspace') {
    handleInput('←');
  } else if (key === 'Enter' || key === '=') {
    handleInput('=');
  } else if (key === '.') {
    handleInput('.');
  } else if (key === 'Escape') {
    handleInput('C'); // Limpiar la calculadora cuando se presiona Escape
  }
});

// Función para manejar las entradas de teclas o clics
function handleInput(value) {
  if (value === 'C') {
    currentInput = '';
    operator = '';
    operand1 = '';
    resultDisplayed = false;
    display.textContent = '0';
  } else if (value === '←') {
    currentInput = currentInput.slice(0, -1);
    display.textContent = currentInput || '0';
  } else if (value === '%') {
    if (currentInput === '' || operand1 === '') return;  // Si no hay un número para calcular el porcentaje, no hacer nada.
    currentInput = String(parseFloat(currentInput) * (parseFloat(operand1) / 100));
    display.textContent = formatNumber(currentInput);
  } else if (['+', '-', 'x', '/', '*'].includes(value)) {
    if (currentInput === '' && operand1 === '') return;
    if (operand1 && operator && currentInput) {
      operand1 = operate(operand1, currentInput, operator);
      display.textContent = formatNumber(operand1);
    } else {
      operand1 = currentInput;
    }
    
    // Mostrar el operador en el display
    operator = value === 'x' ? '*' : value === '%' ? '/' : value;
    currentInput = '';
    
    // Cambiar el operador por el símbolo correspondiente en el display
    display.textContent = formatNumber(operand1) + " " + operator;
  } else if (value === '=') {
    if (!operand1 || !currentInput || !operator) return;
    const result = operate(operand1, currentInput, operator);
    display.textContent = formatNumber(result);
    currentInput = String(result);
    operand1 = '';
    operator = '';
    resultDisplayed = true;
  } else {
    if (resultDisplayed) {
      currentInput = '';
      resultDisplayed = false;
    }
    if (value === '.' && currentInput.includes('.')) return;
    currentInput += value;
    display.textContent = formatNumber(currentInput);
  }
}

// Función para realizar las operaciones
function operate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);

  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b === 0 ? 'Error' : a / b;
    case '%':
      return a % b;
    default:
      return b;
  }
}

// Cambiar el tema
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeBtn.textContent = document.body.classList.contains('light') ? '🌙 Cambiar tema' : '🌞 Cambiar tema';
});

