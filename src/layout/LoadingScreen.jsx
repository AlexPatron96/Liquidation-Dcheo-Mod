import React from 'react';
import '../styles/loading.css'


const LoadingScreen = () => {
    return (
        <div className='spinner-overlay'>
            <div className='logo-page Logo-loading'>
                <h1>Boss<span>Design</span></h1>
            </div>
            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    );
};

export default LoadingScreen;