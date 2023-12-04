import { useWebSocket } from "../../hooks/useWebSocket"
import { MarketsTableRow } from "../MarketsTableRow"

export const MarketsTable = () => {
    const { data, isInitialLoading } = useWebSocket()

    return (
        <table className="w-full text-sm text-left text-gray-500 border table-auto">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-8 py-4">Market</th>
                    <th scope="col" className="px-8 py-4">Price</th>
                    <th scope="col" className="px-8 py-4">Volumen (24H)</th>
                    <th scope="col" className="px-8 py-4">Change (24H)</th>
                </tr>
            </thead >
            <tbody>
                {!isInitialLoading ? data.map((item) => (
                    <MarketsTableRow
                        key={item.market}
                        market={item.market}
                        last={item.last}
                        volumeQuote={item.volumeQuote}
                        change24h={item.change24h}
                    />
                )) : (
                    <tr>
                        <td colSpan={4}>Loading...</td>
                    </tr>

                )}
            </tbody>
        </table >
    )
}