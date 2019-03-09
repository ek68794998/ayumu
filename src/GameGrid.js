import React, { Component } from "react";
import "./GameGrid.css";

const NBSP = String.fromCharCode(160);
const COLUMN_COUNT = 7;
const ROW_COUNT = 4;
const MAX_NUMBER = 9;

export class GameGrid extends Component {
    previousGridClickValue = 0;

    constructor(props) {
        super(props);

        this.state = {
            data: this.createNewGrid(),
            valuesVisible: true,
        };
    }

    createNewGrid() {
        console.log("Generating new grid...");

        const gridData = [];
        const numberSet = [];

        for (let i = 1; i <= ROW_COUNT * COLUMN_COUNT; i++) {
            numberSet.push(i);
        }

        numberSet.sort(() => 0.5 - Math.random());

        for (let i = 0; i < ROW_COUNT; i++) {
            let row = [];

            for (let j = 0; j < COLUMN_COUNT; j++) {
                let cell = numberSet[j * ROW_COUNT + i];

                if (cell <= MAX_NUMBER) {
                    row.push(cell);
                } else {
                    row.push(null);
                }
            }

            gridData.push(row);
        }

        return gridData;
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

                gridData = this.createNewGrid();
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