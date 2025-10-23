const BASE_URL_POSTS = "http://localhost:8080/api/posts";

export async function createPost(postData) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error creating post");
    }

    return await response.json();
  } catch (err) {
    console.error("❌ Error in createPost:", err.message);
    throw err;
  }
}

export async function getPostById(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Post not found");
    }

    return await response.json();
  } catch (err) {
    console.error("❌ Error in getPostById:", err.message);
    throw err;
  }
}

export async function addPhotosToPost(postId, photosData) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(photosData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error adding photos");
    }

    return await response.json();
  } catch (err) {
    console.error("❌ Error in addPhotosToPost:", err.message);
    throw err;
  }
}

export async function deletePost(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "DELETE"
    });

    if (response.status === 204) return true;

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error deleting post");
    }

    return false;
  } catch (err) {
    console.error("❌ Error in deletePost:", err.message);
    throw err;
  }
}

export async function listBusinessPosts(businessId, page = 0, size = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/posts?page=${page}&size=${size}`);

    if (!response.ok) throw new Error("Error fetching business posts");

    return await response.json();
  } catch (err) {
    console.error("❌ Error in listBusinessPosts:", err.message);
    throw err;
  }
}

export async function listUserPosts(authorUserId, page = 0, size = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${authorUserId}/posts?page=${page}&size=${size}`);

    if (!response.ok) throw new Error("Error fetching user posts");

    return await response.json();
  } catch (err) {
    console.error("❌ Error in listUserPosts:", err.message);
    throw err;
  }
}

export async function getFeedPosts(page = 0, size = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/feed/posts?page=${page}&size=${size}`);

    if (!response.ok) throw new Error("Error fetching feed posts");

    return await response.json();
  } catch (err) {
    console.error("❌ Error in getFeedPosts:", err.message);
    throw err;
  }
}

export async function getBusinessRating(businessId) {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/rating`);

    if (!response.ok) throw new Error("Error fetching business rating");

    return await response.json();
  } catch (err) {
    console.error("❌ Error in getBusinessRating:", err.message);
    throw err;
  }
}