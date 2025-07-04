import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
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
import { authScreenAtom, userAtom } from '../atoms';
import useShowToast from '../hooks/useShowToast'

const SignupCard = () => {
  const [showPassword, setShowPassword] = useState(false)
  const setUser = useSetRecoilState(userAtom)
  const showToast = useShowToast()
  const setAuthScreen = useSetRecoilState(authScreenAtom)
  const [inputs, setInputs] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    linkedin: '',
    github: '',
    })

    const handleSingup = async() => {
      if(!inputs.name || !inputs.username || !inputs.email || !inputs.password) {
        showToast("Error","Please fill all the fields","error")
        return
      }
        try {
          const res = await fetch('/api/users/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputs)
          })
          const data = await res.json()
          if(data.error) {
            showToast("Error", data.error, "error")
            return
          }
          else {
            showToast("Account created","You can now login","success")
            localStorage.setItem('user-threads', JSON.stringify(data))
            setUser(data)
          }
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
            Sign up
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
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input type="text"  value={inputs.name} onChange={e=>setInputs({...inputs , name:e.target.value})}/>
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" value={inputs.username} onChange={e=>setInputs({...inputs , username:e.target.value})}/>
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={inputs.email} onChange={e=>setInputs({...inputs , email:e.target.value})}/>
            </FormControl>
            <FormControl >
              <FormLabel>Your LinkedIn Link</FormLabel>
              <Input type="email" value={inputs.linkedin} onChange={e=>setInputs({...inputs , linkedin:e.target.value})}/>
            </FormControl>
            <FormControl >
              <FormLabel>Your Github Link</FormLabel>
              <Input type="email" value={inputs.github} onChange={e=>setInputs({...inputs , github:e.target.value})}/>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} value={inputs.password} onChange={e=>setInputs({...inputs , password:e.target.value})}/>
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
                  bg: 'blue.500'}}
                  onClick={handleSingup}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link 
                color={'blue.400'}
                onClick={()=>setAuthScreen('login')}
                >Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
} 

export default SignupCard