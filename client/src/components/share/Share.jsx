import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import {useContext, useState} from "react";
import {AuthContext} from "../../context/authContext";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {makeRequest} from "../../axios";
import person from "../../assets/person.png";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const {currentUser} = useContext(AuthContext)

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({queryKey: ["posts"]});
    },
  })

  const upload = async () => {
    try {
      //send object to backend
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data
    } catch (err) {
      console.log(err)
    }
  }

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({desc, img: imgUrl})
    setDesc("");
    setFile(null)

  }

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={!!!currentUser.profilePic.length?person
                :"(/upload/"+currentUser.profilePic}
              alt=""
            />
            <input type="text" placeholder={`What's on your mind ${currentUser.name}?`}
                   onChange={e => setDesc(e.target.value)}
                   value={desc}
            />
          </div>
          <div className="right">
            {/*create fake url to show*/}
            {file && <img className="file" src={URL.createObjectURL(file)} alt=""/>}
          </div>
        </div>
        <hr/>
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display: "none"}}
                   onChange={e => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt=""/>
                <span>Add Image</span>
              </div>
            </label>
            {/*<div className="item">*/}
            {/*  <img src={Map} alt=""/>*/}
            {/*  <span>Add Place</span>*/}
            {/*</div>*/}
            {/*<div className="item">*/}
            {/*  <img src={Friend} alt=""/>*/}
            {/*  <span>Tag Friends</span>*/}
            {/*</div>*/}
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
