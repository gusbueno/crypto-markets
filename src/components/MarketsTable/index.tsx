import { useWebSocket } from "../../hooks/useWebSocket"
import { MarketsTableHeader } from "../MarketsTableHeader"
import { MarketsTableRow } from "../MarketsTableRow"

export const MarketsTable = () => {
    const { data, isInitialLoading } = useWebSocket()

    return (
        <table className="w-full text-sm text-left text-gray-500 border table-auto">
            <MarketsTableHeader />
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
                        <td colSpan={4} className="px-6 py-4 text-center">Loading...</td>
                    </tr>

                )}
            </tbody>
        </table >
    )
}