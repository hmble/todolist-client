import { Box, Center, Container, Flex, Heading } from '@chakra-ui/layout'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import React, { useEffect } from 'react'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Textarea,
} from '@chakra-ui/react'
import Header from '../components/Header'
import { fetcher } from '../utils'
import FileUpload from '../components/FileUpload'
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
export default function Profile() {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(async () => {
    if (typeof localStorage !== 'undefined') {
      const username = localStorage.getItem('username')
      const resp = await fetcher('GET', `/api/${username}`)

      localStorage.setItem('details', JSON.stringify(resp))
    }
  }, [])
  const onSubmit = async (values) => {
    const resp = await fetcher('POST', '/api/register', values)

    const d = await resp.json()
    if (typeof localstorage !== 'undefined') {
      localStorage.setItem('token', d.token)
    }
    router.push('/')
  }

  return (
    <Flex direction="column">
      <Header />

      <Container maxW="90%" centerContent>
        <Box w={{ base: '300px', md: '400px' }} p={4}>
          <Center>
            <Heading as="h3" size="md" my={4}>
              Register
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
              <FormControl my={2}>
                <FormLabel htmlFor="firstname">First Name</FormLabel>
                <Input
                  id="firstname"
                  placeholder="First Name"
                  {...register('firstname')}
                />
              </FormControl>
              <FormControl my={2}>
                <FormLabel htmlFor="lastname">Last Name</FormLabel>
                <Input
                  id="lastname"
                  placeholder="Last Name"
                  {...register('lastname')}
                />
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
              <FormControl my={2} isInvalid={errors['password_repeat']}>
                <FormLabel htmlFor="password_repeat">
                  Confirm Password
                </FormLabel>
                <PasswordInput
                  id="password_repeat"
                  placeholder="Confirm Password"
                  {...register('password_repeat', {
                    validate: (value) =>
                      value === password.current ||
                      'The passwords do not match',
                  })}
                />
                <FormErrorMessage>
                  {errors.password_repeat && errors.password_repeat.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                mt={4}
                colorScheme="purple"
                isLoading={isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Box>
        </Box>
        <Heading as="h3" size="lg">
          Upload Profile Picture
        </Heading>
        <FileUpload />
      </Container>
    </Flex>
  )
}
