import { AppProps } from 'next/app'
import './styles.css'
import { ChakraProvider } from '@chakra-ui/react'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}

export default CustomApp
