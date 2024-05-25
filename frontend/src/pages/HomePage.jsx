import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Flex } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import { postsAtom } from "../atoms";

const HomePage = () => {

    const showToast = useShowToast()
    const [posts, setPosts] = useRecoilState(postsAtom)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true)
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
        <>
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
        </>
    );
    }

export default HomePage;