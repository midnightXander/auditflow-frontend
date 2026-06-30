export interface AuditResults {
  url: string,
  client_name: string,
  audit_date: string
  overall_score: number
  lighthouse: {
    categories: Record<string, { title: string; score: number; description: string }>
    metrics: {
      coreWebVitals?: Record<string, { displayValue: string; score: number; rating: string }>
      performance?: Record<string, { displayValue: string; score: number }>
    }
    opportunities?: Array<{ title: string; description: string; savings?: { ms: number } }>
    audits : any
  }
  broken_links: { total_checked: number; broken_count: number; status: string; broken_links: any[] }
  image_optimization: { total_images: number; score: number; issues: any; recommendations: string[] }
  structured_data: { score: number; status: string; has_json_ld: boolean; has_open_graph: boolean; has_twitter_card: boolean; has_microdata: boolean; json_ld_types: string[]; open_graph_properties: string[]; twitter_card_type: string; recommendations: string[] }
  content_quality: { score: number; status: string; word_count: number; paragraph_count: number; avg_sentence_length: number; avg_paragraph_length: number; content_to_code_ratio: number; reading_ease_score: number; reading_level: string; heading_structure: Record<string, number>; recommendations: string[] }
  technical_seo: { title: any; meta_description: any; canonical: any; robots_txt: boolean; sitemap_xml: boolean; headings: Record<string, number> }
  security: { https: boolean; security_headers: Record<string, boolean> }
}

export interface AuditIssue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  impact: string;
  recommendation: string;
}

export interface AuditReport {
  id: string;
  url: string;
  date: string;
  overallScore: number;
  scores: { onPage: number; technical: number; performance: number; mobile: number; security: number };
  issues: AuditIssue[];
  summary: string;
  keywords: { keyword: string; position: number; volume: number }[];
  competitors: { name: string; score: number }[];
}

export const auditReports: AuditReport[] = [
  {
    id: 'AUD-2841',
    url: 'acme-agency.com',
    date: '2025-06-15T14:30:00Z',
    overallScore: 92,
    scores: { onPage: 95, technical: 88, performance: 91, mobile: 94, security: 96 },
    summary: 'This website demonstrates strong SEO fundamentals with excellent on-page optimization and mobile experience. Minor technical improvements recommended around image compression and canonical tag consistency.',
    keywords: [
      { keyword: 'digital marketing agency', position: 3, volume: 8400 },
      { keyword: 'seo services', position: 5, volume: 12200 },
      { keyword: 'content marketing', position: 8, volume: 6100 },
    ],
    competitors: [
      { name: 'Competitor A', score: 78 },
      { name: 'Competitor B', score: 85 },
      { name: 'Competitor C', score: 71 },
    ],
    issues: [
      { id: 'I-001', title: 'Missing alt text on 3 images', description: 'Images on the blog and services pages are missing alt attributes.', severity: 'warning', category: 'On-Page SEO', impact: 'Medium', recommendation: 'Add descriptive alt text to all images for better accessibility and image SEO.' },
      { id: 'I-002', title: 'Slow server response time', description: 'TTFB averaging 780ms on key landing pages.', severity: 'warning', category: 'Performance', impact: 'High', recommendation: 'Implement server-side caching and consider upgrading hosting or using a CDN.' },
      { id: 'I-003', title: 'H1 tag missing on about page', description: 'The about page does not have a proper H1 heading.', severity: 'info', category: 'On-Page SEO', impact: 'Medium', recommendation: 'Add a single, descriptive H1 tag to the about page that includes your primary keyword.' },
      { id: 'I-004', title: 'Meta description too short', description: 'Meta descriptions on 4 pages are under 120 characters.', severity: 'info', category: 'On-Page SEO', impact: 'Low', recommendation: 'Expand meta descriptions to 150-160 characters for better CTR.' },
      { id: 'I-005', title: 'Schema markup incomplete', description: 'Organization schema is missing logo and sameAs properties.', severity: 'warning', category: 'Technical', impact: 'Medium', recommendation: 'Add complete Organization schema with logo URL and social profile links.' },
      { id: 'I-006', title: 'No XML sitemap found', description: 'Could not locate an XML sitemap at /sitemap.xml.', severity: 'critical', category: 'Technical', impact: 'High', recommendation: 'Generate and submit an XML sitemap to Google Search Console.' },
      { id: 'I-007', title: 'Internal links could be improved', description: 'Several orphaned pages with no internal links pointing to them.', severity: 'info', category: 'On-Page SEO', impact: 'Low', recommendation: 'Add contextual internal links to orphaned pages from relevant content.' },
      { id: 'I-008', title: 'HTTPS mixed content', description: '2 resources loaded over HTTP on secure pages.', severity: 'warning', category: 'Security', impact: 'Medium', recommendation: 'Update all resource URLs to use HTTPS.' },
    ],
  },
  {
    id: 'AUD-2840',
    url: 'client-site.io',
    date: '2025-06-15T12:15:00Z',
    overallScore: 67,
    scores: { onPage: 72, technical: 58, performance: 64, mobile: 70, security: 82 },
    summary: 'Significant technical SEO issues detected including slow page speed, missing sitemap, and poor crawlability. Immediate action recommended to address critical issues before they impact rankings further.',
    keywords: [
      { keyword: 'web design services', position: 12, volume: 5400 },
      { keyword: 'brand strategy', position: 18, volume: 3200 },
    ],
    competitors: [
      { name: 'Competitor A', score: 81 },
      { name: 'Competitor B', score: 74 },
      { name: 'Competitor C', score: 69 },
    ],
    issues: [
      { id: 'I-009', title: 'No XML sitemap found', description: 'Sitemap is missing entirely from the site.', severity: 'critical', category: 'Technical', impact: 'High', recommendation: 'Create and submit an XML sitemap immediately.' },
      { id: 'I-010', title: 'Robots.txt blocking important pages', description: 'Disallow rules are preventing crawling of key content pages.', severity: 'critical', category: 'Technical', impact: 'High', recommendation: 'Review and fix robots.txt rules to allow search engines to crawl important pages.' },
      { id: 'I-011', title: 'Duplicate title tags', description: '8 pages share the same title tag text.', severity: 'critical', category: 'On-Page SEO', impact: 'High', recommendation: 'Write unique, keyword-optimized title tags for each page.' },
      { id: 'I-012', title: 'Largest Contentful Paint > 4s', description: 'LCP is 4.2 seconds, well above the recommended 2.5s threshold.', severity: 'critical', category: 'Performance', impact: 'High', recommendation: 'Optimize images, enable compression, and consider using a CDN.' },
      { id: 'I-013', title: 'Missing meta descriptions', description: '12 pages have no meta description tags.', severity: 'warning', category: 'On-Page SEO', impact: 'Medium', recommendation: 'Write compelling meta descriptions for all pages.' },
      { id: 'I-014', title: 'No SSL certificate', description: 'Site is serving over HTTP without any SSL redirect.', severity: 'critical', category: 'Security', impact: 'High', recommendation: 'Install an SSL certificate and redirect all HTTP traffic to HTTPS.' },
      { id: 'I-015', title: 'Broken internal links', description: '6 internal links return 404 errors.', severity: 'warning', category: 'Technical', impact: 'Medium', recommendation: 'Fix or remove broken internal links.' },
      { id: 'I-016', title: 'Images not compressed', description: 'Page images average 2.4MB each with no compression.', severity: 'warning', category: 'Performance', impact: 'Medium', recommendation: 'Compress all images and convert to WebP format.' },
    ],
  },
];

export function getAuditById(id: string): AuditReport | undefined {
  return auditReports.find((a) => a.id === id);
}

export const reportTemplates = [
  {
    id: 'executive',
    name: 'Executive Summary',
    description: 'Clean, high-level overview with key metrics and prioritized recommendations.',
    accentColor: '#00a4c6',
    previewImage: '/images/showcase-5.jpg',
  },
  {
    id: 'detailed',
    name: 'Detailed Technical',
    description: 'Comprehensive audit with all findings, detailed analysis, and step-by-step fixes.',
    accentColor: '#6366f1',
    previewImage: '/images/showcase-1.jpg',
  },
  {
    id: 'branded',
    name: 'Agency Branded',
    description: 'Fully white-labeled report with your logo, colors, and custom messaging.',
    accentColor: '#34d399',
    previewImage: '/images/showcase-5.jpg',
  },
];
