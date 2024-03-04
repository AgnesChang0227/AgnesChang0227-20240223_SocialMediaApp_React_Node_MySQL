import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {makeRequest} from "../../axios";
import {useLocation, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/authContext";
import Update from "../../components/update/Update";
import person from "../../assets/person.png";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const {currentUser,setCurrentUser} = useContext(AuthContext);

  let {userId} = useParams();
  userId = parseInt(userId);

  //fetch target user info
  const {isPending, error, data} =
    useQuery({
      queryKey: ['user'],
      queryFn: () =>
        makeRequest.get("/users/find/" + userId)
          .then(res =>  {
            //check if user info is not latest
            if (currentUser.id===res.data.id){
              for (const key in res.data) {
                if (currentUser[key]!==res.data[key]) {
                  //update user info
                  setCurrentUser(res.data);
                  break;
                }
              }
            }
            return res.data
          })
    })
  //fetch target user's follower
  const {isPending: rIsPending, data: relationshipData} =
    useQuery({
      queryKey: ['relationship'],
      queryFn: () =>
        makeRequest.get("/relationships?followedUserId=" + userId)
          .then(res => res.data)
    })

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (following) => {
      if (following) return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", {userId});
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({queryKey: ["relationship"]})
    },
  })


  const handleFollow = (e) => {
    e.preventDefault();
    //current user is follower or not
    mutation.mutate(relationshipData.includes(currentUser.id));

  }

  return (
    <div className="profile">
      {isPending ?
        "Loading" :
        <>
          <div className="images">
            <img
              src={"/upload/" + data.coverPic}
              alt=""
              className="cover"
            />
            <img
              src={!!!data.profilePic.length?person
                :"(/upload/"+data.profilePic}
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large"/>
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large"/>
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large"/>
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large"/>
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large"/>
                </a>
              </div>
              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon/>
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon/>
                    <span>{data.website}</span>
                  </div>
                </div>
                {currentUser.id === userId ?
                  <button onClick={() => setOpenUpdate(true)}>
                    Update
                  </button>
                  :
                  <button onClick={handleFollow}>
                    {rIsPending ?
                      "Loading" :
                      relationshipData.includes(currentUser.id)
                        ? "Following"
                        : "Follow"}
                  </button>
                }
              </div>
              <div className="right">
                <EmailOutlinedIcon/>
                <MoreVertIcon/>
              </div>
            </div>
            <Posts userId={userId}/>
          </div>
        </>
      }
      {openUpdate &&
        <Update setOpenUpdate={setOpenUpdate} user={data}/>
      }

    </div>
  )
};

export default Profile;
