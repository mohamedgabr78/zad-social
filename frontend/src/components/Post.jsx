import { useState } from "react";
import { Flex, Avatar, Box,Text, Image } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";

const Post = ({post,postedBy}) => {

    const [liked, setLike] = useState(false);
    return (
        <>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar src='/user_image.jpg' size={"md"} name='Mohamed Gabr' />
                    <Box w={1} h={'full'} bg={'gray.light'} my={2}></Box>
                    <Box position={"relative"} w={'full'}>
                        <Avatar size={'xs'} src='https://bit.ly/dan-abromov' name='Ma tr' position={"absolute"} left={'11px'} padding={'2px'} top={0}/>
                        <Avatar size={'xs'} src='' name='ddrt cT' position={"absolute"} right={'-5px'} padding={'2px'} bottom={'0px'}/>
                        <Avatar size={'xs'} src='' name='vb nh' position={"absolute"} left={'-4px'} padding={'2px'} bottom={'0px'}/>
                    </Box>
                </Flex>
                <Flex flexDirection={"column"} flex={1} gap={2}>
                    <Flex justifyContent={"space-between"} w={'full'}>
                        <Flex gap={2}>
                            <Text fontSize={"sm"} fontWeight={"bold"}>Mohamed Gabr</Text>
                            <Image src='/verified.png' w={4} h={4}/>
                        </Flex>
                        <Flex gap={2} alignItems={'center'}>
                            <Text fontSize={"sm"} color={'gray.light'}>1d</Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"}>{postText}</Text>
                    {postImage && (
                    <Box borderRadius={6} overflow={'hidden'} w={'full'} h={'full'}>
                        <Image src={postImage} w={'full'} h={'full'}/>
                    </Box>
                    )}
                    <Flex gap={3} my={1}>
                        <Actions liked={liked} setLike={setLike}/>
                    </Flex> 
                    <Flex gap={2} alignItems={'center'}>
                        <Text fontSize={"sm"} color={'gray.light'}>{replies}</Text>
                        <Box w={0.5} h={0.5} bg={'gray.light'} borderRadius={'full'}></Box>
                        <Text fontSize={"sm"} color={'gray.light'}>{likes}</Text>
                    </Flex>  
                </Flex>
            </Flex>
		</>
	);
};

export default Post;