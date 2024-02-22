import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

const Subindex = () => {
    return (
        <div className=''>
            <section>
                <Outlet />
            </section>
        </div>
    );
};

export default Subindex;
