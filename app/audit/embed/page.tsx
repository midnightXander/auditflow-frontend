'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth, fetchWithAuth } from '@/lib/auth-context'
import { useProtectedRoute } from '@/lib/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import DashboardHeader from '@/components/dashboard-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Code, Copy, Check, Settings, Users, Download, 
  RefreshCw, Eye, Mail, Globe, Trash2, Send, MessageSquare, X, Edit2, TriangleAlert,
  AlertTriangle,
  ArrowRight,
    CheckCircle2,
    ToggleLeft,
    ToggleRight,
    Monitor,
    Smartphone,
    Tablet, Save,
} from 'lucide-react'
import { toast } from "sonner"
import gsap from 'gsap';
import Link from 'next/link'
import DashboardLayout from '@/components/dashboardLayout'
import EmptyState from '@/components/emptyState'


export default function EmbedWidgetPage() {
  const { user } = useAuth()
  const { isProtected } = useProtectedRoute()
  const [apiKey, setApiKey] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [settings, setSettings] = useState({
    leadCapture: true,
    requireEmail: true,
    buttonText: 'Analyze Website',
    headline: 'Free Website SEO Audit',
    description: 'Get a comprehensive SEO analysis in seconds'
  })
  const [leads, setLeads] = useState([])
  const [stats, setStats] = useState({
    totalAudits: 0,
    leadsCapture: 0,
    conversionRate: 0
  })

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [config, setConfig] = useState({
      title: 'Free SEO Audit',
      subtitle: 'Enter your website URL for an instant analysis',
      buttonText: 'Analyze',
      primaryColor: '#00a4c6',
      bgColor: '#ffffff',
      textColor: '#141e27',
      borderRadius: 8,
      showLogo: true,
      showPoweredBy: false,
      requireEmail: true,
      emailPlaceholder: 'Enter your email',
      width: '100%',
      shadow: true,
    });
    const previewRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (!previewRef.current) return;
      const ctx = gsap.context(() => {
        gsap.fromTo('.widget-section > *', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out' });
      }, previewRef);
      return () => ctx.revert();
    }, []);
  
  //   const embedCode = `<!-- OUTAudits Embed Widget -->
  // <div id="outaudits-widget"></div>
  // <script>
  //   (function() {
  //     var s = document.createElement('script');
  //     s.src = 'https://cdn.outaudits.com/widget.js';
  //     s.async = true;
  //     s.onload = function() {
  //       OutAudits.init({
  //         apiKey: 'YOUR_API_KEY',
  //         container: '#outaudits-widget',
  //         theme: {
  //           primaryColor: '${config.primaryColor}',
  //           bgColor: '${config.bgColor}',
  //           textColor: '${config.textColor}',
  //           borderRadius: ${config.borderRadius},
  //         },
  //         fields: {
  //           title: '${config.title}',
  //           subtitle: '${config.subtitle}',
  //           buttonText: '${config.buttonText}',
  //           requireEmail: ${config.requireEmail},
  //         },
  //         branding: {
  //           showLogo: ${config.showLogo},
  //           showPoweredBy: ${config.showPoweredBy},
  //         }
  //       });
  //     };
  //     document.head.appendChild(s);
  //   })();
  // </script>`;

  useEffect(() => {
    loadSettings()
    loadLeads()
  }, [])

  const embedCode = apiKey 
    ? `<script 
    src="${process.env.NEXT_PUBLIC_API_URL}/embed/widget.js?api_key=${apiKey}">
    </script>\n<div id="auditflow-widget"></div>`
    : ''

  const loadSettings = async () => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/embed/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      const data = await response.json()
      setApiKey(data.api_key || '')
      // if (data.lead_capture !== undefined) setConfig(s => ({ ...s, leadCapture: data.lead_capture }))
      if (data.require_email !== undefined) setConfig(s => ({ ...s, requireEmail: data.require_email }))
      if (data.button_text) setConfig(s => ({ ...s, buttonText: data.button_text }))
      if (data.headline) setConfig(s => ({ ...s, title: data.headline }))
      if (data.description) setConfig(s => ({ ...s, subtitle: data.description }))
      if (data.primary_color) setConfig(s => ({ ...s, primaryColor: data.primary_color }))
      if (data.bg_color) setConfig(s => ({ ...s, bgColor: data.bg_color })) 
      if (data.text_color) setConfig(s => ({ ...s, textColor: data.text_color }))
      if (data.border_radius) setConfig(s => ({ ...s, borderRadius: data.border_radius }))
      if (data.show_logo) setConfig(s => ({ ...s, showlogo: data.show_logo }))  
      if (data.show_poweredBy) setConfig(s => ({ ...s, showPoweredBy: data.show_poweredBy }))    
      if (data.email_placeholder) setConfig(s => ({ ...s, emailPlaceholder: data.email_placeholder }))   
      if (data.width) setConfig(s => ({ ...s, width: data.width }))
      if (data.shadow) setConfig(s => ({ ...s, shadow: data.shadow }))
        
      console.log(data)  
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const loadLeads = async () => {
    // Load captured leads
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/embed/leads`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      const data = await response.json()
      setLeads(data.leads || [])
      console.log('Leads data:', data)
      setStats({
        totalAudits: data.total_audits || 0,
        leadsCapture: data.leads_captured || 0,
        conversionRate: data.conversion_rate || 0
      })
    } catch (error) {
      console.error('Failed to load leads:', error)
    }
  }

  const generateApiKey = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/embed/generate-key`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      const data = await response.json()
      setApiKey(data.api_key)
    } catch (error) {
      console.error('Failed to generate API key:', error)
    }
  }

  const saveSettings = async () => {
    // Example usage:
    console.log(lightenHex("#336699")); // lighter version
    console.log(darkenHex("#336699"));  // darker version
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/embed/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
    //     {
    //   title: 'Free SEO Audit',
    //   subtitle: 'Enter your website URL for an instant analysis',
    //   buttonText: 'Analyze',
    //   primaryColor: '#00a4c6',
    //   bgColor: '#ffffff',
    //   textColor: '#141e27',
    //   borderRadius: 8,
    //   showLogo: true,
    //   showPoweredBy: false,
    //   requireEmail: true,
    //   emailPlaceholder: 'Enter your email',
    //   width: '100%',
    //   shadow: true,
    // }
        body: JSON.stringify({
          lead_capture: settings.leadCapture,
          require_email: config.requireEmail,
          button_text: config.buttonText,
          headline: config.title,
          description: config.subtitle,
          primary_color: config.primaryColor,
          bg_color: config.bgColor,
          text_color: config.textColor,
          border_radius: config.borderRadius,
          show_logo: config.showLogo,
          show_powered_by: config.showPoweredBy,
          email_placeholder: config.emailPlaceholder,
          width: config.width,
          shadow: config.shadow,
        })
      })
      toast.success('Settings saved!')
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const updateLead = async (leadId: string, newNotes?:string, newStatus?: string ) => {
    console.log(`updating lead: ${leadId}`, newNotes, newStatus)
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/embed/leads/${leadId}?${newStatus ? `status=${newStatus}` : ""}${newNotes ? `&notes=${newNotes}` : ""}`, {
        method: 'PATCH',
      })
      loadLeads()
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({...selectedLead, status: newStatus || selectedLead.status, notes: newNotes || selectedLead.notes})
      }
    } catch (error) {
      console.error('Failed to update lead status:', error)
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/embed/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      loadLeads()
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({...selectedLead, status: newStatus})
      }
    } catch (error) {
      console.error('Failed to update lead status:', error)
    }
  }

  const updateLeadNotes = async (leadId: string) => {
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/embed/leads/${leadId}/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ notes })
      })
      loadLeads()
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({...selectedLead, notes})
      }
      setIsEditingNotes(false)
    } catch (error) {
      console.error('Failed to update notes:', error)
    }
  }

  const sendEmail = async (leadId: string) => {
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/embed/leads/${leadId}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          subject: emailSubject,
          body: emailBody
        })
      })
      alert('Email sent successfully!')
      setShowEmailModal(false)
      setEmailSubject('')
      setEmailBody('')
    } catch (error) {
      console.error('Failed to send email:', error)
      alert('Failed to send email')
    }
  }

  const deleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/embed/leads/${leadId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      loadLeads()
      setSelectedLead(null)
    } catch (error) {
      console.error('Failed to delete lead:', error)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
 * Convert hex color to RGB components
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace(/^#/, "");
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

/**
 * Convert RGB back to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/**
 * Lighten a hex color by a given percentage (default 20%)
 */
function lightenHex(hex: string, percent: number = 20): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = percent / 100;
  const newR = Math.min(255, Math.round(r + (255 - r) * factor));
  const newG = Math.min(255, Math.round(g + (255 - g) * factor));
  const newB = Math.min(255, Math.round(b + (255 - b) * factor));
  return rgbToHex(newR, newG, newB);
}

/**
 * Darken a hex color by a given percentage (default 20%)
 */
function darkenHex(hex: string, percent: number = 20): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 - percent / 100;
  const newR = Math.max(0, Math.round(r * factor));
  const newG = Math.max(0, Math.round(g * factor));
  const newB = Math.max(0, Math.round(b * factor));
  return rgbToHex(newR, newG, newB);
}




  const deviceWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };

  const filteredLeads = statusFilter === 'all' 
    ? leads 
    : leads.filter((lead: any) => lead.status === statusFilter)

  return (
    <DashboardLayout>
      <main className="flex-1 h-screen">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="my-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Embeddable Widget</h1>
          <p className="text-gray-600">Embed the SEO audit tool on your website and capture leads</p>
        </div>

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList>
            <TabsTrigger className="rounded" value="setup">Setup</TabsTrigger>
            <TabsTrigger className="rounded" value="customize">Customize</TabsTrigger>
            <TabsTrigger className="rounded" value="leads">Leads ({leads.length})</TabsTrigger>
            <TabsTrigger className="rounded" value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            {/* API Key */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="w-5 h-5 text-[#00a4c6]"/>
                  API Key
                </CardTitle>
                <CardDescription>Your unique embed API key. Keep it secret!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiKey ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={apiKey} 
                        readOnly 
                        className="font-mono text-sm"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(apiKey)}
                      >
                        {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={generateApiKey}
                    >
                      <RefreshCw className="w-4 h-4 mr-2"/>
                      Regenerate Key
                    </Button>
                  </>
                ) : (
                  <Button onClick={generateApiKey}>
                    Generate API Key
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Embed Code */}
            {apiKey && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="w-5 h-5 text-[#00a4c6]"/>
                    Embed Code
                  </CardTitle>
                  <CardDescription>Copy this code and paste it on your website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                      <code>{embedCode}</code>
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(embedCode)}
                    >
                      {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      Quick Integration Guide:
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• WordPress: Use "Insert Headers and Footers" plugin</li>
                      <li>• Wix: Add → Embed Code → Custom Code</li>
                      <li>• Shopify: Online Store → Themes → Edit Code</li>
                      <li>• Squarespace: Add Code Block to any page</li>
                    </ul>
                    
                  </div>
                  <p className="text-sm" style={{ color: '#35393b', lineHeight: '22px' }}>Need help ? <a href='mailto:support@outaudits.com' className='text-blue-600'>Contact Support</a></p>
                </CardContent>
              </Card>
            )}

            {/* Preview */}
            {apiKey && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 text-[#00a4c6]"/>
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  
                  {/*Show preview if apikey is present */}

                  {(apiKey) && (
                  <div
                      className="rounded p-8 flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: '#e8ecf0',
                        border: '1px solid #e4e9ed',
                        minHeight: 400,
                      }}
                    >
                      <div
                        className="transition-all duration-300"
                        style={{ width: deviceWidths[previewDevice], maxWidth: '100%' }}
                      >
                        {/* The Widget */}
                        <div
                          className="p-6 text-center transition-all"
                          style={{
                            backgroundColor: config.bgColor,
                            borderRadius: config.borderRadius,
                            boxShadow: config.shadow ? '0px 10px 40px rgba(0,0,0,0.08)' : 'none',
                            border: `1px solid ${config.shadow ? 'transparent' : '#e4e9ed'}`,
                          }}
                        >
                          {config.showLogo && (
                            <div className="flex items-center justify-center gap-1 mb-4">
                              <img src={user?.agency_logo || ''} alt={user?.agency_name || ''} className="w-8 h-8" />
                            </div>
                          )}
                          <h4 className="text-lg font-bold" style={{ color: config.textColor }}>
                            {config.title}
                          </h4>
                          <p className="text-sm mt-1" style={{ color: '#8896a4' }}>
                            {config.subtitle}
                          </p>
        
                          {config.requireEmail && (
                            <input
                              type="email"
                              placeholder={config.emailPlaceholder}
                              className="w-full mt-4 px-3 py-2.5 rounded text-sm outline-none text-center"
                              style={{ backgroundColor: `${config.bgColor}25`, border: `1px solid`, color: config.textColor }}
                              readOnly
                            />
                          )}
        
                          <div className="flex items-center gap-2 mt-3">
                            <Globe className="w-4 h-4 flex-shrink-0" style={{ color: '#c1cfda' }} />
                            <input
                              type="text"
                              placeholder="https://yourwebsite.com"
                              className="flex-1 px-3 py-2.5 rounded text-sm outline-none"
                              style={{ backgroundColor: `${config.bgColor}25`, border: `1px solid `, color: config.textColor }}
                              readOnly
                            />
                          </div>
        
                          <button
                            className="w-full mt-4 py-2.5 rounded text-sm font-semibold text-white border-none cursor-default"
                            style={{ backgroundColor: config.primaryColor, borderRadius: config.borderRadius }}
                          >
                            {config.buttonText}
                          </button>
        
                          {config.showPoweredBy && (
                            <p className="text-[10px] mt-3" style={{ color: '#c1cfda' }}>
                              Powered by <a href="https://outaudits.com" target="_blank" rel="noopener noreferrer">OUTAUDITS</a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  { (!apiKey) && (
                    <div className="border-2 border-dashed border-gray-300 rounded p-8 bg-gray-50">
                    <p className="text-center text-gray-600 mb-4">
                      Preview will appear here once deployed
                    </p>
                    <Button variant="outline" className="mx-auto block">
                      Open Preview in New Tab
                    </Button>
                  </div>
                  )}
                  
                  
                  
                </CardContent>
              </Card>
            )} 
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize" className="space-y-6">
            <div className="p-4 lg:p-8 overflow-x-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#141e27' }}>Widget Customizer</h1>
                        <p className="text-sm mt-0.5" style={{ color: '#44576a' }}>Configure and embed a white-label SEO audit form on any website</p>
                      </div>
                    </div>
                  {apiKey && (
                    <div ref={previewRef} className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 widget-section">
                      {/* Preview Area */}
                      <div className="space-y-4">
                        {/* Device toggles */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold" style={{ color: '#141e27' }}>Live Preview</h3>
                          <div className="flex items-center gap-1 p-1 rounded bg-white" style={{ border: '1px solid #e4e9ed' }}>
                            {[
                              { key: 'desktop' as const, icon: Monitor },
                              { key: 'tablet' as const, icon: Tablet },
                              { key: 'mobile' as const, icon: Smartphone },
                            ].map((d) => (
                              <button
                                key={d.key}
                                onClick={() => setPreviewDevice(d.key)}
                                className="p-1.5 rounded bg-transparent border-none cursor-pointer"
                                style={{ color: previewDevice === d.key ? '#00a4c6' : '#c1cfda' }}
                              >
                                <d.icon className="w-4 h-4" />
                              </button>
                            ))}
                          </div>
                        </div>
            
                        {/* Preview container */}
                        <div
                          className="rounded p-8 flex items-center justify-center transition-all duration-300"
                          style={{
                            backgroundColor: '#e8ecf0',
                            border: '1px solid #e4e9ed',
                            minHeight: 400,
                          }}
                        >
                          <div
                            className="transition-all duration-300"
                            style={{ width: deviceWidths[previewDevice], maxWidth: '100%' }}
                          >
                            {/* The Widget */}
                            <div
                              className="p-6 text-center transition-all"
                              style={{
                                backgroundColor: config.bgColor,
                                borderRadius: config.borderRadius,
                                boxShadow: config.shadow ? '0px 10px 40px rgba(0,0,0,0.08)' : 'none',
                                border: `1px solid ${config.shadow ? 'transparent' : '#e4e9ed'}`,
                              }}
                            >
                              {config.showLogo && (
                                <div className="flex items-center justify-center gap-1 mb-4">
                                  <img src={user?.agency_logo || ''} alt={user?.agency_name || ''} className="w-8 h-8" />
                                </div>
                              )}
                              <h4 className="text-lg font-bold" style={{ color: config.textColor }}>
                                {config.title}
                              </h4>
                              <p className="text-sm mt-1" style={{ color: '#8896a4' }}>
                                {config.subtitle}
                              </p>
            
                              {config.requireEmail && (
                                <input
                                  type="email"
                                  placeholder={config.emailPlaceholder}
                                  className="w-full mt-4 px-3 py-2.5 rounded text-sm outline-none text-center"
                                  // style={{ backgroundColor: '#f5f7fa', border: '1px solid #e4e9ed', color: config.textColor }}
                                  style = {{ backgroundColor: `${lightenHex(config.bgColor)}`,borderRadius: `${config.borderRadius}px`, border: `1px solid ${darkenHex(config.bgColor)}`,  color: config.textColor }}
                                  readOnly
                                />
                              )}
            
                              <div className="flex items-center gap-2 mt-3">
                                <Globe className="w-4 h-4 flex-shrink-0" style={{ color: '#c1cfda' }} />
                                <input
                                  type="text"
                                  placeholder="Enter Your Website URL"
                                  className="flex-1 px-3 py-2.5 rounded text-sm outline-none"
                                  // style={{ backgroundColor: '#f5f7fa', border: '1px solid #e4e9ed', color: config.textColor }}
                                  style = {{ backgroundColor: `${lightenHex(config.bgColor)}`,borderRadius: `${config.borderRadius}px`, border: `1px solid ${darkenHex(config.bgColor)}`, color: config.textColor }}

                                  readOnly
                                />
                              </div>
            
                              <button
                                className="w-full mt-4 py-2.5 rounded text-sm font-semibold text-white border-none cursor-default"
                                style={{ backgroundColor: config.primaryColor, borderRadius: config.borderRadius }}
                              >
                                {config.buttonText}
                              </button>
            
                              {config.showPoweredBy && (
                                <p className="text-[10px] mt-3" style={{ color: '#c1cfda' }}>
                                  Powered by <a href="https://outaudits.com" target="_blank" rel="noopener noreferrer">OUTAUDITS</a>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
            
                        {/* Embed Code */}
                        <div className="bg-white rounded p-5" style={{ border: '1px solid #e4e9ed' }}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Code className="w-4 h-4" style={{ color: '#00a4c6' }} />
                              <h3 className="text-sm font-semibold" style={{ color: '#141e27' }}>Embed Code</h3>
                            </div>
                            <button
                              onClick={handleCopy}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border-none cursor-pointer hover:opacity-90"
                              style={{ backgroundColor: copied ? '#f0fdf4' : '#f5f7fa', color: copied ? '#34d399' : '#44576a' }}
                            >
                              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              {copied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <pre
                            className="p-4 rounded text-xs overflow-x-auto"
                            style={{ backgroundColor: '#141e27', color: '#c1cfda', fontFamily: 'monospace', lineHeight: '20px' }}
                          >
                            {embedCode.slice(0,70)}...
                          </pre>
                        </div>
                      </div>
            
                      {/* Configuration Sidebar */}
                      <div className="space-y-4">
                        <div className="bg-white rounded p-5" style={{ border: '1px solid #e4e9ed' }}>
                          <h3 className="text-sm font-semibold mb-4" style={{ color: '#141e27' }}>Content</h3>
                          <div className="space-y-4">
                            {[
                              { label: 'Widget Title', key: 'title' as const },
                              { label: 'Subtitle', key: 'subtitle' as const },
                              { label: 'Button Text', key: 'buttonText' as const },
                              { label: 'Email Placeholder', key: 'emailPlaceholder' as const },
                            ].map((field) => (
                              <div key={field.key}>
                                <label className="text-xs font-medium block mb-1.5" style={{ color: '#44576a' }}>{field.label}</label>
                                <input
                                  type="text" value={config[field.key]}
                                  onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
                                  className="w-full px-3 py-2 rounded text-sm outline-none"
                                  style={{ border: '1px solid #e4e9ed', color: '#141e27' }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
            
                        <div className="bg-white rounded p-5" style={{ border: '1px solid #e4e9ed' }}>
                          <h3 className="text-sm font-semibold mb-4" style={{ color: '#141e27' }}>Appearance</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs font-medium block mb-1.5" style={{ color: '#44576a' }}>Primary Color</label>
                              <div className="flex items-center gap-2">
                                <input type="color" value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-none" />
                                <span className="text-xs font-mono" style={{ color: '#8896a4' }}>{config.primaryColor}</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium block mb-1.5" style={{ color: '#44576a' }}>Background Color</label>
                              <div className="flex items-center gap-2">
                                <input type="color" value={config.bgColor} onChange={(e) => setConfig({ ...config, bgColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-none" />
                                <span className="text-xs font-mono" style={{ color: '#8896a4' }}>{config.bgColor}</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium block mb-1.5" style={{ color: '#44576a' }}>Text Color</label>
                              <div className="flex items-center gap-2">
                                <input type="color" value={config.textColor} onChange={(e) => setConfig({ ...config, textColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-none" />
                                <span className="text-xs font-mono" style={{ color: '#8896a4' }}>{config.textColor}</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium block mb-1.5" style={{ color: '#44576a' }}>Border Radius: {config.borderRadius}px</label>
                              <input
                                type="range" min={0} max={24} value={config.borderRadius}
                                onChange={(e) => setConfig({ ...config, borderRadius: parseInt(e.target.value) })}
                                className="w-full accent-[#00a4c6]"
                              />
                            </div>
                          </div>
                        </div>
            
                        <div className="bg-white rounded p-5" style={{ border: '1px solid #e4e9ed' }}>
                          <h3 className="text-sm font-semibold mb-4" style={{ color: '#141e27' }}>Behavior</h3>
                          <div className="space-y-3">
                            {[
                              { key: 'showLogo' as const, label: 'Show logo' },
                              { key: 'showPoweredBy' as const, label: 'Show "Powered by" badge' },
                              { key: 'requireEmail' as const, label: 'Require email before audit' },
                              { key: 'shadow' as const, label: 'Drop shadow' },
                            ].map((opt) => (
                              <label key={opt.key} className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm" style={{ color: '#44576a' }}>{opt.label}</span>
                                <button
                                  onClick={() => setConfig({ ...config, [opt.key]: !config[opt.key] })}
                                  className="bg-transparent border-none cursor-pointer"
                                >
                                  {config[opt.key] ? (
                                    <ToggleRight className="w-6 h-6 text-[#00a4c6]" />
                                  ) : (
                                    <ToggleLeft className="w-6 h-6" style={{ color: '#c1cfda' }} />
                                  )}
                                </button>
                              </label>
                            ))}
                          </div>
                        </div>
            
                        {/* Reset */}
                        <button
                          onClick={() => setConfig({
                            title: 'Free SEO Audit', subtitle: 'Enter your website URL for an instant analysis',
                            buttonText: 'Analyze', primaryColor: '#00a4c6', bgColor: '#ffffff',
                            textColor: '#141e27', borderRadius: 8, showLogo: true, showPoweredBy: false,
                            requireEmail: true, emailPlaceholder: 'Enter your email', width: '100%', shadow: true,
                          })}
                          className="flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded text-sm font-medium bg-transparent border cursor-pointer hover:bg-[#f9fafb]"
                          style={{ borderColor: '#e4e9ed', color: '#44576a' }}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Reset to Defaults
                        </button>
                        {/* Save */}
                        <button
                          onClick={() => saveSettings()}
                          className="flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded text-sm font-medium bg-transparent border cursor-pointer hover:bg-[#f9fafb]"
                          style={{ borderColor: '#e4e9ed', backgroundColor: '#00a4c6', color: '#e4e9ed' }}
                        >
                          <Save className="w-4 h-4" />
                          Save Settings
                        </button>
                      </div>
                    </div>
                  )}
                  {!apiKey && (
                    <EmptyState 
                    headline='No API Key Found'
                    subText='Generate your Embed API Key to start customizing your widget'
                    buttonText='Generate Key'
                    icon={<Code className="w-5 h-5 text-[#00a4c6]"/>}
                    onNew={()=>{}}

                    />
                  )}
                  
                  </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            {/* Lead Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant={statusFilter === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                  >
                    All ({leads.length})
                  </Button>
                  <Button 
                    variant={statusFilter === 'new' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatusFilter('new')}
                  >
                    New
                  </Button>
                  <Button 
                    variant={statusFilter === 'contacted' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatusFilter('contacted')}
                  >
                    Contacted
                  </Button>
                  <Button 
                    variant={statusFilter === 'qualified' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatusFilter('qualified')}
                  >
                    Qualified
                  </Button>
                  <Button 
                    variant={statusFilter === 'converted' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatusFilter('converted')}
                  >
                    Converted
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Leads List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leads Column */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-main"/>
                      Captured Leads
                    </CardTitle>
                    <CardDescription>Click on a lead to view and manage details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredLeads.length === 0 ? (
                      <div className="text-center py-12">
                        <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads yet</h3>
                        <p className="text-gray-600">Leads will appear here when visitors use your embedded widget</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredLeads.map((lead: any) => (
                          <div 
                            key={lead.id} 
                            onClick={() => {
                              setSelectedLead(lead)
                              setNotes(lead.notes || '')
                              setIsEditingNotes(false)
                            }}
                            className={`p-4 border rounded cursor-pointer transition-colors ${
                              selectedLead?.id === lead.id 
                                ? 'bg-blue-50 border-blue-300' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{lead.email}</p>
                                <p className="text-sm text-gray-600">{lead.website}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(lead.created_at).toLocaleString()}
                                </p>
                              </div>
                              <Badge variant={
                                lead.status === 'converted' ? 'default' : 
                                lead.status === 'qualified' ? 'secondary' : 
                                'outline'
                              }>
                                {lead.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Lead Details Sidebar */}
              {selectedLead && (
                <div className="space-y-3">
                  {/* Status Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {['new', 'contacted', 'qualified', 'converted'].map((status) => (
                          <Button
                            key={status}
                            variant={selectedLead.status === status ? 'default' : 'outline'}
                            size="sm"
                            className="capitalize"
                            onClick={() => updateLead(selectedLead.id, undefined, status)}
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notes Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4"/>
                          Notes
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditingNotes(!isEditingNotes)}
                        >
                          <Edit2 className="w-4 h-4"/>
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {isEditingNotes ? (
                        <>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes about this lead..."
                            className="w-full h-24 p-2 border rounded text-sm"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateLead(selectedLead.id, notes) }
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsEditingNotes(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {notes || 'No notes added'}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Actions Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        className="w-full"
                        variant="outline"
                        onClick={() => setShowEmailModal(true)}
                      >
                        <Mail className="w-4 h-4 mr-2"/>
                        Send Email
                      </Button>
                      <Link href={`/audit/${selectedLead.job_id}`} target="_blank">
                        <Button className="w-full" variant="outline">
                          <Eye className="w-4 h-4 mr-2"/>
                          View Report
                        </Button>
                      </Link>
                      <Button
                        className="w-full mt-2"
                        variant="destructive"
                        onClick={() => deleteLead(selectedLead.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2"/>
                        Delete Lead
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
              {!selectedLead && (
                <Card className="bg-gray-50">
                  <CardContent className="p-12 text-center">
                    <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a lead to view details</h3>
                    <p className="text-gray-600">Click on a lead from the list to see more information and manage it</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Email Modal */}
            {showEmailModal && selectedLead && (
              <Card className="border-2 border-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="w-5 h-5"/>
                      Email {selectedLead.email}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmailModal(false)}
                    >
                      <X className="w-4 h-4"/>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Subject</Label>
                    <Input
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Email subject"
                    />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Your message..."
                      className="w-full h-32 p-2 border rounded text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => sendEmail(selectedLead.id)}
                      className="flex-1"
                    >
                      <Send className="w-4 h-4 mr-2"/>
                      Send Email
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowEmailModal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-gray-900">{stats.totalAudits}</div>
                  <div className="text-sm text-gray-600">Total Audits</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600">{stats.leadsCapture}</div>
                  <div className="text-sm text-gray-600">Leads Captured</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-emerald-600">{stats.conversionRate}%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </main>
    </DashboardLayout>  
  )
}