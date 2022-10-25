import React from "react";
import {useState} from "react";
import Video from "./Video.js";
import video from "../icons/slideshow/TheInheritance.mp4";
import picture from "../icons/slideshow/slideshow2.jpg";



const Home =() => {
    const videoOptions ={
        autoplay: true,
        controls: false,
        scorces: [{
            src: video,
            type: 'video/mp4'
        }]
    }
    
        return (
            <div>
       <div className="video-container">
        <Video  />
         </div>
       <div className="inpunity-container">
       <a className= "impunity-href" href="https://www.amazon.com/Impunity-Rohan-ebook/dp/B079VWMRZF/ref=sr_1_1?crid=20F0L09WDESU&keywords=impunity+e+rohan&qid=1666723037&qu=eyJxc2MiOiIxLjI5IiwicXNhIjoiMC4wMCIsInFzcCI6IjAuMDAifQ%3D%3D&sprefix=impunity+e+rohan%2Caps%2C132&sr=8-1"><img className="impunity-picture" src={'https://cdn.discordapp.com/attachments/540352341707063307/1034539965176094731/Print_Previewer.jpg'} alt={''}/></a>
       <p className="description">Nobody dies here. Not without permission.
        The year is 2104, and artificial immortality has been achieved. President Newman has built the perfect world – a world without an end. But, in order to keep it, some parts have to be imperfect. Erik and Rose are inhabitants of the Nation – one lives under the physical abuse of the Labor District, the other under the psychological abuse of the Golden
        District. The Sentinels kill anyone who steps out of line, the Government kills children born outside of Reproduction periods, and the citizens kill each other for fun. But Rose and Erik maintain hope. In a time when immortality is government-mandated and humans are a commodity, each fights for the freedom of those they love. 
        </p>
       </div>
      </div>
        );
      
}
export default Home;