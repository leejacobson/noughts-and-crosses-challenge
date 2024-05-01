import { webSocket } from 'rxjs/webSocket';
import { GameState, MoveMessage } from '@/shared/types/gameEventTypes'

const API_URL = process.env.API_URL || 'localhost:3001'

export async function getInfo() {
    const response = await fetch(`http://${API_URL}/info`, {
        credentials: 'include',
    })
    return await response.json()
}

export async function createUser(username: string): Promise<boolean> {
    const response = await fetch(`http://${API_URL}/create?username=${username}`, {
        credentials: 'include',
    })
    return await response.status === 200
}

export type GameClient = {
    onEvent: (fn: (value: GameState) => void) => void,
    sendMove: (message: MoveMessage) => void,
}
export function joinGame(): GameClient {
    const ws = webSocket<any>(`ws://${API_URL}/game`)
    return {
        onEvent: fn => ws.subscribe(fn),
        sendMove: message => ws.next(message),
    }
}
