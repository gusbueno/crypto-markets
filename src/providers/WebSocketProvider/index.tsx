import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { markets } from "../../constants/markets"
import { calculateChange } from "../../helpers"

export interface Ticker24hUpdate {
    ask: string;
    askSize: string;
    market: string;
    timestamp: number;
    bid: string | null;
    bidSize: string | null;
    high: string | null;
    last: string | null;
    low: string | null;
    open: string | null;
    volume: string | null;
    volumeQuote: string | null;
}

export type DataMarket = Pick<Ticker24hUpdate, "market" | "last" | "volumeQuote"> & { change24h: string }


type WebSocketContextProps = {
    data: Array<DataMarket>;
    isInitialLoading: boolean;
    performSearch: (term: string) => void;
    orderBy: OrderBy;
    handleSort: (field: keyof DataMarket) => void;
}

type WebSocketProviderProps = {
    children: React.ReactNode;
}

type OrderBy = {
    field: keyof DataMarket;
    direction: 'asc' | 'desc';
}

export const WebSocketContext = createContext<WebSocketContextProps>({} as WebSocketContextProps)

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
    const [data, setData] = useState<Array<Pick<Ticker24hUpdate, "market" | "last" | "volumeQuote" | "ask" | "bid" | "open">>>([])
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true)
    const [term, setTerm] = useState<string>('')
    const [orderBy, setOrderBy] = useState<OrderBy>({ field: 'market', direction: 'asc' })

    const ws = useRef<WebSocket | null>(new WebSocket('wss://ws.bitvavo.com/v2/'))

    const onWSOpen = () => {
        ws.current?.send(JSON.stringify({
            action: 'subscribe',
            channels: [{ name: 'ticker24h', markets }]
        }))
    }

    const onWSMessage = useCallback((event: MessageEvent) => {
        const messageData = JSON.parse(event.data);

        switch (messageData.event) {
            case "subscribed": {
                // initiate the data with the markets
                if (!data.length) {
                    const initialData = markets.map((market: string) => (
                        {
                            market: market.split('-')[0],
                            last: null,
                            volumeQuote: null,
                            ask: "0.00",
                            bid: null,
                            open: null,
                        }
                    ))
                    setData(initialData)
                }
                break;
            }
            case "ticker24h":
                // update data with new values
                if (messageData.data.length) {
                    setData((prevData) => {
                        const newData = [...prevData]
                        messageData.data.forEach((item: Ticker24hUpdate) => {
                            const index = newData.findIndex((dataItem) => dataItem.market === item.market.split('-')[0])
                            newData[index].last = item.last
                            newData[index].volumeQuote = item.volumeQuote
                            newData[index].ask = item.ask
                            newData[index].bid = item.bid
                            newData[index].open = item.open
                        })
                        return newData
                    })
                }

                setIsInitialLoading(false)
                break;
            default:
                break;
        }
    }, [data])

    useEffect(() => {
        if (ws.current !== null) {
            ws.current.onopen = onWSOpen

            ws.current.onmessage = onWSMessage

            ws.current.onerror = (error: Event) => {
                console.log('WebSocket error: ', error)
            }
        }

        return () => {
            if (ws?.current !== null) {
                ws.current.readyState === 1 && ws.current.close()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ws])

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                if (ws.current === null) {
                    ws.current = new WebSocket('wss://ws.bitvavo.com/v2/')
                    ws.current.onopen = onWSOpen
                    ws.current.onmessage = onWSMessage
                }
            } else if (document.visibilityState === 'hidden') {
                ws.current?.readyState === 1 && ws.current?.close()
                ws.current = null
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onWSMessage])

    const performSearch = useCallback((term: string) => {
        setTerm(term)
    }, [])

    const handleSort = useCallback((field: keyof DataMarket) => {
        setOrderBy((prevOrderBy) => {
            if (prevOrderBy.field === field) {
                return {
                    field,
                    direction: prevOrderBy.direction === 'asc' ? 'desc' : 'asc'
                }
            }

            return {
                field,
                direction: 'asc'
            }
        })
    }, [])

    const memoizedData = useMemo(() => {
        // create a list with the values that we need
        const newData = [...data].map((item) => {
            const { market, last, volumeQuote, ask, bid, open } = item
            const change24h = calculateChange({ ask, bid, open })

            return {
                market,
                last: last ? last : '0',
                volumeQuote:
                    volumeQuote
                        ? volumeQuote
                        : '0',
                change24h
            }
        })

        // filter data by term
        let filteredData = [...newData]
        if (term) {
            filteredData = newData.filter((item) => item.market.toLowerCase().includes(term.toLowerCase()))
        }

        // sort
        filteredData.sort((a, b) => {
            const aItem = orderBy.field === 'market' ? a[orderBy.field] : parseFloat(a[orderBy.field])
            const bItem = orderBy.field === 'market' ? b[orderBy.field] : parseFloat(b[orderBy.field])
            if (orderBy.direction === 'asc') {
                return aItem > bItem ? 1 : -1
            } else {
                return aItem < bItem ? 1 : -1
            }
        })

        return filteredData
    }, [data, orderBy.direction, orderBy.field, term])

    return (
        <WebSocketContext.Provider value={{
            data: memoizedData,
            isInitialLoading,
            performSearch,
            orderBy,
            handleSort
        }}>
            {children}
        </WebSocketContext.Provider>
    )
}