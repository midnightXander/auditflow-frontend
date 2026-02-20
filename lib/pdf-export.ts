import jsPDF from 'jspdf'
import { WhiteLabelConfig } from './whitelabel'
import { format } from 'date-fns'

// ─── Colour helpers ───────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return [r, g, b]
}

function scoreColour(score: number): [number, number, number] {
  if (score >= 90) return [16, 185, 129]   // green
  if (score >= 70) return [6, 182, 212]    // cyan
  if (score >= 50) return [245, 158, 11]   // amber
  return [239, 68, 68]                     // red
}

function scoreLabel(score: number) {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Needs Improvement'
  return 'Poor'
}

// Load logo as DataURL
async function loadLogoData(src?: string | null): Promise<{ dataUrl: string; width: number; height: number } | null> {
  if (!src) return null
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'Anonymous' // required to avoid tainting canvas for toDataURL
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(null)
        ctx.drawImage(img, 0, 0)
        const dataUrl = canvas.toDataURL('image/png')
        resolve({ dataUrl, width: img.naturalWidth, height: img.naturalHeight })
      } catch {
        // CORS or other error, fail gracefully
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// ─── Layout constants ─────────────────────────────────────────────────────────

const PAGE_W = 210   // A4 mm
const PAGE_H = 297
const MARGIN = 18
const COL = PAGE_W - MARGIN * 2
const BRAND_H = 22   // header strip height

// ─── Drawing primitives ───────────────────────────────────────────────────────

function brandedHeader(
  doc: jsPDF,
  config: WhiteLabelConfig,
  pageNum: number,
  totalPages: number,
  logo?: { dataUrl: string; width: number; height: number } | null,
) {
  const [r, g, b] = hexToRgb(config.accentColor)
  doc.setFillColor(r, g, b)
  doc.rect(0, 0, PAGE_W, BRAND_H, 'F')

  // logo (if available) + agency name
  let nameX = MARGIN
  if (logo?.dataUrl) {
    const maxH = BRAND_H - 6
    const maxW = 40
    const ratio = Math.min(maxW / logo.width, maxH / logo.height, 1)
    const w = logo.width * ratio
    const h = logo.height * ratio
    const y = (BRAND_H - h) / 2
    try {
      doc.addImage(logo.dataUrl, 'PNG', MARGIN, y, w, h)
      nameX = MARGIN + w + 6
    } catch {
      // fall back to text if addImage fails
      nameX = MARGIN
    }
  }

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(config.agencyName, nameX, 14)
  

  // page number right-aligned
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN, 14, { align: 'right' })
}

function footer(doc: jsPDF, config: WhiteLabelConfig, auditDate: string) {
  const y = PAGE_H - 10
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 150, 150)
  doc.text(config.reportFooter, MARGIN, y)
  doc.text(`Generated ${auditDate}`, PAGE_W - MARGIN, y, { align: 'right' })
  // thin rule above footer
  doc.setDrawColor(220, 220, 220)
  doc.line(MARGIN, y - 4, PAGE_W - MARGIN, y - 4)
}

function sectionTitle(doc: jsPDF, label: string, y: number, accentColor: string) {
  const [r, g, b] = hexToRgb(accentColor)
  doc.setFillColor(r, g, b)
  doc.rect(MARGIN, y, 3, 6, 'F')
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 30, 30)
  doc.text(label, MARGIN + 6, y + 5)
  return y + 12
}

/** Draws a score pill: coloured background + white bold number. Returns right-edge x */
function scorePill(doc: jsPDF, score: number, x: number, y: number) {
  const [r, g, b] = scoreColour(score)
  const pillW = 22, pillH = 8
  doc.setFillColor(r, g, b)
  doc.roundedRect(x, y - 6, pillW, pillH, 2, 2, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text(`${score}`, x + pillW / 2, y - 0.5, { align: 'center' })
  return x + pillW + 2
}

/** Horizontal mini progress bar */
function progressBar(
  doc: jsPDF,
  score: number,
  x: number,
  y: number,
  w: number,
  h = 3,
) {
  const [r, g, b] = scoreColour(score)
  doc.setFillColor(230, 230, 230)
  doc.roundedRect(x, y, w, h, 1, 1, 'F')
  doc.setFillColor(r, g, b)
  doc.roundedRect(x, y, w * (score / 100), h, 1, 1, 'F')
}

/** Tick / cross icon */
function statusIcon(doc: jsPDF, pass: boolean, x: number, y: number) {
  if (pass) {
    doc.setTextColor(16, 185, 129)
    doc.setFontSize(9)
    doc.text('✓', x, y)
  } else {
    doc.setTextColor(239, 68, 68)
    doc.setFontSize(9)
    doc.text('✗', x, y)
  }
}

// ─── Page builder helpers ─────────────────────────────────────────────────────

function newPage(
  doc: jsPDF,
  config: WhiteLabelConfig,
  auditDate: string,
  pageTracker: { num: number; total: number },
) {
  doc.addPage()
  pageTracker.num++
  brandedHeader(doc, config, pageTracker.num, pageTracker.total)
  footer(doc, config, auditDate)
  return BRAND_H + 10   // starting Y for content
}

// ─── Main export function ─────────────────────────────────────────────────────

export async function exportAuditPDF(
  results: any,
  config: WhiteLabelConfig,
): Promise<void> {
  // load logo before building pages so brandedHeader can draw it synchronously
  const logo = await loadLogoData(config.agencyLogo)


  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const auditDate = format(new Date(results.audit_date || Date.now()), 'dd MMM yyyy, HH:mm')
  const totalPages = 5
  const pt = { num: 1, total: totalPages }

  // ─── PAGE 1: Cover ───────────────────────────────────────────────────────────
  {
    const [r, g, b] = hexToRgb(config.accentColor)

    // full-bleed gradient-ish cover
    doc.setFillColor(r, g, b)
    doc.rect(0, 0, PAGE_W, PAGE_H * 0.45, 'F')

    // subtle diagonal stripe
    doc.setFillColor(r - 15 < 0 ? 0 : r - 15, g - 15 < 0 ? 0 : g - 15, b + 20 > 255 ? 255 : b + 20)
    doc.triangle(0, PAGE_H * 0.45, PAGE_W, PAGE_H * 0.38, PAGE_W, PAGE_H * 0.45, 'F')

    // agency name (top-left of cover)
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(config.agencyName.toUpperCase(), MARGIN, 20)

    // big report heading
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('WEBSITE', MARGIN, 55)
    doc.text('AUDIT REPORT', MARGIN, 69)

    // URL chip
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setFillColor(255, 255, 255, 0.18)
    doc.roundedRect(MARGIN, 76, COL, 10, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.text(results.url || '—', MARGIN + 4, 82.5)

    // overall score circle (white circle, coloured text)
    const cx = PAGE_W - MARGIN - 22, cy = 60, cr = 22
    doc.setFillColor(255, 255, 255)
    doc.circle(cx, cy, cr, 'F')
    const [sr, sg, sb] = scoreColour(results.overall_score ?? 0)
    doc.setTextColor(sr, sg, sb)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(`${results.overall_score ?? 0}`, cx, cy + 2, { align: 'center' })
    doc.setFontSize(7)
    doc.setTextColor(80, 80, 80)
    doc.text('/ 100', cx, cy + 8, { align: 'center' })
    doc.setFontSize(8)
    doc.setTextColor(sr, sg, sb)
    doc.text(scoreLabel(results.overall_score ?? 0).toUpperCase(), cx, cy + 14, { align: 'center' })

    // white content area
    const contentY = PAGE_H * 0.45 + 10

    // Prepared for / by
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Prepared for', MARGIN, contentY + 8)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(14)
    doc.text(config.clientName || 'Client', MARGIN, contentY + 17)

    if (config.preparedBy) {
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text(`Prepared by: ${config.preparedBy}`, MARGIN, contentY + 25)
    }

    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    doc.text(`Audit date: ${auditDate}`, MARGIN, contentY + 33)

    // quick summary grid at bottom of cover
    const cats = Object.entries(results.lighthouse?.categories ?? {})
    const gridY = contentY + 48
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(60, 60, 60)
    doc.text('LIGHTHOUSE SCORES', MARGIN, gridY)

    cats.forEach(([, cat]: [string, any], i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const cellX = MARGIN + col * (COL / 2 + 4)
      const cellY = gridY + 6 + row * 18
      const cellW = COL / 2 - 4

      doc.setFillColor(248, 249, 250)
      doc.roundedRect(cellX, cellY, cellW, 14, 2, 2, 'F')

      const [cr2, cg2, cb2] = scoreColour(cat.score)
      doc.setFillColor(cr2, cg2, cb2)
      doc.roundedRect(cellX, cellY, 3, 14, 1, 1, 'F')

      doc.setTextColor(30, 30, 30)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.text(cat.title, cellX + 6, cellY + 5)

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(cr2, cg2, cb2)
      doc.text(`${cat.score}`, cellX + 6, cellY + 11)
    })

    footer(doc, config, auditDate)
  }

  // ─── PAGE 2: Performance & Core Web Vitals ───────────────────────────────────
  {
    doc.addPage()
    brandedHeader(doc, config, 2, totalPages, logo)
    footer(doc, config, auditDate)
    let y = BRAND_H + 10

    y = sectionTitle(doc, 'Performance', y, config.accentColor)

    const metrics = results.lighthouse?.metrics ?? {}
    const cwv = metrics.coreWebVitals ?? {}
    const perf = metrics.performance ?? {}

    // CWV cards row
    const vitals = [
      { key: 'lcp', label: 'Largest Contentful Paint', good: 2500, unit: 'ms' },
      { key: 'cls', label: 'Cumulative Layout Shift', good: 0.1, unit: '' },
      { key: 'tbt', label: 'Total Blocking Time', good: 200, unit: 'ms' },
    ]

    const cardW = (COL - 8) / 3
    vitals.forEach((v, i) => {
      const data = cwv[v.key]
      if (!data) return
      const cx2 = MARGIN + i * (cardW + 4)
      const [cr2, cg2, cb2] = scoreColour(Math.round(data.score * 100))

      doc.setFillColor(248, 249, 250)
      doc.roundedRect(cx2, y, cardW, 28, 3, 3, 'F')
      doc.setFillColor(cr2, cg2, cb2)
      doc.roundedRect(cx2, y, cardW, 2.5, 1, 1, 'F')

      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(v.label, cx2 + 5, y + 8)

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(cr2, cg2, cb2)
      doc.text(data.displayValue ?? '—', cx2 + 5, y + 18)

      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(120, 120, 120)
      doc.text((data.rating ?? '').replace('-', ' ').toUpperCase(), cx2 + 5, y + 24)
    })

    y += 34

    // Additional metrics
    const moreMetrics = [
      { label: 'First Contentful Paint', val: perf.fcp?.displayValue },
      { label: 'Speed Index',            val: perf.speedIndex?.displayValue },
      { label: 'Time to Interactive',    val: perf.tti?.displayValue },
    ]

    doc.setFontSize(9)
    moreMetrics.forEach((m, i) => {
      if (!m.val) return
      const row = Math.floor(i / 2)
      const col = i % 2
      const mx = MARGIN + col * (COL / 2 + 4)
      const my = y + row * 12
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(90, 90, 90)
      doc.text(m.label, mx, my)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 30, 30)
      doc.text(m.val, mx + COL / 2 - 4, my, { align: 'right' })
    })

    y += Math.ceil(moreMetrics.length / 2) * 12 + 10

    // Opportunities
    const opps = (results.lighthouse?.opportunities ?? []).slice(0, 5)
    if (opps.length > 0) {
      y = sectionTitle(doc, 'Top Opportunities', y, config.accentColor)

      opps.forEach((opp: any) => {
        if (y > PAGE_H - 30) return
        doc.setFillColor(255, 250, 235)
        doc.roundedRect(MARGIN, y, COL, 13, 2, 2, 'F')
        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(40, 40, 40)
        doc.text(opp.title, MARGIN + 4, y + 5)
        if (opp.savings?.ms) {
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(180, 100, 0)
          doc.text(`Save ~${Math.round(opp.savings.ms)}ms`, PAGE_W - MARGIN - 2, y + 5, { align: 'right' })
        }
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80, 80, 80)
        const desc = doc.splitTextToSize(opp.description?.substring(0, 120) ?? '', COL - 8)
        doc.text(desc[0], MARGIN + 4, y + 10)
        y += 16
      })
    }
  }

  // ─── PAGE 3: SEO & Structured Data ───────────────────────────────────────────
  {
    doc.addPage()
    brandedHeader(doc, config, 3, totalPages, logo)
    footer(doc, config, auditDate)
    let y = BRAND_H + 10

    y = sectionTitle(doc, 'Technical SEO', y, config.accentColor)

    const seo = results.technical_seo ?? {}
    const seoChecks = [
      { label: 'Title Tag',         pass: !!seo.title?.present,            note: seo.title?.content?.substring(0, 60) },
      { label: 'Meta Description',  pass: !!seo.meta_description?.present, note: `${seo.meta_description?.length ?? 0} chars` },
      { label: 'Canonical URL',     pass: !!seo.canonical?.present,        note: '' },
      { label: 'Robots.txt',        pass: !!seo.robots_txt,                note: '' },
      { label: 'Sitemap.xml',       pass: !!seo.sitemap_xml,               note: '' },
      { label: 'H1 Tag',            pass: (seo.headings?.h1 ?? 0) === 1,   note: `${seo.headings?.h1 ?? 0} found` },
    ]

    seoChecks.forEach((item) => {
      doc.setFillColor(item.pass ? 236 : 254, item.pass ? 253 : 242, item.pass ? 243 : 242)
      doc.roundedRect(MARGIN, y, COL, 10, 2, 2, 'F')
      statusIcon(doc, item.pass, MARGIN + 4, y + 7)
      doc.setFontSize(9)
      doc.setFont('helvetica', item.pass ? 'normal' : 'bold')
      doc.setTextColor(30, 30, 30)
      doc.text(item.label, MARGIN + 11, y + 7)
      if (item.note) {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(120, 120, 120)
        doc.setFontSize(7)
        doc.text(item.note, PAGE_W - MARGIN - 2, y + 7, { align: 'right' })
      }
      y += 13
    })

    y += 6

    // Structured Data
    y = sectionTitle(doc, 'Structured Data', y, config.accentColor)

    const sd = results.structured_data ?? {}
    scorePill(doc, sd.score ?? 0, MARGIN, y + 5)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text(`Status: ${sd.status ?? '—'}`, MARGIN + 28, y + 2)
    y += 12

    const sdItems = [
      { label: 'JSON-LD',      pass: !!sd.has_json_ld,      note: sd.json_ld_types?.join(', ') || '' },
      { label: 'Open Graph',   pass: !!sd.has_open_graph,   note: sd.open_graph_properties?.join(', ') || '' },
      { label: 'Twitter Card', pass: !!sd.has_twitter_card, note: sd.twitter_card_type || '' },
      { label: 'Microdata',    pass: !!sd.has_microdata,    note: '' },
    ]

    sdItems.forEach((item) => {
      doc.setFillColor(248, 249, 250)
      doc.roundedRect(MARGIN, y, COL, 9, 2, 2, 'F')
      statusIcon(doc, item.pass, MARGIN + 4, y + 6.5)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(30, 30, 30)
      doc.text(item.label, MARGIN + 11, y + 6.5)
      if (item.note) {
        doc.setFontSize(7)
        doc.setTextColor(120, 120, 120)
        const noteText = item.note.length > 50 ? item.note.substring(0, 50) + '…' : item.note
        doc.text(noteText, PAGE_W - MARGIN - 2, y + 6.5, { align: 'right' })
      }
      y += 11
    })

    // SD recommendations
    if (sd.recommendations?.length > 0) {
      y += 4
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(60, 60, 60)
      doc.text('Recommendations', MARGIN, y)
      y += 6
      sd.recommendations.slice(0, 4).forEach((rec: string) => {
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80, 80, 80)
        doc.text('•', MARGIN + 2, y)
        const wrapped = doc.splitTextToSize(rec, COL - 10)
        doc.text(wrapped, MARGIN + 8, y)
        y += wrapped.length * 4.5 + 2
      })
    }
  }

  // ─── PAGE 4: Content Quality & Images ────────────────────────────────────────
  {
    doc.addPage()
    brandedHeader(doc, config, 4, totalPages, logo)
    footer(doc, config, auditDate)
    let y = BRAND_H + 10

    // Content Quality
    y = sectionTitle(doc, 'Content Quality', y, config.accentColor)

    const cq = results.content_quality ?? {}
    const cqScore = cq.score ?? 0

    scorePill(doc, cqScore, MARGIN, y + 5)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text(cq.reading_level ?? '—', MARGIN + 28, y + 2)
    doc.text(`${cq.word_count ?? 0} words`, MARGIN + 28, y + 8)
    y += 16

    progressBar(doc, cqScore, MARGIN, y, COL, 4)
    y += 10

    const cqStats = [
      { label: 'Word Count',              val: `${cq.word_count ?? 0}`,                     good: (cq.word_count ?? 0) >= 500 },
      { label: 'Sentences',               val: `${cq.sentence_count ?? 0}`,                 good: true },
      { label: 'Avg Sentence Length',     val: `${cq.avg_sentence_length ?? 0} words`,      good: (cq.avg_sentence_length ?? 0) <= 20 },
      { label: 'Avg Paragraph Length',    val: `${cq.avg_paragraph_length ?? 0} words`,     good: (cq.avg_paragraph_length ?? 0) <= 100 },
      { label: 'Content / Code Ratio',    val: `${cq.content_to_code_ratio ?? 0}%`,         good: (cq.content_to_code_ratio ?? 0) >= 15 },
      { label: 'Flesch Reading Ease',     val: `${cq.reading_ease_score ?? 0}`,             good: (cq.reading_ease_score ?? 0) >= 60 },
      { label: 'H1 Headings',             val: `${cq.heading_structure?.h1 ?? 0}`,          good: (cq.heading_structure?.h1 ?? 0) === 1 },
      { label: 'H2 Headings',             val: `${cq.heading_structure?.h2 ?? 0}`,          good: (cq.heading_structure?.h2 ?? 0) > 0 },
    ]

    const halfW = (COL - 6) / 2
    cqStats.forEach((s, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const cx2 = MARGIN + col * (halfW + 6)
      const cy2 = y + row * 12

      doc.setFillColor(248, 249, 250)
      doc.roundedRect(cx2, cy2, halfW, 10, 2, 2, 'F')

      const [cr2, cg2, cb2] = s.good ? [16, 185, 129] : [239, 68, 68]
      doc.setFillColor(cr2, cg2, cb2)
      doc.roundedRect(cx2, cy2, 2.5, 10, 1, 1, 'F')

      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(s.label, cx2 + 5, cy2 + 4.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 30, 30)
      doc.text(s.val, cx2 + halfW - 3, cy2 + 4.5, { align: 'right' })
    })

    y += Math.ceil(cqStats.length / 2) * 12 + 10

    // Image Optimization
    y = sectionTitle(doc, 'Image Optimization', y, config.accentColor)

    const img = results.image_optimization ?? {}
    const imgScore = img.score ?? 0
    const issues = img.issues ?? {}

    scorePill(doc, imgScore, MARGIN, y + 5)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text(`${img.total_images ?? 0} images found`, MARGIN + 28, y + 5)
    y += 14

    const imgStats = [
      { label: 'Missing Alt Text',      val: issues.missing_alt_count ?? 0,       bad: (issues.missing_alt_count ?? 0) > 0 },
      { label: 'Missing Dimensions',    val: issues.missing_dimensions_count ?? 0, bad: (issues.missing_dimensions_count ?? 0) > 0 },
      { label: 'No Lazy Loading',       val: issues.no_lazy_loading_count ?? 0,   bad: (issues.no_lazy_loading_count ?? 0) > 3 },
      { label: 'Old Format (JPG/PNG)',  val: issues.old_format_count ?? 0,        bad: (issues.old_format_count ?? 0) > 0 },
    ]

    imgStats.forEach((s) => {
      const isIssue = s.bad && s.val > 0
      doc.setFillColor(isIssue ? 254 : 248, isIssue ? 242 : 249, isIssue ? 242 : 250)
      doc.roundedRect(MARGIN, y, COL, 9, 2, 2, 'F')
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(isIssue ? 180 : 60, 40, 40)
      doc.text(s.label, MARGIN + 4, y + 6.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(isIssue ? 239 : 16, isIssue ? 68 : 185, isIssue ? 68 : 129)
      doc.text(`${s.val}`, PAGE_W - MARGIN - 2, y + 6.5, { align: 'right' })
      y += 11
    })
  }

  // ─── PAGE 5: Security & Action Plan ──────────────────────────────────────────
  {
    doc.addPage()
    brandedHeader(doc, config, 5, totalPages, logo)
    footer(doc, config, auditDate)
    let y = BRAND_H + 10

    y = sectionTitle(doc, 'Security', y, config.accentColor)

    const sec = results.security ?? {}
    const bl  = results.broken_links ?? {}

    const secChecks = [
      { label: 'HTTPS / SSL',                      pass: !!sec.https },
      { label: 'HSTS Header',                      pass: !!sec.security_headers?.strict_transport_security },
      { label: 'X-Frame-Options',                  pass: !!sec.security_headers?.x_frame_options },
      { label: 'X-Content-Type-Options',           pass: !!sec.security_headers?.x_content_type_options },
      { label: 'Content-Security-Policy',          pass: !!sec.security_headers?.content_security_policy },
    ]

    const secHalf = (COL - 6) / 2
    secChecks.forEach((s, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const cx2 = MARGIN + col * (secHalf + 6)
      const cy2 = y + row * 12

      doc.setFillColor(s.pass ? 236 : 254, s.pass ? 253 : 242, s.pass ? 243 : 242)
      doc.roundedRect(cx2, cy2, secHalf, 10, 2, 2, 'F')
      statusIcon(doc, s.pass, cx2 + 4, cy2 + 7)
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(30, 30, 30)
      doc.text(s.label, cx2 + 11, cy2 + 7)
    })

    y += Math.ceil(secChecks.length / 2) * 12 + 8

    // Broken links summary
    y = sectionTitle(doc, 'Broken Links', y, config.accentColor)

    const blStatus = bl.status ?? 'unknown'
    const blColor: [number,number,number] = blStatus === 'pass' ? [16,185,129] : blStatus === 'warning' ? [245,158,11] : [239,68,68]
    doc.setFillColor(...blColor)
    const pillLabel = blStatus === 'pass' ? 'PASS' : blStatus === 'warning' ? 'WARNING' : 'FAIL'
    doc.roundedRect(MARGIN, y, 22, 8, 2, 2, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(pillLabel, MARGIN + 11, y + 5.5, { align: 'center' })
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text(`${bl.total_checked ?? 0} links checked — ${bl.broken_count ?? 0} broken`, MARGIN + 26, y + 5.5)
    y += 14

    if ((bl.broken_count ?? 0) > 0 && bl.broken_links?.length > 0) {
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(100, 100, 100)
      doc.text('BROKEN LINKS', MARGIN, y)
      y += 5
      bl.broken_links.slice(0, 5).forEach((link: any) => {
        if (y > PAGE_H - 40) return
        doc.setFillColor(254, 242, 242)
        doc.roundedRect(MARGIN, y, COL, 9, 2, 2, 'F')
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80, 80, 80)
        const urlText = (link.url ?? '').length > 70 ? (link.url ?? '').substring(0, 70) + '…' : (link.url ?? '')
        doc.text(urlText, MARGIN + 4, y + 6)
        doc.setTextColor(239, 68, 68)
        doc.text(`${link.status_code ?? 'Error'}`, PAGE_W - MARGIN - 2, y + 6, { align: 'right' })
        y += 11
      })
    }

    y += 8

    // ── Action Plan ────────────────────────────────────────────────────────────
    if (y < PAGE_H - 60) {
      y = sectionTitle(doc, 'Recommended Action Plan', y, config.accentColor)

      const actions: { priority: string; task: string; impact: string }[] = []

      if (!sec.https)
        actions.push({ priority: 'CRITICAL', task: 'Enable HTTPS / SSL certificate', impact: 'Security' })
      if ((bl.broken_count ?? 0) > 0)
        actions.push({ priority: 'HIGH', task: `Fix ${bl.broken_count} broken link(s)`, impact: 'SEO + UX' })
      if ((results.image_optimization?.issues?.missing_alt_count ?? 0) > 0)
        actions.push({ priority: 'HIGH', task: 'Add alt text to images', impact: 'Accessibility + SEO' })
      if (!results.technical_seo?.meta_description?.present)
        actions.push({ priority: 'HIGH', task: 'Write a meta description', impact: 'SEO' })
      if (!results.structured_data?.has_json_ld)
        actions.push({ priority: 'MEDIUM', task: 'Implement JSON-LD structured data', impact: 'SEO visibility' })
      if (!results.structured_data?.has_open_graph)
        actions.push({ priority: 'MEDIUM', task: 'Add Open Graph meta tags', impact: 'Social sharing' })
      if ((results.image_optimization?.issues?.old_format_count ?? 0) > 0)
        actions.push({ priority: 'LOW', task: 'Convert images to WebP/AVIF', impact: 'Performance' })

      const priorityColor: Record<string, [number,number,number]> = {
        CRITICAL: [239, 68, 68],
        HIGH:     [245, 158, 11],
        MEDIUM:   [6, 182, 212],
        LOW:      [107, 114, 128],
      }

      actions.slice(0, 6).forEach((a) => {
        if (y > PAGE_H - 30) return
        const [pr, pg, pb] = priorityColor[a.priority] ?? [107, 114, 128]
        doc.setFillColor(248, 249, 250)
        doc.roundedRect(MARGIN, y, COL, 10, 2, 2, 'F')

        doc.setFillColor(pr, pg, pb)
        doc.roundedRect(MARGIN, y, 18, 10, 2, 2, 'F')
        doc.setFontSize(6)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text(a.priority, MARGIN + 9, y + 6.5, { align: 'center' })

        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(30, 30, 30)
        doc.text(a.task, MARGIN + 22, y + 4)
        doc.setFontSize(7)
        doc.setTextColor(120, 120, 120)
        doc.text(a.impact, MARGIN + 22, y + 9)

        y += 13
      })
    }
  }

  // ─── Save ─────────────────────────────────────────────────────────────────────
  const safeClient = (config.clientName || 'audit').replace(/\s+/g, '_').toLowerCase()
  const safeDate   = format(new Date(), 'yyyy-MM-dd')
  doc.save(`${config.agencyName.replace(/\s+/g, '_')}_audit_${safeClient}_${safeDate}.pdf`)
}