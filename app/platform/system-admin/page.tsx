'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { fetchWithAuth, useAuth } from '@/lib/auth-context'
import { Trash, Edit, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  email: string
  full_name?: string
  plan?: string
  is_verified?: boolean
  credits_remaining?: number
}

type Stats = {
  users: {
    total: number
    verified: number
    new_this_month: number
    by_plan: {
      free: number
      pro: number
      agency: number
    }
  }
  audits: {
    total: number
    this_month: number
  }
  features: {
    crawls: number
    comparisons: number
  }
  revenue: {
    mrr: number
  }
}

type ActivityItem = {
  type: string
  user_email: string
  url?: string
  status?: string
  score?: number | null
  created_at: string
}

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [usersTotal, setUsersTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingStats, setLoadingStats] = useState(false)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loadingActivity, setLoadingActivity] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<User>>({})
  const router = useRouter()

  

  useEffect(() => {
    if(user && user.is_admin){
        fetchAll()

    }
  }, [user,page])

  async function fetchAll() {
    fetchStats()
    fetchUsers(page, pageSize)
    fetchActivity()
  }

  async function fetchStats() {
    setLoadingStats(true)
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/stats`)
      if (!res.ok) throw new Error('Failed to load stats')
      const data = await res.json()
      
      setStats(data as Stats)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingStats(false)
    }
  }

  async function fetchUsers(pageNum: number, pageSizeNum: number) {
    setLoadingUsers(true)
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/users?page=${pageNum}&page_size=${pageSizeNum}`)
      if (!res.ok) throw new Error('Failed to load users')
      const data = await res.json()
      // expected shape: { users: [...], total, page, page_size, total_pages }
      setUsers(data.users || [])
      setUsersTotal(data.total || 0)
      setTotalPages(data.total_pages || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingUsers(false)
    }
  }

  async function fetchActivity() {
    setLoadingActivity(true)
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/activity`)
      if (!res.ok) throw new Error('Failed to load activity')
      const data = await res.json()
      setActivity(data.activity || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingActivity(false)
    }
  }

  async function handleDeleteUser(userId: string) {
    const ok = confirm('Are you sure you want to delete this user? This action cannot be undone.')
    if (!ok) return

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/users/${userId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Delete failed')
      // refresh users
      fetchUsers(page, pageSize)
    } catch (err) {
      console.error(err)
      alert('Failed to delete user')
    }
  }

  function startEdit(user: User) {
    setEditingUserId(user.id)
    setEditValues({
      email: user.email,
      full_name: user.full_name,
      plan: user.plan,
      credits_remaining: user.credits_remaining,
    })
  }

  function cancelEdit() {
    setEditingUserId(null)
    setEditValues({})
  }

  async function saveEdit(userId: string) {
    try {
      const payload = { ...editValues }
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Update failed')
      // refresh
      setEditingUserId(null)
      setEditValues({})
      fetchUsers(page, pageSize)
    } catch (err) {
      console.error(err)
      alert('Failed to update user')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !user?.is_admin) {
    router.push('/404')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Overview of users, audits, activity and revenue</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline">Open Site</Button>
            </Link>
            <Button onClick={() => fetchAll()}>Refresh</Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent>
              <p className="text-sm text-gray-500">Total Users</p>
              <div className="text-3xl font-bold">{loadingStats ? '—' : stats?.users.total ?? 0}</div>
              <p className="text-sm text-gray-500">Verified: {stats?.users.verified ?? '—'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p className="text-sm text-gray-500">Audits</p>
              <div className="text-3xl font-bold">{loadingStats ? '—' : stats?.audits.total ?? 0}</div>
              <p className="text-sm text-gray-500">This month: {stats?.audits.this_month ?? '—'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p className="text-sm text-gray-500">Crawls</p>
              <div className="text-3xl font-bold">{loadingStats ? '—' : stats?.features.crawls ?? 0}</div>
              <p className="text-sm text-gray-500">Comparisons: {stats?.features.comparisons ?? '—'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p className="text-sm text-gray-500">MRR</p>
              <div className="text-3xl font-bold">${loadingStats ? '—' : (stats?.revenue.mrr ?? 0)}</div>
              <p className="text-sm text-gray-500">Monthly Recurring Revenue</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">All Users</h2>
              <div className="text-sm text-gray-600">{usersTotal} users</div>
            </div>

            <div className="space-y-3">
              <div className="bg-white border rounded-lg overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-gray-600 border-b">
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Plan</th>
                      <th className="py-3 px-4">Credits</th>
                      <th className="py-3 px-4">Verified</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-gray-500">Loading users...</td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-gray-500">No users found</td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="border-b last:border-b-0">
                          <td className="py-3 px-4 align-top">
                            <div className="text-sm font-medium text-gray-900">{u.email}</div>
                            <div className="text-xs text-gray-500">{u.id}</div>
                          </td>
                          <td className="py-3 px-4 align-top">
                            {editingUserId === u.id ? (
                              <Input value={editValues.full_name || ''} onChange={(e) => setEditValues(prev => ({ ...prev, full_name: e.target.value }))} className="h-9" />
                            ) : (
                              <div className="text-sm text-gray-900">{u.full_name || '—'}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 align-top">
                            {editingUserId === u.id ? (
                              <select value={editValues.plan || u.plan} onChange={(e) => setEditValues(prev => ({ ...prev, plan: e.target.value }))} className="h-9 rounded border px-2 text-sm">
                                <option value="free">Free</option>
                                <option value="pro">Pro</option>
                                <option value="agency">Agency</option>
                              </select>
                            ) : (
                              <div className="text-sm text-gray-900 capitalize">{u.plan || 'free'}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 align-top">
                            {editingUserId === u.id ? (
                              <Input value={String(editValues.credits_remaining ?? u.credits_remaining ?? 0)} onChange={(e) => setEditValues(prev => ({ ...prev, credits_remaining: Number(e.target.value) }))} className="h-9" />
                            ) : (
                              <div className="text-sm text-gray-900">{u.credits_remaining ?? '—'}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 align-top">
                            <div className="text-sm">{u.is_verified ? '✅' : '—'}</div>
                          </td>
                          <td className="py-3 px-4 align-top">
                            <div className="flex items-center gap-2">
                              {editingUserId === u.id ? (
                                <>
                                  <Button size="sm" onClick={() => saveEdit(u.id)}>
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => cancelEdit()}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => startEdit(u)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u.id)}>
                                    <Trash className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
                <div className="flex items-center gap-2">
                  <Button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
                  <Button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <div className="text-sm text-gray-600">{activity.length} items</div>
            </div>

            <div className="space-y-3">
              {loadingActivity ? (
                <div className="p-6 text-center text-gray-500">Loading activity...</div>
              ) : activity.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No activity</div>
              ) : (
                activity.map((a, i) => (
                  <Card key={i} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{a.user_email}</div>
                          <div className="text-xs text-gray-600">{a.type} • {a.url ?? '—'}</div>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <div>{new Date(a.created_at).toLocaleString()}</div>
                          <div className="mt-1">{a.status ?? ''} {a.score ? `• ${a.score}` : ''}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
