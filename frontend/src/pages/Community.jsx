import { useEffect, useState } from "react";
import { get, post, del } from "../services/api";
import { auth } from "../firebase";

export default function Community() {
  const [postText, setPostText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [posts, setPosts] = useState([]);

  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [openComments, setOpenComments] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        setError("");

        const result = await get("/api/feed");
        setPosts(result);
      } catch (error) {
        console.error("Community API error:", error);
        setError("Unable to load community posts.");
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  async function uploadAchievementFile() {
    if (!selectedFile) {
      return "";
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("User is not logged in.");
    }

    const token = await currentUser.getIdToken();

    const formData = new FormData();
    formData.append("file", selectedFile);
    const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"; 
  
    const response = await fetch(
      `${API_BASE_URL}/api/files/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const result = await response.json();

    return result.url;
  }

  async function handleCreatePost() {
    const text = postText.trim();

    if (!text) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      let fileUrl = "";

      if (selectedFile) {
        setUploading(true);
        fileUrl = await uploadAchievementFile();
        setUploading(false);
      }

      const newPost = await post("/api/posts", {
        text,
        visibility: "public",
        image_url: fileUrl,
      });

      setPosts((currentPosts) => [
        {
          ...newPost,
          likes: 0,
          likedByMe: false,
          is_owner: true,
          author_name: "You",
        },
        ...currentPosts,
      ]);

      setPostText("");
      setSelectedFile(null);

      const fileInput = document.getElementById(
        "achievement-file"
      );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Create post API error:", error);
      setError(
        "Unable to publish the post or upload the achievement."
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  async function handleLike(postId, likedByMe) {
    try {
      setError("");

      if (likedByMe) {
        await del(`/api/posts/${postId}/like`);

        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: Math.max((post.likes || 0) - 1, 0),
                  likedByMe: false,
                }
              : post
          )
        );
      } else {
        await post(`/api/posts/${postId}/like`, {});

        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: (post.likes || 0) + 1,
                  likedByMe: true,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Like API error:", error);
      setError("Unable to update the like.");
    }
  }

  async function handleDeletePost(postId) {
    try {
      setError("");

      await del(`/api/posts/${postId}`);

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId)
      );
    } catch (error) {
      console.error("Delete post API error:", error);
      setError("Unable to delete the post.");
    }
  }

  async function loadComments(postId) {
    try {
      const result = await get(`/api/posts/${postId}/comments`);

      setComments((currentComments) => ({
        ...currentComments,
        [postId]: result,
      }));
    } catch (error) {
      console.error("Comments API error:", error);
      setError("Unable to load comments.");
    }
  }

  async function toggleComments(postId) {
    const currentlyOpen = openComments[postId];

    setOpenComments((current) => ({
      ...current,
      [postId]: !currentlyOpen,
    }));

    if (!currentlyOpen && !comments[postId]) {
      await loadComments(postId);
    }
  }

  async function handleAddComment(postId) {
    const text = (commentInputs[postId] || "").trim();

    if (!text) {
      return;
    }

    try {
      setError("");

      const newComment = await post(
        `/api/posts/${postId}/comments`,
        {
          text,
        }
      );

      setComments((currentComments) => ({
        ...currentComments,
        [postId]: [
          ...(currentComments[postId] || []),
          {
            ...newComment,
            author_name: "You",
          },
        ],
      }));

      setCommentInputs((currentInputs) => ({
        ...currentInputs,
        [postId]: "",
      }));
    } catch (error) {
      console.error("Add comment API error:", error);
      setError("Unable to add comment.");
    }
  }

  if (loading) {
    return (
      <div className="page">
        <h2>Community</h2>
        <p>Loading community...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Community</h2>

      <div className="card">
        <h3>Create a Post</h3>

        <textarea
          value={postText}
          onChange={(event) => setPostText(event.target.value)}
          placeholder="Share your hobby, skill, progress, or achievement..."
          rows="4"
        />

        <input
          id="achievement-file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) =>
            setSelectedFile(event.target.files?.[0] || null)
          }
        />

        {selectedFile && (
          <p>
            Selected file: <strong>{selectedFile.name}</strong>
          </p>
        )}

        <button onClick={handleCreatePost} disabled={saving}>
          {uploading
            ? "Uploading..."
            : saving
              ? "Publishing..."
              : "Publish Post"}
        </button>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}
      </div>

      <div className="card">
        <h3>Community Feed</h3>

        {posts.length === 0 ? (
          <p>No community posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <p>
                <strong>
                  {post.author_name || "Community member"}
                </strong>
              </p>

              <p>{post.text}</p>

              {post.image_url && (
                <div style={{ marginBottom: "15px" }}>
                  <img
                    src={post.image_url}
                    alt="Achievement"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      borderRadius: "8px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}

              <button
                onClick={() =>
                  handleLike(post.id, post.likedByMe)
                }
              >
                {post.likedByMe ? "Unlike" : "Like"} (
                {post.likes || 0})
              </button>

              <button
                onClick={() => toggleComments(post.id)}
                style={{ marginLeft: "8px" }}
              >
                {openComments[post.id]
                  ? "Hide Comments"
                  : "Comments"}
              </button>

              {post.is_owner && (
                <button
                  onClick={() => handleDeletePost(post.id)}
                  style={{ marginLeft: "8px" }}
                >
                  Delete
                </button>
              )}

              {openComments[post.id] && (
                <div style={{ marginTop: "15px" }}>
                  <h4>Comments</h4>

                  {(comments[post.id] || []).length === 0 ? (
                    <p>No comments yet.</p>
                  ) : (
                    comments[post.id].map((comment) => (
                      <div
                        key={comment.id}
                        style={{
                          padding: "8px 0",
                          borderBottom:
                            "1px solid #e5e7eb",
                        }}
                      >
                        <strong>
                          {comment.author_name ||
                            "Community member"}
                        </strong>

                        <p>{comment.text}</p>
                      </div>
                    ))
                  )}

                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(event) =>
                      setCommentInputs((currentInputs) => ({
                        ...currentInputs,
                        [post.id]: event.target.value,
                      }))
                    }
                  />

                  <button
                    onClick={() =>
                      handleAddComment(post.id)
                    }
                  >
                    Add Comment
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}