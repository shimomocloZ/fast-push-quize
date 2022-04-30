import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: {
      io: ServerIO
    }
  }
}
const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log(`New Socket.io server...`)
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: `/api/socketio`,
    })
    res.socket.server.io = io
  }
  res.end()
}

export default handler
