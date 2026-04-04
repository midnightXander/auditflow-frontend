"use client";

import { useEffect, useState } from "react";
import { useAuth, fetchWithAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Check, Clock, Filter, Search } from "lucide-react";
import Link from "next/link";

const CATEGORY_OPTIONS = [
  { label: "All", value: "" },
  { label: "Website Audit", value: "audit" },
  { label: "Deep Crawl", value: "crawl" },
  { label: "Competitor Compare", value: "compare" },
  { label: "Rank Tracking", value: "rank" },
  { label: "Backlink Analysis", value: "backlink" },
  { label: "Keyword Analysis", value: "keyword" },
];

export default function ActivityHistoryPage() {
  const { user, loading } = useAuth();
  const [activity, setActivity] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (user) fetchActivity();
  }, [user]);

  useEffect(() => {
    let data = [...activity];
    if (category) data = data.filter((a) => a.type === category);
    if (date) data = data.filter((a) => a.created_at.slice(0, 10) === date);
    if (search)
      data = data.filter(
        (a) =>
          (a.target && a.target.toLowerCase().includes(search.toLowerCase())) ||
          (a.domain && a.domain.toLowerCase().includes(search.toLowerCase()))
      );
    setFiltered(data);
  }, [activity, category, date, search]);

  const fetchActivity = async () => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/activities`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch activity");
      const data = await response.json();
      setActivity(data.activities || []);
    } catch (error) {
      setActivity([]);
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 h-screen overflow-y-auto pt-16 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity History</h1>
              <p className="text-gray-600">View and filter your full activity log.</p>
            </div>
            <div className="flex flex-wrap gap-2 items-end">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select
                  className="border rounded px-3 py-2 text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  className="border rounded px-3 py-2 text-sm"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Domain/Target</label>
                <Input
                  placeholder="Search domain or target..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <div className="p-8 text-center">
                  <Clock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No activity found for the selected filters.</p>
                </div>
              ) : (
                filtered.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${item.type}/${item.activity_id}`}
                    className="p-6 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.status === "completed"
                            ? "bg-emerald-100 text-emerald-600"
                            : item.status === "failed"
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {item.status === "completed" ? (
                          <Check className="w-5 h-5" />
                        ) : item.status === "failed" ? (
                          <span className="font-bold text-lg">!</span>
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.title || item.type}</p>
                        <p className="text-sm text-gray-600">
                          {item.summary || `Ran ${item.type} on ${item.target}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex space-x-2">
                        {item.status === "completed" ? (
                          <p className="text-xs mx-2 font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                            {item.type === "audit"
                              ? "1"
                              : item.type === "crawl"
                              ? "2"
                              : "1"} credits
                          </p>
                        ) : null}
                        <p
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{formatTime(item.created_at)}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
