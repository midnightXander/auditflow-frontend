"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, Globe, Trello, LinkIcon, KeySquare, BarChart3, CheckCircle } from "lucide-react";

const STEPS = [
  {
    title: "Welcome to OUTAudits!",
    description: "OUTAudits helps agencies and freelancers deliver professional SEO audits, deep crawls, and competitor analysis in seconds. Let's get you started!",
    icon: <CheckCircle className="w-8 h-8 text-primary-600 mb-4" />,
  },
  {
    title: "Run Your First Audit",
    description: "Enter a website URL and generate a client-ready SEO audit report. Use the white-label PDF export to impress prospects and clients.",
    icon: <Zap className="w-8 h-8 text-amber-500 mb-4" />,
  },
  {
    title: "Deep Crawl & Technical Checks",
    description: "Crawl entire sites to find broken links, duplicate content, and technical SEO issues. Perfect for onboarding new clients or monthly retainers.",
    icon: <Globe className="w-8 h-8 text-cyan-600 mb-4" />,
  },
  {
    title: "Competitor & Keyword Analysis",
    description: "Compare your site to competitors, track keyword rankings, and discover new keyword opportunities to boost your clients' visibility.",
    icon: <Trello className="w-8 h-8 text-purple-600 mb-4" />,
  },
  {
    title: "Share, Export, and Collaborate",
    description: "Share audit results with a link, export branded PDFs, and manage all your reports from the dashboard. Invite your team for seamless collaboration.",
    icon: <BarChart3 className="w-8 h-8 text-indigo-600 mb-4" />,
  },
  {
    title: "You're Ready!",
    description: "Start winning more clients and delivering value with OUTAudits. Need help? Visit our help center or contact support anytime.",
    icon: <CheckCircle className="w-8 h-8 text-green-600 mb-4" />,
  },
];

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Show onboarding for new users (or if not dismissed)
    if (typeof window !== "undefined" && !localStorage.getItem("outaudits_onboarded")) {
      setTimeout(() => setOpen(true), 800);
    }
  }, []);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setOpen(false);
      localStorage.setItem("outaudits_onboarded", "1");
    }
  };

  const handleSkip = () => {
    setOpen(false);
    localStorage.setItem("outaudits_onboarded", "1");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            {STEPS[step].icon}
            <DialogTitle className="text-2xl mb-2">{STEPS[step].title}</DialogTitle>
            <p className="text-gray-600 mb-2">{STEPS[step].description}</p>
          </div>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2">
          <div className="flex justify-between w-full">
            <Button variant="ghost" onClick={handleSkip} className="text-gray-500">Skip</Button>
            <Button onClick={handleNext}>
              {step === STEPS.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
          <div className="flex justify-center gap-1 mt-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i === step ? "bg-primary-600" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
