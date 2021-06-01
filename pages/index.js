import { Button } from '@chakra-ui/button'
import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  StackDivider,
  VStack,
} from '@chakra-ui/layout'
import {
  UpDownIcon,
  CloseIcon,
  TriangleDownIcon,
  SettingsIcon,
} from '@chakra-ui/icons'
import { useState } from 'react'
import {
  ScaleFade,
  useDisclosure,
  IconButton,
  CheckboxGroup,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { Menu, MenuButton, MenuList, MenuItem, Stack } from '@chakra-ui/react'
import HookForm from '../components/HookForm'
import { useForm } from 'react-hook-form'
import { fetcher } from '../utils'
import Header from '../components/Header'

const ShowTodo = ({ onToggle, data }) => {
  const [localData, setLocalData] = useState([...data])
  const { handleSubmit, register } = useForm()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSubmit = async (data) => {
    // we handle individual request in differnt methods like
    // deleteTodo()
    // archiveTodo()
    // unarchiveTodo()
  }
  const deleteTodo = async (values) => {
    await fetcher('POST', '/api/todo/multidelete', values)

    const d = await fetcher('GET', '/api/todo/all')
    setLocalData([...d])
  }
  const archiveTodo = async (values) => {
    await fetcher('POST', '/api/todo/archive', values)
    const d = await fetcher('GET', '/api/todo/all')
    setLocalData([...d])
  }
  const unarchiveTodo = async (values) => {
    await fetcher('POST', '/api/todo/unarchive', values)
    const d = await fetcher('GET', '/api/todo/all')
    setLocalData([...d])
  }

  const getTodos = async (option) => {
    let token
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token')
    }
    const d = await fetcher('GET', '/api/todo/all')

    switch (option) {
      case 'archive':
        setLocalData([...d.filter((d) => d.is_archived)])
        break
      case 'unarchive':
        setLocalData([...d.filter((d) => !d.is_archived)])
        break
      case 'sortasc':
        setLocalData([
          ...d.sort((a, b) => new Date(a.created) - new Date(b.created)),
        ])
        break
      case 'sortdesc':
        setLocalData([
          ...d.sort((a, b) => new Date(b.created) - new Date(a.created)),
        ])
        break
      default:
        setLocalData([...d])
    }
  }

  return (
    <Box my={8}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex justifyContent="flex-end">
          <Menu>
            <MenuButton
              as={Button}
              mr={4}
              colorScheme="purple"
              rightIcon={<TriangleDownIcon />}
            >
              Filter
            </MenuButton>
            <MenuList>
              <MenuItem onClick={getTodos}>All</MenuItem>
              <MenuItem onClick={async () => await getTodos('archive')}>
                Archive
              </MenuItem>
              <MenuItem onClick={async () => await getTodos('unarchive')}>
                Unarchive
              </MenuItem>
              <MenuItem onClick={async () => await getTodos('sortasc')}>
                Sort (ASC)
              </MenuItem>
              <MenuItem onClick={async () => await getTodos('sortdesc')}>
                Sort (DESC)
              </MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} mr={4} rightIcon={<UpDownIcon />}>
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleSubmit(deleteTodo)}>Delete</MenuItem>
              <MenuItem onClick={handleSubmit(archiveTodo)}>Archive</MenuItem>
              <MenuItem onClick={handleSubmit(unarchiveTodo)}>
                Unarchive
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            aria-label="Close todo"
            icon={<CloseIcon />}
            onClick={onToggle}
          />
        </Flex>
        <Stack spacing={4} mt={4}>
          <VStack
            align="stretch"
            divider={<StackDivider borderColor="gray.200" />}
            spacing={2}
          >
            <CheckboxGroup colorScheme="purple" size="lg">
              {localData?.map((d) => (
                <Checkbox
                  {...register('list')}
                  id="list"
                  key={d.todoid}
                  name="list"
                  value={d.todoid}
                >
                  <Box mx={2} onClick={onOpen}>
                    <Heading flex="2" as="h4" size="md">
                      {d.title}
                    </Heading>
                    {d.is_archived ? (
                      <Badge colorScheme="green">Archived</Badge>
                    ) : null}
                  </Box>
                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Just Do It ✅</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>{d.description}</ModalBody>
                    </ModalContent>
                  </Modal>
                </Checkbox>
              ))}
            </CheckboxGroup>
          </VStack>
        </Stack>
      </form>
    </Box>
  )
}

export default function Home() {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true })
  const { isOpen: isTodoOpen, onToggle: onToggleTodo } = useDisclosure()
  const [data, setData] = useState([])

  const getTodos = async () => {
    let token
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token')
    }
    const data = await fetcher('GET', '/api/todo/all')
    setData([...data])
  }
  return (
    <Flex direction="column">
      <Header />
      <Container maxW="90%" centerContent>
        <Box w={{ base: '400px', sm: '70%' }} my={8}>
          <Menu>
            <MenuButton as={Button} rightIcon={<SettingsIcon />}>
              Menu
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  if (isTodoOpen) {
                    onToggleTodo()
                  }
                  onToggle()
                }}
              >
                Add todo
              </MenuItem>
              <MenuItem
                onClick={async () => {
                  await getTodos()
                  if (isOpen) {
                    onToggle()
                  }
                  onToggleTodo()
                }}
              >
                Show todo
              </MenuItem>
            </MenuList>
          </Menu>
          <ScaleFade unmountOnExit={true} initialScale={0.9} in={isOpen}>
            <HookForm onToggle={onToggle} />
          </ScaleFade>
          <ScaleFade unmountOnExit={true} initialScale={0.9} in={isTodoOpen}>
            <ShowTodo onToggle={onToggleTodo} data={data} />
          </ScaleFade>
        </Box>
      </Container>
    </Flex>
  )
}
