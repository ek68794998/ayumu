import React, { Component } from "react";
import "./App.css";

const COLUMN_COUNT = 7;
const ROW_COUNT = 4;

class App extends Component {
    gridData = [];

    constructor(props) {
        super(props);

        for (let i = 0; i < ROW_COUNT; i++) {
            let row = [];

            for (let i = 0; i < COLUMN_COUNT; i++) {
                let cell = Math.round(Math.random() * 100);

                row.push(cell);
            }

            this.gridData.push(row);
        }
    }

    render() {
        console.log(this.gridData);

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
