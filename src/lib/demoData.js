export const DEMO_REPORT = {
  _isDemo: true,
  company: {
    name: "Vibhor Steel Tubes Limited",
    ticker: "VSTL",
    exchange: "Both",
    sector: "Steel Manufacturing",
    filing_type: "quarterly",
    filing_period: "Q3 FY2025-26 (Oct–Dec 2025)"
  },
  tldr: {
    verdict: "mixed",
    verdict_reason: "Revenue is growing strongly — up 22% year-on-year — but profits are collapsing. Net profit fell 52% compared to Q3 last year. The company is selling more steel but keeping far less of each rupee, caught in a classic commodity squeeze where steel prices have dropped globally.",
    bullets: [
      "Revenue grew 22% YoY to ₹301.5 Cr, but net profit crashed 52% to ₹1.66 Cr",
      "Net profit margin is now below 0.6% — barely any cushion against any operational surprise",
      "Raw materials eat 84% of every rupee of revenue, leaving almost nothing for shareholders",
      "The new Odisha plant has added capacity and debt — finance costs rose 11% YoY",
      "Auditor issued a clean limited review report with no qualifications",
      "Promoters hold 73.66% stake with no pledging — family is still fully in the game"
    ],
    investor_takeaway: "Don't buy this stock without understanding the steel cycle — the business is real, but margins are dangerously thin right now."
  },
  financials: {
    revenue: { value: 301.5, prev: 247.2, period: "Q3 FY26", prev_period: "Q3 FY25" },
    net_profit: { value: 1.66, prev: 3.43, period: "Q3 FY26", prev_period: "Q3 FY25" },
    ebitda: {
      value: 9.17,
      prev: 14.03,
      margin: 3.04,
      prev_margin: 5.67,
      calculation_note: "EBITDA = PBT (₹2.17 Cr) + Finance Cost (₹4.46 Cr) + Depreciation (₹4.46 Cr) - Other Income (₹2.49 Cr) = ₹9.17 Cr"
    },
    operating_margin: { value: 1.07, prev: 2.44 },
    net_margin: { value: 0.55, prev: 1.39 },
    eps: { value: 0.87, prev: 1.81, period: "Q3 FY26", prev_period: "Q3 FY25" },
    debt: { value: null, prev: null },
    ytd: {
      revenue: 817.2,
      net_profit: 6.22,
      ebitda: 28.4,
      period_label: "9M FY2025-26"
    },
    commentary: "VSTL is in a classic volume-up, margin-down situation. They're shipping more steel than ever, but global steel prices have softened, so each tonne they sell earns less. Revenue grew ₹54 Cr year-on-year, but profit shrank by ₹1.77 Cr. EBITDA margin has compressed from 5.67% to 3.04% — showing the operational squeeze clearly."
  },
  trend: {
    direction: "mixed",
    summary: "Revenue has grown consistently over the past few years, more than doubling from FY21 to FY25. But profit has been volatile — it jumped in FY23, stayed decent in FY24, then dropped sharply in FY25 and is deteriorating further in FY26. This is the pattern of a commodity business: you can grow volume, but you can't control the price you get.",
    data_points: [
      { period: "FY23", revenue: 1113, profit: 21.07 },
      { period: "FY24", revenue: 1074, profit: 17.72 },
      { period: "FY25", revenue: 998, profit: 11.77 },
      { period: "9M FY26", revenue: 817, profit: 6.22 }
    ]
  },
  business: {
    what_they_do: "Vibhor Steel Tubes makes steel pipes and tubes — the kind used in water supply, construction, and infrastructure projects. They have factories in Maharashtra, Telangana, and Odisha. A large chunk of their production is made for Jindal Pipes Limited and sold under the Jindal Star brand.",
    key_segments: ["ERW Pipes", "GI Pipes", "Crash Barriers", "Transmission Line Towers"],
    key_customers_or_geographies: "Jindal Pipes Limited is the anchor customer — a major listed steel company. India-focused, with some exports.",
    moat: "Honestly, not much. This is a commoditised manufacturing business — they don't set prices, they take whatever the market offers. Their edge is operational scale, three plants across India, and a six-year supply agreement with Jindal Pipes. That agreement is both their biggest strength and their biggest single-customer risk."
  },
  risks: [
    {
      severity: "high",
      title: "Profit margin near zero",
      detail: "At 0.55% net margin, the company has almost no buffer. Any spike in raw material costs, power costs, or interest rates could push them into a loss. This is not a safe position for a listed company."
    },
    {
      severity: "high",
      title: "Jindal Pipes dependency",
      detail: "A significant share of production goes to one customer under a manufacturing agreement. If Jindal Pipes renegotiates terms, delays orders, or finds a cheaper supplier, VSTL's revenue and factory utilisation take an immediate hit."
    },
    {
      severity: "medium",
      title: "Steel price cycle risk",
      detail: "The company has no pricing power — they sell at whatever the market rate for steel is. If global steel prices stay depressed (as they have been since late 2023), margins will remain squeezed regardless of how efficiently they operate."
    },
    {
      severity: "medium",
      title: "Rising interest burden from expansion",
      detail: "The new Odisha plant was debt-funded. Finance costs are up 11% YoY for the 9-month period. In a low-margin business, this interest expense eats a meaningful slice of whatever thin profit remains."
    }
  ],
  positives: [
    {
      title: "Revenue momentum is real",
      detail: "22% year-on-year revenue growth is not trivial. The company is winning orders, filling factories, and growing its customer base — even if margins are under pressure."
    },
    {
      title: "New Odisha plant adds capacity",
      detail: "The recently commissioned Odisha facility expands production capacity and should reduce logistics costs for east India customers. Management expects it to contribute to a stronger FY27."
    },
    {
      title: "Promoters buying more shares",
      detail: "Promoter holding increased from 73.48% to 73.66% during FY25 through open market purchases. When founders spend their own money buying stock, it's a meaningful signal of confidence."
    },
    {
      title: "Clean audit — no red flags in accounting",
      detail: "The statutory auditor issued an unqualified limited review report. No accounting tricks, no unusual adjustments, no going-concern warnings."
    }
  ],
  management_commentary: {
    available: true,
    tone: "cautious",
    tone_note: "Management is carefully optimistic — acknowledging the difficult environment while pointing to future catalysts, but stopping short of any specific guidance.",
    key_statements: [
      {
        said: "The decline in revenue and profit was primarily due to a significant drop in steel prices in domestic and international markets.",
        means: "They're blaming the steel market, which is fair — prices have genuinely fallen. But it also means they have no control over when things improve."
      },
      {
        said: "The company sold approximately the same quantity of steel as the previous year, but lower prices led to reduced turnover and profit.",
        means: "Volume is holding up. This is actually important — they're not losing customers, they're just getting paid less per tonne. If prices recover, profits should snap back."
      },
      {
        said: "The Odisha plant is expected to enhance capacity, reduce logistical costs, and provide access to new regional markets.",
        means: "This is forward-looking and hard to verify. It's the management's best argument for why FY27 should be better than FY26."
      }
    ]
  },
  ratios: [
    {
      name: "Net profit margin",
      value: "0.55%",
      benchmark: "Steel manufacturers typically need 2–4% net margin to be considered healthy. Below 1% is a warning sign.",
      assessment: "weak"
    },
    {
      name: "EPS",
      value: "₹0.87 (Q3)",
      benchmark: "Full year EPS was ₹6.21 in FY25. At current run rate, FY26 EPS will be meaningfully lower.",
      assessment: "weak"
    },
    {
      name: "Revenue growth (YoY)",
      value: "+21.9%",
      benchmark: "Strong for a steel manufacturer. Industry average growth is 8–12% in normal years.",
      assessment: "strong"
    },
    {
      name: "Raw material as % of revenue",
      value: "84%",
      benchmark: "For ERW pipe manufacturers, 75–80% is typical. 84% is high and leaves very little room for error.",
      assessment: "weak"
    },
    {
      name: "Promoter holding",
      value: "73.66%",
      benchmark: "High promoter holding (above 60%) means founders have skin in the game. It also means low public float and can make the stock illiquid.",
      assessment: "ok"
    }
  ],
  red_flags: [
    {
      flag: "Promoter share pledging",
      status: "clear",
      detail: "No promoter shares are pledged. This is a good sign — pledging would indicate financial stress."
    },
    {
      flag: "Auditor qualifications",
      status: "clear",
      detail: "The statutory auditor (Ashok Kumar Goyal & Co.) issued a clean limited review report dated 13 Feb 2026 with no qualifications or adverse remarks."
    },
    {
      flag: "Related party transactions",
      status: "watch",
      detail: "Multiple promoter family members are on the company payroll — Vijay Kaushik, Vibhor Kaushik, Vijay Laxmi Kaushik, Pratima Sandhir. Annual salaries totalling ₹6.5+ Cr. Not unusual for a family-run business, but worth tracking whether compensation is in line with market rates."
    },
    {
      flag: "Customer concentration",
      status: "concern",
      detail: "Heavy reliance on Jindal Pipes Limited as the anchor manufacturing partner. The six-year agreement provides some stability, but single-customer dependency is a structural risk that SEBI filings do not fully quantify."
    },
    {
      flag: "Profit margin compression",
      status: "concern",
      detail: "Net margin has fallen from 1.89% in FY23 to 1.18% in FY25 to below 0.6% in Q3 FY26. The trend is consistently downward with no sign of reversal yet."
    }
  ],
  what_changed: "The most important change this quarter versus Q3 FY25 is the severity of margin compression. Revenue is actually up 22%, but net profit is down 52% — the gap between those two numbers tells you everything about what's happening. The new Odisha plant has come online since the DRHP was filed in 2023, adding capacity but also debt. Finance costs are now 11% higher year-on-year. The Labour Codes (notified Nov 2025) were assessed as having no material impact for this quarter, but management flagged they'll continue monitoring this.",
  hidden_insights: [
    "Inventory movement is unusual: changes in finished goods inventory swung from -₹12.1 Cr (Q2 FY26) to +₹21.2 Cr (Q3 FY26), suggesting the company built up stock rather than selling everything it produced — possibly anticipating a price recovery.",
    "The company has no subsidiary, associate, or joint venture — it's a pure standalone entity. This simplifies analysis but also means there are no hidden subsidiaries that could be used to park losses.",
    "Other income of ₹2.49 Cr this quarter is unusually high compared to prior quarters (₹0.37 Cr in Q2, ₹0.18 Cr in Q3 FY25). The filing doesn't break this down — worth checking whether this is a one-off gain that inflated the headline profit.",
    "The auditor is a relatively small regional CA firm (Ashok Kumar Goyal & Co., Hisar) for a company with ₹1,000 Cr revenue. This is common for SME-origin companies post-listing but is worth noting as a governance observation."
  ],
  bear_bull: {
    bull: [
      "Volume is holding up — if steel prices recover by even 5–8%, profit margins could double or triple from current levels without any operational change",
      "Promoters are buying stock in the open market — they clearly believe the current price undervalues the company",
      "The Odisha plant provides fresh capacity and access to east Indian markets that competitors may not be able to serve as cost-effectively"
    ],
    bear: [
      "There is no floor on how far steel prices can fall — if China dumps more steel globally or domestic demand slows, margins could go negative",
      "The Jindal Pipes agreement expires in 2029 — if Jindal builds its own capacity or switches supplier, VSTL loses its anchor revenue overnight",
      "At sub-1% net margins, one bad quarter (a plant shutdown, a raw material spike, a monsoon disruption) could wipe out an entire year's profit"
    ]
  },
  eli15: {
    company_in_one_line: "Vibhor Steel Tubes is like a factory that makes metal pipes — the kind that go underground for water supply or are used in construction — and their biggest customer is another bigger company called Jindal Pipes.",
    what_happened: "This quarter, the factory sold more pipes than ever before, but the price of steel fell globally, so they made much less money per pipe. It's like if you sold 1,000 samosas instead of 800, but the price of flour doubled — you're busier but poorer.",
    should_i_care: "This is an interesting company to watch if you're learning about how commodity businesses work — it's a great example of how a company can grow revenue but still struggle with profits. As an actual investment right now, it's risky for a first-time investor because the margins are razor-thin and depend heavily on steel prices, which nobody can predict."
  },
  drhp_extras: null
};
