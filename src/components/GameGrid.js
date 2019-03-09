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
        veilDurationMs: 500,
    });

    previousGridClickValue = 0;

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            status: "",
            events: [],
        };
    }

    newGame() {
        this.setState(() => ({
            status: null,
            events: [],
        }));

        this.gameMode.resetGrid();
    }

    onCellClicked(rowIndex, columnIndex) {
        this.gameMode.onCellActivated(rowIndex, columnIndex);
    }

    onInvalidNumberClicked() {
        this.gameMode.gameOver();

        this.setState(() => ({
            status: "Failed",
            events: this.gameMode.getEventsList(),
        }));
    }

    onGameCompletedSuccessfully() {
        this.setState(() => ({
            status: "Completed",
            events: this.gameMode.getEventsList(),
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

        let gameStatus = null;

        if (this.state.status && this.state.status.length) {
            const eventText = this.state.events.map((eventText, eventIndex) => {
                return (
                    <li key={eventIndex}>{eventText}</li>
                );
            });

            gameStatus = (
                <div className="GameGrid-output">
                    <h2 className="GameGrid-status-header">{this.state.status}</h2>
                    <ul className="GameGrid-status-text">{eventText}</ul>
                </div>
            );
        }

        const gridClasses = [ "GameGrid-grid" ];

        if (this.gameMode.enabled) {
            gridClasses.push("GameGrid-grid-active");
        }

        return (
            <div className="GameGrid-container">
                <div className="GameGrid-actions">
                    <button onClick={() => this.newGame()}>New game</button>
                </div>
                <table className={gridClasses.join(" ")}>
                    <tbody>{grid}</tbody>
                </table>
                {gameStatus}
            </div>
        );
    }
}