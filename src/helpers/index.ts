import { Ticker24hUpdate } from "../providers/WebSocketProvider";

type TickerOpenVolumeLowHigh = Pick<Ticker24hUpdate, "ask" | "bid" | "open">;

export const calculateChange = (update: TickerOpenVolumeLowHigh): string => {
  const { ask, bid, open } = update;

  if (!ask || !bid || !open) return "0.00";

  const openFloat = parseFloat(open);
  const midPrice = calculateMidPrice(parseFloat(bid), parseFloat(ask));

  return formatPercentage((midPrice - openFloat) / openFloat);
};

function calculateMidPrice(bidPrice: number, askPrice: number): number {
  return (bidPrice + askPrice) / 2;
}

function formatPercentage(change: number): string {
  return (change * 100).toFixed(2);
}
