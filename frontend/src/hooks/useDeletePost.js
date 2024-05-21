import useShowToast from './useShowToast'

function useDeletePost() {
    const showToast = useShowToast();


    const handleDeletePost = (async (e, postId) => {
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
                
            }
        } catch (error) {
            showToast("Error", error, "error");
        }
    })
  return (
    handleDeletePost
  )
}

export default useDeletePost