const DEFAULT_OPTIONS = {
    rowCount: 4,
    columnCount: 7,
    minNumber: 1,
    maxNumber: 9,
    numbers: [],
};

export class FlashMemoryMode {
    gridData = [];

    numberSet = [];

    options = {};

    constructor(customOptions) {
        Object.assign(this.options, DEFAULT_OPTIONS, customOptions);

        for (let i = 0; i < this.options.rowCount * this.options.columnCount; i++) {
            if (i < this.options.numbers.length
                && this.options.numbers[i] >= this.options.minNumber
                && this.options.numbers[i] <= this.options.maxNumber) {

                this.numberSet[i] = this.options.numbers[i];
            } else {
                this.numberSet[i] = null;
            }
        }

        console.log(this.options);
    }

    resetGrid() {
        this.gridData = [];

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