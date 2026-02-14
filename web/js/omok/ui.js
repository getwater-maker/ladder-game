import { omokState, OMOK_SIZE } from './state.js';
// Removed circular imports. We will depend on window globals for handlers.


export function renderBoard() {
    const boardEl = document.getElementById('omok-board');
    if (!boardEl) return;

    boardEl.innerHTML = '';

    for (let r = 0; r < OMOK_SIZE; r++) {
        for (let c = 0; c < OMOK_SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = 'omok-cell';

            // Grid Lines
            if (r === 0) cell.classList.add('first-row');
            if (r === OMOK_SIZE - 1) cell.classList.add('last-row');
            if (c === 0) cell.classList.add('first-col');
            if (c === OMOK_SIZE - 1) cell.classList.add('last-col');

            if (omokState.board[r][c]) {
                const piece = document.createElement('div');
                piece.className = `omok-piece omok-${omokState.board[r][c]}`;
                if (omokState.lastMove && omokState.lastMove.r === r && omokState.lastMove.c === c) {
                    piece.classList.add('omok-last-move');
                }
                cell.appendChild(piece);
            }

            cell.onclick = () => {
                if (window.handleOmokClick) window.handleOmokClick(r, c);
            };
            boardEl.appendChild(cell);
        }
    }
}

export function updateStatus() {
    const statusEl = document.getElementById('omok-status');
    if (!statusEl) return;

    if (omokState.gameOver) {
        statusEl.innerText = omokState.winner === 'b' ? '🎉 흑돌 승리!' : '🎉 백돌 승리!';
        statusEl.classList.add('highlight');
        showVictoryModal();
    } else {
        statusEl.innerText = omokState.turn === 'b' ? '⚫ 흑돌 차례' : '⚪ 백돌 차례';
        statusEl.classList.remove('highlight');
    }
}

function showVictoryModal() {
    const modal = document.getElementById('result-modal');
    if (!modal) return;

    const title = document.getElementById('modal-player-name');
    const icon = document.getElementById('modal-result-icon');
    const text = document.getElementById('modal-result-text');
    const btnArea = document.getElementById('modal-btn-area');

    title.innerText = "🏆 게임 종료 🏆";
    icon.innerText = omokState.winner === 'b' ? '⚫' : '⚪';
    text.innerText = omokState.winner === 'b' ? '흑돌 승리!' : '백돌 승리!';
    text.className = 'victory-text';

    // We access global aliases for restart/exit which are mapped in main.js or omok.js checks
    btnArea.innerHTML = `
        <button class="btn-primary" onclick="restartOmok(); document.getElementById('result-modal').classList.add('hidden')">다시 하기</button>
        <button class="btn-secondary" onclick="backToStartFromOmok(); document.getElementById('result-modal').classList.add('hidden')">나가기</button>
    `;

    modal.classList.remove('hidden');
}
