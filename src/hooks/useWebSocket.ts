import { useContext } from "react"

import { WebSocketContext } from "../providers/WebSocketProvider"

export const useWebSocket = () => {
    const context = useContext(WebSocketContext)

    if (!Object.keys(context).length) {
		throw new Error('Consumer needs to be wrapped by a WebSocketProvider')
	}

    return context
}