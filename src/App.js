import React, { Component } from "react";
import "./App.css";

const COLUMN_COUNT = 7;
const ROW_COUNT = 4;
const MAX_NUMBER = 9;

class App extends Component {
    gridData = [];

    constructor(props) {
        super(props);

        const numberSet = [];

        for (let i = 1; i <= ROW_COUNT * COLUMN_COUNT; i++) {
            numberSet.push(i);
        }

        numberSet.sort(() => 0.5 - Math.random());

        console.log(numberSet);

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

            this.gridData.push(row);
        }
    }

    render() {
        const grid = this.gridData.map((row) => {
            const columns = row.map((cell) => {
                return (
                    <td>
                        <div class="App-cell">{cell}</div>
                    </td>
                );
            });

            return (
                <tr class="App-row">{columns}</tr>
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
