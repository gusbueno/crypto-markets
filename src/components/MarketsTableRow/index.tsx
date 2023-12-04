import { memo } from "react"
import { twJoin } from "tailwind-merge"

import { DataMarket } from "../../providers/WebSocketProvider"

type MarketsTableRowProps = DataMarket

export const MarketsTableRow = memo(({ market, last, volumeQuote, change24h }: MarketsTableRowProps) => {
    const isChange24hPositive = parseFloat(change24h) > 0
    const isChange24hNegative = parseFloat(change24h) < 0

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
            <td className="px-6 py-4 text-right">€{parseFloat(last!).toLocaleString()}</td>
            <td className="px-6 py-4 text-right">{parseFloat(volumeQuote!).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
            <td
                className={
                    twJoin(
                        "px-6 py-4 text-right",
                        isChange24hPositive && 'text-teal-500',
                        isChange24hNegative && 'text-red-500')
                }
            >{`${isChange24hPositive ? '+' : ''} ${isChange24hNegative ? '-' : ''} ${Math.abs(parseFloat(change24h))}%`}</td>
        </tr>
    )
})