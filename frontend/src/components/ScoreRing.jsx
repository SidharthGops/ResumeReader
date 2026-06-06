import { useEffect, useState } from 'react'

export default function ScoreRing({ score = 0, strokeWidth = 12 }) {
    const [displayScore, setDisplayScore] = useState(0)

    useEffect(() => {
        const duration = 1200 // ms
        const steps = 60
        const stepTime = duration / steps
        let currentStep = 0

        const interval = setInterval(() => {
            currentStep++
            const progress = currentStep / steps
            const easeProgress = progress * (2 - progress)
            const currentScore = Math.round(easeProgress * score)

            setDisplayScore(currentScore)

            if (currentStep >= steps) {
                setDisplayScore(score)
                clearInterval(interval)
            }
        }, stepTime)
        return () => clearInterval(interval)
    }, [score])

    // Determine colors based on score value
    let strokeColor = '#ef4444'
    let statusText = 'Low Match'
    let badgeClass = 'badge-error'

    if (score >= 80) {
        strokeColor = '#22c55e'
        statusText = 'Excellent Match'
        badgeClass = 'badge-success'
    } else if (score >= 60) {
        strokeColor = '#fde047'
        statusText = 'Good Match'
        badgeClass = 'badge-info'
    } else if (score >= 40) {
        strokeColor = '#f59e0b'
        statusText = 'Fair Match'
        badgeClass = 'badge-warning'
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center w-44 h-44">
                {/* Background Ring */}
                <svg
                    width="200"
                    height="200"
                    viewBox="0 0 100 100"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    {/* Animated Progress Ring */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * displayScore) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        transform="rotate(-90 50 50)"
                    />
                </svg>

                {/* Score Text */}
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl md:text-5xl font-black tracking-tight text-base-content">
                        {displayScore}%
                    </span>
                    <span className="text-xs uppercase tracking-widest font-bold opacity-60 mt-1">
                        Match
                    </span>
                </div>
            </div>

            {/* Badge Indicator */}
            <div className={`badge ${badgeClass} badge-lg font-bold gap-1 py-3 px-4 shadow-sm`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-ping"></span>
                {statusText}
            </div>
        </div>
    )
}
