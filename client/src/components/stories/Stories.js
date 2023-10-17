import React,{useContext} from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";

const Stories = () => {
  //console.log(`stories rendered`);
  const {currentUser} = useContext(AuthContext);
  //Temporary Data
  const stories = [
    {
      id: 1,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 2,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 3,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 4,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
  ];
  return (
    <div className="stories">
      <div className="story">
        <img src={currentUser.profilePic} alt="story"/>
        <span>{currentUser.username}</span>
        <button>+</button>
      </div>
      {stories?.map((story) => (
        <div className="story" key={story.id}>
          <img src={story.img} alt="story"/>
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
