// export const kpiData = [
//   {
//     label: 'Total Audits',
//     value: '1,284',
//     change: '+12.5%',
//     changeType: 'up' as const,
//     icon: 'FileText',
//   },
//   {
//     label: 'Avg. SEO Score',
//     value: '78/100',
//     change: '+3.2%',
//     changeType: 'up' as const,
//     icon: 'BarChart3',
//   },
//   {
//     label: 'Sites Crawled',
//     value: '156',
//     change: '+8.1%',
//     changeType: 'up' as const,
//     icon: 'Globe',
//   },
//   {
//     label: 'Keywords Tracked',
//     value: '4,231',
//     change: '-2.4%',
//     changeType: 'down' as const,
//     icon: 'Search',
//   },
// ];

export const auditTrendData = [
  { month: 'Jan', audits: 85, score: 72 },
  { month: 'Feb', audits: 102, score: 74 },
  { month: 'Mar', audits: 98, score: 75 },
  { month: 'Apr', audits: 125, score: 73 },
  { month: 'May', audits: 140, score: 76 },
  { month: 'Jun', audits: 165, score: 78 },
  { month: 'Jul', audits: 158, score: 77 },
  { month: 'Aug', audits: 190, score: 79 },
  { month: 'Sep', audits: 210, score: 80 },
  { month: 'Oct', audits: 195, score: 78 },
  { month: 'Nov', audits: 235, score: 81 },
  { month: 'Dec', audits: 268, score: 82 },
];

export const siteHealthData = [
  { name: 'On-Page SEO', value: 92, fill: '#00a4c6' },
  { name: 'Technical', value: 78, fill: '#6366f1' },
  { name: 'Performance', value: 85, fill: '#34d399' },
  { name: 'Mobile', value: 88, fill: '#f59e0b' },
  { name: 'Security', value: 95, fill: '#ef4444' },
];

export const keywordRankingData = [
  { keyword: 'seo tools', position: 3, volume: 12500, change: '+2' },
  { keyword: 'audit software', position: 5, volume: 8200, change: '-1' },
  { keyword: 'white label seo', position: 2, volume: 5400, change: '+5' },
  { keyword: 'site crawler', position: 8, volume: 3100, change: '+3' },
  { keyword: 'keyword tracker', position: 4, volume: 6700, change: '-2' },
  { keyword: 'backlink analysis', position: 6, volume: 4500, change: '+1' },
  { keyword: 'page speed test', position: 1, volume: 18200, change: '+4' },
  { keyword: 'competitor research', position: 7, volume: 2800, change: '-3' },
];

export const recentAudits = [
  {
    id: 'AUD-2841',
    url: 'acme-agency.com',
    score: 92,
    status: 'completed' as const,
    date: '2 min ago',
    issues: { critical: 0, warning: 3, info: 12 },
  },
  {
    id: 'AUD-2840',
    url: 'client-site.io',
    score: 67,
    status: 'completed' as const,
    date: '15 min ago',
    issues: { critical: 2, warning: 8, info: 24 },
  },
  {
    id: 'AUD-2839',
    url: 'digital-marketing.co',
    score: 84,
    status: 'completed' as const,
    date: '1 hr ago',
    issues: { critical: 0, warning: 5, info: 18 },
  },
  {
    id: 'AUD-2838',
    url: 'ecommerce-store.net',
    score: 71,
    status: 'in-progress' as const,
    date: '1 hr ago',
    issues: { critical: 1, warning: 6, info: 15 },
  },
  {
    id: 'AUD-2837',
    url: 'blog-network.org',
    score: 88,
    status: 'completed' as const,
    date: '3 hrs ago',
    issues: { critical: 0, warning: 2, info: 9 },
  },
  {
    id: 'AUD-2836',
    url: 'local-business.com',
    score: 55,
    status: 'completed' as const,
    date: '5 hrs ago',
    issues: { critical: 4, warning: 11, info: 31 },
  },
];

export const activityFeed = [
  { action: 'Audit completed', target: 'acme-agency.com', time: '2 min ago', type: 'success' as const },
  { action: 'New project created', target: 'client-site.io', time: '15 min ago', type: 'info' as const },
  { action: 'PDF report exported', target: 'digital-marketing.co', time: '1 hr ago', type: 'info' as const },
  { action: 'Critical issue found', target: 'ecommerce-store.net', time: '1 hr ago', type: 'warning' as const },
  { action: 'Crawl started', target: 'blog-network.org', time: '3 hrs ago', type: 'info' as const },
  { action: 'Widget lead captured', target: 'new-lead@email.com', time: '4 hrs ago', type: 'success' as const },
  { action: 'Score improved', target: 'local-business.com', time: '5 hrs ago', type: 'success' as const },
  { action: 'API call made', target: '/audit/generate', time: '6 hrs ago', type: 'info' as const },
];

export const competitorData = [
  { name: 'Your Site', score: 84, traffic: 12500, backlinks: 3200 },
  { name: 'Competitor A', score: 76, traffic: 9800, backlinks: 2800 },
  { name: 'Competitor B', score: 89, traffic: 15200, backlinks: 4100 },
  { name: 'Competitor C', score: 71, traffic: 7400, backlinks: 1900 },
];
