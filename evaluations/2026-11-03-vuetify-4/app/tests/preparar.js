import { vi } from 'vitest'

class ObservadorVazio {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ObservadorVazio
globalThis.IntersectionObserver = ObservadorVazio
globalThis.visualViewport = globalThis.visualViewport ?? new EventTarget()
window.matchMedia = vi.fn((consulta) => ({
  matches: false,
  media: consulta,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
}))
