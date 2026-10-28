const draggableElement = document.querySelectorAll('.piece');
const droppableElement = document.querySelectorAll('.cell');

let currentPlayer = 'X';
let gameOver = false;
let scoreX = 0;
let scoreO = 0;
let draws = 0;
let selectedPiece = null;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// DRAG START
draggableElement.forEach(element => {
    element.addEventListener('dragstart', event => {
        if (gameOver || element.id !== currentPlayer) {
            event.preventDefault();
            return;
        }

        selectedPiece = element.id;
        event.dataTransfer.setData('text/plain', element.id);
    });

    // TAP X OR O
    element.addEventListener('click', () => {
        if (gameOver || element.id !== currentPlayer) return;

        selectedPiece = element.id;
       document.getElementById('turn').innerText =
      `Player ${currentPlayer}: Choose a box;`
     });

    // TOUCH DRAG FOR MOBILE
    element.addEventListener('touchstart', event => {
        if (gameOver || element.id !== currentPlayer) return;

        selectedPiece = element.id;
        element.dataset.touchDrag = 'true';
    }, { passive: true });

    element.addEventListener('touchend', event => {
        if (!selectedPiece || gameOver) return;

        const touch = event.changedTouches[0];
        const target = document.elementFromPoint(
            touch.clientX,
            touch.clientY
        );

        const cell = target ? target.closest('.cell') : null;

        if (cell) {
            playMove(selectedPiece, cell);
        }

        element.dataset.touchDrag = '';
    });
});

// DROP AND DRAGOVER
droppableElement.forEach(cell => {
    cell.addEventListener('dragover', event => {
        event.preventDefault();
        cell.classList.add('over');
    });

    cell.addEventListener('dragleave', () => {
        cell.classList.remove('over');
    });

    cell.addEventListener('drop', event => {
        event.preventDefault();
        cell.classList.remove('over');

        const piece = event.dataTransfer.getData('text/plain');
        playMove(piece, cell);
    });

    // TAP A BOX ON MOBILE
    cell.addEventListener('click', () => {
        if (selectedPiece) {
            playMove(selectedPiece, cell);
        }
    });
});

// MOVE X OR O INTO THE BOX
function playMove(piece, cell) {
    if (gameOver || !piece || piece !== currentPlayer) return;
    if (cell.innerText !== '') return;

    cell.innerText = piece;
    cell.classList.add(piece.toLowerCase());

    selectedPiece = null;

    if (checkWinner()) {
        gameOver = true;

        if (currentPlayer === 'X') {
            scoreX++;
            document.getElementById('scoreX').innerText = scoreX;
        } else {
            scoreO++;
            document.getElementById('scoreO').innerText = scoreO;
        }

        document.getElementById('result').innerText =
           `Player ${currentPlayer} Wins!;`
        document.getElementById('turn').innerText = 'Game Over!';
        return;
    }

    if ([...droppableElement].every(cell => cell.innerText !== '')) {
        draws++;
        document.getElementById('draws').innerText = draws;
        document.getElementById('result').innerText = "It's a Draw!";
        document.getElementById('turn').innerText = 'Game Over!';
        gameOver = true;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    document.getElementById('turn').innerText =
        `Player ${currentPlayer}'s Turn;`
    document.getElementById('result').innerText = 'Score';
}

// CHECK WINNER
function checkWinner() {
    return winningCombinations.some(combo =>
        combo.every(index =>
            droppableElement[index].innerText === currentPlayer
        )
    );
}

// DRAG END
draggableElement.forEach(element => {
    element.addEventListener('dragend', () => {
        droppableElement.forEach(cell => cell.classList.remove('over'));
    });
});

// RESET
function reset() {
    droppableElement.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o', 'over');
    });

    currentPlayer = 'X';
    gameOver = false;
    selectedPiece = null;

    document.getElementById('turn').innerText = "Player X's Turn";
    document.getElementById('result').innerText = 'Score';
}