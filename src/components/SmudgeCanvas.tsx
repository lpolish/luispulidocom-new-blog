"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "./ui/button"

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  life: number
  maxLife: number
}

export default function SmudgeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const isDrawingRef = useRef(false)
  const prevPositionRef = useRef({ x: 0, y: 0 })
  const [colorPhase, setColorPhase] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Color palettes for evolution
  const colorPalettes = [
    ["#3498db", "#2980b9", "#1abc9c", "#16a085"], // Blue to Teal
    ["#e74c3c", "#c0392b", "#f39c12", "#d35400"], // Red to Orange
    ["#9b59b6", "#8e44ad", "#3498db", "#2980b9"], // Purple to Blue
    ["#f1c40f", "#f39c12", "#e67e22", "#d35400"], // Yellow to Orange
    ["#1abc9c", "#16a085", "#2ecc71", "#27ae60"], // Teal to Green
  ]

  // Get current color palette based on phase
  const getCurrentPalette = useCallback(() => {
    return colorPalettes[Math.floor(colorPhase) % colorPalettes.length]
  }, [colorPhase])

  // Get a random color from the current palette with transition to next palette
  const getRandomColor = useCallback(() => {
    const currentPalette = getCurrentPalette()
    const nextPaletteIndex = (Math.floor(colorPhase) + 1) % colorPalettes.length
    const nextPalette = colorPalettes[nextPaletteIndex]

    const transitionProgress = colorPhase % 1
    const colorIndex = Math.floor(Math.random() * currentPalette.length)

    // Get colors from current and next palette
    const currentColor = currentPalette[colorIndex]
    const nextColor = nextPalette[colorIndex]

    // Parse the hex colors to RGB
    const currentRGB = hexToRgb(currentColor)
    const nextRGB = hexToRgb(nextColor)

    // Interpolate between the colors
    const r = Math.floor(currentRGB.r * (1 - transitionProgress) + nextRGB.r * transitionProgress)
    const g = Math.floor(currentRGB.g * (1 - transitionProgress) + nextRGB.g * transitionProgress)
    const b = Math.floor(currentRGB.b * (1 - transitionProgress) + nextRGB.b * transitionProgress)

    return `rgb(${r}, ${g}, ${b})`
  }, [colorPhase, getCurrentPalette])

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return


    // Responsive sizing using ResizeObserver
    let resizeObserver: ResizeObserver | null = null
    const container = canvas.parentElement
    const handleResize = () => {
      if (!container) return
      // Set canvas dimensions to match container
      const dpr = window.devicePixelRatio || 1
      canvas.width = container.clientWidth * dpr
      canvas.height = container.clientHeight * dpr
      canvas.style.width = container.clientWidth + "px"
      canvas.style.height = container.clientHeight + "px"
      // Clear and redraw
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.scale(dpr, dpr)
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
    handleResize()
    if (container && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(container)
    }


    // Start color evolution
    const colorInterval = setInterval(() => {
      setColorPhase((prev) => prev + 0.005) // Slow color evolution
    }, 100)

    // Animation loop
    let animationFrameId: number


    const render = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Apply slight fade effect to create trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.03)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles (iterate backwards for safe removal)
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i]
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Apply friction
        particle.vx *= 0.98
        particle.vy *= 0.98

        // Decrease life
        particle.life--

        // Remove dead particles
        if (particle.life <= 0) {
          particlesRef.current.splice(i, 1)
          continue
        }

        // Calculate opacity based on life
        const opacity = particle.life / particle.maxLife

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 3 + opacity * 5, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace("rgb", "rgba").replace(")", `, ${opacity})`)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    // Cleanup
    return () => {
      if (resizeObserver && container) resizeObserver.disconnect()
      clearInterval(colorInterval)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Handle mouse/touch events
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const getPosition = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      if ("touches" in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        }
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        }
      }
    }

    const createParticles = (x: number, y: number, prevX: number, prevY: number) => {
      // Calculate distance and angle between current and previous position
      const dx = x - prevX
      const dy = y - prevY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx)

      // Create particles along the path
      const count = Math.max(Math.floor(distance / 5), 1)

      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0 : i / (count - 1)
        const px = prevX + dx * t
        const py = prevY + dy * t

        // Add some randomness to velocity
        const spread = 2
        const vx = Math.cos(angle) * 2 + (Math.random() - 0.5) * spread
        const vy = Math.sin(angle) * 2 + (Math.random() - 0.5) * spread

        // Create 3-5 particles at each point for a fuller effect
        const particleCount = 3 + Math.floor(Math.random() * 3)

        for (let j = 0; j < particleCount; j++) {
          particlesRef.current.push({
            x: px + (Math.random() - 0.5) * 10,
            y: py + (Math.random() - 0.5) * 10,
            vx: vx + (Math.random() - 0.5) * 2,
            vy: vy + (Math.random() - 0.5) * 2,
            color: getRandomColor(),
            life: 50 + Math.random() * 100,
            maxLife: 50 + Math.random() * 100,
          })
        }
      }
    }

    const handleStart = (e: MouseEvent | TouchEvent) => {
      isDrawingRef.current = true
      const pos = getPosition(e)
      prevPositionRef.current = pos
    }

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return

      const pos = getPosition(e)
      createParticles(pos.x, pos.y, prevPositionRef.current.x, prevPositionRef.current.y)
      prevPositionRef.current = pos
    }

    const handleEnd = () => {
      isDrawingRef.current = false
    }

    // Mouse events
    canvas.addEventListener("mousedown", handleStart)
    canvas.addEventListener("mousemove", handleMove)
    canvas.addEventListener("mouseup", handleEnd)
    canvas.addEventListener("mouseout", handleEnd)

    // Touch events
    canvas.addEventListener("touchstart", handleStart)
    canvas.addEventListener("touchmove", handleMove)
    canvas.addEventListener("touchend", handleEnd)

    return () => {
      // Cleanup
      canvas.removeEventListener("mousedown", handleStart)
      canvas.removeEventListener("mousemove", handleMove)
      canvas.removeEventListener("mouseup", handleEnd)
      canvas.removeEventListener("mouseout", handleEnd)

      canvas.removeEventListener("touchstart", handleStart)
      canvas.removeEventListener("touchmove", handleMove)
      canvas.removeEventListener("touchend", handleEnd)
    }
  }, [getRandomColor])

  // Clear canvas
  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    particlesRef.current = []
  }

  // Save canvas as image
  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `evolving-smudge-${new Date().toISOString().slice(0, 10)}.png`
    link.href = dataUrl
    link.click()
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-black" : "w-full aspect-video"}`}>
      <canvas ref={canvasRef} className="w-full h-full touch-none cursor-crosshair rounded-lg" />

      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleClear}
          className="bg-black/50 border-white/20 text-white hover:bg-black/70"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="sr-only">Clear Canvas</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleSave}
          className="bg-black/50 border-white/20 text-white hover:bg-black/70"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="sr-only">Save Image</span>
        </Button>

        <Button
          variant="outline"
          onClick={toggleFullscreen}
          className="bg-black/50 border-white/20 text-white hover:bg-black/70"
        >
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
      </div>
    </div>
  )
}
