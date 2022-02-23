import { AppProps } from 'next/app'
import './styles.css'
import { createTheme, ThemeProvider } from '@mui/material'

const theme = createTheme({})
function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default CustomApp
