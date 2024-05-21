import { useEffect, useState } from "react";
import { Flex, Avatar, Box, Text, Image } from "@chakra-ui/react";
import Actions from "./postActions/Actions";
import useShowToast from "../hooks/useShowToast";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms";
import useDeletePost from "../hooks/useDeletePost";


const Post = ({ post, postedBy }) => {
    const [user, setUser] = useState({});
    const [replies, setReplies] = useState(post.replies);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const currentUser = useRecoilValue(userAtom);
    const handleDeletePost = useDeletePost();


    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const response = await fetch(`/api/users/profile/${postedBy}`);
                const data = await response.json();
                if (data.error) showToast("Error", data.error, "error");
                setUser({ username: data.username, profilePic: data.profilePic });
            } catch (error) {
                showToast("Error", error, "error");
            }
        };
        fetchOwner();
    }, [postedBy, showToast]);

    useEffect(() => {
        setReplies(post.replies);
    }, [post]);



    // Display only unique replies by slicing the filtered array to the first 3 elements.
    const uniqueReplies = replies.filter((reply, index, self) =>
        index === self.findIndex((r) => r.username === reply.username)
    ).slice(0, 3);

    return (
        <>
            <Link to={`/${user.username}/post/${post._id}`} style={{ textDecoration: 'none' }}>
                <Flex gap={3} mb={4} py={5}>
                    <Flex flexDirection={"column"} alignItems={"center"}>
                        <Avatar
                            src={user.profilePic}
                            size={"md"}
                            name={user.username}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${user.username}`);
                            }}
                        />
                        <Box w={1} h={'full'} bg={'gray.light'} my={2}></Box>
                        <Box position={"relative"} w={'full'}>
                            {uniqueReplies.length === 0 && <Text fontSize={"sm"} color={'gray.light'} display={'flex'} justifyContent={'center'}>🥱</Text>}
                            {uniqueReplies[0] && <Avatar size={'xs'} src={uniqueReplies[0].profilePic} name={uniqueReplies[0].username} position={"absolute"} left={'11px'} padding={'2px'} top={0}/>}
                            {uniqueReplies[1] && <Avatar size={'xs'} src={uniqueReplies[1].profilePic} name={uniqueReplies[1].username} position={"absolute"} right={'-5px'} padding={'2px'} bottom={'0px'}/>}
                            {uniqueReplies[2] && <Avatar size={'xs'} src={uniqueReplies[2].profilePic} name={uniqueReplies[2].username} position={"absolute"} left={'-4px'} padding={'2px'} bottom={'0px'}/>}
                        </Box>
                    </Flex>
                    <Flex flexDirection={"column"} flex={1} gap={2}>
                        <Flex justifyContent={"space-between"} w={'full'}>
                            <Flex gap={2}>
                                <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
                                <Image src='/verified.png' w={4} h={4} />
                            </Flex>
                            <Flex gap={2} alignItems={'center'}>
                                <Text fontSize={"sm"} color={'gray.light'}>{
                                    formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                                }</Text>
                                {currentUser?._id === post.postedBy && (
                                    <DeleteIcon onClick={(e) => handleDeletePost(e, post._id)} cursor={'pointer'}/>
                                )}
                            </Flex>
                        </Flex>
                        <Text fontSize={"sm"}>{post.text}</Text>
                        {post.img && (
                            <Box borderRadius={6} overflow={'hidden'} w={'full'} h={'full'}>
                                <Image src={post.img} w={'full'} h={'full'} />
                            </Box>
                        )}
                        <Flex gap={3} my={1}>
                            <Actions post={post} />
                        </Flex>
                    </Flex>
                </Flex>
            </Link>
        </>
    );
};

export default Post;
