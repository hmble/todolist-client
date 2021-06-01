import { useForm } from 'react-hook-form'
import React from 'react'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Textarea,
  Box,
  Flex,
} from '@chakra-ui/react'
import { fetcher } from '../utils'

export default function HookForm({ onToggle }) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (values) => {
    const { title, description } = values

    const data = {
      title: title,
      description: description,
      is_archived: false,
    }
    let token
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token')
    }
    const d = await fetcher('POST', '/api/todo/new', data)
    // onToggle()
  }

  return (
    <Box my={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.title}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            placeholder="title"
            {...register('title', {
              required: 'This is required',
            })}
          />
          <FormErrorMessage>
            {errors.title && errors.title.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.description}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            placeholder="description"
            {...register('description')}
          />
        </FormControl>

        <Flex>
          <Button
            mt={4}
            colorScheme="purple"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
          <Button mt={4} ml={4} onClick={onToggle}>
            Close
          </Button>
        </Flex>
      </form>
    </Box>
  )
}
