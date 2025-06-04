import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms";
import { useRecoilState } from "recoil";
import { postsAtom } from "../atoms";
import useShowToast from "../hooks/useShowToast";

const Comment = ({ reply, lastReply, post }) => {

	const currentUser = useRecoilValue(userAtom);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const showToast = useShowToast();

	const handleDeleteComment = async () => {
		try {
		if (!window.confirm("Are you sure you want to delete this comment?")) return;
		const res = await fetch(`/api/posts/${post._id}/reply/${reply._id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await res.json();
		if (data.error) return showToast("Error", data.error, "error");
		setPosts(posts.map(p => p._id === post._id ? { ...p, replies: p.replies.filter(r => r._id !== reply._id) } : p));

	} catch (error) {
		showToast("Error", error.message, "error");
	}
}

	return (
		<>
			<Flex gap={4} py={2} my={2} w={"full"}>
				<Avatar src={reply.userprofilePic} size={"sm"} />
				<Flex gap={1} w={"full"} flexDirection={"column"}>
					<Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
						<Text fontSize='sm' fontWeight='bold'>
							{reply.username}
						</Text>
					</Flex>
					<Text>{reply.text}</Text>
				</Flex>
				{currentUser._id === reply.userId && <DeleteIcon cursor={"pointer"} onClick={handleDeleteComment}/>}
			</Flex>
			{!lastReply ? <Divider /> : null}
		</>
	);
};

export default Comment;