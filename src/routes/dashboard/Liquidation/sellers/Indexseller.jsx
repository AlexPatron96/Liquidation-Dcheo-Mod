import React from 'react';
import { Outlet } from 'react-router-dom';

const Indexseller = () => {
    return (
        <div className=''>
            <section>
                <Outlet />
            </section>
        </div>
    );
};

export default Indexseller;
