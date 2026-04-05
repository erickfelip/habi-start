import { useEffect, useState } from 'react'

const useDebounce = (callback: any, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(callback)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(callback), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [callback, delay])

  return debouncedValue
}

export default useDebounce
