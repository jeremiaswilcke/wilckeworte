'use client'

export function GradientOrb() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full opacity-30 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, var(--coral) 0%, var(--teal) 60%, transparent 80%)',
          mixBlendMode: 'screen',
          animation: 'orbFloat 8s ease-in-out infinite',
        }}
      />
      <style jsx>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 20px) scale(1.05); }
          66% { transform: translate(20px, -15px) scale(0.95); }
        }
      `}</style>
    </div>
  )
}
