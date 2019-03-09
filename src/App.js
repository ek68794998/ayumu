import React, { Component } from "react";
import "./App.scss";

import { GameGrid } from "./components/GameGrid";

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-container">
                    <GameGrid />
                </div>
            </div>
        );
    }
}

export default App;
