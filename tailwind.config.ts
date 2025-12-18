import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        // Custom colors
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
    },
  },
} satisfies Config
