import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

export const tema = {
  defaultTheme: 'system',
  themes: {
    // 0,60 (padrão) reprovou no axe em labels no tema claro; o escuro já usa 0,70.
    light: { colors: { primary: '#0B5CAD' }, variables: { 'medium-emphasis-opacity': 0.75 } },
    dark: { colors: { primary: '#9CCBFF' } },
  },
}

export function criarVuetify() {
  return createVuetify({
    theme: tema,
    icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
    defaults: { VTextField: { variant: 'outlined' }, VSelect: { variant: 'outlined' } },
  })
}
