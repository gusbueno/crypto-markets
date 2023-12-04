import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { markets } from "../../constants/markets";
import { calculateChange } from "../../helpers";

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

type DataMarket = Pick<Ticker24hUpdate, "market" | "last" | "volumeQuote"> & { change24h: string }


type WebSocketContextProps = {
    data: Array<DataMarket>;
    isInitialLoading: boolean;
    performSearch: (term: string) => void;
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

    const ws = useRef<WebSocket>(new WebSocket('wss://ws.bitvavo.com/v2/')).current

    useEffect(() => {
        ws.onopen = () => {
            ws.send(JSON.stringify({
                action: 'subscribe',
                channels: [{ name: 'ticker24h', markets }]
            }))
        }

        ws.onmessage = (event: MessageEvent) => {
            const messageData = JSON.parse(event.data);

            switch (messageData.event) {
                case "subscribed": {
                    // initiate the data with the markets
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
        }

        ws.onerror = (error: Event) => {
            console.log('WebSocket error: ', error)
        }

        return () => {
            ws?.readyState === 1 && ws?.close()
        }
    }, [ws])

    const performSearch = useCallback((term: string) => {
        setTerm(term)
    }, [])

    const memoizedData = useMemo(() => {
        // update data with new values
        const newData = [...data].map((item) => {
            const { market, last, volumeQuote, ask, bid, open } = item
            const change24h = calculateChange({ ask, bid, open })

            return {
                market: market.split('-')[0],
                last: last ? last : '0',
                volumeQuote: volumeQuote ? Intl.NumberFormat().format(+parseFloat(volumeQuote).toFixed(2)) : '0',
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
            if (orderBy.direction === 'asc') {
                return a[orderBy.field] > b[orderBy.field] ? 1 : -1
            } else {
                return a[orderBy.field] < b[orderBy.field] ? 1 : -1
            }
        })

        return filteredData
    }, [data, orderBy.direction, orderBy.field, term])

    return (
        <WebSocketContext.Provider value={{
            data: memoizedData,
            isInitialLoading,
            performSearch
        }}>
            {children}
        </WebSocketContext.Provider>
    )
}