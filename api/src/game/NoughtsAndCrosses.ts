import { Shape } from "@/shared/types/noughtsAndCrossesTypes"
import Grid from "./Grid"

type PositionOffset = [number, number]
const lineDirections: { [key: string]: PositionOffset } = {
    'UP': [-1,0],
    'UP_RIGHT': [-1,1],
    'RIGHT': [0,1],
    'DOWN_RIGHT': [1,1],
    'DOWN': [1,0],
    'DOWN_LEFT': [1,-1],
    'LEFT': [0,-1],
    'UP_LEFT': [-1,-1],
}

export default class NoughtsAndCrosses {
    private grid: Grid<Shape>

    constructor(
        private readonly rows: number = 3,
        private readonly columns: number = 3,
        private readonly winningLineLength: number = 3
    ) {
        this.grid = new Grid(this.rows, this.columns)
    }

    placeShape(row: number, column: number, shape: Shape): void {
        try {
            if (this.grid.getCell(row, column) != null) return
            this.grid.setCell(row, column, shape)
        } catch(error) {
            console.error(`Error placing shape at ${row}, ${column}`, error)
        }
    }

    // Checks if any row and column has a winning line in any direction
    hasWinningLine(): Shape | null {
        for (let row=0; row<this.rows; row++) {
            for (let column=0; column<this.columns; column++) {
                for (let lineDirection of Object.values(lineDirections)) {
                    const winningShape = this.isWinningLine(row, column, lineDirection, this.winningLineLength)
                    if (winningShape) return winningShape
                }
            }
        }
        return null
    }

    hasRemainingMoves() {
        return this.getGameGrid().findIndex(row => row.findIndex(cell => cell === null) >= 0) >= 0
    }

    getGameGrid = () => this.grid.getGrid()

    // This method uses recursion to check that a line (of given a position offset and line length) has matching values
    private isWinningLine(row: number, column: number, positionOffset: PositionOffset, lineLength: number): Shape | null {
        const shape = this.grid.getCell(row, column)
        if (shape == null) return null
        const nextRow = row - positionOffset[0];
        const nextColumn = column - positionOffset[1];
        const adjacentShape = this.grid.getCell(nextRow, nextColumn)

        if (lineLength <= 1) return shape
        if (shape === adjacentShape) return this.isWinningLine(nextRow, nextColumn, positionOffset, lineLength - 1)
        return null
    }
}
