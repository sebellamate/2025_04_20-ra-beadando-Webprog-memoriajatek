const n = 6, m = 12; 
let fox = {x: n -1, y: m - 1};
let rabbit = {x: randint(0, n-1), y:randint(0, 2)};
let currentlevel = 1;

let board = []; 

const table = document.querySelector("table");

function randint(a, b) {
    return Math.floor(Math.random() * (b-a+1)) + a;
}

function createBoard() {
    board = [];
    for (let i = 0; i < n; i++) {
        row = [];
        for (let j = 0; j < m; j++) {
            const field = "";
            row.push(field);
        }
        board.push(row);
    }
}

function showBoard() {
    table.innerHTML = "";
    for (const row of board) {
        const tr = document.createElement("tr");
        for (const field of row) {
            const td = document.createElement("td");
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function GameStart(){
    createBoard();
    showBoard();
    gomb.disabled = true;
}

const gomb = document.querySelector("button");
gomb.addEventListener("click", GameStart);
