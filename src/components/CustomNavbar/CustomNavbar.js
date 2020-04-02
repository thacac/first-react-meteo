/* fichier components/CustomNavbar.js */
import React, { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

const CustomNavbar = (props) => {
    const [collapsed, setCollapsed] = useState(true);
    const toggleNavbar = () => setCollapsed(!collapsed);
    return (

        <Navbar expand="md" color="light" light>
            <NavbarBrand href="/" className="mr-auto"><img className="logo" src="img/meteo-logo.png" alt="logo" /></NavbarBrand>
            <NavbarToggler onClick={toggleNavbar} className="mr-2" />
            <Collapse isOpen={!collapsed} navbar>
                <Nav navbar>
                    <NavItem>
                        <NavLink href="">Lien1</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="">Lien2</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="">Lien3</NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>

    )
}
export default CustomNavbar;