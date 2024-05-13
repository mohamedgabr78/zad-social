import { Avatar, Box, Flex, VStack,Text, Menu, Portal, MenuButton, MenuItem, MenuList, Button } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtoms";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";

const UserHeader = ({user}) => {

    const showToast = useShowToast()
    const currentUser = useRecoilValue(userAtom) // logged in user
    const [following, setFollowing] = useState(user.followers.includes(currentUser._id))
    const [uptating, setUpdating] = useState(false)


    const CopyURL = () => {
        navigator.clipboard.writeText(window.location.href).then(function() {
            showToast({
                title: "Copied to clipboard",
                status: "success",
                duration: 2000,
                isClosable: true,
              })
          }, function(err) {
            console.error('Async: Could not copy text: ', err);
          });
    }

    const handleFollowing = async() => {

        if(!currentUser) {
            showToast('Error', 'You need to login first', 'error')
            return
        }

        if(uptating) return
        setUpdating(true)
        try{
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            const data = await res.json()
            if(data.error) {
                showToast('Error', data.error, 'error')
                return
            }
            if(following){
                showToast('Success', `Unfollowed ${user.name}`, 'success')
                user.followers = user.followers.filter(follower => follower !== currentUser._id)
            }else{
                showToast('Success', `Followed ${user.name}`, 'success')
                user.followers.push(currentUser._id)
            }
            setFollowing(!following)
        }
        catch(error) {
            showToast('Error', error, 'error');
        }finally{
            setUpdating(false)
        }
    }

    return (
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>   
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>{user.name}</Text>
                    <Flex gap={2}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                        <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"}>
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar
                        size={{
                            base: "md",
                            md: "lg",
                        }} 
                        name={user.name}
                        src={user.profilePic}
                    />
                </Box>
            </Flex>
            <Text fontSize={"sm"}>{user.bio}</Text>
            {currentUser._id === user._id ? (
            <Link to={"/update"}>
            <Button colorScheme={"blue"} size={"sm"}>Update Profile</Button>
            </Link>
            ):<Button colorScheme={"blue"} size={"sm"} onClick={handleFollowing} isLoading={uptating}>{`${following ? 'Unfollow' : 'Follow'}`}</Button>
            }
            
            <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={'full'} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{user.followers.length} Followers</Text>
                    <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"} to={"https://www.linkedin.com/in/mohamed-gabr78/"}>LinkedIn.com</Link>
                    <Link color={"gray.light"} to={"https://github.com/mohamedgabr78"}>GitHub.com</Link>
                </Flex>
                <Flex gap={2}>
                    <Box>
                        <BsLinkedin size={24} cursor={"pointer"}/>
                    </Box>
                    <Box>
                        <BsGithub size={24} cursor={"pointer"} />
                    </Box>
                    <Box>
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"gray.dark"}>
                                    <MenuItem bg={"gray.dark"} onClick={CopyURL}>Copy Link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>
            <Flex/>
            </Flex>
            <Flex w={"full"}>
            <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"}
            cursor={"pointer"} padding={3} >
                <Text fontWeight={"bold"}>Threads</Text>
            </Flex>
            <Flex flex={1} borderBottom={"1.5px solid gray"} justifyContent={"center"}
             cursor={"pointer"} padding={3} color={"gray.light"}>
            <Text fontWeight={"bold"}>Replies</Text>
            </Flex>
            </Flex>
                
        </VStack>
    )
}

export default UserHeader