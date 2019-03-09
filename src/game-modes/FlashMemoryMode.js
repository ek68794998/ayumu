const DEFAULT_OPTIONS = {
    columnCount: 7,
    maxNumber: 9,
    minNumber: 1,
    numbers: [],
    onFail: null,
    onSolve: null,
    onUpdate: null,
    rowCount: 4,
    veilDurationMs: 500,
};

export class GridCell {
    empty = false;

    failed = false;

    solid = false;

    value = 0;
}

export class GridEvent {
    correct = false;

    elapsed = 0;

    solved = false;

    type = "";

    value = 0;
}

export class FlashMemoryMode {
    enabled = false;

    events = [];

    gridData = [];

    numberSet = [];

    options = {};

    sortedNumberSet = [];

    startTime = null;

    valuesSolved = 0;

    constructor(customOptions) {
        Object.assign(this.options, DEFAULT_OPTIONS, customOptions);

        if (!this.options.numbers || !this.options.numbers.length) {
            throw new Error("Invalid value for 'options.numbers'.");
        }

        for (let i = 0; i < this.options.rowCount * this.options.columnCount; i++) {
            if (i < this.options.numbers.length
                && this.options.numbers[i] >= this.options.minNumber
                && this.options.numbers[i] <= this.options.maxNumber) {

                this.sortedNumberSet[i] = this.options.numbers[i];
            } else {
                this.sortedNumberSet[i] = null;
            }
        }

        this.sortedNumberSet.sort();
    }

    gameOver() {
        this.gridData.forEach((row) => {
            row.forEach((cell) => {
                if (cell.value && !cell.empty) {
                    cell.failed = true;
                }
            });
        });
    }

    isSolved() {
        return !this.sortedNumberSet[this.valuesSolved];
    }

    onCellActivated(rowIndex, columnIndex) {
        if (!this.enabled) {
            return;
        }

        const cell = this.gridData[rowIndex][columnIndex];

        if (!cell) {
            throw new Error(`Invalid cell object at row ${rowIndex}, cell ${columnIndex}.`);
        }

        if (cell.failed) {
            return;
        }

        let moveIsSolution = false;
        let moveIsIncorrect = false;

        const value = cell.value;
        const expectedValue = this.sortedNumberSet[this.valuesSolved];

        const event = new GridEvent();
        event.type = "select";
        event.elapsed = new Date() - this.startTime;

        if (value && expectedValue) {
            const isCorrect = value === expectedValue;

            event.correct = isCorrect;
            event.value = value;

            if (isCorrect) {
                this.valuesSolved++;
                cell.empty = true;
                cell.solid = false;

                if (this.isSolved()) {
                    moveIsSolution = true;
                }
            } else {
                moveIsIncorrect = true;
            }
        }

        event.solved = this.isSolved();

        this.events.push(event);
        this.options.onUpdate && this.options.onUpdate();

        if (moveIsSolution) {
            this.options.onSolve && this.options.onSolve();
        } else if (moveIsIncorrect) {
            this.options.onFail && this.options.onFail();
        }
    }

    resetGrid() {
        this.enabled = false;
        this.startTime = new Date();

        this.valuesSolved = 0;
        this.events = [];
        this.gridData = [];

        this.numberSet = this.sortedNumberSet.slice();
        this.numberSet.sort(() => 0.5 - Math.random());

        for (let i = 0; i < this.options.rowCount; i++) {
            let row = [];

            for (let j = 0; j < this.options.columnCount; j++) {
                const cell = new GridCell();
                cell.value = this.numberSet[j * this.options.rowCount + i];
                cell.empty = !cell.value;
                cell.solid = false;

                row.push(cell);
            }

            this.gridData.push(row);
        }

        this.options.onUpdate && this.options.onUpdate();

        setTimeout(() => {
            this.gridData.forEach((row) => {
                row.forEach((cell) => {
                    if (cell.value) {
                        cell.solid = true;
                    }
                });
            });

            this.options.onUpdate && this.options.onUpdate();

            this.startTime = new Date();
            this.enabled = true;
        }, this.options.veilDurationMs);
    }

    totalNumbers() {
        return this.sortedNumberSet.filter((value) => !!value).length;
    }
}