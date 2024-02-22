import React from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';

const Index = () => {
    return (
        <div>
            
            <section>
                <Outlet />
            </section>

        </div>
    );
};

export default Index;