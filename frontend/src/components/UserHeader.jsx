import { Avatar, Box, Flex, VStack,Text, Menu, Portal, MenuButton, MenuItem, MenuList, Button } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import { userAtom } from '../atoms';
import useShowToast from "../hooks/useShowToast";
import useFollowing from "../hooks/useFollowing";
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const UserHeader = ({user}) => {

    
    const currentUser = useRecoilValue(userAtom)
    const {following, handleFollowing, updating} = useFollowing(user)
    const showToast = useShowToast()

    const CopyURL = () => {
        navigator.clipboard.writeText(window.location.href).then(function() {
            showToast({
                title: "Copied to clipboard",
                status: "success",
                duration: 2000,
                isClosable: true,
              })
          }, function(err) {
            showToast({
                title: err,
                status: "err",
                duration: 2000,
                isClosable: true,
              })
          });
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
            {currentUser?._id === user._id ? (
            <Link to={"/update"}>
            <Button colorScheme={"blue"} size={"sm"}>Update Profile</Button>
            </Link>
            ):<Button colorScheme={"blue"} size={"sm"} onClick={handleFollowing} isLoading={updating}>{`${following ? 'Unfollow' : 'Follow'}`}</Button>
            }
            
            <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={'full'} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{user.followers.length} Followers</Text>
                    <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                </Flex>
                <Flex gap={2}>
                    <Box>
                        <FaLinkedin onClick={() => window.open(`${currentUser.linkedIn}`, '_blank')} size={25} cursor={'pointer'}/>
                    </Box>
                    <Box>
                        <FaGithub onClick={() => window.open(`${currentUser.github}`, '_blank')} size={25} cursor={'pointer'}/>
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