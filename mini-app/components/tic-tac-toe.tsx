"use client";

import { useState, useEffect } from "react";

export default function TicTacToe() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [winner, setWinner] = useState<string | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);

  const checkWin = (b: string[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, bIdx, c] of lines) {
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
        return b[a];
      }
    }
    if (b.every((v) => v)) return "Draw";
    return null;
  };

  const makeMove = (index: number, player: string) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);
    const win = checkWin(newBoard);
    if (win) setWinner(win);
  };

  const aiMove = () => {
    const emptyIndices = board
      .map((v, i) => (v === "" ? i : null))
      .filter((v): v is number => v !== null);
    if (emptyIndices.length === 0) return;
    const choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    makeMove(choice, "O");
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        aiMove();
        setIsPlayerTurn(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, winner]);

  const handleClick = (index: number) => {
    if (!isPlayerTurn || winner) return;
    makeMove(index, "X");
    setIsPlayerTurn(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">Tic Tac Toe</h2>
      {winner && (
        <div className="text-2xl font-bold">
          {winner === "Draw" ? "It's a draw!" : `${winner} wins!`}
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className="w-20 h-20 border border-gray-300 rounded flex items-center justify-center text-4xl font-bold"
            onClick={() => handleClick(idx)}
          >
            {cell === "X" ? (
              <span className="text-red-600">X</span>
            ) : cell === "O" ? (
              <span className="text-blue-600">O</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
