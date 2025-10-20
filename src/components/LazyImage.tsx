import React, { useEffect, useState } from 'react'

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  placeholder?: string
  // If true, the full image will load immediately; otherwise it will load
  // after window.load to reduce competition with critical resources.
  eager?: boolean
}

export function LazyImage({ src, placeholder, alt, className, style, eager, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [showFull, setShowFull] = useState(Boolean(eager))

  useEffect(() => {
    // Respect Save-Data and slow connections: don't auto-load the large image.
    const connection = (navigator as any).connection
    if (connection && (connection.saveData || /2g/.test(connection.effectiveType ?? ''))) {
      setShowFull(false)
      return
    }

    if (showFull) return

    const onLoad = () => setShowFull(true)
    if (document.readyState === 'complete') {
      // delay a short time so critical rendering gets priority
      setTimeout(onLoad, 150)
    } else {
      window.addEventListener('load', onLoad)
      return () => window.removeEventListener('load', onLoad)
    }
  }, [showFull, eager])

  useEffect(() => {
    let img: HTMLImageElement | null = null
    if (showFull && src) {
      img = new Image()
      img.src = String(src)
      img.onload = () => setLoaded(true)
      img.onerror = () => setLoaded(true)
    }
    return () => {
      if (img) {
        img.onload = null
        img.onerror = null
        img = null
      }
    }
  }, [showFull, src])

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={style}>
      {/** Placeholder (low-weight) */}
      <img
        src={placeholder}
        alt={alt}
        aria-hidden={loaded}
        className={`block w-full h-auto transition-opacity duration-500 ease-in-out ${loaded ? 'opacity-0' : 'opacity-100'}`}
        decoding="async"
      />

      {showFull && (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-auto block transition-opacity duration-500 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
          decoding="async"
          loading={eager ? 'eager' : 'lazy'}
          {...rest}
        />
      )}
    </div>
  )
}
