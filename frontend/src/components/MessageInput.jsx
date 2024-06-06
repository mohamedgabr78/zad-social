import {
	Box,
	Flex,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";
import { selectedConversationAtom, conversationAtom } from "../atoms";
import messageSound from '../assets/sounds/pop.mp3'
import EmojiPicker from 'emoji-picker-react';
import Picker from "emoji-picker-react";


const MessageInput = ({ setMessages }) => {
	const [messageText, setMessageText] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const showToast = useShowToast();
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const setConversations = useSetRecoilState(conversationAtom);
	const imageRef = useRef(null);
	const { onClose } = useDisclosure();
	const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
	const [isSending, setIsSending] = useState(false);

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!messageText && !imgUrl) return;
		if (isSending) return;

		setIsSending(true);
    const sound = new Audio(messageSound);
    sound.play();

		try {
			const res = await fetch("/api/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: messageText,
					receiverId: selectedConversation.userId,
					img: imgUrl,
				}),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			setMessages((messages) => [...messages, data]);

			setConversations((prevConvs) => {
				const updatedConversations = prevConvs.map((conversation) => {
					if (conversation._id === selectedConversation._id) {
						return {
							...conversation,
							lastMessage: {
								text: messageText,
								sender: data.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
			setMessageText("");
			setImgUrl("");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsSending(false);
		}
	};

	const onEmojiClick = (event) => {
		setMessageText((prevText) => prevText + event.emoji);
		setShowEmojiPicker(false);
	};


	return (
		<Flex gap={2} alignItems={"center"}>
			<form onSubmit={handleSendMessage} style={{ flex: 95 }}>
				<InputGroup>
					<Input
						w={"full"}
						placeholder='Type a message'
						onChange={(e) => setMessageText(e.target.value)}
						value={messageText}
					/>
					<InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
						<IoSendSharp />
					</InputRightElement>
				</InputGroup>
			</form>
			<Flex flex={5} cursor={"pointer"}>
				<BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
				<Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
			</Flex>
            <Flex flex={5} cursor={"pointer"} position="relative">
                <div onClick={() => setShowEmojiPicker((prev) => !prev)}>
                    😊
                </div>
                {showEmojiPicker && (

                    <Flex position="absolute" zIndex="10" boxShadow="md" bottom={8} right={10} >
                        <Picker onEmojiClick={onEmojiClick} width={200} height={300} searchDisabled={true}/>
                    </Flex>
                )}
            </Flex>
			<Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
					setImgUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Flex>
	);
};

export default MessageInput;