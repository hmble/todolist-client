import { useForm } from 'react-hook-form'
import {
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Flex,
} from '@chakra-ui/react'
import { upload } from '../utils'
import { useRouter } from 'next/router'
export default function FileUpload() {
  const { register, handleSubmit } = useForm()
  const router = useRouter()
  const onSubmit = async (data) => {
    let formData = new FormData()
    formData.append('file', data.file[0])

    const resp = await upload(formData)
    router.reload()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex mt={4}>
        <FormControl my={2}>
          <Input id="file" type="file" {...register('file')} />
        </FormControl>
        <Button mt={2} ml={2} colorScheme="purple" type="submit">
          Upload
        </Button>
      </Flex>
    </form>
  )
}
