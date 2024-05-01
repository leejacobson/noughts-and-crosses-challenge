import { Shape } from "./noughtsAndCrossesTypes"

export enum GameStateCode {
    ACTIVE = 'ACTIVE',
    ENDED = 'ENDED',
    ABANDONED = 'ENDED',
}

export type GameState = {
    gameGrid: Shape[][]
    playerShape: Shape
    player: string
    opponent: string
    awaitingInput: boolean
    gameState: GameStateCode
    winner?: string
}

export type MoveMessage = {
    move: [number, number]
}

/* Type guards */
export const isMoveMessage = (msg: any): msg is MoveMessage => 
    msg.move && Array.isArray(msg.move) && Number.isInteger(msg.move[0]) && Number.isInteger(msg.move[0])
