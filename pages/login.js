import { Box, Center, Container, Flex, Heading } from '@chakra-ui/layout'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import React from 'react'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import Header from '../components/Header'
import { fetcher } from '../utils'
function PasswordInput(props) {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size="md">
      <Input
        {...props}
        pr="4.5rem"
        type={show ? 'text' : 'password'}
        placeholder="Enter password"
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}
export default function Login() {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (values) => {
    const d = await fetcher('POST', '/api/login', values)
    if (!d?.message?.includes('error')) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('token', d?.token)
        localStorage.setItem('username', values.username)
        localStorage.setItem('details', JSON.stringify(d?.details))
      }
      router.push('/')
    }
  }

  return (
    <Flex direction="column">
      <Header />

      <Container maxW="90%" centerContent>
        <Box w={{ base: '300px', md: '400px' }} p={4}>
          <Center>
            <Heading as="h3" size="md" my={4}>
              Login
            </Heading>
          </Center>
          <Box
            border="2px"
            borderColor="gray.300"
            borderRadius={8}
            py={4}
            px={8}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={errors['username']}>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  placeholder="Username"
                  {...register('username', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl my={2} isInvalid={errors['password']}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <PasswordInput
                  id="password"
                  placeholder="Password"
                  {...register('password', {
                    required: 'You must specify a password',
                    minLength: {
                      value: 8,
                      message: 'Password must have at least 8 characters',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                mt={4}
                colorScheme="purple"
                isLoading={isSubmitting}
                type="submit"
              >
                Login
              </Button>
            </form>
          </Box>
        </Box>
      </Container>
    </Flex>
  )
}
