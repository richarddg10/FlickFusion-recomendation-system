import React from 'react';
import './NavBar.css'

export function NavBar({ onClick }) {
    
    return (
        <>
        <div className="navbar-bg">
            <img className='logo-2-img' src='/logo-2.png' alt='Logo' />
            <div className='btns-div'>
                <button className='home-button'
                    onMouseOver={(e) => e.currentTarget.querySelector('img').src='/home-icon-2.png'} 
                    onMouseOut={(e) => e.currentTarget.querySelector('img').src='/home-icon-1.png'}
                    onClick={onClick}
                >
                    <img src='/home-icon-1.png' alt='Home Icon'/>
                    Home
                </button>
            </div>
        </div>
        </>
    )
}
