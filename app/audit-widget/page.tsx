import AuditWidgetLanding from "./auditWidget"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Audit Widget - OUTAudits',
  description: 'Embed our white-label website auditing and SEO tools on your own website. Generate leads directly from your agency website and scale revenue.',
}



export default function AuditWidgetPage() {
  
  return (
    <AuditWidgetLanding />
  )
}
