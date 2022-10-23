import React,{useState} from "react";
import {NavLink, Route} from "react-router-dom";
import Home from "./Home";
import twitter from '../icons/black twitter logo.png';
import instagram from '../icons/black insta logo.png'
import facebook from '../icons/black facebook icon.png'
import ticktock from '../icons/black tic toc icon.png'
import background from '../icons/background.jpg'

const App =() => {
    const [isActive, setActive] = useState('nav-menu');
    const [hamburger, setHamburger] = useState('hamburger');


      const toggleHamburger = () => {
        if(hamburger === 'hamburger' ){
        setHamburger('hamburger-active');
   
        console.log(isActive)
        }
        else
        setHamburger('hamburger');
        
        if(isActive === 'nav-menu'){
            setActive('nav-menuActive');
        }else{
            setActive('nav-menu');
        }
      };

    return<>

        <img className="background" src={background}  />
        <a href="#" className="name">Sabrina Guild</a>
        
    <div className="navbar"> 
    <ul className="socal-bar">
        <li>
        <a  href="https://twitter.com/theguildwriter"><img className="socal-links" src={twitter} onClick="https://arizonaatwork.com" /></a>
        </li>
        <li>
        <a  href="https://www.instagram.com/theguildwriter/"><img className="socal-links" src={instagram} onClick="https://arizonaatwork.com" /></a>
        </li>
        <li>
        <a  href="https://www.facebook.com/people/Sabrina-Guild/100084027047976/"><img className="socal-links" src={facebook} onClick="https://arizonaatwork.com" /></a>
        </li>
        <li>
        <a  href="https://www.tiktok.com/@theguildwriter"><img className="socal-links" src={ticktock} onClick="https://arizonaatwork.com" /></a>
        </li>
    </ul>   
    
    <div className="icon-links">
        
        </div>      
    <ul className={isActive}>    
        <li>    
        <NavLink exact to='/' className='navlink' activeClassName="active">
            Home
        </NavLink>
        </li>
         <li>    
        <NavLink exact to='/bio' className='navlink' activeClassName="active">
            Bio
        </NavLink>
        </li>
        <li>    
        <NavLink exact to='/upcoming' className='navlink' activeClassName="active">
            Login/Register
        </NavLink>
        </li>
    </ul>
    <div className={hamburger} onClick={toggleHamburger}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
    </div>
    </div>
    <div className="featured">featured Stuff here</div>

    
    
    </>
    
    }
    export default App;