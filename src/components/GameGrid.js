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
        rowCount: ROW_COUNT,
    });

    previousGridClickValue = 0;

    constructor(props) {
        super(props);

        this.gameMode.resetGrid();

        this.state = {
            data: this.gameMode.gridData,
        };
    }

    onCellClicked(rowIndex, columnIndex) {
        this.gameMode.onCellActivated(rowIndex, columnIndex);

        if (this.gameMode.isSolved()) {
            console.log(this.gameMode.events.map((event) => {
                return `[${event.elapsed}] ${event.type} (value=${event.value}, correct=${event.correct}, solved=${event.solved})`;
            }));

            this.gameMode.resetGrid();
        }

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
                    if (cell.solid) {
                        cellValue = NBSP;
                        cellClasses.push("GameGrid-cell-solid");
                    } else if (cell.empty) {
                        cellValue = NBSP;
                    } else {
                        cellValue = cell.value;
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
            <table className="GameGrid-grid">
                <tbody>{grid}</tbody>
            </table>
        );
    }
}