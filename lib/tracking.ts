

export const trackVisitor = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/visitor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_url: window.location.href,
            utm_source: new URLSearchParams(window.location.search).get('utm_source'),
            utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
            utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign')
          })
        });
      } catch (error) {
        console.error('Error tracking visitor:', error)
      }
    }
  