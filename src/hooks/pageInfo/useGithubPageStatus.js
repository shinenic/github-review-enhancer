import { useEffect, useState, useRef } from 'react'

const getLoadingDom = () => {
  return document?.querySelector?.('span[class~="js-pjax-loader-bar"]')
}

const MAX_GETTING_DOM_ATTEMPT = 8

/**
 * Get the status of spa github page,
 * due to the loading span is created dynamically,
 * the status will be `unknown` until the dom found.
 *
 * @returns {'unknown'|'loading'|'loaded'} status
 */
const useGithubPageStatus = () => {
  const attemptCount = useRef(0)
  const [status, setStatus] = useState('unknown')
  const [loadingDom, setLoadingDom] = useState(null)

  useEffect(() => {
    if (loadingDom) return

    let interval = null

    const callback = () => {
      setLoadingDom(getLoadingDom())
      setStatus('loaded')
      attemptCount.current += 1

      if (attemptCount.current >= MAX_GETTING_DOM_ATTEMPT) {
        clearInterval(interval)
      }
    }

    interval = setInterval(callback, 1000)

    return () => clearInterval(interval)
  }, [loadingDom])

  useEffect(() => {
    if (!loadingDom) return

    const callback = (mutations) => {
      const widthValue = mutations[0].target.style.width
      setStatus(widthValue !== '100%' && !!widthValue)
    }

    const observer = new MutationObserver(callback)

    observer.observe(loadingDom, { attributes: true, subtree: true })

    return () => observer.disconnect()
  }, [loadingDom])

  return status
}

export default useGithubPageStatus
