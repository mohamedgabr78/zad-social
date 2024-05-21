import useShowToast from './useShowToast'
import { useSetRecoilState } from 'recoil'
import { postsAtom } from '../atoms'
import { useNavigate } from "react-router-dom";
import { useCallback } from 'react';

function useDeletePost() {
    const showToast = useShowToast();
    const setPosts = useSetRecoilState(postsAtom)
    const navigate = useNavigate();

    const handleDeletePost = useCallback(async (e, postId, username) => {
        try {
            e.preventDefault();
            if (!window.confirm("Are you sure you want to delete this post?")) return;
            const response = await fetch(`/api/posts/delete/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await response.json();
            if (data.error) {
                showToast("Error", data.error, "error")
                return;
            }else{
                showToast("Success", "Post deleted successfully", "success");
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
                if (username) {
                    navigate(`/${username}`);
                }
                
            }
        } catch (error) {
            showToast("Error", error, "error");
        }
    }, [showToast, setPosts, navigate]);

  return handleDeletePost
}

export default useDeletePost