// Utilitário para testar responsividade
export const deviceBreakpoints = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1024px'
}

export function checkResponsiveness() {
  console.log('Testando responsividade nos breakpoints:')
  Object.entries(deviceBreakpoints).forEach(([device, width]) => {
    console.log(`- ${device}: ${width}`)
  })
}
