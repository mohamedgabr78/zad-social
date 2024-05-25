import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
  } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { useState, useRef} from 'react';
import { userAtom } from '../atoms/userAtoms';
import useShowToast from '../hooks/useShowToast';
import usePreviewImg from '../hooks/usePreviewImg';
  
  export default function UpdateProfile()  {

    const {handleImageChange, imgUrl} = usePreviewImg()

    const [user, setUser] = useRecoilState(userAtom);
    const [inputs, setInputs] = useState({
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        password: '',
    });

    const fileRef = useRef(null);
    const [updating, setUpdating] = useState(false);


    // Custom Hooks
    const showToast = useShowToast()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (updating) return;
        setUpdating(true);

        try {
            const response = await fetch(`/api/users/update/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...inputs, profilePic: imgUrl}),
            });

            const data = await response.json();

            if (data.error) {
                showToast('Error', data.error, 'error');
                return;
            }

            setUser(data);
            showToast('Success', 'Profile updated successfully', 'success');
            localStorage.setItem('user-threads', JSON.stringify(data));
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setUpdating(false);
        }
    }

    return (
    <form onSubmit={handleSubmit}>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl id="user">
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" src={imgUrl}/>
              </Center>
              <Center w="full">
                <Button w="full" onClick={()=> fileRef.current.click()}>Change Avatar</Button>
                <Input type="file" hidden  ref={fileRef} onChange={handleImageChange}/>
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="username">
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={inputs.username} onChange={e=>{setInputs({...inputs, username:e.target.value})}}/>
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: 'gray.500' }}
              type="email"
              value={inputs.email} onChange={e=>{setInputs({...inputs, email:e.target.value})}}/>
          </FormControl>
          <FormControl id="fullName">
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="fullName"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={inputs.name} onChange={e=>{setInputs({...inputs, name:e.target.value})}}/>
          </FormControl>
          <FormControl id="bio">
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your Bio"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={inputs.bio} onChange={e=>{setInputs({...inputs, bio:e.target.value})}}/>
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: 'gray.500' }}
              type="password"
              value={inputs.password} onChange={e=>{setInputs({...inputs, password:e.target.value})}}/>
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}>
              Cancel
            </Button>
            <Button
              bg={'blue.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'blue.500'
              }}
              type= 'submit'
              isLoading = {updating}
              >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
      </form>
    );
  }