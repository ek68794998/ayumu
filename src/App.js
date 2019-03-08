import React, { Component } from "react";
import "./App.css";

const NBSP = String.fromCharCode(160);
const COLUMN_COUNT = 7;
const ROW_COUNT = 4;
const MAX_NUMBER = 9;

class App extends Component {
    previousGridClickValue = 0;

    constructor(props) {
        super(props);

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

        this.state = {
            gridData: gridData,
        };
    }

    onCellClicked(rowIndex, columnIndex) {
        const gridData = this.state.gridData;

        const value = gridData[rowIndex][columnIndex];
        const isClickSuccess = value && value === this.previousGridClickValue + 1;

        if (isClickSuccess) {
            gridData[rowIndex][columnIndex] = null;

            const solved = gridData.every((row) => {
                return row.every((cell) => !cell);
            });

            if (solved) {
                console.log("SOLVED!");
            } else {
                console.log("One step closer...");
            }

            this.setState(() => ({
                gridData: gridData,
            }));

            this.previousGridClickValue = value;
        } else {
            console.log("Incorrect choice:", value || "None");
        }
    }

    render() {
        const grid = this.state.gridData.map((row, rowIndex) => {
            const columns = row.map((cell, columnIndex) => {
                return (
                    <td key={columnIndex}>
                        <div className="App-cell" onClick={() => this.onCellClicked(rowIndex, columnIndex)}>{cell || NBSP}</div>
                    </td>
                );
            });

            return (
                <tr className="App-row" key={rowIndex}>{columns}</tr>
            );
        });

        return (
            <div className="App">
                <div className="App-container">
                    <table className="App-grid">
                        <tbody>{grid}</tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default App;
