export default class Grid<T> {
    private grid: T[][] = []

    constructor(
        private readonly rows: number = 3,
        private readonly columns: number = 3,
    ) {
        this.grid = new Array(this.rows).fill(null).map(() => new Array(this.columns).fill(null))
    }
 
    getCell(row: number, column: number): T | null {
        if (row < 0 || row >= this.rows || column < 0 || column >= this.columns) return null
        return this.grid[row][column]
    }

    setCell(row: number, column: number, value: T): void {
        if (row < 0 || row >= this.rows || column < 0 || column >= this.columns) {
            throw new Error(`Invalid grid position ${row}, ${column}`)
        }
        this.grid[row][column] = value
    }

    getGrid = () => this.grid
}