export const siteConfig = {
  brandName: "Flash Max",
  logoPath: "/images/logo.svg",
  metadata: {
    title: "Flash Max | Editable Premium Brand Site",
    description:
      "A premium editable brand website with checkout, reviews, and editable payment instructions.",
  },
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Generator", href: "/#generator" },
    { label: "Reviews", href: "/#reviews" },
  ],
  cta: {
    primaryLabel: "Buy Now",
    secondaryLabel: "View Reviews",
    checkoutLabel: "Start Order Now",
    href: "/checkout",
    secondaryHref: "/#reviews",
  },
  socialLinks: [
    { label: "X", href: "https://example.com/x" },
    { label: "Telegram", href: "https://example.com/telegram" },
    { label: "LinkedIn", href: "https://example.com/linkedin" },
  ],
  whatsappLink: "https://wa.me/10000000000",
  hero: {
    eyebrow: "PREMIUM DIGITAL SERVICE",
    headline: "Instant Flash USDT Setup",
    subheadline:
      "Generate a USDT-style demo balance inside your own test interface for layout previews, payment instructions, and order-flow testing.",
    supportLine: "",
    validityLabel: "Demo notice",
    validityValue: "25 days remaining",
    previewImage: "/images/hero-preview.svg",
  },
  stats: [
    { value: "$25", label: "Starter Price" },
    { value: "< 10 min", label: "Typical Setup" },
    { value: "24/7", label: "Support Window" },
  ],
  generator: {
    stats: [
      { value: "$9.3B", label: "D Volume" },
      { value: "2.1M", label: "Preview Runs" },
      { value: "99.9%", label: "Interface Uptime" },
    ],
    panelTitle: "Flash Max Generator",
    statusLabel: "Ready",
    amountLabel: "Select Amount",
    durationLabel: "Visibility Duration",
    networkLabel: "Select Network",
    targetAddressLabel: "Target Address",
    targetAddressHelp: "0x... (42 chars)",
    targetAddressPlaceholder: "0x...",
    summaryLabels: {
      amount: "Demo Amount",
      duration: "Duration",
      price: "Total Price",
    },
    ctaLabel: "Buy USDT",
    completedMessage:
      "Demo order preview created. Connect your own backend before using real payments or customer records.",
    paymentModal: {
      title: "Payment",
      currencyLabel: "SELECT CURRENCY",
      sendExactlyLabel: "Send exactly",
      addressLabel: "to this address",
      copyLabel: "Copy",
      copiedLabel: "Copied",
      paymentAddress: "bc1qvc6lwlpxw0yswrhxlps97fhxe9pghskmsd6r",
      qrImage: "/images/qr-placeholder.svg",
      currencies: [
        {
          name: "Bitcoin",
          symbol: "BTC",
          amount: "0.003956",
          icon: "BTC",
          paymentAddress: "bc1qchy3tqe9yjr9uxnm2kv4glpa9sfzqvzj40cn9p",
          paymentLink:
            "https://link.trustwallet.com/send?address=bc1qchy3tqe9yjr9uxnm2kv4glpa9sfzqvzj40cn9p&asset=c0",
          qrImage:
            "https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=https%3A%2F%2Flink.trustwallet.com%2Fsend%3Faddress%3Dbc1qchy3tqe9yjr9uxnm2kv4glpa9sfzqvzj40cn9p%26asset%3Dc0",
        },
        {
          name: "USDT",
          symbol: "USDT",
          displaySymbol: "Ethereum",
          amount: "620.00",
          icon: "USDT",
          paymentAddress: "0x14B8AbEC2F46050Ad682D0898e4391abeF8DE830",
          paymentLink:
            "https://link.trustwallet.com/send?address=0x14B8AbEC2F46050Ad682D0898e4391abeF8DE830&asset=c60_t0xdAC17F958D2ee523a2206206994597C13D831ec7",
          qrImage:
            "https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=https%3A%2F%2Flink.trustwallet.com%2Fsend%3Faddress%3D0x14B8AbEC2F46050Ad682D0898e4391abeF8DE830%26asset%3Dc60_t0xdAC17F958D2ee523a2206206994597C13D831ec7",
        },
        {
          name: "USDT",
          symbol: "USDT",
          displaySymbol: "TRON",
          amount: "620.00",
          icon: "USDT",
          paymentAddress: "TNcXiVHkTjfm9CRfjfeprkRSLsb6vx1ids",
          paymentLink:
            "https://link.trustwallet.com/send?address=TNcXiVHkTjfm9CRfjfeprkRSLsb6vx1ids&asset=c195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
          qrImage:
            "https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=https%3A%2F%2Flink.trustwallet.com%2Fsend%3Faddress%3DTNcXiVHkTjfm9CRfjfeprkRSLsb6vx1ids%26asset%3Dc195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
        },
        {
          name: "USDT",
          symbol: "USDT",
          displaySymbol: "BNB",
          amount: "620.00",
          icon: "USDT",
          paymentAddress: "0x14B8AbEC2F46050Ad682D0898e4391abeF8DE830",
          paymentLink:
            "https://link.trustwallet.com/send?address=0x14B8AbEC2F46050Ad682D0898e4391abeF8DE830&asset=c20000714_t0x55d398326f99059fF775485246999027B3197955",
          qrImage:
            "https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=https%3A%2F%2Flink.trustwallet.com%2Fsend%3Faddress%3D0x14B8AbEC2F46050Ad682D0898e4391abeF8DE830%26asset%3Dc20000714_t0x55d398326f99059fF775485246999027B3197955",
        },
      ],
    },
    amountOptions: [
      {
        label: "50K",
        token: "USDT",
        price: 20,
        priceLabel: "$20",
        description: "Perfect for testing",
      },
      {
        label: "100K",
        token: "USDT",
        price: 30,
        priceLabel: "$30",
        description: "Best for demos",
      },
      {
        label: "500K",
        token: "USDT",
        price: 50,
        priceLabel: "$50",
        description: "For larger previews",
      },
      {
        label: "1M",
        token: "USDT",
        price: 100,
        priceLabel: "$100",
        description: "Maximum impact",
      },
    ],
    durations: [{ label: "60 to 90 Days", multiplier: 1 }],
    networks: [
      {
        label: "Tether (USDT ERC20)",
        shortLabel: "USDT",
        type: "evm",
        placeholder: "0x...",
        hint: "0x... (42 chars)",
      },
      {
        label: "Ethereum (ERC20)",
        shortLabel: "ETH",
        type: "evm",
        placeholder: "0x...",
        hint: "0x... (42 chars)",
      },
      {
        label: "BNB Smart Chain (BEP20)",
        shortLabel: "BNB",
        type: "evm",
        placeholder: "0x...",
        hint: "0x... (42 chars)",
      },
      {
        label: "Tron (TRC20)",
        shortLabel: "TRX",
        type: "tron",
        placeholder: "T...",
        hint: "T... (34 chars)",
      },
      {
        label: "Polygon",
        shortLabel: "POL",
        type: "evm",
        placeholder: "0x...",
        hint: "0x... (42 chars)",
      },
      {
        label: "Arbitrum",
        shortLabel: "ARB",
        type: "evm",
        placeholder: "0x...",
        hint: "0x... (42 chars)",
      },
      {
        label: "Bitcoin (BTC)",
        shortLabel: "BTC",
        type: "bitcoin",
        placeholder: "bc1...",
        hint: "bc1... or 1... / 3...",
      },
      {
        label: "Solana (SOL)",
        shortLabel: "SOL",
        type: "solana",
        placeholder: "Solana address...",
        hint: "32-44 chars",
      },
      {
        label: "Litecoin (LTC)",
        shortLabel: "LTC",
        type: "litecoin",
        placeholder: "ltc1...",
        hint: "ltc1... or L... / M...",
      },
      {
        label: "Ripple (XRP)",
        shortLabel: "XRP",
        type: "xrp",
        placeholder: "r...",
        hint: "r... address",
      },
      {
        label: "Base",
        shortLabel: "BASE",
        type: "evm",
        placeholder: "0x...",
        hint: "0x... (42 chars)",
      },
      {
        label: "Optimism",
        shortLabel: "OP",
        type: "evm",
        placeholder: "0x...",
        hint: "0x... (42 chars)",
      },
      {
        label: "Avalanche C-Chain",
        shortLabel: "AVAX",
        type: "evm",
        placeholder: "0x...",
        hint: "0x... (42 chars)",
      },
    ],
    useCasesEyebrow: "USE CASES",
    useCases: [
      {
        title: "Proof of Funds UI Testing",
        description:
          "Demonstrate simulated liquidity and financial-capacity screens for educational verification flows, protocol demos, and partnership mockups.",
      },
      {
        title: "Testing & Development",
        description:
          "Test dApp integrations, smart contracts, wallet interfaces, and blockchain applications with realistic simulated token balances.",
      },
      {
        title: "Temporary Visibility",
        description:
          "Create time-limited token display previews for screenshots, demonstrations, educational materials, and short-term testing needs.",
      },
      {
        title: "API Integration Testing",
        description:
          "Validate exchange-style APIs, trading bots, portfolio trackers, and analytical tools using simulated high-value balances.",
      },
      {
        title: "Social Credibility Mockups",
        description:
          "Create educational community, mentorship, and group-access mockups that show simulated holdings without claiming real funds.",
      },
    ],
    howItWorks: {
      title: "How the Demo Preview Works",
      description:
        "Flash Max uses a front-end simulation pattern for showing USDT-style balances inside your own interface. It does not mint tokens, alter blockchain records, or create spendable balances in real wallets or exchanges.",
    },
    keyFeatures: {
      title: "Key Features",
      items: [
        {
          title: "Instant Delivery",
          description:
            "Demo token values appear in your test interface after the payment preview is confirmed.",
        },
        {
          title: "Fully Anonymous",
          description:
            "No KYC fields, no sensitive wallet credentials, and crypto payment instructions only.",
        },
        {
          title: "Flexible Duration",
          description:
            "Use configurable visibility periods based on your educational testing and demo needs.",
        },
        {
          title: "Multi-Network",
          description:
            "Works with Ethereum, BSC, and Tron-style network labels for the same simulated token appearance.",
        },
      ],
    },
    generatorFaq: [
      {
        question: "What happens when the duration expires?",
        answer:
          "The simulated balance display can be hidden or reset in your own test interface. This demo does not burn tokens, modify wallets, or change any block explorer records.",
      },
      {
        question: "Is this legal to use?",
        answer:
          "This interface is designed for legitimate testing, demonstrations, and educational UI previews. Using any demo to deceive others in financial transactions may violate local laws. Always use responsibly.",
      },
      {
        question: "Can I extend the duration after purchase?",
        answer:
          "Duration behavior is controlled by your own configuration or backend. You can edit the duration options in siteConfig.ts or connect custom rules for your project.",
      },
      {
        question: "How fast will I receive the preview?",
        answer:
          "The front-end preview updates immediately after valid inputs. Real payment confirmation, fulfillment, or customer delivery requires your own secure backend.",
      },
      {
        question: "Which wallets are supported?",
        answer:
          "The template includes major wallet and network labels such as MetaMask, Trust Wallet, Coinbase Wallet, ERC-20, BEP-20, and TRC-20 for UI preview purposes only.",
      },
    ],
    supportedNetworksLabel: "SUPPORTED NETWORKS",
    supportedNetworks: [
      { id: "eth", label: "Ethereum" },
      { id: "bnb", label: "BNB Smart Chain" },
      { id: "tron", label: "Tron" },
      { id: "polygon", label: "Polygon" },
      { id: "arbitrum", label: "Arbitrum" },
      { id: "base", label: "Base" },
    ],
    proof: {
      eyebrow: "PROOF",
      title: "Recent Proof Previews",
      items: [
        {
          label: "Wallet Preview",
          value: "1,000,000.00 USDT",
          meta: "Ethereum display",
        },
        {
          label: "Payment Confirmed",
          value: "100.00 USDT",
          meta: "USDT checkout",
        },
        {
          label: "Network Ready",
          value: "60 to 90 Days",
          meta: "Visibility duration",
        },
      ],
    },
    reviews: {
      eyebrow: "REVIEWS",
      title: "Customer Reviews",
      intro: "Share your experience and read recent feedback from other users.",
      nameLabel: "Your Name",
      namePlaceholder: "Enter your name",
      reviewLabel: "Your Review",
      reviewPlaceholder: "Write your review...",
      ratingLabel: "Rating",
      submitLabel: "Submit Review",
      emptyMessage: "No reviews yet. Be the first to add one.",
      savedMessage: "Review saved successfully.",
      defaultReviews: [
        {
          name: "Alex M.",
          rating: 5,
          text: "Clean layout, fast checkout flow, and easy instructions.",
          date: "May 2026",
        },
        {
          name: "Sam R.",
          rating: 5,
          text: "The generator form is simple to use and looks professional.",
          date: "May 2026",
        },
      ],
    },
    protocolLine: "Flash Max Demo Protocol",
    version: "v3.1.0",
    networkLine: "EVM UI Preview - Tron Label - Base - Arbitrum",
  },
  platforms: [
    "Binance",
    "Coinbase",
    "Trust Wallet",
    "MetaMask",
    "Ledger",
    "Phantom",
    "OKX",
    "Bybit",
    "KuCoin",
    "Crypto.com",
  ],
  features: {
    eyebrow: "WHY CHOOSE US",
    title:
      "A fast, flexible service layout for launches, memberships, and digital products.",
    intro:
      "Swap this copy for your own positioning. The section spacing, cards, and visual weight are ready for a high-conversion brand page.",
    items: [
      {
        title: "Lightning-Fast Flow",
        description:
          "Guide visitors from headline to package selection with a direct, low-friction path.",
      },
      {
        title: "Multi-Network Ready",
        description:
          "Keep token, network, wallet address, and instructions editable from one config file.",
      },
      {
        title: "Multiple Packages",
        description:
          "List several product or service tiers with clean pricing and package details.",
      },
      {
        title: "Trust-Oriented UI",
        description:
          "Use polished cards, confirmations, FAQs, and transparent payment guidance.",
      },
    ],
  },
  process: {
    eyebrow: "HOW IT WORKS",
    title: "A clear three-step order path.",
    steps: [
      {
        title: "Choose a package",
        description:
          "Visitors pick the plan that matches their needs from editable pricing cards.",
      },
      {
        title: "Send payment",
        description:
          "The checkout page shows a public receiving address, token, network, and instructions.",
      },
      {
        title: "Submit confirmation",
        description:
          "Visitors can provide their transaction ID and contact details for manual review.",
      },
    ],
  },
  products: [
    {
      name: "Starter Access",
      slug: "starter",
      priceUsd: 25,
      priceLabel: "$25",
      summary: "Good for a first order or small launch.",
      highlighted: false,
      features: ["Basic onboarding", "Manual review", "Email support"],
    },
    {
      name: "Growth Access",
      slug: "growth",
      priceUsd: 75,
      priceLabel: "$75",
      summary: "A balanced package for growing brands.",
      highlighted: true,
      features: ["Priority onboarding", "Faster review", "WhatsApp support"],
    },
    {
      name: "Scale Access",
      slug: "scale",
      priceUsd: 150,
      priceLabel: "$150",
      summary: "For larger requests that need more handling.",
      highlighted: false,
      features: ["Dedicated queue", "Extended support", "Custom notes"],
    },
  ],
  highlights: {
    eyebrow: "TRANSACTION HIGHLIGHTS",
    title: "Editable proof-style cards for your own screenshots.",
    intro:
      "Replace these placeholders with original screenshots, customer proof, or product previews that you own.",
    images: [
      {
        src: "/images/transaction-1.svg",
        alt: "Placeholder payment preview one",
        label: "Order Preview",
      },
      {
        src: "/images/transaction-2.svg",
        alt: "Placeholder payment preview two",
        label: "Review Queue",
      },
      {
        src: "/images/transaction-3.svg",
        alt: "Placeholder payment preview three",
        label: "Confirmation",
      },
    ],
  },
  testimonials: {
    eyebrow: "CUSTOMER NOTES",
    title: "Original testimonial placeholders.",
    items: [
      {
        quote:
          "The page was easy to understand, and the payment instructions were clear from the start.",
        name: "Alex Morgan",
        role: "Founder",
      },
      {
        quote:
          "The package cards and confirmation flow made the buying process feel professional.",
        name: "Sam Reed",
        role: "Digital operator",
      },
      {
        quote:
          "Everything I needed was visible without a long back-and-forth conversation.",
        name: "Nina Cole",
        role: "Creator",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions visitors usually ask.",
    items: [
      {
        question: "Can I change the brand name and logo?",
        answer:
          "Yes. Update brandName and logoPath in siteConfig.ts, then replace the logo file in public/images.",
      },
      {
        question: "Where do I change the wallet address?",
        answer:
          "Edit payment.walletAddress in siteConfig.ts. Use only a public receiving address, never a seed phrase or private key.",
      },
      {
        question: "Does this process connect to a real backend?",
        answer:
          "The reviews section uses an API backend. Payment processing still needs your own secure backend if you want automation.",
      },
      {
        question: "Can I change prices and packages?",
        answer:
          "Yes. Edit the products array in siteConfig.ts to update names, prices, summaries, and included features.",
      },
    ],
  },
  payment: {
    title: "Complete Your Order",
    intro:
      "Select a package, send the exact amount to the public receiving address, then submit the confirmation details.",
    tokenName: "USDT",
    paymentNetwork: "TRC20",
    walletAddress: "TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    walletLabel: "Public receiving address",
    qrImage: "/images/qr-placeholder.svg",
    minimumDepositLabel: "Minimum deposit",
    minimumDepositValue: "$25",
    instructions: [
      "Send only the configured token on the selected network.",
      "Do not send from an exchange or wallet that cannot provide a transaction ID.",
      "Never share your seed phrase, private key, wallet password, or login codes.",
      "After sending, paste your transaction ID and contact details for manual review.",
    ],
    confirmationFields: {
      transactionIdLabel: "Transaction ID",
      contactLabel: "Contact email or WhatsApp",
      noteLabel: "Order note",
      submitLabel: "Submit Confirmation",
    },
    supportText:
      "Need help before paying? Contact support through the WhatsApp link from your config.",
  },
  notice: {
    title: "Important Notice",
    intro:
      "Please read this before using the payment area. This website is a customizable template and does not request sensitive wallet credentials.",
    points: [
      {
        label: "Public address only",
        text:
          "Only use a public receiving address for payment instructions. Never collect seed phrases, private keys, or wallet passwords.",
      },
      {
        label: "Placeholder content",
        text:
          "All names, prices, claims, testimonials, screenshots, and payment values are editable placeholders.",
      },
      {
        label: "Manual verification",
        text:
          "The confirmation form is a front-end placeholder. Add your own secure backend before processing real orders.",
      },
      {
        label: "Legal compliance",
        text:
          "Replace this copy with accurate terms for your own business and comply with your local regulations.",
      },
    ],
    warning:
      "Do not use this template to mislead visitors, impersonate another brand, or request private wallet credentials.",
    acceptLabel: "I Understand & Accept",
  },
  finalCta: {
    title: "READY TO LAUNCH YOUR PREMIUM FLOW?",
    body:
      "Replace the placeholders with your own offer, pricing, assets, and payment details. The structure is ready for a polished brand rollout.",
    stats: [
      { value: "50K+", label: "Template-ready visits" },
      { value: "99.9%", label: "Static uptime target" },
      { value: "24/7", label: "Support copy" },
    ],
  },
  contact: {
    title: "Contact Support",
    body:
      "Use this page for your own support instructions, response time, and contact channels.",
    email: "support@example.com",
    phone: "+1 000 000 0000",
  },
  footer: {
    description: "",
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "Generator", href: "/#generator" },
      { label: "Reviews", href: "/#reviews" },
    ],
    supportLinks: [
      { label: "Contact Us", href: "/contact" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
    copyright: "(c) 2026 Flash Max. All rights reserved.",
    disclaimer:
      "This template uses placeholder content. Replace it with accurate, legal, and original details for your business.",
  },
  legal: {
    termsTitle: "Terms of Service",
    privacyTitle: "Privacy Policy",
    updatedLabel: "Last updated: May 19, 2026",
    terms: [
      "These placeholder terms should be replaced by terms written for your own business.",
      "The payment instructions shown by this template are editable and should use only public receiving addresses.",
      "Do not use this website to impersonate another brand, mislead customers, or request private wallet credentials.",
    ],
    privacy: [
      "This placeholder policy should be replaced with your actual privacy practices.",
      "If you collect order confirmations or reviews, store them securely and only request information you genuinely need.",
      "Do not collect seed phrases, private keys, wallet passwords, or login credentials.",
    ],
  },
} as const;
