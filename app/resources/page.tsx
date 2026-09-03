"use client";

import React from "react";
import Link from "next/link";

export default function GlossaryPage() {
  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem", fontFamily: "Inter, system-ui, sans-serif" }}>
      <header>
        <h1 style={{ fontSize: "2rem", marginBottom: ".25rem" }}>Plain‑English SEO Glossary</h1>
        <p style={{ color: "#444", marginTop: 0 }}>
          Short, client-friendly explanations of core SEO terms — share this with clients, teammates, or marketing partners.
        </p>
        <div style={{ marginTop: "1rem", display: "flex", gap: ".5rem", alignItems: "center" }}>
          <a
            href="/plain-english-seo-glossary.pdf"
            download
            style={{ background: "#0b66ff", color: "white", padding: ".6rem 1rem", borderRadius: 6, textDecoration: "none" }}
          >
            Download PDF
          </a>
          <Link href="#why" style={{ color: "#0b66ff", textDecoration: "underline" }}>Why this exists</Link>
        </div>
      </header>

      <section id="why" style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem" }}>Why this glossary?</h2>
        <p style={{ color: "#444" }}>
          Too much jargon makes clients confused and distrustful. This glossary translates technical SEO into plain language clients understand and can share.
        </p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem" }}>Quick glossary</h2>
        <dl style={{ marginTop: ".75rem", lineHeight: 1.5 }}>
          <dt><strong>Algorithm</strong></dt>
          <dd>Google’s secret recipe for ranking pages. You can’t see it, but you can make pages it likes: clear content, fast performance, and a trustworthy reputation.</dd>

          <dt><strong>Authority</strong></dt>
          <dd>How much Google trusts your site for a topic. The more you’re seen as an expert, the more likely you are to appear for relevant searches.</dd>

          <dt><strong>Backlink</strong></dt>
          <dd>A link from another site to yours — a public vote. Links from reputable sites are one of the strongest signals that build trust and visibility.</dd>

          <dt><strong>Bounce Rate</strong></dt>
          <dd>The share of visitors who leave after viewing only one page. A high bounce usually means the page didn’t match user expectations.</dd>

          <dt><strong>Crawling</strong></dt>
          <dd>Google’s automated spiders reading your pages. If Google can’t crawl your site, it can’t rank it — blocked crawling is like a locked front door.</dd>

          <dt><strong>Domain Authority (DA)</strong></dt>
          <dd>A third-party score (0–100) estimating ranking strength. It’s a rough tool, not a Google metric — use it as a reference, not gospel.</dd>

          <dt><strong>Featured Snippet</strong></dt>
          <dd>The highlighted answer box at the top of search results. If you win it, you appear above the #1 result and get extra attention.</dd>

          <dt><strong>Focus Keyword</strong></dt>
          <dd>The single phrase a page is meant to answer. Staying focused helps match searcher queries and avoids confusing the page’s purpose.</dd>

          <dt><strong>Indexing</strong></dt>
          <dd>When Google adds a page to its searchable library. If a page isn’t indexed, it won’t show up in search at all.</dd>

          <dt><strong>Internal Links</strong></dt>
          <dd>Links between your own pages. They help visitors find related content and tell Google which pages are connected and important.</dd>

          <dt><strong>Jargon</strong></dt>
          <dd>Insider language that confuses clients. Plain explanations build trust and let clients understand value and results.</dd>

          <dt><strong>Keyword</strong></dt>
          <dd>A word or phrase people type into search. Ranking for the right keywords means showing up when potential customers are looking.</dd>

          <dt><strong>Link Building</strong></dt>
          <dd>Strategies to earn links from other sites. Done correctly it increases trust; spammy/paid links can cause penalties.</dd>

          <dt><strong>Local SEO</strong></dt>
          <dd>Optimizing to appear in local results, like “near me” searches. Essential for businesses serving a specific area — it brings ready-to-buy customers.</dd>

          <dt><strong>Long‑Tail Keywords</strong></dt>
          <dd>Longer, specific searches (e.g., “CRM for small real estate agencies”). Lower volume but higher intent — often easier to convert.</dd>

          <dt><strong>Meta Description</strong></dt>
          <dd>The short text under a page title in search results. Think of it as free ad copy — a good one increases clicks even without higher rank.</dd>

          <dt><strong>On‑Page vs Off‑Page SEO</strong></dt>
          <dd>On‑page: things you control on the site (content, titles, speed). Off‑page: external factors (links, mentions). Both work together to earn visibility.</dd>

          <dt><strong>Organic Traffic</strong></dt>
          <dd>Visitors from unpaid search results. High-value traffic because people came looking for something — no cost-per-click.</dd>

          <dt><strong>Page Speed</strong></dt>
          <dd>How quickly a page loads. Slower pages frustrate users and reduce conversions — and search engines prefer fast pages.</dd>

          <dt><strong>Ranking</strong></dt>
          <dd>Your page’s position in search results. Page 1 captures most clicks — moving up even a few positions can greatly increase traffic.</dd>

          <dt><strong>Rank Tracking</strong></dt>
          <dd>Monitoring position changes over time. It’s how you show progress: "We moved from #9 to #3" is an easy-to-understand result.</dd>

          <dt><strong>Search Intent</strong></dt>
          <dd>The reason someone searches: to learn, buy, or find a site. Matching content to intent is how you both rank and convert visitors.</dd>

          <dt><strong>Sitemap</strong></dt>
          <dd>A file that lists your pages so search engines can crawl them more efficiently. Think of it as a map for Google.</dd>

          <dt><strong>Technical SEO</strong></dt>
          <dd>Behind‑the‑scenes fixes: speed, mobile, broken links, crawlability. It’s the plumbing — if it’s broken, great content won’t perform well.</dd>

          <dt><strong>White‑Hat SEO</strong></dt>
          <dd>SEO done by the rules: helpful content and honest tactics. It’s sustainable — shortcuts (black‑hat) risk penalties and removal.</dd>

          <dt><strong>Zero‑Click Searches</strong></dt>
          <dd>When Google answers the query on the results page so no click is needed. You still gain brand visibility if your content is quoted there.</dd>
        </dl>
      </section>

      <footer style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #eee", color: "#666" }}>
        <p>Want this as a PDF? Click <a href="/plain-english-seo-glossary.pdf" download>Download PDF</a>.</p>
      </footer>
    </main>
  );
}