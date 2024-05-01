import { WebSocket } from 'ws'
import NoughtsAndCrosses from "./NoughtsAndCrosses";
import { GameState, GameStateCode, isMoveMessage } from '@/shared/types/gameEventTypes'
import { Shape } from '@/shared/types/noughtsAndCrossesTypes';

export type Player = {
    ws: WebSocket,
    username: string,
    sid: string,
}

export default class GameController {
    private players: [Player, Player]
    private activePlayer: 0 | 1 = 0
    private gameState: GameStateCode = GameStateCode.ACTIVE
    private winner: Player

    constructor(private readonly game: NoughtsAndCrosses, player1: Player, player2: Player) {
        this.players = [player1, player2]
        this.startGame()
    }

    private sendGameEvent() {
        this.players.forEach((player, playerNo) => {
            const gameEvent: GameState = {
                gameGrid: this.game.getGameGrid(),
                playerShape: playerNo === 0 ? Shape.X : Shape.O,
                player: player.username,
                opponent: playerNo === 0 ? this.players[1].username : this.players[0].username,
                awaitingInput: this.gameState == GameStateCode.ACTIVE && playerNo === this.activePlayer,
                gameState: this.gameState,
                winner: this.winner?.username,
            }
            player.ws.send(JSON.stringify(gameEvent))
        })
    }

    private startGame() {
        this.sendGameEvent()
        this.moveListener()
        this.closeListener()
    }

    private moveListener() {
        this.players.forEach((player, playerNo) => {
            player.ws.on('message', (msg) => {
                try {
                    if (playerNo !== this.activePlayer) throw new Error('Not player\'s turn')
                    const jsonMessage = JSON.parse(msg.toString())
                    if (!isMoveMessage(jsonMessage)) throw new Error('Invalid message')
    
                    const [row, column] = jsonMessage.move
                    const playerShape = playerNo === 0 ? Shape.X : Shape.O
                    this.game.placeShape(row, column, playerShape)
                    this.activePlayer = this.activePlayer == 0 ? 1 : 0
                } catch(err) {
                    console.error('Error processing move,', err.message)
                }

                if (this.game.hasWinningLine()) {
                    this.gameState = GameStateCode.ENDED
                    this.winner = player
                    this.endGame()
                }
                else if (!this.game.hasRemainingMoves()) {
                    this.gameState = GameStateCode.ENDED
                    this.endGame()
                }
                else {
                    this.sendGameEvent()
                }
            })
        })
    }

    private closeListener() {
        this.players.forEach((player, playerNo) => {
            player.ws.on('close', () => {
                if (this.gameState !== GameStateCode.ACTIVE) return
                const winningPlayerNo = playerNo === 0 ? 1 : 0
                this.winner = this.players[winningPlayerNo]
                this.gameState = GameStateCode.ABANDONED
                this.endGame()
            })
        })
    }

    private endGame() {
        this.sendGameEvent()
        this.players.forEach((player) => player.ws.close())
    }
}
