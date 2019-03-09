const DEFAULT_OPTIONS = {
    columnCount: 7,
    maxNumber: 9,
    minNumber: 1,
    numbers: [],
    rowCount: 4,
};

export class GridCell {
    empty = false;

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

    isSolved() {
        return !this.sortedNumberSet[this.valuesSolved];
    }

    onCellActivated(rowIndex, columnIndex) {
        const cell = this.gridData[rowIndex][columnIndex];
        const value = cell && cell.value;
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
            }
        }

        event.solved = this.totalNumbers() <= this.valuesSolved;

        this.events.push(event);
    }

    resetGrid() {
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
    }

    totalNumbers() {
        return this.sortedNumberSet.filter((value) => !!value).length;
    }
}