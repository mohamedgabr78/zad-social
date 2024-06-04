import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Box, Flex } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import { postsAtom } from "../atoms";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {

    const showToast = useShowToast()
    const [posts, setPosts] = useRecoilState(postsAtom)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true)
            setPosts([])
            try {
                const response = await fetch('/api/posts/feed')
                const data = await response.json()
                if(data.error) showToast("Error", data.error, "error")
                setPosts(data)
            }

            catch (error) {
                showToast("Error", error, "error")
            }
    }
    getFeedPosts()
    setLoading(false)
    }
    , [showToast]);
    return (
        <Flex gap={10} alignItems={'flex-start'}>
            <Box flex={70}>
            {!loading && posts.length === 0 && (
                <Flex justifyContent="center">
                    <h1>No posts to show</h1>
                </Flex>
            )}
            {loading && (
                <Flex justifyContent="center">
                    <Spinner size="xl" />
                </Flex>
            )}
            {!loading && posts.length > 0 && (
                posts.map(post => (
                    <Post key={post._id} post={post} postedBy={post.postedBy}/>
                ))
            )}
            </Box>
            <Box flex={30}>
                <SuggestedUsers />
            </Box>
        </Flex>
    );
    }

export default HomePage;