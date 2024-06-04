import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import { IoSendSharp } from 'react-icons/io5'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedConversationAtom, conversationAtom } from '../atoms/'
import { useState, useRef } from 'react'
import { BsFillImageFill } from 'react-icons/bs'
import usePreviewImage from '../hooks/usePreviewImg'

function MessageInput({setMessages}) {

  const showToast = useShowToast()
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useRecoilState(conversationAtom);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure()
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();

  const handleSendMessage = async(e) => {
    e.preventDefault();
    if (!messageText && !imgUrl) {return;}
    if (isSending) {return;}

    setIsSending(true);

    try {
      const res = await fetch(`/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          receiverId: selectedConversation.userId,
          img: imgUrl
        })
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error, "error", 5000);
      }
      setMessages((prev) => [...prev, data]);

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
  }
    catch (error) {
      showToast("An error occurred", error, "");
    }finally {
      setIsSending(false);
    }
  }

  return (
    <Flex gap={2} alignItems={"center"}>
    <form onSubmit={handleSendMessage} style={{ flex:95 }}>
        <InputGroup>
            <Input type="text" placeholder="Type a message" width={'full'}
            onChange={(e)=> setMessageText(e.target.value)}
            value={messageText}
            />
            <InputRightElement onClick={handleSendMessage} cursor="pointer" >
            <IoSendSharp/>
            </InputRightElement>
        </InputGroup>
    </form>
    <Flex flex={5} cursor={"pointer"}>
				<BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
				<Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
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
  )
}

export default MessageInput