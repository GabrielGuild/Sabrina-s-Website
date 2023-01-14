import React from "react";
import {useState} from "react";
import {
    NavLink,
     Route,
     Routes,
    } from "react-router-dom";
import {
    Home,
    Login,
    Bio,
    Admin
} from "./index";
import twitter from '../icons/black twitter logo.png';
import instagram from '../icons/black insta logo.png'
import facebook from '../icons/black facebook icon.png'
import ticktock from '../icons/black tic toc icon.png'
import background from '../icons/background.jpg'

const App =() => {
    const [user, setUser] = useState(false);
    const [token, setToken] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
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
      const closeHamburger= () =>{
        if(hamburger === 'hamburger'){
            return null
        }
        setHamburger('hamburger');
        setActive('nav-menu');

      }
      const handleLogout =() =>{
      setUser(false);
      setToken('');
      setIsLoggingOut(false);
      }
  

    return(
        <main  onClick={closeHamburger}>
        <img className="background" src={background} alt="" />
        <a href="#" className="name">Sabrina Guild</a>
        
    <div className="navbar"> 
    <ul className="socal-bar">
        <li>
        <a  href="https://twitter.com/theguildwriter"><img className="socal-links" src={twitter}  alt="" onClick="https://arizonaatwork.com" /></a>
        </li>
        <li>
        <a  href="https://www.instagram.com/theguildwriter/"><img className="socal-links" src={instagram} alt="" onClick="https://arizonaatwork.com" /></a>
        </li>
        <li>
        <a  href="https://www.facebook.com/people/Sabrina-Guild/100084027047976/"><img className="socal-links" src={facebook} alt="" onClick="https://arizonaatwork.com" /></a>
        </li>
        <li>
        <a  href="https://www.tiktok.com/@theguildwriter"><img className="socal-links" src={ticktock} alt="" onClick="https://arizonaatwork.com" /></a>
        </li>
    </ul>   
    
    <div className="icon-links">
        
        </div>      
    <ul className={isActive}>    
        <NavLink exact to='/' className='navlink' activeClassName="active">
            Home
        </NavLink>
        <NavLink exact to='/bio' className='navlink' activeClassName="active">
            Bio
        </NavLink>
        <NavLink exact to='/login' className='navlink' activeClassName="active">
        { (user && token) ? 'Account' : 'Login/Register' }
        </NavLink>
        {
          (user && token && user.isAdmin) ?
          <NavLink to="/admin" className="navlink" activeClassName="active">
            Admin
          </NavLink> :
          null
        }
         {
          (token && user) ?
          <button
            className='Logout'
            onClick={(event)=>{
              event.preventDefault();
              handleLogout();
            }}>Logout</button> 
          :
          null
        }
    </ul>
    <div className={hamburger} onClick={toggleHamburger}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
    </div>
    </div>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bio" element={<Bio />} />
        <Route path="/login" element={<Login token={token} setToken={setToken} user={user} setUser={setUser}/>} />
        <Route path="/admin" element={<Admin token={token} user={user}/>}/>
    </Routes>
      

      <div className="Footer">
        <div>© 2022 Sabrina Guild. All rights reserved.</div>
        <div>Built by Gabriel Guild</div>  
      </div>

      </main>
    );
    };
    export default App;