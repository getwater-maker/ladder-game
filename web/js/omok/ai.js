import { omokState, OMOK_SIZE } from './state.js';
import { checkWin, isForbidden } from './rules.js';

export function getAiMove() {
    if (omokState.gameOver) return null;

    const level = omokState.level || 1;

    // Level 1-2: Random
    if (level <= 2 && Math.random() < 0.3) {
        return findRandomMove();
    }

    // 1. Check Forced Wins (My 4 -> 5)
    let winMove = findForcedMove('w', 4);
    if (winMove) return winMove;

    // 2. Block Critical Threats (Opp 4 -> 5)
    let blockMove = findForcedMove('b', 4);
    if (blockMove) return blockMove;

    // Level 3+: Check 3s (My 3 -> 4)
    if (level >= 3) {
        let my3 = findForcedMove('w', 3, true);
        if (my3) return my3;

        let block3 = findForcedMove('b', 3, true);
        if (block3) return block3;
    }

    // Heuristic Score
    const moves = [];
    for (let r = 0; r < OMOK_SIZE; r++) {
        for (let c = 0; c < OMOK_SIZE; c++) {
            if (!omokState.board[r][c] && !isForbidden(r, c, 'w')) { // Check rules for AI too? AI is White usually.
                // White doesn't have forbidden moves usually, but if we play Black AI, we should check.
                // Assuming AI is White ('w') in 'ai' mode.

                const score = evaluatePosition(r, c, 'w') + (evaluatePosition(r, c, 'b') * 0.95);
                moves.push({ r, c, score });
            }
        }
    }

    moves.sort((a, b) => b.score - a.score);

    let topN = Math.max(1, 13 - level);
    if (moves.length > 0) {
        const pickIndex = Math.floor(Math.random() * Math.min(topN, moves.length));
        return moves[pickIndex];
    }

    return findRandomMove();
}

function findRandomMove() {
    const empty = [];
    for (let r = 0; r < OMOK_SIZE; r++) {
        for (let c = 0; c < OMOK_SIZE; c++) {
            if (!omokState.board[r][c]) empty.push({ r, c });
        }
    }
    if (empty.length > 0) {
        return empty[Math.floor(Math.random() * empty.length)];
    }
    return null;
}

function findForcedMove(color, count, openEnds = false) {
    for (let r = 0; r < OMOK_SIZE; r++) {
        for (let c = 0; c < OMOK_SIZE; c++) {
            if (!omokState.board[r][c]) {
                // Skip if forbidden for Black AI (if we were black)
                // But AI is White.

                omokState.board[r][c] = color;

                // Simplified "count in a row" check
                const maxCount = getMaxCount(r, c, color);

                // If we need open ends (e.g. open 3), check ends
                let valid = false;
                if (openEnds) {
                    // Simplified: Just check if maxCount matches
                    // A real open-check is expensive here, trust heuristics later.
                    // But for block logic, if it makes 4, we must likely block.
                    if (maxCount >= count) valid = true; // Not strictly 'open' check
                } else {
                    if (maxCount >= count) valid = true;
                }

                omokState.board[r][c] = null;

                if (valid) return { r, c };
            }
        }
    }
    return null;
}

function getMaxCount(r, c, color) {
    let max = 0;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of directions) {
        let count = 1;
        let nr = r + dr, nc = c + dc;
        while (nr >= 0 && nr < OMOK_SIZE && nc >= 0 && nc < OMOK_SIZE && omokState.board[nr][nc] === color) { count++; nr += dr; nc += dc; }
        nr = r - dr; nc = c - dc;
        while (nr >= 0 && nr < OMOK_SIZE && nc >= 0 && nc < OMOK_SIZE && omokState.board[nr][nc] === color) { count++; nr -= dr; nc -= dc; }
        if (count > max) max = count;
    }
    return max;
}

function evaluatePosition(r, c, color) {
    let score = 0;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (const [dr, dc] of directions) {
        let count = 0;
        let open = 0;

        // Forward
        for (let i = 1; i < 5; i++) {
            const nr = r + dr * i, nc = c + dc * i;
            if (nr < 0 || nr >= OMOK_SIZE || nc < 0 || nc >= OMOK_SIZE) break;
            if (omokState.board[nr][nc] === color) count++;
            else if (omokState.board[nr][nc] === null) { open++; break; }
            else break;
        }

        // Backward
        for (let i = 1; i < 5; i++) {
            const nr = r - dr * i, nc = c - dc * i;
            if (nr < 0 || nr >= OMOK_SIZE || nc < 0 || nc >= OMOK_SIZE) break;
            if (omokState.board[nr][nc] === color) count++;
            else if (omokState.board[nr][nc] === null) { open++; break; }
            else break;
        }

        if (count >= 4) score += 10000;
        else if (count === 3 && open >= 1) score += 1000;
        else if (count === 2 && open >= 2) score += 100;
        else if (count === 1) score += 10;

        score += (8 - Math.abs(r - 7) - Math.abs(c - 7));
    }
    return score;
}
