import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/theme.css'
import { App } from './app/App'

if (import.meta.env.DEV) {
  const { validateContent } = await import('./data/validate')
  const problems = validateContent()
  if (problems.length > 0) {
    console.warn(`[PathFinder] ${problems.length} content problem(s):\n- ${problems.join('\n- ')}`)
  }
}

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
