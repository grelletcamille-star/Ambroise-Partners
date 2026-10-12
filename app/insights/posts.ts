// Insights articles. To add one: copy an entry, give it a new unique `slug`, and put the newest first.
// Block types: { h2: '...' } for a heading, { p: '...' } for a paragraph, { ul: ['...', '...'] } for a list.

export type Block = { h2: string } | { p: string } | { ul: string[] };

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO date, e.g. '2026-10-12'
  author: string;
  category: string;
  excerpt: string;
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: 'bridge-financing-before-a-priced-round',
    title: 'Bridge financing before a priced round: what investors look at',
    date: '2026-10-12',
    author: 'Camille Grellet',
    category: 'Capital Raising',
    excerpt: 'A bridge can buy the time a company needs to reach its next value-inflection point, or it can weaken its next round. How to make it the former.',
    body: [
      { p: 'Many healthcare companies raise a bridge between two priced rounds: to reach a clinical readout, a regulatory milestone or a first commercial contract before going back to the market. Done well, a bridge lets the next round be priced on de-risked data. Done poorly, it signals that existing investors are hesitant and leaves the company negotiating from a weaker position.' },
      { h2: 'Tie the money to a milestone' },
      { p: 'The first question any investor asks is what the bridge buys. The answer should be one clearly defined milestone, reached with a comfortable margin of cash. A bridge sized to "extend the runway" without a precise objective is far harder to support than one that funds a specific readout, a CE marking or a partnership signature.' },
      { h2: 'Show insider support' },
      { p: 'New investors read the participation of existing shareholders as a vote of confidence. A meaningful insider commitment, ideally announced before outside investors are approached, makes the rest of the round easier to fill and limits questions about the company’s prospects.' },
      { h2: 'Keep the terms simple' },
      { p: 'Convertible instruments are the usual format. The discount, the valuation cap, the maturity and what happens if the next round does not take place should be clear and in line with market practice. Terms that are too aggressive solve today’s problem by creating one for the next lead investor.' },
      { h2: 'Prepare the next round at the same time' },
      { p: 'The best bridges are run with the following round already in view: the equity story, the data room and the target investor list are built while the bridge is being raised. Some of the investors met at this stage will become candidates to lead the next round.' },
      { ul: [
        'One milestone, funded with a margin of cash',
        'Visible commitment from existing investors',
        'Market-standard, readable terms',
        'The next round prepared in parallel',
      ] },
    ],
  },
  {
    slug: 'licensing-as-a-financing-strategy',
    title: 'Licensing as a financing strategy for emerging biotechs',
    date: '2026-10-05',
    author: 'Thomas Guillot',
    category: 'Partnerships & Licensing',
    excerpt: 'Partnering an asset, a territory or an indication can fund development without dilution, provided the deal is timed and structured with the company’s long-term value in mind.',
    body: [
      { p: 'For an emerging biotech, equity is not the only source of capital. Licensing an asset, a geography or a field of use to a pharmaceutical partner can bring non-dilutive funding, external validation of the science and development capabilities that a small team does not have.' },
      { h2: 'Choose what to partner, and what to keep' },
      { p: 'A licence should monetise what the company cannot develop efficiently on its own, while preserving the core of its value. Regional deals, for instance in markets where the company has no commercial ambitions, or deals limited to one indication, are often a way to raise funds without giving away the main upside.' },
      { h2: 'Timing matters as much as terms' },
      { p: 'The value a partner will attribute to an asset rises sharply with each clinical milestone. Partnering too early can mean selling at a discount; waiting too long can mean running out of cash. The decision should be made against the company’s financing plan, not in isolation.' },
      { h2: 'Structure for the long term' },
      { p: 'Beyond the headline value, what matters is the split between upfront payment, development and commercial milestones and royalties, the allocation of development costs, and the governance of the partnership. Change-of-control and termination clauses should also be read with a future sale of the company in mind.' },
      { h2: 'Run a process' },
      { p: 'A licensing deal is negotiated better with several interested parties. A structured process, with a non-confidential presentation, a well-prepared data room and a defined calendar, creates the competitive tension that improves terms and speeds up decisions.' },
    ],
  },
  {
    slug: 'building-an-equity-story-for-specialist-investors',
    title: 'Building an equity story specialist healthcare investors can underwrite',
    date: '2026-09-28',
    author: 'Camille Grellet',
    category: 'Fundraising',
    excerpt: 'Specialist investors see hundreds of companies a year. A clear equity story connects the science to a credible path to value, and answers their questions before they ask them.',
    body: [
      { p: 'Healthcare investors are specialists. Many have scientific or medical backgrounds, and they review a large number of opportunities each year. An equity story that resonates with them does not simplify the science: it translates it into a clear answer to one question, how this company creates value, and for whom.' },
      { h2: 'Start from the medical need' },
      { p: 'The story should open with the patients and the unmet need: who they are, how they are treated today and why current options fall short. The technology then appears as the answer to that need, not as an end in itself.' },
      { h2: 'Make the path to market explicit' },
      { p: 'Clinical development, regulatory strategy, market access and reimbursement are where many stories lose investors. Each step should be laid out with its timing, its cost and the evidence the company already has. For diagnostics and medical devices in particular, the reimbursement pathway and the adoption model deserve as much attention as the technology.' },
      { h2: 'Show what the money achieves' },
      { p: 'Investors underwrite milestones. The use of proceeds should map directly onto the value-creating events the round will fund, and onto what the company will be worth once they are reached. Comparable transactions and financings help anchor that view in the market.' },
      { h2: 'Anticipate the objections' },
      { p: 'Every company has weaknesses: competition, a small dataset, a long regulatory path. Addressing them openly, with the mitigation plan, builds more credibility than leaving investors to find them in due diligence.' },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
