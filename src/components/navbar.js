import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Logo from './github-icon.svg'
export const NavbarGithub = (props) => {
  return (
    <Navbar bg="dark" variant="dark">
        <Navbar.Brand>
            <img
                alt=""
                style={{backgroundColor:"white"}}
                src={Logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
            />{' '}
            {props.title}
        </Navbar.Brand>
  </Navbar>
  );
}


