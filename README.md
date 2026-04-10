# GnoSwap Bridge Web App

The **GnoSwap Bridge** is a web frontend that allows users to easily send Gno.land assets across supported blockchains via their respective bridges.

Users can connect their wallets to the GnoSwap Bridge web app through a browser plugin for Chromium-based web browsers, as shown below:

| Blockchain | Supported Wallets                                                                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Gno.land      | [Adena](https://chromewebstore.google.com/detail/adena/oefglhbffgfkcpboeackfgdagmlnihnh)                                                     |
| AtomOne   | [Keplr](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) |
| Ethereum        | [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en)     |


## Instructions

1. Install dependencies

```bash
$ npm install
```

2. Run Bridge

```bash
$ npm start
```

## Add a new IBC network

1. Update `src/types/network.ts`:

Add the chain to BlockChainType, IbcNetwork, isIbcNetwork, ibcChannels, ibcPrefix and allowedCoins

2. Update `src/consts/network.ts`:

Update blockChainImage and blockChainName

3. Add the chain in `src/pages/Send/BlockChainNetwork.tsx`:

Add the chain in the TO SelectBlockchain's array

## License

This software is licensed under the Apache 2.0 license. Read more about it [here](./LICENSE).

© 2021 Terra Bridge Web App
© 2026 GnoSwap Labs