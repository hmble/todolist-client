import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { fetcher } from '../utils'
function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
export default MyApp
