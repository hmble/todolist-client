import { Box, Center, Flex, Heading, LinkOverlay } from '@chakra-ui/layout'

import { Avatar } from '@chakra-ui/react'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetcher } from '../utils'

export default function Header(props) {
  const [url, setUrl] = useState('')
  const router = useRouter()
  useEffect(() => {
    if (router.pathname !== '/login') {
      async function getSrc() {
        if (typeof localStorage !== 'undefined') {
          const details = JSON.parse(localStorage.getItem('details'))

          if (details) {
            const username = details.username
            const data = await fetcher('GET', '/api/' + username)
            setUrl(data.profileurl)
          }
        }
        return ''
      }
      getSrc()
    }
  }, [])

  const logout = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
      router.push('/login')
    }
  }
  const editProfile = () => {
    router.push('/profile')
  }
  const register = () => {
    router.push('/register')
  }
  return (
    <Center>
      <Box
        w={{ base: '90%', md: '70%' }}
        bg="purple.500"
        px={4}
        py={2}
        mt={2}
        borderRadius={8}
      >
        <Flex justifyContent="space-between">
          <Heading
            as="h2"
            size="xl"
            color="white"
            onClick={() => {
              router.push('/')
            }}
          >
            What Todo ?
          </Heading>

          <Menu>
            <MenuButton as={Avatar} src={url} bg="teal.500" />

            <MenuList>
              <MenuItem onClick={editProfile}>Edit Profile</MenuItem>
              <MenuItem onClick={register}>Register</MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
    </Center>
  )
}
