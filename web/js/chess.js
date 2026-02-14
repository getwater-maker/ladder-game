
// ============================================================
// Chess Game - Elementary Level (AI + PvP)
// ============================================================
import { ref, set, onValue, update, db } from './firebase-config.js';


// Piece SVGs (Luxury Set with Gradients)
const PIECES_SVG = {
    w: {
        K: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
            <defs>
                <linearGradient id="gradWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#fff;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#e0e0e0;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="gradGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#daa520;stop-opacity:1" />
                </linearGradient>
                <filter id="shadow">
                    <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.5)"/>
                </filter>
            </defs>
            <g filter="url(#shadow)">
                <path d="M22.5 11.63V6M20 8h5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22.5 25s4.5-7.5 3-13.5c-3-1.5-6-1.5-6 0-1.5 6 3 13.5 3 13.5z" fill="url(#gradWhite)" stroke="#000" stroke-width="1.5" stroke-linecap="butt"/>
                <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 2-8 2s-4-3-8-3-5 3-8 3-4-3-8-2c-3 6 6 10.5 6 10.5v7z" fill="url(#gradWhite)" stroke="#000" stroke-width="1.5"/>
                <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#000" stroke-width="1.5"/>
                <path d="M22.5 11.63V6M20 8h5" stroke="url(#gradGold)" stroke-width="1"/>
            </g>
        </svg>`,
        Q: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
            <g filter="url(#shadow)">
                <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM10.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM38.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" fill="url(#gradWhite)" stroke="#000" stroke-width="1.5"/>
                <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11z" fill="url(#gradWhite)" stroke="#000" stroke-width="1.5" stroke-linecap="butt"/>
                <path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 12.5 2.5 12.5 2.5s11.5 0 12.5-2.5c1-2 2.5-2 2.5-4zm-1.5 4.5c5.5-3 16.5-3 22 0m-23 3c5.5-3 16.5-3 22 0m-23 3c5.5-3 16.5-3 22 0" stroke="#000" stroke-width="1.5"/>
                <circle cx="24.5" cy="7.5" r="1.5" fill="url(#gradGold)"/>
            </g>
        </svg>`,
        R: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
            <g filter="url(#shadow)">
                <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" fill="url(#gradWhite)" stroke="#000" stroke-width="1.5" stroke-linecap="butt"/>
                <path d="M34 14l-3 3H14l-3-3" stroke="#000" stroke-width="1.5"/>
                <path d="M31 17v12.5c0 1.5.5 2.5 2.5 2.5h-22c2 0 2.5-1 2.5-2.5V17" fill="url(#gradWhite)" stroke="#000" stroke-width="1.5" stroke-linecap="butt"/>
                <path d="M31 29.5c0 1.5-1 4-4 4h-9c-3 0-4-2.5-4-4" stroke="#000" stroke-width="1.5"/>
                <path d="M11 14h23" fill="none" stroke="#000" stroke-width="1.5" stroke-linejoin="miter"/>
            </g>
        </svg>`,
        B: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
            <g filter="url(#shadow)">
                <g fill="url(#gradWhite)" stroke="#000" stroke-width="1.5" stroke-linecap="butt">
                    <path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.38 0 10.11.48 13.5 1.45V32c0-1.54-.78-2.31-2.93-2.91-2.09-.59-4.83-.88-6.07-.88-1.92 0-8.62.29-10.7 2.15C14.7 31.81 14.7 32.5 14.7 34v2H9z"/>
                    <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
                    <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
                </g>
                <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#000" stroke-width="1.5" stroke-linejoin="miter"/>
                <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill="url(#gradGold)" stroke="none"/>
            </g>
        </svg>`,
        N: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
            <g filter="url(#shadow)">
                <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="url(#gradWhite)" stroke="#000" stroke-width="1.5"/>
                <path d="M24 18c.38 2.32-4.68 1.97-5 0 .38-2.32 4.68-1.97 5 0z" fill="#000" stroke="#000" stroke-width="1.5"/>
                <path d="M9.5 25.5A4.5 4.5 0 1 1 5 21a4.5 4.5 0 0 1 4.5 4.5z" fill="url(#gradWhite)" stroke="#000" stroke-width="1.5" stroke-linecap="butt"/>
                <path d="M15 15.5c-1.66 0-3 1.34-3 3 0 1.66 1.34 3 3 3 1.66 0 3-1.34 3-3 0-1.66-1.34-3-3-3z" fill="url(#gradWhite)" stroke="#000" stroke-width="1.5" stroke-linecap="butt"/>
                <path d="M36 15c-1.5 5.5-4.5 10-8 10-2.5 0-4.5-2-4.5-5s2-4.5 4.5-5c1.1 0 2.14.33 3 .9" stroke="#000" stroke-width="1.5"/>
            </g>
        </svg>`,
        P: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
            <g filter="url(#shadow)">
                <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="url(#gradWhite)" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
            </g>
        </svg>`
    },
    b: {
        k: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
            <defs>
                <linearGradient id="gradBlack" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#4a4a4a;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#222;stop-opacity:1" />
                </linearGradient>
                <filter id="shadow">
                    <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.5)"/>
                </filter>
            </defs>
            <g filter="url(#shadow)">
                <path d="M22.5 11.63V6M20 8h5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22.5 25s4.5-7.5 3-13.5c-3-1.5-6-1.5-6 0-1.5 6 3 13.5 3 13.5z" fill="url(#gradBlack)" stroke="#fff" stroke-width="1.5" stroke-linecap="butt"/>
                <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 2-8 2s-4-3-8-3-5 3-8 3-4-3-8-2c-3 6 6 10.5 6 10.5v7z" fill="url(#gradBlack)" stroke="#fff" stroke-width="1.5"/>
                <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff" stroke-width="1.5"/>
            </g>
        </svg>`,
        q: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
            <g filter="url(#shadow)">
                <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM10.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM38.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" fill="url(#gradBlack)" stroke="#fff" stroke-width="1.5"/>
                <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11z" fill="url(#gradBlack)" stroke="#fff" stroke-width="1.5" stroke-linecap="butt"/>
                <path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 12.5 2.5 12.5 2.5s11.5 0 12.5-2.5c1-2 2.5-2 2.5-4zm-1.5 4.5c5.5-3 16.5-3 22 0m-23 3c5.5-3 16.5-3 22 0m-23 3c5.5-3 16.5-3 22 0m-23 3c5.5-3 16.5-3 22 0m-23 3c5.5-3 16.5-3 22 0" stroke="#fff" stroke-width="1.5"/>
            </g>
        </svg>`,
        r: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
            <g filter="url(#shadow)">
                <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" fill="url(#gradBlack)" stroke="#fff" stroke-width="1.5" stroke-linecap="butt"/>
                <path d="M34 14l-3 3H14l-3-3" stroke="#fff" stroke-width="1.5"/>
                <path d="M31 17v12.5c0 1.5.5 2.5 2.5 2.5h-22c2 0 2.5-1 2.5-2.5V17" fill="url(#gradBlack)" stroke="#fff" stroke-width="1.5" stroke-linecap="butt"/>
                <path d="M31 29.5c0 1.5-1 4-4 4h-9c-3 0-4-2.5-4-4" stroke="#fff" stroke-width="1.5"/>
                <path d="M11 14h23" fill="none" stroke="#fff" stroke-width="1.5" stroke-linejoin="miter"/>
            </g>
        </svg>`,
        b: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
            <g filter="url(#shadow)">
                <g fill="url(#gradBlack)" stroke="#fff" stroke-width="1.5" stroke-linecap="butt">
                    <path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.38 0 10.11.48 13.5 1.45V32c0-1.54-.78-2.31-2.93-2.91-2.09-.59-4.83-.88-6.07-.88-1.92 0-8.62.29-10.7 2.15C14.7 31.81 14.7 32.5 14.7 34v2H9z"/>
                    <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
                    <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
                </g>
                <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" stroke-width="1.5" stroke-linejoin="miter"/>
            </g>
        </svg>`,
        n: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
            <g filter="url(#shadow)">
                <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="url(#gradBlack)" stroke="#fff" stroke-width="1.5"/>
                <path d="M24 18c.38 2.32-4.68 1.97-5 0 .38-2.32 4.68-1.97 5 0z" fill="#fff" stroke="#fff" stroke-width="1.5"/>
                <path d="M9.5 25.5A4.5 4.5 0 1 1 5 21a4.5 4.5 0 0 1 4.5 4.5z" fill="url(#gradBlack)" stroke="#fff" stroke-width="1.5" stroke-linecap="butt"/>
                <path d="M15 15.5c-1.66 0-3 1.34-3 3 0 1.66 1.34 3 3 3 1.66 0 3-1.34 3-3 0-1.66-1.34-3-3-3z" fill="url(#gradBlack)" stroke="#fff" stroke-width="1.5" stroke-linecap="butt"/>
                <path d="M36 15c-1.5 5.5-4.5 10-8 10-2.5 0-4.5-2-4.5-5s2-4.5 4.5-5c1.1 0 2.14.33 3 .9" stroke="#fff" stroke-width="1.5"/>
            </g>
        </svg>`,
        p: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
            <g filter="url(#shadow)">
                <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="url(#gradBlack)" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
            </g>
        </svg>`
    }
};

function getPieceSVG(pieceChar) {
    if (!pieceChar) return '';
    const color = pieceChar === pieceChar.toUpperCase() ? 'w' : 'b';
    return PIECES_SVG[color][pieceChar] || '';
}

// Piece values for AI evaluation
const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

// Initial board: row 0 = black back rank (top), row 7 = white back rank (bottom)
const INITIAL_BOARD = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

// ============================================================
// Game State
// ============================================================
let chess = {
    board: [],
    turn: 'w',
    mode: 'ai',            // 'ai' or 'pvp'
    aiLevel: 1,             // 1, 2, 3
    selectedSquare: null,
    validMoves: [],
    lastMove: null,
    capturedWhite: [],
    capturedBlack: [],
    moveHistory: [],
    gameOver: false,
    isThinking: false
};

// ============================================================
// Helpers
// ============================================================
function isWhitePiece(p) { return p !== null && p === p.toUpperCase(); }
function isBlackPiece(p) { return p !== null && p === p.toLowerCase(); }
function isOwn(p, color) { return color === 'w' ? isWhitePiece(p) : isBlackPiece(p); }
function isEnemy(p, color) { return p !== null && !isOwn(p, color); }
function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function copyBoard(board) { return board.map(row => [...row]); }

// ============================================================
// Move Generation (pseudo-legal)
// ============================================================
function generateMoves(board, color) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (!piece || !isOwn(piece, color)) continue;
            const type = piece.toLowerCase();
            const from = { row: r, col: c };

            if (type === 'p') {
                const dir = color === 'w' ? -1 : 1;
                const startRow = color === 'w' ? 6 : 1;
                if (inBounds(r + dir, c) && !board[r + dir][c]) {
                    moves.push({ from, to: { row: r + dir, col: c } });
                    if (r === startRow && !board[r + 2 * dir][c]) {
                        moves.push({ from, to: { row: r + 2 * dir, col: c } });
                    }
                }
                for (const dc of [-1, 1]) {
                    const nr = r + dir, nc = c + dc;
                    if (inBounds(nr, nc) && board[nr][nc] && isEnemy(board[nr][nc], color)) {
                        moves.push({ from, to: { row: nr, col: nc } });
                    }
                }
            } else if (type === 'n') {
                const jumps = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
                for (const [dr, dc] of jumps) {
                    const nr = r + dr, nc = c + dc;
                    if (inBounds(nr, nc) && !isOwn(board[nr][nc], color)) {
                        moves.push({ from, to: { row: nr, col: nc } });
                    }
                }
            } else if (type === 'b') {
                for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
                    slideMoves(board, color, from, dr, dc, moves);
                }
            } else if (type === 'r') {
                for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                    slideMoves(board, color, from, dr, dc, moves);
                }
            } else if (type === 'q') {
                for (const [dr, dc] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
                    slideMoves(board, color, from, dr, dc, moves);
                }
            } else if (type === 'k') {
                for (const [dr, dc] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
                    const nr = r + dr, nc = c + dc;
                    if (inBounds(nr, nc) && !isOwn(board[nr][nc], color)) {
                        moves.push({ from, to: { row: nr, col: nc } });
                    }
                }
            }
        }
    }
    return moves;
}

function slideMoves(board, color, from, dr, dc, moves) {
    let r = from.row + dr, c = from.col + dc;
    while (inBounds(r, c)) {
        if (board[r][c]) {
            if (isEnemy(board[r][c], color)) {
                moves.push({ from, to: { row: r, col: c } });
            }
            break;
        }
        moves.push({ from, to: { row: r, col: c } });
        r += dr;
        c += dc;
    }
}

// ============================================================
// Check Detection
// ============================================================
function findKing(board, color) {
    const king = color === 'w' ? 'K' : 'k';
    for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++)
            if (board[r][c] === king) return { row: r, col: c };
    return null;
}

function isKingInCheck(board, color) {
    const kingPos = findKing(board, color);
    if (!kingPos) return false;
    const enemy = color === 'w' ? 'b' : 'w';
    const enemyMoves = generateMoves(board, enemy);
    return enemyMoves.some(m => m.to.row === kingPos.row && m.to.col === kingPos.col);
}

// ============================================================
// Legal Move Generation
// ============================================================
function applyMoveToBoard(board, move) {
    const piece = board[move.from.row][move.from.col];
    board[move.to.row][move.to.col] = piece;
    board[move.from.row][move.from.col] = null;
    if (piece === 'P' && move.to.row === 0) board[move.to.row][move.to.col] = 'Q';
    if (piece === 'p' && move.to.row === 7) board[move.to.row][move.to.col] = 'q';
}

function generateLegalMoves(board, color) {
    const pseudo = generateMoves(board, color);
    return pseudo.filter(move => {
        const test = copyBoard(board);
        applyMoveToBoard(test, move);
        return !isKingInCheck(test, color);
    });
}

// ============================================================
// Game Status
// ============================================================
function getGameStatus(board, color) {
    const legal = generateLegalMoves(board, color);
    const inCheck = isKingInCheck(board, color);
    if (legal.length === 0) {
        return inCheck ? 'checkmate' : 'stalemate';
    }
    return inCheck ? 'check' : 'playing';
}

// ============================================================
// Move Execution
// ============================================================
function makeChessMove(from, to) {
    const piece = chess.board[from.row][from.col];
    const captured = chess.board[to.row][to.col];

    chess.moveHistory.push({
        from: { row: from.row, col: from.col },
        to: { row: to.row, col: to.col },
        piece, captured, promoted: false
    });

    if (captured) {
        if (isWhitePiece(captured)) chess.capturedWhite.push(captured);
        else chess.capturedBlack.push(captured);
    }

    chess.board[to.row][to.col] = piece;
    chess.board[from.row][from.col] = null;

    if (piece === 'P' && to.row === 0) {
        chess.board[to.row][to.col] = 'Q';
        chess.moveHistory[chess.moveHistory.length - 1].promoted = true;
    }
    if (piece === 'p' && to.row === 7) {
        chess.board[to.row][to.col] = 'q';
        chess.moveHistory[chess.moveHistory.length - 1].promoted = true;
    }

    chess.lastMove = { from, to };
    chess.turn = chess.turn === 'w' ? 'b' : 'w';
}

function undoSingleMove() {
    const move = chess.moveHistory.pop();
    if (!move) return;

    chess.board[move.from.row][move.from.col] = move.piece;
    chess.board[move.to.row][move.to.col] = move.captured;

    if (move.captured) {
        if (isWhitePiece(move.captured)) {
            const idx = chess.capturedWhite.lastIndexOf(move.captured);
            if (idx !== -1) chess.capturedWhite.splice(idx, 1);
        } else {
            const idx = chess.capturedBlack.lastIndexOf(move.captured);
            if (idx !== -1) chess.capturedBlack.splice(idx, 1);
        }
    }

    chess.turn = chess.turn === 'w' ? 'b' : 'w';
    chess.lastMove = chess.moveHistory.length > 0
        ? {
            from: chess.moveHistory[chess.moveHistory.length - 1].from,
            to: chess.moveHistory[chess.moveHistory.length - 1].to
        }
        : null;
}

// ============================================================
// AI (Easy - for elementary students)
// ============================================================
function evaluateBoard(board) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (!piece) continue;
            const val = PIECE_VALUES[piece.toLowerCase()];
            const centerBonus = (3.5 - Math.abs(c - 3.5)) * 5 + (3.5 - Math.abs(r - 3.5)) * 3;
            if (isBlackPiece(piece)) {
                score += val + centerBonus;
            } else {
                score -= val + centerBonus;
            }
        }
    }
    return score;
}

function aiSelectMove() {
    const legalMoves = generateLegalMoves(chess.board, 'b');
    if (legalMoves.length === 0) return null;

    const level = chess.aiLevel;

    // Level 1: 거의 랜덤, 가끔 좋은 수
    if (level === 1) {
        // 60% 완전 랜덤
        if (Math.random() < 0.6) {
            return legalMoves[Math.floor(Math.random() * legalMoves.length)];
        }
        // 40% 상위 5개 중 랜덤
        const evaluated = legalMoves.map(move => {
            const test = copyBoard(chess.board);
            applyMoveToBoard(test, move);
            return { move, score: evaluateBoard(test) };
        });
        evaluated.sort((a, b) => b.score - a.score);
        const topN = Math.min(5, evaluated.length);
        return evaluated[Math.floor(Math.random() * topN)].move;
    }

    // Level 2: 가끔 랜덤, 보통 괜찮은 수
    if (level === 2) {
        // 25% 완전 랜덤
        if (Math.random() < 0.25) {
            return legalMoves[Math.floor(Math.random() * legalMoves.length)];
        }
        // 75% 상위 3개 중 랜덤
        const evaluated = legalMoves.map(move => {
            const test = copyBoard(chess.board);
            applyMoveToBoard(test, move);
            return { move, score: evaluateBoard(test) };
        });
        evaluated.sort((a, b) => b.score - a.score);
        const topN = Math.min(3, evaluated.length);
        return evaluated[Math.floor(Math.random() * topN)].move;
    }

    // Level 3: 대부분 좋은 수, 2수 앞을 봄
    // 10% 랜덤
    if (Math.random() < 0.1) {
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }
    // 90% 2수 앞까지 평가
    const evaluated = legalMoves.map(move => {
        const test = copyBoard(chess.board);
        applyMoveToBoard(test, move);
        // 상대(흰색) 최선의 응수를 고려
        const opponentMoves = generateLegalMoves(test, 'w');
        let worstForBlack = evaluateBoard(test);
        for (const opp of opponentMoves) {
            const test2 = copyBoard(test);
            applyMoveToBoard(test2, opp);
            const score = evaluateBoard(test2);
            if (score < worstForBlack) worstForBlack = score;
        }
        return { move, score: worstForBlack };
    });
    evaluated.sort((a, b) => b.score - a.score);
    // 상위 2개 중 랜덤 (약간의 변화)
    const topN = Math.min(2, evaluated.length);
    return evaluated[Math.floor(Math.random() * topN)].move;
}

// ============================================================
// Board Rendering
// ============================================================
function ensureSVGDefs() {
    if (document.getElementById('chess-svg-defs')) return;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.id = 'chess-svg-defs';
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML = `<defs>
        <linearGradient id="gradWhite" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e0e0e0;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="gradGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#daa520;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="gradBlack" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4a4a4a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#222;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
            <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
    </defs>`;
    document.body.appendChild(svg);
}

function renderChessBoard() {
    ensureSVGDefs();
    const boardEl = document.getElementById('chess-board');
    boardEl.innerHTML = '';

    // Board border check effect
    const inCheckNow = (chess.turn === 'w' && isKingInCheck(chess.board, 'w')) ||
        (chess.turn === 'b' && isKingInCheck(chess.board, 'b'));
    if (inCheckNow && !chess.gameOver) {
        boardEl.classList.add('board-in-check');
    } else {
        boardEl.classList.remove('board-in-check');
    }

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div');
            sq.className = 'chess-square ' + ((r + c) % 2 === 0 ? 'light' : 'dark');

            // Last move highlight
            if (chess.lastMove) {
                const lm = chess.lastMove;
                if ((r === lm.from.row && c === lm.from.col) ||
                    (r === lm.to.row && c === lm.to.col)) {
                    sq.classList.add('last-move');
                }
            }

            // Selected
            if (chess.selectedSquare &&
                chess.selectedSquare.row === r && chess.selectedSquare.col === c) {
                sq.classList.add('selected');
            }

            // Valid moves & Captures
            const isValid = chess.validMoves.some(m => m.row === r && m.col === c);
            if (isValid) {
                // If there's a piece, it's a capture
                if (chess.board[r][c]) {
                    sq.classList.add('valid-capture');
                } else {
                    sq.classList.add('valid-move');
                }
            }

            // Check highlight on king
            if (chess.board[r][c] === 'K' && chess.turn === 'w' && isKingInCheck(chess.board, 'w')) {
                sq.classList.add('in-check');
            }
            if (chess.board[r][c] === 'k' && chess.turn === 'b' && isKingInCheck(chess.board, 'b')) {
                sq.classList.add('in-check');
            }

            // Piece
            if (chess.board[r][c]) {
                const pieceDiv = document.createElement('div');
                pieceDiv.className = 'chess-piece';
                pieceDiv.innerHTML = getPieceSVG(chess.board[r][c]);

                // Animation for just moved piece
                if (chess.lastMove && chess.lastMove.to.row === r && chess.lastMove.to.col === c) {
                    pieceDiv.classList.add('piece-landed');
                }

                sq.appendChild(pieceDiv);
            }

            // Click
            const row = r, col = c;
            sq.addEventListener('click', () => onChessSquareClick(row, col));
            boardEl.appendChild(sq);
        }
    }

    // Captured pieces - Use SVGs
    const capBlackEl = document.getElementById('chess-captured-black');
    capBlackEl.innerHTML = '';
    chess.capturedBlack.forEach(p => {
        const d = document.createElement('div');
        d.className = 'captured-piece';
        d.innerHTML = getPieceSVG(p);
        capBlackEl.appendChild(d);
    });

    const capWhiteEl = document.getElementById('chess-captured-white');
    capWhiteEl.innerHTML = '';
    chess.capturedWhite.forEach(p => {
        const d = document.createElement('div');
        d.className = 'captured-piece';
        d.innerHTML = getPieceSVG(p);
        capWhiteEl.appendChild(d);
    });
}

// ============================================================
// Click Handling
// ============================================================
function onChessSquareClick(row, col) {
    if (chess.gameOver || chess.isThinking) return;

    // In AI mode, only allow clicks on white's turn
    if (chess.mode === 'ai' && chess.turn !== 'w') return;

    const piece = chess.board[row][col];

    if (chess.selectedSquare) {
        const isValid = chess.validMoves.some(m => m.row === row && m.col === col);

        if (isValid) {
            makeChessMove(chess.selectedSquare, { row, col });
            chess.selectedSquare = null;
            chess.validMoves = [];
            renderChessBoard();
            updateChessStatus();

            // AI mode: trigger AI response
            if (chess.mode === 'ai' && !chess.gameOver) {
                chess.isThinking = true;
                updateChessStatus();
                setTimeout(() => {
                    const aiMove = aiSelectMove();
                    if (aiMove) makeChessMove(aiMove.from, aiMove.to);
                    chess.isThinking = false;
                    renderChessBoard();
                    updateChessStatus();
                }, 500); // Slightly longer delay for natural feel
            }
            return;
        }

        // Click own piece: reselect
        if (piece && isOwn(piece, chess.turn)) {
            selectPiece(row, col);
            return;
        }

        // Deselect
        chess.selectedSquare = null;
        chess.validMoves = [];
        renderChessBoard();
        return;
    }

    // Select own piece
    if (piece && isOwn(piece, chess.turn)) {
        selectPiece(row, col);
    }
}

function selectPiece(row, col) {
    chess.selectedSquare = { row, col };
    chess.validMoves = generateLegalMoves(chess.board, chess.turn)
        .filter(m => m.from.row === row && m.from.col === col)
        .map(m => m.to);
    renderChessBoard();
}

// ============================================================
// Status & Game Over
// ============================================================
function updateChessStatus() {
    const statusEl = document.getElementById('chess-status');

    if (chess.isThinking) {
        statusEl.textContent = '🤔 컴퓨터가 생각 중...';
        statusEl.className = 'chess-status';
        return;
    }

    const status = getGameStatus(chess.board, chess.turn);
    const levelNames = { 1: '🐣', 2: '🐥', 3: '🦅' };
    const levelTag = chess.mode === 'ai' ? ` [Lv.${chess.aiLevel}${levelNames[chess.aiLevel] || ''}]` : '';
    const whiteName = chess.mode === 'ai' ? '당신' : '흰색';
    const blackName = chess.mode === 'ai' ? `컴퓨터${levelTag}` : '검은색';

    switch (status) {
        case 'checkmate':
            chess.gameOver = true;
            if (chess.turn === 'b') {
                statusEl.textContent = chess.mode === 'ai'
                    ? '🎉 축하합니다! 이겼어요!'
                    : '🎉 흰색이 이겼어요!';
                showChessGameOver(
                    chess.mode === 'ai' ? '🏆 승리!' : '🏆 흰색 승리!',
                    chess.mode === 'ai' ? '정말 잘했어요!' : '흰색 플레이어가 이겼습니다!'
                );
            } else {
                statusEl.textContent = chess.mode === 'ai'
                    ? '😢 컴퓨터가 이겼어요'
                    : '🎉 검은색이 이겼어요!';
                showChessGameOver(
                    chess.mode === 'ai' ? '😢 패배' : '🏆 검은색 승리!',
                    chess.mode === 'ai' ? '다시 도전해 보세요!' : '검은색 플레이어가 이겼습니다!'
                );
            }
            statusEl.className = 'chess-status';
            break;
        case 'stalemate':
            chess.gameOver = true;
            statusEl.textContent = '🤝 무승부입니다!';
            showChessGameOver('🤝 무승부!', '잘 싸웠어요!');
            statusEl.className = 'chess-status';
            break;
        case 'check':
            statusEl.textContent = chess.turn === 'w'
                ? `⚠️ 체크! ${whiteName}의 왕을 지키세요!`
                : `⚠️ 체크! ${blackName}의 왕이 위험해요`;
            statusEl.className = 'chess-status check';
            showCheckAlert();
            break;
        default:
            statusEl.textContent = chess.turn === 'w'
                ? `${whiteName}의 차례입니다 (흰색)`
                : `${blackName}의 차례입니다 (검은색)`;
            statusEl.className = 'chess-status';
    }
}

function showCheckAlert() {
    const boardContainer = document.querySelector('.chess-board-container');
    // Remove any existing alert
    const existing = boardContainer.querySelector('.check-alert-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'check-alert-overlay';
    overlay.innerHTML = '<div class="check-alert-text">체크!</div>';
    boardContainer.style.position = 'relative';
    boardContainer.appendChild(overlay);

    // Auto-remove after animation
    setTimeout(() => {
        if (overlay.parentNode) overlay.remove();
    }, 1900);
}

function showChessGameOver(title, subtitle) {
    const chessGameArea = document.getElementById('chess-game-area');
    const existing = document.getElementById('chess-game-over');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'chess-game-over';
    overlay.id = 'chess-game-over';
    overlay.innerHTML = `
        <div class="chess-game-over-content">
            <h2>${title}</h2>
            <p>${subtitle}</p>
            <button class="btn-primary" onclick="chessNewGame()">다시 하기</button>
            <br><br>
            <button class="btn-small" onclick="backToStartFromChess()">처음으로</button>
        </div>
    `;
    chessGameArea.appendChild(overlay);
}

// ============================================================
// Init & Controls
// ============================================================
function showAiLevelSelect() {
    document.getElementById('chess-mode-step').classList.add('hidden');
    document.getElementById('chess-level-step').classList.remove('hidden');
}

function backFromChessStep() {
    const levelStep = document.getElementById('chess-level-step');
    const modeStep = document.getElementById('chess-mode-step');
    // If on level selection, go back to mode selection
    if (!levelStep.classList.contains('hidden')) {
        levelStep.classList.add('hidden');
        modeStep.classList.remove('hidden');
    } else {
        // On mode selection, go back to start
        backToStartFromChess();
    }
}

function initChessGame(mode, level) {
    chess.mode = mode || 'ai';
    chess.aiLevel = level || 1;
    chess.board = INITIAL_BOARD.map(row => [...row]);
    chess.turn = 'w';
    chess.selectedSquare = null;
    chess.validMoves = [];
    chess.lastMove = null;
    chess.capturedWhite = [];
    chess.capturedBlack = [];
    chess.moveHistory = [];
    chess.gameOver = false;
    chess.isThinking = false;

    const overlay = document.getElementById('chess-game-over');
    if (overlay) overlay.remove();

    // Reset level step for next time
    document.getElementById('chess-mode-step').classList.remove('hidden');
    document.getElementById('chess-level-step').classList.add('hidden');

    // Hide mode selection, show game area
    document.getElementById('chess-mode-select').classList.add('hidden');
    document.getElementById('chess-game-area').classList.remove('hidden');

    renderChessBoard();
    updateChessStatus();
}

function chessNewGame() {
    initChessGame(chess.mode, chess.aiLevel);
}

function chessUndo() {
    if (chess.gameOver || chess.isThinking) return;

    if (chess.mode === 'ai') {
        undoSingleMove(); // undo AI
        undoSingleMove(); // undo User
    } else {
        undoSingleMove();
    }
    renderChessBoard();
    updateChessStatus();
}

// ============================================================
// Multiplayer Logic (Firebase)
// ============================================================
// import { ref, set, onValue, update, db } from './firebase-config.js'; // Moved to top

let chessRoomId = 'chess_room_default';
let myColor = 'w';

function initChessMultiplayer() {
    // Only for PvP mode
    if (chess.mode !== 'pvp') return;

    const gameRef = ref(db, `chess/${chessRoomId}`);

    // Listen for updates
    onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Check if board changed
            if (data.board && JSON.stringify(chess.board) !== JSON.stringify(data.board) || chess.turn !== data.turn) {
                // Validate board structure to prevent crashes
                if (Array.isArray(data.board) && data.board.length === 8) {
                    chess.board = data.board.map(row => Array.isArray(row) ? row : Array(8).fill(null));
                } else {
                    // If invalid, don't update local board to avoid crash, or reset?
                    // Let's keep local if remote is weird, or reset if needed.
                    // For now, minimal safety.
                }

                chess.turn = data.turn || 'w';
                chess.lastMove = data.lastMove;
                chess.gameOver = data.gameOver;
                chess.capturedWhite = data.capturedWhite || [];
                chess.capturedBlack = data.capturedBlack || [];

                renderChessBoard();
                updateChessStatus();
            }

        }
    });
}

function sendChessUpdate() {
    if (chess.mode !== 'pvp') return;

    const gameRef = ref(db, `chess/${chessRoomId}`);
    update(gameRef, {
        board: chess.board,
        turn: chess.turn,
        lastMove: chess.lastMove,
        gameOver: chess.gameOver,
        capturedWhite: chess.capturedWhite,
        capturedBlack: chess.capturedBlack,
        timestamp: Date.now()
    });
}


// Override makeChessMove to send updates
const originalMakeChessMove = makeChessMove;
makeChessMove = function (from, to) {
    originalMakeChessMove(from, to);
    sendChessUpdate();
};

/* 
   Note: To fully implement online PvP where players can only move their own color, 
   we would need a "Join Game" screen to assign colors.
   For now, this shared board allows anyone to move any piece (Hotseat style but online synced).
   This is simpler for family usage without complex lobby system.
*/


// ============================================================
// Expose functions
// ============================================================
window.showAiLevelSelect = function () {
    document.getElementById('chess-mode-step').classList.add('hidden');
    document.getElementById('chess-level-step').classList.remove('hidden');
};

window.showChessPvpRoom = function () {
    document.getElementById('chess-mode-step').classList.add('hidden');
    document.getElementById('chess-pvp-step').classList.remove('hidden');
};

window.joinChessRoom = function () {
    const code = document.getElementById('chess-room-code').value.trim();
    if (!code) {
        alert('방 코드를 입력하세요!');
        return;
    }
    chessRoomId = 'chess_room_' + code;
    document.getElementById('chess-pvp-step').classList.add('hidden');
    window.initChessGame('pvp');
};

window.backFromChessStep = function () {
    const levelStep = document.getElementById('chess-level-step');
    const pvpStep = document.getElementById('chess-pvp-step');
    const modeStep = document.getElementById('chess-mode-step');

    // If showing level select or pvp room, go back to mode select
    if (!levelStep.classList.contains('hidden')) {
        levelStep.classList.add('hidden');
        modeStep.classList.remove('hidden');
    } else if (!pvpStep.classList.contains('hidden')) {
        pvpStep.classList.add('hidden');
        modeStep.classList.remove('hidden');
    } else {
        backToStartFromChess();
    }
};

function backToStartFromChess() {
    // Reset all chess sub-steps
    document.getElementById('chess-mode-select').classList.remove('hidden');
    document.getElementById('chess-mode-step').classList.remove('hidden');
    document.getElementById('chess-level-step').classList.add('hidden');
    document.getElementById('chess-pvp-step').classList.add('hidden');
    document.getElementById('chess-game-area').classList.add('hidden');
    document.getElementById('chess-screen').classList.add('hidden');
    document.getElementById('chess-screen').classList.remove('active');

    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('start-screen').classList.add('active');
}

window.initChessGame = initChessGame;
window.chessNewGame = chessNewGame;
window.chessUndo = chessUndo;
window.backToStartFromChess = backToStartFromChess;

// Hook into init for PvP
const originalInit = initChessGame;
window.initChessGame = function (mode, level) {
    originalInit(mode, level);
    if (mode === 'pvp') {
        initChessMultiplayer();
        // Reset DB for new game
        sendChessUpdate();
    }
};
