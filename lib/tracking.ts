

export const trackVisitor = async () => {
      try {

        if (typeof window !== "undefined") {
          const href = window.location.href;
          const searchUrl = window.location.search
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/visitor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_url: href,
            utm_source: new URLSearchParams(searchUrl).get('utm_source'),
            utm_medium: new URLSearchParams(searchUrl).get('utm_medium'),
            utm_campaign: new URLSearchParams(searchUrl).get('utm_campaign')
          })
        });
      }
      } catch (error) {
        console.error('Error tracking visitor:', error)
      }
    }
  