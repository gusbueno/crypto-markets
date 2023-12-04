import { memo } from "react"

import { Ticker24hUpdate } from "../../providers/WebSocketProvider"

type MarketsTableRowProps = Pick<Ticker24hUpdate, "market" | "last" | "volumeQuote"> & {
    change24h?: string;
}

export const MarketsTableRow = memo(({ market, last, volumeQuote, change24h }: MarketsTableRowProps) => {
    return (
        <tr className="bg-white border-b">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <use xlinkHref={`/market-icons.svg#${market.toLowerCase()}`} href={`/market-icons.svg#${market.toLowerCase()}`} />
                    </svg>
                    {market}
                </div>

            </th>
            <td className="px-6 py-4 text-right">€{last}</td>
            <td className="px-6 py-4 text-right">{volumeQuote}</td>
            <td className="px-6 py-4 text-right">{change24h}%</td>
        </tr>
    )
})