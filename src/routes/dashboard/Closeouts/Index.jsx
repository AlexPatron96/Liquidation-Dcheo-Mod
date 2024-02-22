import React from 'react';
import { Outlet } from 'react-router-dom';


const Index = () => {
    return (
        <div className='pages'>
            <section>
                <Outlet />
            </section>
        </div>
    );
};

export default Index;