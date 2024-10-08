/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link, Navigate, useParams } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [previewPic, setPreviewPic] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  const { id } = useParams();
  const token = sessionStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  useEffect(() => {
    axios
      .get(`/editpost/${id}`)
      .then((response) => {
        const { title, category, description, image } = response.data;
        if (response.status === 200) {
          setTitle(title);
          setCategory(category);
          setDescription(description);
          setPreviewPic(image);
        }
      })
      .catch((error) => {
        console.log("error by /editpost", error);
      });
  }, []);

  function popupNotification(message, type) {
    return toast[type](message, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  }

  const handleFileChange = async (event) => {
    event.preventDefault();
    setPreviewPic(null);
    setLoading(true);
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("post", selectedFile);

    try {
      const response = await axios.post("/postimage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setLoading(false);
        setPreviewPic(response.data);
        console.log("response by /postimage",response);
        
      }
    } catch (error) {
      console.log("error by /postimage",error);
    }
  };

  const deletePostImage = async (e) => {
    e.preventDefault();
    setDeletingPost(true);
    try {
      const response = await axios.post("/deletepostimage", {
        imagename: previewPic,
      });
      if (response.status === 200) {
        console.log("response by /deletepostimage", response);

        setPreviewPic("");
        setDeletingPost(false);
        return popupNotification("Image removed", "success");
      }
    } catch (error) {
      console.log("response by /deletepostimage", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      title === "" ||
      description === "" ||
      category === "" ||
      previewPic === ""
    ) {
      return popupNotification("Please fill all fields and Image", "warn");
    }
    try {
      const response = await axios.post(`/editpost/${id}`, {
        title,
        category,
        image: previewPic,
        description,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setTitle("");
        setCategory("");
        setDescription("");
        setPreviewPic("");
        console.log("response from `/editpost/${id}`", response);
        popupNotification("Post updated", "success");
      } else {
        console.log("Else from /editpost/${id}");
        popupNotification("Something wint wrong", "error");
      }
    } catch (error) {
      console.log("error from `/editpost/${id}`", error);
      popupNotification(error.response.data, "error");
    }
  };

  return (
    <>
      {token && (
        <div className="min-h-screen bg-slate-900 text-white flex justify-center px-4 pt-10 pb-4">
          <form
            className="bg-slate-800 md:px-8 px-4 mb-4 rounded-lg shadow-lg w-full max-w-3xl h-fit"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-semibold text-center text-teal-400 pt-3">
              Create new post
            </h2>
            <div className="w-full h-[1px] bg-gray-700 my-4" />
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-sky-800"
              >
                Title
              </label>
              <input
                type="text"
                value={title}
                name="title"
                placeholder="Title of your blog"
                className="w-full px-4 py-2 rounded-lg bg-gray-600 bg-opacity-10 placeholder:italic placeholder:text-gray-700"
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-sky-800"
              >
                Category
              </label>
              <input
                type="text"
                value={category}
                name="category"
                placeholder="Category of your blog"
                className="w-full px-4 py-2 rounded-lg bg-gray-600 bg-opacity-10 placeholder:italic placeholder:text-gray-700"
                required
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="mb-4 h-80">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-sky-800"
              >
                Summary
              </label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                style={{ height: "15rem" }}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="photo"
                className="block mb-2 text-sm font-medium text-sky-800"
              >
                Photo
              </label>

              {!previewPic && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 bg-opacity-10"
                />
              )}
              <div className="min-w-32 m-4 flex justify-center items-center relative">
                {loading && <span>Uploading...</span>}
                {deletingPost && (
                  <label className="absolute top-2 text-slate-900 font-bold">
                    Deleting...
                  </label>
                )}
                {previewPic && (
                  <>
                    <img
                      className="rounded-xl"
                      src={previewPic}
                      alt="Preview"
                    />
                    <button
                      className="absolute right-2 top-2 bg-red-500 p-1 rounded-lg"
                      onClick={deletePostImage}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="my-8 flex justify-around items-center">
              <Link
                to="/" 
                className="bg-orange-700 px-6 py-2 rounded-lg hover:bg-orange-900"
              >
                Cancel
              </Link>
              <button
                type="submit" 
                className="bg-green-700 px-6 py-2 rounded-lg hover:bg-green-900"
              >
                Create
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
