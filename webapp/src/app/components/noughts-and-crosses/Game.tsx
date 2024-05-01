'use client'

import styles from "./Game.module.scss";
import Board from "./Board"
import { useEffect, useState } from "react";
import { GameClient, createUser, getInfo, joinGame } from "@/app/api/client";
import UsernameForm from "./UsernameForm";
import { GameState, GameStateCode } from "@/shared/types/gameEventTypes";

enum GameScreen {
    'LOADING',
    'USERNAME',
    'WAITING',
    'ACTIVE',
    'ENDED',
}

export default function Game() {
    const [gameScreen, setGameScreen] = useState<GameScreen>(GameScreen.LOADING)
    const [gameClient, setGameClient] = useState<GameClient>()
    const [gameState, setGameState] = useState<GameState>()

    const onEvent = (gameEvent: GameState) => {
        setGameScreen(GameScreen.ACTIVE)
        setGameState(gameEvent)
    }

    const fetchUser = async () => {
        const info = await getInfo()
        if(!info.username) {
            setGameScreen(GameScreen.USERNAME)
            return
        }
        setGameScreen(GameScreen.WAITING)
        const client = joinGame()
        client.onEvent(onEvent)
        setGameClient(client)
    }

    const setUsername = async (username: string) => {
        const result = await createUser(username)
        if (!result) return
        fetchUser()
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const content = () => {
        if (gameScreen === GameScreen.LOADING) return <h2>Loading...</h2>
        else if (gameScreen === GameScreen.WAITING) return <h2>Waiting for opponent...</h2>
        else if (gameScreen === GameScreen.USERNAME) return <UsernameForm setUsername={setUsername} />
        else if (gameScreen === GameScreen.ACTIVE) {
            if (gameState?.gameState == GameStateCode.ACTIVE) {
                return (
                    <div>
                        <Board gameState={gameState} sendMove={gameClient?.sendMove} />
                        <div className={styles.gameFooter}>
                            <div>Opponent: {gameState?.opponent}</div>
                            <div>{ gameState?.awaitingInput ? 'Your turn' : 'Opponent\'s turn' }</div>
                        </div>
                    </div>
                )
            }
            return (
                <div>
                    <h2>Game over</h2>
                    <div>{ gameState?.winner ? `Winner: ${gameState?.winner}` : 'Draw' }</div>

                    <button onClick={fetchUser}>Play again?</button>
                </div>
            )
        }
    }

    return (
        <div className={styles.gameContainer}>
            <div className={styles.game}>
                { content() }
            </div>
        </div>
    )
}
