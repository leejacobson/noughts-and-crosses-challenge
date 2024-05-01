import { Shape } from "@/shared/types/noughtsAndCrossesTypes";
import styles from "./Board.module.scss";
import { GameState, MoveMessage } from "@/shared/types/gameEventTypes";

type Props = {
    gameState?: GameState
    sendMove?: (message: MoveMessage) => void
}
export default function Board({ gameState, sendMove }: Props) {
    const makeMove = (row: number, column: number) => {
        if (!sendMove) return
        sendMove({
            move: [row, column]
        })
    }

    return (
        <div className={styles.grid}>
            { gameState?.gameGrid?.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className={styles.row}>
                    { row.map((cell, columnIndex) => (
                        <div key={`cell-${columnIndex}`} className={styles.cell}>
                            { !cell && gameState.awaitingInput && (
                                <button onClick={() => makeMove(rowIndex, columnIndex)} className={gameState.playerShape === Shape.X ? styles.cellButtonX : styles.cellButtonO}></button> 
                            ) }
                            { cell && (
                                <div className={cell === Shape.X ? styles.cellShapeX : styles.cellShapeO}></div> 
                            ) }
                        </div>
                    )) }
                </div>
            )) }
        </div>
    )
}
