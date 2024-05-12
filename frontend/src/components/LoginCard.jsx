'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import { authScreenAtom } from '../atoms/authAtoms'
import useShowToast from '../hooks/useShowToast'
import { userAtom } from '../atoms/userAtoms'

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false)
  const showToast = useShowToast()
  const setAuthScreen = useSetRecoilState(authScreenAtom)
  const [inputs, setInputs] = useState({
    username: '',
    password: ''
    })

  const setUser = useSetRecoilState(userAtom)

  const handelLogin = async() => {
    if(!inputs.username || !inputs.password) {
      showToast("Error","Please fill all the fields","error")
      return
    }
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( inputs )
      })
      const data = await res.json()
      if(data.error) {
        showToast("Error", data.error, "error")
        return
      }
      localStorage.setItem('user-threads', JSON.stringify(data))
      setUser(data)
      
    } catch (error) {
      showToast("Error", error, "error")
    }
  }

  return (
    <Flex
      minH={'50vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
          w={{
            base:'full',
            md: 'md',
            sm: '400px'
          }}>
          <Stack spacing={4}>
          <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" value={inputs.username} onChange={e=>{setInputs({...inputs, username:e.target.value})}}/>
                </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} value={inputs.password} onChange={e=>{setInputs({...inputs, password:e.target.value})}}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handelLogin}
                >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don`t Have Account Yet?? <Link 
                onClick={()=>setAuthScreen('register')}
                color={'blue.400'}
                >Register</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
} 