'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  children: React.ReactNode
  panelCount: number
}

export function HorizontalScroll({ children, panelCount }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    // Only enable on desktop
    if (window.innerWidth < 900) return

    const totalWidth = track.scrollWidth - window.innerWidth

    const tween = gsap.to(track, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        end: () => `+=${totalWidth}`,
        invalidateOnRefresh: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [panelCount])

  return (
    <div ref={containerRef} style={{ overflow: 'hidden' }}>
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          height: '100vh',
        }}
      >
        {children}
      </div>
    </div>
  )
}
