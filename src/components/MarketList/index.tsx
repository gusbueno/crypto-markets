import { useCallback, useEffect, useRef, useState } from "react"

import { MarketsTable } from "../MarketsTable"
import { useWebSocket } from "../../hooks/useWebSocket"

export const MarketList = () => {
    const [search, setSearch] = useState<string>('')
    const { performSearch } = useWebSocket()

    const debouncedSearchTimer = useRef<ReturnType<typeof setTimeout>>()

    useEffect(() => {
        debouncedSearchTimer.current && clearTimeout(debouncedSearchTimer.current)
        debouncedSearchTimer.current = setTimeout(() => {
            performSearch(search)
        }, 500)
    }, [performSearch, search])

    const handleOnChangeSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }, [])


    return (
        <div className="flex justify-center items-center my-20">
            <div className="flex flex-col gap-5 w-[800px]">
                <h1 className="text-4xl">Market list</h1>
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-4 py-2 border rounded"
                    value={search}
                    onChange={handleOnChangeSearch}
                />
                <div className="relative overflow-x-auto rounded overflow-hidden">
                    <MarketsTable />
                </div>
            </div>

        </div>
    )
}