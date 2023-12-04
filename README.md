# Bitvavo Frontend Challenge

## Introduction

In Bitvavo, dealing with real-time data is very important because
we need to provide our customers with the most up-to-date information about markets, so they
can make the best-informed decisions while trading.

We offer our customers a vast array of different markets to allow traders to cater to different
trading and investment strategies they might have, so it is natural that displaying a list of all of those
markets is a common feature among most of our customer-facing applications.

Knowing that we want to challenge you to come up with a solution to that real-world, production challenge
the frontend engineers in Bitvavo face on a daily basis.

## Challenge
We want you to create your own solution for listing all markets we offer our customers. We list new assets almost on
a monthly basis, so this should be production-facing code that needs to scale to any number of markets that could be added later.

You will be able to use our public WebSockets API and consume the Ticker 24-hour subscription to acquire the required data
and updates for this challenge.

### Requirements
- Use [React](https://react.dev/).
  - Any other auxiliary library is also allowed (like Styled Components, TailwindCSS, decimal.js, or even Redux), but
have in mind that the less code you write, the less material we'll have to assess your challenge.
  - You can use any build-tool of your choice, like [Create React App](https://create-react-app.dev/) or [Vite](https://vitejs.dev/guide/).
- Use [TypeScript](https://www.typescriptlang.org/).
- Create a market list that lists all the markets returned by the API.
- Market list must not have any kind of pagination.
- Market list must display the following information:
  - The market's icon. We'll provide that, more info can be found below in the [provided material](#provided-material) section.
  - The market identifier: You can use the `market` property for that.
  - The current price: You can use the `last` property for that.
  - The market's trading volume in Euros in the last 24 hours: You can use the `volumeQuote` property for that.
  - The market's price change percentage in the last 24 hours: For that, you'll need to do a calculation based on
`bid`, `ask`, and `open`. To get you going, here you can find such calculation below in the [provided material](#provided-material) section.
- Handle real-time updates coming from the WebSockets API to update all the information listed above.
- As mentioned above, we expect to see client-side performance best practices, so every update should try to update the minimum of
components as possible.
- Handle Websockets/API errors and close events. We want the connection to be as resilient as possible and in the event
of a disconnection or error, the user should be communicated that things aren't working as expected.
- Disconnect and re-connect the WebSockets connection when the browser tab's focus changes (when the user switch tabs).
- Implement search functionality that allows you to find a specific market.
- The ability to sort the list by name, price, change percentage, and trading volume.
- Provide instructions in a `README.md` file on how to run the project and additional information you'd like to highlight.
### Nice to have
- Unit tests. If you chose to do so, please use [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [Jest](https://jestjs.io/).
- Responsive layout

### Inspiration
You could use one of our market lists as inspiration for the layout/design. You can find it [here](https://bitvavo.com/en/markets).

### Provided material
Here are some code snippets and material to get you started:
- [Our WebSockets documentation](https://docs.bitvavo.com/#section/Introduction). Useful to better understand its behaviour.
- [Market pair identifier list](./provided-material/markets.ts).
- [Icon list](./provided-material/market-icons.svg). Here you'll find an [SVG sprite map](https://css-tricks.com/svg-sprites-use-better-icon-fonts/#aa-use-the-icons-wherever)
and below you can find usage examples. The way it is integrated into your project might vary depending on the build-tool of your choice.

### Basic WebSockets connection to our API
```typescript
import { markets } from './market-list'; // This file will be provided to you.

const wsConnection = new WebSocket('wss://ws.bitvavo.com/v2/');

wsConnection.onopen = () => {
  wsConnection.send(JSON.stringify({
    action: 'subscribe',
    channels: [{ name: 'ticker24h', markets }]
  }));
};

wsConnection.onmessage = ({ data }) => {
  const messageData = JSON.parse(data);

  console.log(messageData);
};
```

### Ticker 24h update interface
```typescript
interface Ticker24hUpdate {
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
```

#### Change percentage calculation
```typescript
function calculateChange(update: TickerOpenVolumeLowHigh): string {
  const { ask, bid, open } = update;

  if (!ask || !bid || !open) return '0.00';

  const openFloat = parseFloat(open);
  const midPrice = calculateMidPrice(parseFloat(bid), parseFloat(ask));

  return formatPercentage((midPrice - openFloat) / openFloat);
}

function calculateMidPrice(bidPrice: number, askPrice: number): number {
  return (bidPrice + askPrice) / 2;
}

function formatPercentage(change: number): string {
  return (change * 100).toFixed(2);
}
```

### SVG Sprite map usage
```html
<svg viewBox="0 0 24 24" width="24" height="24">
  <use xlink:href="/market-icons.svg#btc" href="/market-icons.svg#btc"></use>
</svg>
```
