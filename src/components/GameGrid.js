import React, { Component } from "react";
import "./GameGrid.css";

import { FlashMemoryMode } from "../game-modes/FlashMemoryMode";

const NBSP = String.fromCharCode(160);
const COLUMN_COUNT = 7;
const ROW_COUNT = 4;
const MAX_NUMBER = 9;

export class GameGrid extends Component {
    gameMode = new FlashMemoryMode({
        columnCount: COLUMN_COUNT,
        maxNumber: MAX_NUMBER,
        numbers: Array(ROW_COUNT * COLUMN_COUNT).fill().map((_, index) => index + 1),
        onFail: () => this.onInvalidNumberClicked(),
        onSolve: () => this.onGameCompletedSuccessfully(),
        onUpdate: () => this.onGameUpdate(),
        rowCount: ROW_COUNT,
        veilDurationMs: 1500,
    });

    previousGridClickValue = 0;

    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };
    }

    newGame() {
        this.gameMode.resetGrid();
    }

    onCellClicked(rowIndex, columnIndex) {
        this.gameMode.onCellActivated(rowIndex, columnIndex);
    }

    onInvalidNumberClicked() {
        this.gameMode.gameOver();

        console.log("Game failed.");
        console.log(this.gameMode.events.map((event) => {
            return `[${event.elapsed}] ${event.type} (value=${event.value}, correct=${event.correct}, solved=${event.solved})`;
        }));
    }

    onGameCompletedSuccessfully() {
        console.log("Game solved!");
        console.log(this.gameMode.events.map((event) => {
            return `[${event.elapsed}] ${event.type} (value=${event.value}, correct=${event.correct}, solved=${event.solved})`;
        }));
    }

    onGameUpdate() {
        this.setState(() => ({
            data: this.gameMode.gridData,
        }));
    }

    render() {
        const grid = this.state.data.map((row, rowIndex) => {
            const columns = row.map((cell, columnIndex) => {
                const cellClasses = [ "GameGrid-cell" ];
                let cellValue = "-";

                if (cell) {
                    if (cell.failed) {
                        cellValue = cell.value;
                        cellClasses.push("GameGrid-cell-failed");
                    } else if (cell.solid) {
                        cellValue = NBSP;
                        cellClasses.push("GameGrid-cell-solid");
                    } else if (cell.empty) {
                        cellValue = NBSP;
                        cellClasses.push("GameGrid-cell-empty");
                    } else {
                        cellValue = cell.value;
                        cellClasses.push("GameGrid-cell-value");
                    }
                }

                return (
                    <td key={columnIndex}>
                        <div className={cellClasses.join(" ")} onClick={() => this.onCellClicked(rowIndex, columnIndex)}>{cellValue}</div>
                    </td>
                );
            });

            return (
                <tr className="GameGrid-row" key={rowIndex}>{columns}</tr>
            );
        });

        return (
            <div className="GameGrid-container">
                <div className="GameGrid-actions">
                    <button onClick={() => this.newGame()}>New game</button>
                </div>
                <table className="GameGrid-grid">
                    <tbody>{grid}</tbody>
                </table>
            </div>
        );
    }
}