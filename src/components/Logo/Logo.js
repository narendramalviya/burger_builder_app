import React from 'react';
import bugerLogo from '../../assets/images/27.1 burger-logo.png.png';
import classes from './Logo.css';
const logo = (props) =>(
    <div className={classes.Logo}>
        <img src={bugerLogo} alt="myBurger" />
    </div>
);

export default logo;