import { Flex, Avatar, Box,Text, Image, Divider, Button } from "@chakra-ui/react"
import Actions from "../components/postActions/Actions";
import useGetProfile from "../hooks/useGetProfile";
import useShowToast from "../hooks/useShowToast";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { postsAtom, userAtom } from "../atoms";
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { Spinner } from "@chakra-ui/spinner";
import { formatDistanceToNow } from "date-fns";
import useDeletePost from "../hooks/useDeletePost";

const PostPage = () => {
	const { user, loading } = useGetProfile();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const showToast = useShowToast();
	const { pid } = useParams();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();
    const deletePost = useDeletePost();

	const currentPost = posts[0];

	useEffect(() => {
		const getPost = async () => {
			setPosts([]);
			try {
				const res = await fetch(`/api/posts/${pid}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts([data]);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};
		getPost();
	}, [showToast, pid, setPosts]);


    const handleDeletePost = async (e) => {
        try {
            await deletePost(e,currentPost._id);
			navigate(`/${user.username}`);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!currentPost) return null;

	return (
		<>
			<Flex>
				<Flex w={"full"} alignItems={"center"} gap={3}>
					<Avatar src={user.profilePic} size={"md"} name='Mark Zuckerberg' />
					<Flex>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{user.username}
						</Text>
						<Image src='/verified.png' w='4' h={4} ml={4} />
					</Flex>
				</Flex>
				<Flex gap={4} alignItems={"center"}>
					<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
						{formatDistanceToNow(new Date(currentPost.createdAt))} ago
					</Text>

					{currentUser?._id === user._id && (
						<DeleteIcon size={20} onClick={(e) => handleDeletePost(e)} cursor={'pointer'}/>
					)}
				</Flex>
			</Flex>

			<Text my={3}>{currentPost.text}</Text>

			{currentPost.img && (
				<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
					<Image src={currentPost.img} w={"full"} />
				</Box>
			)}

			<Flex gap={3} my={3}>
				<Actions post={currentPost} />
			</Flex>

			<Divider my={4} />

			<Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"gray.light"}>Get the app to like, reply and post.</Text>
				</Flex>
				<Button>Get</Button>
			</Flex>

			<Divider my={4} />
			{currentPost.replies.map((reply) => (
                <>
                    <Flex gap={4} py={2} my={2} w={"full"}>
                        <Avatar src={reply.profilePic} size={"sm"} />
                        <Flex gap={1} w={"full"} flexDirection={"column"}>
                            <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                                <Text fontSize='sm' fontWeight='bold'>
                                    {reply.username}
                                </Text>
                            </Flex>
                            <Text>{reply.text}</Text>
                        </Flex>
                    </Flex>
                    <Divider />
                </>
			))}
		</>
	);
};

export default PostPage;