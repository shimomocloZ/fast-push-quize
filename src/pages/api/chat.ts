import { NextApiRequest } from 'next'
import { NextApiResponseServerIO } from './socketio'

const handle = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === `POST`) {
    const message = req.body
    // messageイベントの実行
    res?.socket?.server?.io?.emit(`update-data`, message)
    res.status(201).json(message)
  }
}

export default handle
