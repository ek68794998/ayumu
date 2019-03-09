const DEFAULT_OPTIONS = {
    columnCount: 7,
    maxNumber: 9,
    minNumber: 1,
    numbers: [],
    rowCount: 4,
};

export class FlashMemoryMode {
    gridData = [];

    numberSet = [];

    options = {};

    sortedNumberSet = [];

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

        console.log(this.options);
    }

    isSolved() {
        return !this.sortedNumberSet[this.valuesSolved];
    }

    onCellActivated(rowIndex, columnIndex) {
        const value = this.gridData[rowIndex][columnIndex];
        const expectedValue = this.sortedNumberSet[this.valuesSolved];

        if (expectedValue) {
            const isCorrect = value === expectedValue;

            if (isCorrect) {
                this.valuesSolved++;
                this.gridData[rowIndex][columnIndex] = null;

                console.log("Solved", this.valuesSolved, "of", this.sortedNumberSet.filter((value) => !!value).length, "values.");
            } else {
                console.log("Incorrect choice:", value || "None");
            }
        } else {
            console.log("Already solved.");
        }
    }

    resetGrid() {
        this.valuesSolved = 0;
        this.gridData = [];

        this.numberSet = this.sortedNumberSet.slice();
        this.numberSet.sort(() => 0.5 - Math.random());

        for (let i = 0; i < this.options.rowCount; i++) {
            let row = [];

            for (let j = 0; j < this.options.columnCount; j++) {
                row.push(this.numberSet[j * this.options.rowCount + i]);
            }

            this.gridData.push(row);
        }
    }
}