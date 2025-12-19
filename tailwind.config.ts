import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        'background-secondary': 'oklch(0.2069 0.0403 263.99)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
    },
  },
} satisfies Config
