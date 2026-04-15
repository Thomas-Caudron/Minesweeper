const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const WIDTH = 9;
const HEIGHT = 9;
const MINES = 10;

let grid = [];
let revealed = [];
let mines = [];
let gameOver = false;
let firstMove = true;

function initializeGrid() {
  grid = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(0));
  revealed = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(false));
  mines = [];
  gameOver = false;
  firstMove = true;
}

function placeMines(firstX, firstY) {
  let count = 0;
  while (count < MINES) {
    let x = Math.floor(Math.random() * WIDTH);
    let y = Math.floor(Math.random() * HEIGHT);
    if ((x !== firstX || y !== firstY) && grid[y][x] !== -1) {
      grid[y][x] = -1;
      mines.push([x, y]);
      count++;
    }
  }
}

function calculateNumbers() {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (grid[y][x] === -1) continue;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          let nx = x + dx;
          let ny = y + dy;
          if (nx >= 0 && nx < WIDTH && ny >= 0 && ny < HEIGHT && grid[ny][nx] === -1) {
            count++;
          }
        }
      }
      grid[y][x] = count;
    }
  }
}

function reveal(x, y) {
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT || revealed[y][x]) return;
  revealed[y][x] = true;
  if (grid[y][x] === -1) {
    gameOver = true;
    return;
  }
  if (grid[y][x] === 0) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        reveal(x + dx, y + dy);
      }
    }
  }
}

function printGrid() {
  console.log('  ' + Array.from({length: WIDTH}, (_, i) => i).join(' '));
  for (let y = 0; y < HEIGHT; y++) {
    let row = y + ' ';
    for (let x = 0; x < WIDTH; x++) {
      if (revealed[y][x]) {
        if (grid[y][x] === -1) {
          row += '* ';
        } else {
          row += grid[y][x] + ' ';
        }
      } else {
        row += '. ';
      }
    }
    console.log(row);
  }
}

function checkWin() {
  let revealedCount = 0;
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (revealed[y][x]) revealedCount++;
    }
  }
  return revealedCount === WIDTH * HEIGHT - MINES;
}

function play() {
  initializeGrid();
  printGrid();
  rl.question('Entrez x y (ex: 0 0): ', (input) => {
    let [x, y] = input.trim().split(' ').map(Number);
    if (firstMove) {
      placeMines(x, y);
      calculateNumbers();
      firstMove = false;
    }
    reveal(x, y);
    if (gameOver) {
      console.log('Boom! Vous avez perdu.');
      printGrid();
      rl.close();
      return;
    }
    if (checkWin()) {
      console.log('Félicitations! Vous avez gagné.');
      printGrid();
      rl.close();
      return;
    }
    play();
  });
}

play();
