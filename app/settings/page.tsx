'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import gsap from 'gsap'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import DashboardHeader from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import {
  Settings,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  Upload,
  ArrowRight,
  CheckCircle2,
  Palette,
  Globe,
  Key,
  Shield,
  Image,
  ToggleLeft,
  ToggleRight,
  Copy,
} from 'lucide-react'
import { WhiteLabelModal } from '@/components/whiteLabelModal'
import { saveWhiteLabelToDatabase } from '@/lib/whitelabel'
import DashboardLayout from '@/components/dashboardLayout'


export default function SettingsPage() {
  const { user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const [showWL, setShowWL] = useState(false)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    auditAlerts: true,
    weeklyReports: true,
    newFeatures: false,
  })

  //addition
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'branding' | 'account' | 'notifications' | 'api'>('branding');
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    agencyName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [settings, setSettings] = useState({
    agencyName: '',
    primaryColor: '#00a4c6',
    logo: null as string | null,
    customDomain: 'custom.yourdomain.com',
    agencyUrl : '',
    email: '',
    name: '',
    role: 'Agency Owner',
    notifyAuditComplete: true,
    notifyRankingChange: true,
    notifyWeeklyDigest: false,
    notifyNewLead: true,
  })
  const contentRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      //set logo in settings
      setSettings({...settings, logo: ev.target?.result as string})
    }
    reader.readAsDataURL(file)
  }

  const handleSaveBranding = () => {
    const config = {
        agencyName : settings.agencyName,
        agencyLogo : settings.logo,
        accentColor : settings.primaryColor,
        agencyUrl : settings.agencyUrl 

    }
    saveWhiteLabelToDatabase(config)
  }

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      handleSaveBranding()
      console.log('Saving profile:', formData)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
      return
    }
    try {
      // API call to change password
      console.log('Changing password')
      setSaveStatus('success')
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  useEffect(() => {
    if (!user) return
    setFormData({
      email: user.email || '',
      fullName: user.full_name || '',
      agencyName: user.agency_name || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setSettings((prev) => ({
      ...prev,
      agencyName: user.agency_name || prev.agencyName,
      agencyUrl: user.agency_url || prev.agencyUrl,
      logo: user.agency_logo,
      primaryColor: user.accent_color,
      email: user.email || prev.email,
      name: user.full_name || prev.name,
    }))
  }, [user])

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.settings-section > *', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out' });
    }, contentRef);
    return () => ctx.revert();
  }, [activeTab]);

  const handleSave = () => {
    console.log('Saving profile:', settings)
    handleSaveBranding()
    setSaveStatus('success')
    setSaved(true);
    // setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { key: 'branding' as const, label: 'Branding', icon: Palette },
    { key: 'account' as const, label: 'Account', icon: Shield },
    { key: 'notifications' as const, label: 'Notifications', icon: Bell },
    { key: 'api' as const, label: 'API Keys', icon: Key },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 w-full max-w-2xl mx-auto  space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-sm mb-1">
            <Link href="/dashboard" className="hover:underline" style={{ color: '#44576a' }}>Dashboard</Link>
            <ArrowRight className="w-3 h-3" style={{ color: '#8896a4' }} />
            <span style={{ color: '#141e27' }} className="font-medium">Settings</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#141e27' }}>Settings</h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded bg-white w-fit" style={{ border: '1px solid #e4e9ed' }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium transition-all cursor-pointer border-none"
              style={{
                backgroundColor: activeTab === t.key ? '#00a4c6' : 'transparent',
                color: activeTab === t.key ? '#ffffff' : '#44576a',
              }}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div ref={contentRef} className="max-w-2xl settings-section space-y-6">
          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <>
              <div className="bg-white rounded p-6" style={{ border: '1px solid #e4e9ed' }}>
                <h3 className="text-base font-semibold mb-1" style={{ color: '#141e27' }}>White-Label Branding</h3>
                <p className="text-xs mb-5" style={{ color: '#8896a4' }}>Customize how your reports appear to clients</p>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium block mb-2" style={{ color: '#141e27' }}>Agency Name</label>
                    <input
                      type="text" value={settings.agencyName}
                      onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded text-sm outline-none"
                      style={{ border: '1px solid #e4e9ed', color: '#141e27' }}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2" style={{ color: '#141e27' }}>Primary Brand Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-none" />
                      <input type="text" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="px-3 py-2.5 rounded text-sm outline-none w-28" style={{ border: '1px solid #e4e9ed', color: '#141e27' }} />
                      <div className="w-16 h-8 rounded" style={{ backgroundColor: settings.primaryColor }} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2" style={{ color: '#141e27' }}>Agency Website</label>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 flex-shrink-0" style={{ color: '#8896a4' }} />
                      <input
                        type="text" value={settings.agencyUrl}
                        onChange={(e) => setSettings({ ...settings, agencyUrl: e.target.value })}
                        className="flex-1 px-3 py-2.5 rounded text-sm outline-none"
                        style={{ border: '1px solid #e4e9ed', color: '#141e27' }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#8896a4' }}>This will appear on your reports</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2" style={{ color: '#141e27' }}>Custom Domain</label>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 flex-shrink-0" style={{ color: '#8896a4' }} />
                      <input
                        type="text" value={settings.customDomain}
                        disabled 
                        onChange={(e) => setSettings({ ...settings, customDomain: e.target.value })}
                        className="flex-1 px-3 py-2.5 bg-gray-50 rounded text-sm outline-none"
                        style={{ border: '1px solid #e4e9ed', color: '#141e27' }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#8896a4' }}>Reports will be hosted on this subdomain. This is an Enterprise feature</p>
                  </div>

                  {/* <div>
                    <label className="text-sm font-medium block mb-2" style={{ color: '#141e27' }}>Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded flex items-center justify-center" style={{ backgroundColor: '#f5f7fa', border: '1px dashed #e4e9ed' }}>
                        <Image className="w-6 h-6" style={{ color: '#c1cfda' }} />
                      </div>
                      <div>
                        <button className="px-3 py-2 rounded text-xs font-medium border cursor-pointer hover:bg-[#f9fafb]" style={{ borderColor: '#e4e9ed', color: '#44576a' }}>
                          Upload Logo
                        </button>
                        <p className="text-[11px] mt-1" style={{ color: '#8896a4' }}>PNG, SVG. Max 2MB. 400x120 recommended</p>
                      </div>
                    </div>
                  </div> */}
                  {/* Agency logo */}
                  <section className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Upload className="w-4 h-4" style={{ color: settings.primaryColor }} />
                    Agency Logo
                    </div>
                    <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    />
                    <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-300 transition-colors flex items-center gap-4"
                    >
                    {settings.logo ? (
                        <>
                        <img
                            src={settings.logo}
                            alt="Agency logo"
                            className="h-12 w-auto object-contain rounded"
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Logo uploaded</p>
                            <p className="text-xs text-gray-500">Click to replace</p>
                        </div>
                        </>
                    ) : (
                        <div className="text-center w-full">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-600">Click to upload logo</p>
                        <p className="text-xs text-gray-400">PNG, SVG, JPG — shown on PDF cover</p>
                        </div>
                    )}
                    </div>
                </section>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white rounded p-6" style={{ border: '1px solid #e4e9ed' }}>
                <h3 className="text-base font-semibold mb-4" style={{ color: '#141e27' }}>Preview</h3>
                <div className="p-5 rounded" style={{ backgroundColor: '#f9fafb', border: `2px solid ${settings.primaryColor}` }}>
                  <div className="flex items-center justify-between pb-3 mb-4" style={{ borderBottom: `2px solid ${settings.primaryColor}` }}>
                    <p className="text-sm font-bold" style={{ color: '#141e27' }}>{settings.agencyName}</p>
                    <p className="text-[10px]" style={{ color: '#8896a4' }}>SEO Audit Report</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ border: `3px solid ${settings.primaryColor}` }}>
                      <span className="text-lg font-bold" style={{ color: settings.primaryColor }}>87</span>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#8896a4' }}>example.com</p>
                      <p className="text-sm font-medium" style={{ color: '#141e27' }}>Good Overall Health</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="bg-white rounded p-6" style={{ border: '1px solid #e4e9ed' }}>
              <h3 className="text-base font-semibold mb-1" style={{ color: '#141e27' }}>Account Information</h3>
              <p className="text-xs mb-5" style={{ color: '#8896a4' }}>Manage your profile and team access</p>

              <div className="space-y-5">
                <div className="flex items-center gap-4 pb-5" style={{ borderBottom: '1px solid #f5f7fa' }}>
                  <img src="/images/testimonial-avatar-1.jpg" alt="Profile" className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#141e27' }}>{settings.name}</p>
                    <p className="text-xs" style={{ color: '#8896a4' }}>{settings.email}</p>
                  </div>
                  <button className="ml-auto px-3 py-1.5 rounded text-xs font-medium border cursor-pointer hover:bg-[#f9fafb]" style={{ borderColor: '#e4e9ed', color: '#44576a' }}>
                    Change
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2" style={{ color: '#141e27' }}>Full Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    disabled={false}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full px-3 py-2.5  rounded text-sm outline-none"
                    style={{ border: '1px solid #e4e9ed', color: '#141e27' }}
                    />
                </div>

                 <div>
                    <label className="text-sm font-medium block mb-2" style={{ color: '#141e27' }}>Email</label>
                    <input
                    type="text"
                    value={settings.email}
                    disabled={true}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="bg-gray-50 w-full px-3 py-2.5  rounded text-sm outline-none"
                    style={{ border: '1px solid #e4e9ed', color: '#141e27' }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                 <div>
                    <label className="text-sm font-medium block mb-2" style={{ color: '#141e27' }}>Role</label>
                    <input
                    type="text"
                    value={settings.role}
                    onChange={(e) => setSettings({ ...settings, role: e.target.value })}
                    className="w-full px-3 py-2.5  rounded text-sm outline-none"
                    style={{ border: '1px solid #e4e9ed', color: '#141e27' }}
                    />
                </div>


                <div className="pt-4" style={{ borderTop: '1px solid #f5f7fa' }}>
                  <h4 className="text-sm font-semibold mb-3" style={{ color: '#141e27' }}>Danger Zone</h4>
                  <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#ef4444' }}>Delete Account</p>
                      <p className="text-xs" style={{ color: '#44576a' }}>This will permanently delete all your data</p>
                    </div>
                    <button className="px-3 py-1.5 rounded text-xs font-medium border-none cursor-pointer" style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded p-6" style={{ border: '1px solid #e4e9ed' }}>
              <h3 className="text-base font-semibold mb-1" style={{ color: '#141e27' }}>Notification Preferences</h3>
              <p className="text-xs mb-5" style={{ color: '#8896a4' }}>Choose what events trigger email notifications</p>

              <div className="space-y-4">
                {[
                  { key: 'notifyAuditComplete' as const, label: 'Audit completed', desc: 'Get notified when an audit finishes running' },
                  { key: 'notifyRankingChange' as const, label: 'Ranking changes', desc: 'Alert when tracked keywords move significantly' },
                  { key: 'notifyWeeklyDigest' as const, label: 'Weekly digest', desc: 'Summary of all activity every Monday' },
                  { key: 'notifyNewLead' as const, label: 'New widget lead', desc: 'Instant alert when someone uses your embeddable widget' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #f5f7fa' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#141e27' }}>{item.label}</p>
                      <p className="text-xs" style={{ color: '#8896a4' }}>{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                      className="bg-transparent border-none cursor-pointer"
                    >
                      {settings[item.key] ? (
                        <ToggleRight className="w-8 h-8 text-[#00a4c6]" />
                      ) : (
                        <ToggleLeft className="w-8 h-8" style={{ color: '#c1cfda' }} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <>
              <div className="bg-white rounded p-6" style={{ border: '1px solid #e4e9ed' }}>
                <h3 className="text-base font-semibold mb-1" style={{ color: '#141e27' }}>API Keys</h3>
                <p className="text-xs mb-5" style={{ color: '#8896a4' }}>Use these keys to access the OUTAudits API programmatically</p>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium block mb-2" style={{ color: '#141e27' }}>Production API Key</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded" style={{ backgroundColor: '#f5f7fa', border: '1px solid #e4e9ed' }}>
                        <Key className="w-4 h-4 flex-shrink-0" style={{ color: '#8896a4' }} />
                        <span className="text-sm font-mono" style={{ color: showApiKey ? '#141e27' : 'transparent', textShadow: showApiKey ? 'none' : '0 0 8px rgba(0,0,0,0.3)' }}>
                          {showApiKey ? 'oa_live_51Mz9JkL8xQp2vNwR7tYbE4c' : 'oa_live_51Mz9JkL8xQp2vNwR7tYbE4c'}
                        </span>
                      </div>
                      <button onClick={() => setShowApiKey(!showApiKey)} className="p-2 rounded hover:bg-[#f5f7fa] bg-transparent border-none cursor-pointer" style={{ color: '#44576a' }}>
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button className="p-2 rounded hover:bg-[#f5f7fa] bg-transparent border-none cursor-pointer" style={{ color: '#44576a' }}>
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2" style={{ color: '#141e27' }}>Webhook Secret</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2.5 rounded" style={{ backgroundColor: '#f5f7fa', border: '1px solid #e4e9ed' }}>
                        <span className="text-sm font-mono" style={{ color: '#8896a4' }}>whsec_•••••••••••••••••••••••••••</span>
                      </div>
                      <button className="p-2 rounded hover:bg-[#f5f7fa] bg-transparent border-none cursor-pointer" style={{ color: '#44576a' }}>
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-3" style={{ borderTop: '1px solid #f5f7fa' }}>
                    <button className="px-4 py-2 rounded text-xs font-medium border-none cursor-pointer" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                      Regenerate Keys
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded p-6" style={{ border: '1px solid #e4e9ed' }}>
                <h3 className="text-base font-semibold mb-1" style={{ color: '#141e27' }}>API Usage</h3>
                <p className="text-xs mb-4" style={{ color: '#8896a4' }}>This billing period (resets July 1)</p>
                <div className="space-y-3">
                  {[
                    { label: 'Audit Generations', used: 0, limit: 250 },
                    { label: 'API Calls', used: 0, limit: 10000 },
                    { label: 'PDF Exports', used: 0, limit: 100 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm" style={{ color: '#141e27' }}>{item.label}</span>
                        <span className="text-xs" style={{ color: '#8896a4' }}>{item.used.toLocaleString()} / {item.limit.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f5f7fa' }}>
                        <div className="h-full rounded-full" style={{ width: `${(item.used / item.limit) * 100}%`, backgroundColor: '#00a4c6' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Save */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90"
              style={{ backgroundColor: '#00a4c6' }}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm" style={{ color: '#34d399' }}>
                <CheckCircle2 className="w-4 h-4" />
                Saved successfully
              </span>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
