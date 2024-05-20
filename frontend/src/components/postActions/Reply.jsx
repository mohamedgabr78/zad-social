import { useState } from "react";

import {
	Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button
	, FormControl, Input
} from "@chakra-ui/react";
import useShowToast from "../../hooks/useShowToast";

const Reply = ({ user, posts, setPosts, post, isOpen, onClose }) => {

    const showToast = useShowToast()
    const [reply, setReply] = useState('')
    const [isReplying, setIsReplying] = useState(false)



    const handleReply = async() => {
		if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");
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
			setPosts({ ...posts, replies: [...posts.replies, data] });
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
					<ModalHeader>{`reply to ${user[0].name} post`}</ModalHeader>
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
  )
}

export default Reply