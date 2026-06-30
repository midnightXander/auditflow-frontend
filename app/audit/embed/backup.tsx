'use client'

import { useEffect, useState } from 'react'
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
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboardLayout'


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

  useEffect(() => {
    loadSettings()
    loadLeads()
  }, [])

  const embedCode = apiKey 
    ? `<script src="${process.env.NEXT_PUBLIC_API_URL}/embed/widget.js?api_key=${apiKey}"></script>\n<div id="auditflow-widget"></div>`
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
      if (data.lead_capture !== undefined) setSettings(s => ({ ...s, leadCapture: data.lead_capture }))
      if (data.require_email !== undefined) setSettings(s => ({ ...s, requireEmail: data.require_email }))
      if (data.button_text) setSettings(s => ({ ...s, buttonText: data.button_text }))
      if (data.headline) setSettings(s => ({ ...s, headline: data.headline }))
      if (data.description) setSettings(s => ({ ...s, description: data.description }))
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
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/embed/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          lead_capture: settings.leadCapture,
          require_email: settings.requireEmail,
          button_text: settings.buttonText,
          headline: settings.headline,
          description: settings.description
        })
      })
      alert('Settings saved!')
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
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            {/* API Key */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600"/>
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
                    <Code className="w-5 h-5 text-purple-600"/>
                    Embed Code
                  </CardTitle>
                  <CardDescription>Copy this code and paste it on your website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
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

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                </CardContent>
              </Card>
            )}

            {/* Preview */}
            {apiKey && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 text-emerald-600"/>
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                    <p className="text-center text-gray-600 mb-4">
                      Preview will appear here once deployed
                    </p>
                    <Button variant="outline" className="mx-auto block">
                      Open Preview in New Tab
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-600"/>
                  Widget Customization
                </CardTitle>
                <CardDescription>
                  <p>Customize how the widget looks and behaves</p>
                  <div className='mt-2 flex'><AlertTriangle className="w-5 h-5 mr-2 text-yellow-600"/><div>You can customize your branding to apply your agency's colors, logo, and more <Link className='text-blue-500' href="/dashboard/settings">here.</Link>.</div></div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lead Capture */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="leadCapture" className="text-base font-medium">
                      Enable Lead Capture
                    </Label>
                    <p className="text-sm text-gray-500">Collect visitor emails before showing results</p>
                  </div>
                  <Switch
                    id="leadCapture"
                    checked={settings.leadCapture}
                    onCheckedChange={(checked) => setSettings({...settings, leadCapture: checked})}
                  />
                </div>

                {/* Require Email */}
                {settings.leadCapture && (
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireEmail" className="text-base font-medium">
                        Require Email
                      </Label>
                      <p className="text-sm text-gray-500">Make email address mandatory</p>
                    </div>
                    <Switch
                      id="requireEmail"
                      checked={settings.requireEmail}
                      onCheckedChange={(checked) => setSettings({...settings, requireEmail: checked})}
                    />
                  </div>
                )}

                {/* Button Text */}
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={settings.buttonText}
                    onChange={(e) => setSettings({...settings, buttonText: e.target.value})}
                    placeholder="Analyze Website"
                  />
                </div>

                {/* Headline */}
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={settings.headline}
                    onChange={(e) => setSettings({...settings, headline: e.target.value})}
                    placeholder="Free Website SEO Audit"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={settings.description}
                    onChange={(e) => setSettings({...settings, description: e.target.value})}
                    placeholder="Get a comprehensive SEO analysis in seconds"
                  />
                </div>

                <Button onClick={saveSettings} className="w-full">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
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
                      <Users className="w-5 h-5 text-blue-600"/>
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
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
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