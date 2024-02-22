import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
	const [activeSidebar, setActiveSidebar] = useState(true);
	const [displayAccordion, setDisplayAccordion] = useState(true);

	const active = () => {
		activeSidebar ? setActiveSidebar(false) : setActiveSidebar(true);
		activeSidebar ? null : setDisplayAccordion(true);
	};

	const activeAcordeon = () => {
		displayAccordion ? setDisplayAccordion(false) : setDisplayAccordion(true);
	};

	return (
		<div id="sidebar" className={activeSidebar ? null : "activeSidebar"}>
			{/* FIXME: De Activar siderbar */}
			<div
				className={`${activeSidebar ? "toggle-btn-off" : "toggle-btn"}`}
				onClick={active}
			>
				<i
					className={`fa-solid ${
						activeSidebar
							? "fa-toggle-on bx-sm"
							: "fa-toggle-off bx-md"
					}   btn-arrow `}
				></i>
			</div>

			<ul className={activeSidebar ? "active" : null}>
				{/* <p className='txt3'>Alex Patron Garcia </p>
                <p className='txt4'>Alex Patron Garcia </p>
                <p className='txt5'>Alex Patron Garcia </p> */}
				<li className={`${activeSidebar ? "active" : null}`}>
					<div
						className={`accordion-item  linkStyleSid ${
							displayAccordion ? null : "activeAcord"
						}`}
						onClick={() => {
							active();
							activeAcordeon();
						}}
					>
						<i className="fa-solid fa-file-invoice bx-fw"></i>

						<span
							className={`accordion-header ${
								activeSidebar ? "activeText" : null
							}`}
							onClick={activeAcordeon}
						>
							Liquidaciones{" "}
							<i
								className={`fa-solid fa-angle-${
									displayAccordion ? "down" : "up"
								} bx-xs bx-fw`}
							></i>
						</span>

						<div
							className={`accordion-content ${
								activeSidebar ? "activeText" : null
							}`}
						>
							<Link
								className="linkStyleSid"
								to={"/dashboard/closeout/vehicle"}
								onClick={active}
							>
								<i className="fa-solid fa-route bx-fw"></i>
								Vehiculos
							</Link>
							<Link
								className="linkStyleSid"
								to={"/dashboard/closeout/seller"}
								onClick={active}
							>
								<i className="fa-solid fa-worm bx-fw"></i>
								Vendedores
							</Link>
						</div>
					</div>
				</li>

				<li className={activeSidebar ? "active" : null}>
					<Link
						className="linkStyleSid"
						to={"/dashboard/invoice"}
						onClick={() => {
							setActiveSidebar(true);
						}}
					>
						<i className="fa-solid fa-file-invoice-dollar bx-fw"></i>
						<span className={activeSidebar ? "activeText" : null}>
							{" "}
							Facturas{" "}
						</span>
					</Link>
				</li>

				<li className={activeSidebar ? "active" : null}>
					<Link
						className="linkStyleSid"
						to={"/dashboard/vehicles"}
						onClick={() => {
							setActiveSidebar(true);
						}}
					>
						<i className="fa-solid fa-truck bx-fw"></i>
						<span className={activeSidebar ? "activeText" : null}>
							Vehiculos
						</span>
					</Link>
				</li>

				<li className={activeSidebar ? "active" : null}>
					<Link
						className="linkStyleSid"
						to={"/dashboard/sellers"}
						onClick={() => {
							setActiveSidebar(true);
						}}
					>
						<i className="fa-solid fa-universal-access bx-fw"></i>
						<span className={activeSidebar ? "activeText" : null}>
							{" "}
							Vendedores
						</span>
					</Link>
				</li>

				<li className={activeSidebar ? "active" : null}>
					<Link
						className="linkStyleSid"
						to={"/dashboard/customers"}
						onClick={() => {
							setActiveSidebar(true);
						}}
					>
						<i className="fa-solid fa-person bx-fw"></i>
						<span className={activeSidebar ? "activeText" : null}>
							{" "}
							Clientes
						</span>
					</Link>
				</li>

				<li className={activeSidebar ? "active" : null}>
					<Link
						className="linkStyleSid"
						to={
							"https://drive.google.com/drive/folders/1F4fYQWiWRd14Zw4VdMQokGVgMvMwPzfB?usp=sharing"
						}
						target="_blank"
					>
						{/* <i className="fa-solid fa-person"></i> */}
						<i className="fa-solid fa-video bx-fw"></i>
						<span className={activeSidebar ? "activeText" : null}>
							{" "}
							Videos
						</span>
					</Link>
				</li>
			</ul>
			<div style={{ height: "45%" }} onClick={active}></div>
		</div>
	);
};

export default Sidebar;
