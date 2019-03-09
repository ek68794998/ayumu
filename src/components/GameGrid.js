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
        let gridData = this.state.data;

        const value = gridData[rowIndex][columnIndex];
        const isClickSuccess = value && value === this.previousGridClickValue + 1;

        if (isClickSuccess) {
            gridData[rowIndex][columnIndex] = null;

            const solved = gridData.every((row) => {
                return row.every((cell) => !cell);
            });

            if (solved) {
                console.log("SOLVED!");

                this.gameMode.resetGrid();
                gridData = this.gameMode.gridData;
                this.previousGridClickValue = 0;
            } else {
                console.log("One step closer...");
                this.previousGridClickValue = value;
            }

            this.setState(() => ({
                data: gridData,
            }));
        } else {
            console.log("Incorrect choice:", value || "None");
        }
    }

    render() {
        const grid = this.state.data.map((row, rowIndex) => {
            const columns = row.map((cell, columnIndex) => {
                return (
                    <td key={columnIndex}>
                        <div className="GameGrid-cell" onClick={() => this.onCellClicked(rowIndex, columnIndex)}>{cell || NBSP}</div>
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