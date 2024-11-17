'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { IconMoon, IconSun } from '@/components/ui/icons'

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ensure this runs only on the client
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid rendering mismatched icons during SSR
  if (!mounted) {
    return null
  }

  return (
    <div className="fixed bottom-1 left-1 z-50 flex size-6 items-center justify-center rounded-full p-4 font-mono text-xs text-white">
      <Button
        size="icon"
        variant="link"
        onClick={() => {
          setTheme(theme === 'light' ? 'dark' : 'light')
        }}
      >
        {resolvedTheme === 'dark' ? (
          <IconMoon className="transition-all" />
        ) : (
          <IconSun className="transition-all" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
