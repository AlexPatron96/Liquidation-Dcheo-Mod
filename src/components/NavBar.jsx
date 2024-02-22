import React, { useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popupuser from "./Modals/Popupuser";

const NavBar = () => {
	const user = useSelector((state) => state.userLoged);
	const navigate = useNavigate();
	const exitApp = () => {
		localStorage.removeItem("userLiquidation");
		localStorage.removeItem("tokenLiquidation");
		localStorage.clear();
		navigate("/login");
	};

	const [modalPopup, setModalPopup] = useState(false);
	const onHidePopup = () => {
		setModalPopup(false);
	};
	const [target, setTarget] = useState(null);
	const ref = useRef(null);

	const handleClick = (event) => {
		setModalPopup(!modalPopup);
		setTarget(event.target);
	};

	return (
		<Navbar
			collapseOnSelect
			expand="lg"
			bg="primary"
			variant="dark"
			sticky="top"
		>
			<Container>
				<Navbar.Brand href="/">
					<div className="logo-page">
						<h1>
							D<span>Cheo</span>
						</h1>
					</div>
				</Navbar.Brand>
				<div
					aria-controls="responsive-navbar-nav"
					className="d-flex flex-row"
				>
					<Navbar.Toggle aria-controls="responsive-navbar-nav">
						<div className="m-1">
							{user.fullname?.split(" ")[0]}
							<i className="fa-solid fa-bars fa-bounce bx-fw"></i>
						</div>
					</Navbar.Toggle>
				</div>
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="/dashboard">Home</Nav.Link>
						<Nav.Link href="/dashboard/liquidation/vehicles">
							Liquidar Vehiculos
						</Nav.Link>
						<Nav.Link href="/dashboard/liquidation/sellers">
							Liquidar Vendedores
						</Nav.Link>
					</Nav>
					<Nav>
						<Button onClick={handleClick}>
							{user.fullname?.split(" ")[0]}
							<i className="fa-solid fa-user bx-fw"></i>
						</Button>
						<Button onClick={() => exitApp()}>
							<i className="fa-solid fa-right-from-bracket bx-fw"></i>
							Salir
						</Button>
						<Popupuser
							onhide={() => setModalPopup(false)}
							show={modalPopup}
							handleclick={handleClick}
							target={target}
						/>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default NavBar;
