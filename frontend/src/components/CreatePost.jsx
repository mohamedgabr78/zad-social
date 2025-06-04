import { useState, useRef } from 'react';
import { userAtom, postsAtom } from '../atoms';
import useShowToast from '../hooks/useShowToast';
import usePreviewImg from '../hooks/usePreviewImg';
import { AddIcon } from '@chakra-ui/icons'
import { Button, FormControl, Textarea, useColorModeValue, Text, Input } from '@chakra-ui/react'
import { Image } from '@chakra-ui/image'
import { CloseButton } from '@chakra-ui/close-button'
import { Flex } from '@chakra-ui/layout'
import { useDisclosure } from '@chakra-ui/hooks'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { BsFillImageFill } from 'react-icons/bs';
import { useRecoilValue } from 'recoil';
import { useRecoilState } from 'recoil';
import { useParams } from 'react-router-dom';

const MAX_CHAR = 300;

function CreatePost() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setPostText] = useState('')
    const [loading, setLoading] = useState(false)
    const imageRef = useRef(null)
    const {handleImageChange, imgUrl, setImgUrl} = usePreviewImg()
    const showToast = useShowToast()
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR); 
    const user = useRecoilValue(userAtom)
    const [posts, setPosts] = useRecoilState(postsAtom);
    const { username } = useParams();

    const handleTextChange = (e) => {
        const inputText = e.target.value

        if(inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR)
            setPostText(truncatedText)
            setRemainingChar(0)
        }else{
            setPostText(inputText)
            setRemainingChar(MAX_CHAR - inputText.length)
        }

    }
	const handleCreatePost = async () => {
		setLoading(true);

		try {
			const res = await fetch("/api/posts/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post created successfully", "success");
				setPosts((prev) => [data, ...prev]);
			
			onClose();
			setPostText("");
			setImgUrl("");
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setLoading(false);
		}
	};


  return (
    <>
			<Button
				position={"fixed"}
				bottom={10}
				right={5}
				bg={useColorModeValue("gray.300", "gray.dark")}
				onClick={onOpen}
				size={{ base: "sm", sm: "md" }}
			>
				<AddIcon />
			</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody padding={6}>
            <FormControl>
                <Textarea
                onChange={handleTextChange}
                placeholder="What's on your mind?"
                value={postText}
                >
                    Post Content
                </Textarea>
                <Text fontSize="xs" fontWeight={"bold"} textAlign={"right"}>
                    {remainingChar}/{MAX_CHAR}
                </Text>
                <Input type="file" hidden ref={imageRef} onChange={handleImageChange}/>
                <BsFillImageFill onClick={() => imageRef.current.click()} cursor="pointer" fontSize="2xl"/>
            </FormControl>
            {imgUrl && (
							<Flex mt={5} w={"full"} position={"relative"}>
								<Image src={imgUrl} alt='Selected img' />
								<CloseButton
									onClick={() => {
										setImgUrl("");
									}}
									bg={"gray.800"}
									position={"absolute"}
									top={2}
									right={2}
								/>
							</Flex>
						)}
          </ModalBody>

          <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
							Post
						</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>)
}

export default CreatePost