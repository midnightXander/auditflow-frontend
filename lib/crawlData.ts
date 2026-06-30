export interface CrawlResults {
  client_name: string
  summary: {
    start_url: string
    domain: string
    total_pages_crawled: number
    total_internal_links: number
    total_external_links: number
    unique_external_domains: number
    avg_word_count: number
    avg_load_time_ms: number
    crawl_duration_sec: number
    crawl_date: string
  }
  issues: {
    duplicate_titles: Record<string, string[]>
    duplicate_content: Array<{ urls: string[]; count: number }>
    thin_content: Array<{ url: string; word_count: number }>
    orphan_pages: Array<{ url: string; word_count: number }>
    broken_pages: Array<{ url: string; status_code: number; error?: string }>
    missing_meta_description: string[]
    missing_h1: string[]
    multiple_h1: Array<{ url: string; h1_count: number; h1_tags: string[] }>
    slow_pages: Array<{ url: string; load_time_ms: number }>
    large_pages: Array<{ url: string; size_kb: number }>
  }
  site_structure: Record<string, Array<{ url: string; title: string; word_count: number }>>
  top_pages: {
    most_linked: any[]
    longest_content: any[]
    slowest: any[]
  }
  pages: any[]
}

export interface Crawl {
    id: number
    job_id: string
    url: string
    issues_found: number
    status: string
    pages_crawled: number
    results: CrawlResults
    created_at: string
    progress: number
}