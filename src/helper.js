import api from "./utils/api";
export const fetchComments = async (videoId, setComments) => {
  try {
    const res = await api.get(`/comments/${videoId}`);
    setComments(res.data);
  } catch (err) {}
};
