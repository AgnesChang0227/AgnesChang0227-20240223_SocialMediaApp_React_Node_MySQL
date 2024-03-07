import React, {useContext, useEffect, useState} from 'react';
import {useQuery} from "@tanstack/react-query";
import {QueryContext} from "../../context/queryContext";
import {AuthContext} from "../../context/authContext";

const Suggestion = () => {
  const {currentUser} = useContext(AuthContext);
  const {getSuggestions} = useContext(QueryContext);
  const {isPending, error, data} = useQuery(getSuggestions(currentUser.id));
  const [showArr,setShowArr] = useState(data||[]);

  useEffect(()=>{
    if (data) setShowArr(data);
  },[data])

  const dismissHandler = (index)=>{
    const updatedData = [...showArr];
    updatedData.splice(index, 1);
    setShowArr(updatedData);
  }

  return (
    isPending ? "Loading"
      :
      <div>
        <span>Suggestions For You</span>
        {showArr.slice(0,3).map((sug,index) => (
          <div key={index}>
            <div className="user">
              <div className="userInfo">
                <img
                  src={sug.profilePic}
                  alt=""
                />
                <span>{sug.name}</span>
              </div>

              <div className="buttons">
                <button onClick={()=>dismissHandler(index)}>dismiss</button>
              </div>
            </div>
            <span>{!!sug.followedUserId
              ?"The followers of the users you are following"
              :`User with ${sug.followerCount} followers`}
            </span>
          </div>

        ))}
      </div>
  )
};

export default Suggestion;