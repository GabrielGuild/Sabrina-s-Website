import React, { Component } from "react";
import video1 from "../icons/slideshow/TheInheritance.mp4";


class Video extends Component {
  render() {
    return (
        <video className="Video-feature" src={video1} loop autoPlay = {true}/>
    );
  }
}

export default Video;