export const flashMaxPackages = [
  {
    id: "credits-50k",
    label: "50K",
    token: "CREDITS",
    price: 20,
    priceLabel: "$20",
    description: "Perfect for testing",
  },
  {
    id: "credits-100k",
    label: "100K",
    token: "CREDITS",
    price: 30,
    priceLabel: "$30",
    description: "Best for demos",
  },
  {
    id: "credits-500k",
    label: "500K",
    token: "CREDITS",
    price: 50,
    priceLabel: "$50",
    description: "For larger previews",
  },
  {
    id: "credits-1m",
    label: "1M",
    token: "CREDITS",
    price: 100,
    priceLabel: "$100",
    description: "Maximum impact",
  },
] as const;

export const flashMaxTargetNetworks = [
  { id: "ethereum", label: "Ethereum (ERC20)", shortLabel: "ETH", type: "evm", placeholder: "0x...", hint: "0x... (42 chars)" },
  { id: "bsc", label: "BNB Smart Chain (BEP20)", shortLabel: "BNB", type: "evm", placeholder: "0x...", hint: "0x... (42 chars)" },
  { id: "tron", label: "Tron (TRC20)", shortLabel: "TRX", type: "tron", placeholder: "T...", hint: "T... (34 chars)" },
  { id: "polygon", label: "Polygon", shortLabel: "POL", type: "evm", placeholder: "0x...", hint: "0x... (42 chars)" },
  { id: "arbitrum", label: "Arbitrum", shortLabel: "ARB", type: "evm", placeholder: "0x...", hint: "0x... (42 chars)" },
  { id: "bitcoin", label: "Bitcoin (BTC)", shortLabel: "BTC", type: "bitcoin", placeholder: "bc1...", hint: "bc1... or 1... / 3..." },
  { id: "solana", label: "Solana (SOL)", shortLabel: "SOL", type: "solana", placeholder: "Solana address...", hint: "32-44 chars" },
  { id: "litecoin", label: "Litecoin (LTC)", shortLabel: "LTC", type: "litecoin", placeholder: "ltc1...", hint: "ltc1... or L... / M..." },
  { id: "xrp", label: "Ripple (XRP)", shortLabel: "XRP", type: "xrp", placeholder: "r...", hint: "r... address" },
  { id: "base", label: "Base", shortLabel: "BASE", type: "evm", placeholder: "0x...", hint: "0x... (42 chars)" },
  { id: "optimism", label: "Optimism", shortLabel: "OP", type: "evm", placeholder: "0x...", hint: "0x... (42 chars)" },
  { id: "avalanche", label: "Avalanche C-Chain", shortLabel: "AVAX", type: "evm", placeholder: "0x...", hint: "0x... (42 chars)" },
] as const;

export const flashMaxPaymentCurrencies = [
  { id: "btc", name: "Bitcoin", display: "Bitcoin (BTC)", symbol: "BTC" },
  { id: "usdterc20", name: "USDT", display: "USDT (Ethereum ERC20)", symbol: "USDT" },
  { id: "usdttrc20", name: "USDT", display: "USDT (Tron TRC20)", symbol: "USDT" },
  { id: "usdtbsc", name: "USDT", display: "USDT (BNB Smart Chain)", symbol: "USDT" },
] as const;

export type FlashMaxPackageId = (typeof flashMaxPackages)[number]["id"];
export type FlashMaxTargetNetworkId = (typeof flashMaxTargetNetworks)[number]["id"];
export type FlashMaxPayCurrency = (typeof flashMaxPaymentCurrencies)[number]["id"];

export function getFlashMaxPackage(id: string) {
  return flashMaxPackages.find((item) => item.id === id);
}

export function getFlashMaxTargetNetwork(id: string) {
  return flashMaxTargetNetworks.find((item) => item.id === id);
}

export function getFlashMaxPaymentCurrency(id: string) {
  return flashMaxPaymentCurrencies.find((item) => item.id === id);
}

export function isValidTargetAddress(address: string, networkType: string) {
  const validators: Record<string, RegExp> = {
    evm: /^0x[a-fA-F0-9]{40}$/,
    tron: /^T[a-zA-Z0-9]{33}$/,
    bitcoin: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,90}$/i,
    solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    litecoin: /^(ltc1|[LM3])[a-zA-HJ-NP-Z0-9]{26,90}$/i,
    xrp: /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/,
  };

  return (validators[networkType] ?? validators.evm).test(address.trim());
}
