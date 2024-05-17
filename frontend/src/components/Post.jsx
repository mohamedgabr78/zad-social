import { useEffect, useState } from "react";
import { Flex, Avatar, Box,Text, Image } from "@chakra-ui/react"
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {formatDistanceToNow} from 'date-fns'

const Post = ({post,postedBy}) => {

    const [user, setUser] = useState({});
    // Custom Hooks
    const showToast = useShowToast()
    const navigate = useNavigate()

    // fetch post owner
    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const response = await fetch(`/api/users/profile/${postedBy}`)
                const data = await response.json()
                if(data.error) showToast("Error", data.error, "error")
                    setUser({username:data.username, profilePic:data.profilePic})
            }
            catch (error) {
                showToast("Error", error, "error")
            }
        }
        fetchOwner()
    }, [postedBy, showToast])


    return (
        <>
        <Link to={`/${user.username}/post/${post._id}`} style={{textDecoration: 'none'}}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar src={user.profilePic} size={"md"} name={user.username} onClick={(e)=>{
                        e.preventDefault()
                        navigate(`/${user.username}`)
                    }}/>
                    <Box w={1} h={'full'} bg={'gray.light'} my={2}></Box>
                    <Box position={"relative"} w={'full'}>
                        {post.replies.length === 0 && <Text fontSize={"sm"} color={'gray.light'} display={'flex'} justifyContent={'center'}>🥱</Text>}
                        {post.replies[0] && <Avatar size={'xs'} src={post.replies[0].profilePic} name={post.replies[0].username} position={"absolute"} left={'11px'} padding={'2px'} top={0}/>}
                        {post.replies[1] && <Avatar size={'xs'} src={post.replies[1].profilePic} name={post.replies[1].username} position={"absolute"} right={'-5px'} padding={'2px'} bottom={'0px'}/>}                  
                        {post.replies[2] && <Avatar size={'xs'} src={post.replies[2].profilePic} name={post.replies[2].username} position={"absolute"} left={'-4px'} padding={'2px'} bottom={'0px'}/>}                  
                    </Box>
                </Flex>
                <Flex flexDirection={"column"} flex={1} gap={2}>
                    <Flex justifyContent={"space-between"} w={'full'}>
                        <Flex gap={2}>
                            <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
                            <Image src='/verified.png' w={4} h={4}/>
                        </Flex>
                        <Flex gap={2} alignItems={'center'}>
                            <Text fontSize={"sm"} color={'gray.light'}>{
                                formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                            }</Text>
                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"}>{post.text}</Text>
                    {post.img && (
                    <Box borderRadius={6} overflow={'hidden'} w={'full'} h={'full'}>
                        <Image src={post.img} w={'full'} h={'full'}/>
                    </Box>
                    )}
                    <Flex gap={3} my={1}>
                        <Actions post={post}/>
                    </Flex> 
                </Flex>
            </Flex>
            </Link>
		</>
	);
};

export default Post;