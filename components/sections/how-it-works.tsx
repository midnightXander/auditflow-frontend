'use client'

import { useEffect, useRef } from 'react'
import { Code, Palette, Send, CheckCircle, BarChart3, Mail } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useRouter } from 'next/navigation'

gsap.registerPlugin(ScrollTrigger)

export default function HowItWorks() {
    const router = useRouter()
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = cardsRef.current.filter(Boolean)
    if (cards.length === 0) return

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    return () => {
      cards.forEach((card) => {
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === card)
          .forEach((t) => t.kill())
      })
    }
  }, [])

  const steps = [
    {
      number: 1,
      title: 'Generate Embed Code',
      description: 'Configure your widget settings, colors, and branding in the dashboard. Copy a single line of code.',
      icon: Code,
      color: '#00a4c6',
    },
    {
      number: 2,
      title: 'Customize Branding',
      description: 'Add your logo, agency name, and choose brand colors. Fully white-labeled for your brand.',
      icon: Palette,
      color: '#00a4c6',
    },
    {
      number: 3,
      title: 'Paste on Your Site',
      description: 'Drop the embed code into any website, landing page, or CMS. Works with WordPress, Webflow, custom builds.',
      icon: Send,
      color: '#00a4c6',
    },
    {
      number: 4,
      title: 'Visitors Run Audits',
      description: 'Visitors enter their website URL and email. They instantly see a preview of their audit report.',
      icon: BarChart3,
      color: '#00a4c6',
    },
    {
      number: 5,
      title: 'Capture Leads',
      description: 'Emails and URLs automatically saved to your dashboard. No manual data entry. Pure lead generation.',
      icon: Mail,
      color: '#00a4c6',
    },
    {
      number: 6,
      title: 'Close the Deal',
      description: 'Follow up with qualified leads, deliver full audit reports, and convert them into paying clients.',
      icon: CheckCircle,
      color: '#00a4c6',
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-b from-white via-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-sm font-semibold text-[#00a4c6]">
            Simple Process
          </span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-black text-slate-900">
            How It Works in 6 Steps
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            From setup to lead capture, you're generating qualified leads in minutes. Here's the workflow.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el
                }}
                className="group relative bg-white rounded-xl p-8 border border-slate-200 hover:border-[#00a4c6] shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#00a4c6] to-[#00a4c6] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.number}
                </div>

                {/* Icon Background */}
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${step.color}20` }}
                >
                  <Icon size={28} color={step.color} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>

                {/* Connecting Line (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 w-8 h-0.5 bg-gradient-to-r from-[#00a4c6] to-transparent" />
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">
            Ready to get started? It only takes 5 minutes to set up.
          </p>
          <button onClick={() => router.push('/register')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#00a4c6] to-[#00a4c6] text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Start Your Free Trial
          </button>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-teal-50 rounded-full filter blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full filter blur-3xl opacity-40" />
      </div>
    </section>
  )
}
