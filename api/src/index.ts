import express from 'express'
import expressWs from 'express-ws'
import WebSocket from 'ws'
import cors from 'cors'
import cookieSession from 'cookie-session'
import { v4 as uuidv4 } from 'uuid';
import { BadRequest } from 'http-errors'
import NoughtsAndCrosses from './game/NoughtsAndCrosses';
import GameController, { Player } from './game/GameController';
import config from './config'

const { app } = expressWs(express())

const KEY = 'SOME_SECRET_KEY'

app.use(cors({
  origin: [/localhost/],
  credentials: true,
}))

app.use(cookieSession({
  name: 'session',
  keys: [KEY],
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}))

const port = process.env.PORT || 3001

const users: { [key: string]: string } = {}
let pendingPlayer: Player | null = null

app.get('/info', (req, res) => {
  const { sid } = req.session!!
  res.send({
    username: users[sid] ?? null
  })
})

app.get('/create', (req, res, next) => {
  const { username } = req.query

  if (typeof username !== 'string') return next(BadRequest())
  const sid = uuidv4()
  users[sid] = username
  req.session!!.sid = sid
  res.send('ok')
})

app.ws('/game', async (ws, req) => {
  const { sid } = req.session!!
  if (!sid || sid === pendingPlayer?.sid) return ws.close()

  const newPlayer = {
    ws,
    username: users[sid],
    sid: sid,
  }

  if (pendingPlayer && pendingPlayer.ws.readyState === WebSocket.OPEN) {
    const game = new NoughtsAndCrosses(config.gridRows, config.gridColumns, config.winningLineLength)
    new GameController(game, pendingPlayer, newPlayer)
    pendingPlayer = null
  } else {
    pendingPlayer = newPlayer
  }
})

app.listen(port, () => console.log(`Listening on port ${port}`))
