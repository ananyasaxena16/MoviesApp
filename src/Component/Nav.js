import React from 'react'
import './Navbar.css';
import {Link} from 'react-router-dom';
function Navbar() {
    return (
        <nav className='nav-styles'>
            <i class="fas fa-eye"></i>
            <ul className='list'>
                <Link to='/'>
                <li>Home</li>
                </Link>
                <Link to='/about'>
                <li>About</li>
                </Link>
                <Link to='/movies'>
                <li>Movies</li>
                </Link>
            </ul>
        </nav>
    )
}

export default Navbar

