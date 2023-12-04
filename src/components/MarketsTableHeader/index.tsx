import { useCallback } from "react"

import { useWebSocket } from "../../hooks/useWebSocket"
import { DataMarket } from "../../providers/WebSocketProvider"
import { ChevronDownIcon, ChevronUpIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid"

export const MarketsTableHeader = () => {
    const { orderBy, handleSort } = useWebSocket()

    const handleOnClick = useCallback((field: keyof DataMarket) => () => {
        handleSort(field)
    }, [handleSort])

    const renderSortIcon = useCallback((field: keyof DataMarket) => {
        if (orderBy.field !== field) return <ChevronUpDownIcon className="w-5 h-5 text-gray-300" />

        if (orderBy.direction === 'asc') {
            return <ChevronUpIcon className="w-4 h-4 text-black" />
        }

        if (orderBy.direction === 'desc') {
            return <ChevronDownIcon className="w-4 h-4 text-black" />
        }
    }, [orderBy.direction, orderBy.field])

    return (
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col">
                    <div className="flex px-8 py-4 hover:cursor-pointer gap-1 items-center" onClick={handleOnClick('market')}>
                        Market
                        {renderSortIcon('market')}
                    </div>
                </th>
                <th scope="col">
                    <div className="flex px-8 py-4 hover:cursor-pointer gap-1 items-center" onClick={handleOnClick('last')}>
                        Price
                        {renderSortIcon('last')}
                    </div>
                </th>
                <th scope="col">
                    <div className="flex px-8 py-4 hover:cursor-pointer gap-1 items-center" onClick={handleOnClick('volumeQuote')}>
                        Volumen (24H)
                        {renderSortIcon('volumeQuote')}
                    </div>
                </th>
                <th scope="col">
                    <div className="flex px-8 py-4 hover:cursor-pointer gap-1 items-center" onClick={handleOnClick('change24h')}>
                        Change (24H)
                        {renderSortIcon('change24h')}
                    </div>
                </th>
            </tr>
        </thead>
    )
}