import { useState } from "react";
import {
	Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, Input
} from "@chakra-ui/react";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilState } from "recoil";
import { postsAtom } from "../../atoms";

const Reply = ({user, post, isOpen, onClose }) => {

	const showToast = useShowToast();
	const [reply, setReply] = useState('');
	const [isReplying, setIsReplying] = useState(false);
	const currentUser = user[0];
	const [posts, setPosts] = useRecoilState(postsAtom);

	const handleReply = async () => {
		if (!currentUser) return showToast("Error", "You must be logged in to reply to a post", "error");
		if (!reply) return showToast("Error", "Reply cannot be empty", "error");
		if (isReplying) return;
		setIsReplying(true);

		try {
			const res = await fetch("/api/posts/reply/" + post._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: reply }),
			});
			const data = await res.json();
			if (data.error) return showToast("Error", data.error, "error");

			const updatedPosts = posts.map(p => 
				p._id === post._id ? { ...p, replies:data } : p
			);
			setPosts(updatedPosts);
			setReply("");
			onClose();
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsReplying(false);
		}
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Reply to this post</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<FormControl>
						<Input
							placeholder='Reply goes here..'
							value={reply}
							onChange={(e) => setReply(e.target.value)}
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme='blue' size={"sm"} mr={3} isLoading={isReplying} onClick={handleReply}>
						Reply
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default Reply;
