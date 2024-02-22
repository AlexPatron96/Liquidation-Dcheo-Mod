import React, { useEffect, useState } from "react";
import Newusers from "../../components/cards/Newusers";
import Newroll from "../../components/cards/Newroll";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Newpermissions from "../../components/cards/Newpermissions";
import Myperfil from "../../components/cards/Myperfil";
import { useSelector } from "react-redux";

const Config = () => {
	const userLoged = useSelector((state) => state.userLoged);
	const [activeTab, setActiveTab] = useState("profile");

	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};
	return (
		<div className="pages">
			<h5>CONFIGURACIONES</h5>

			<Tabs
				activeKey={activeTab}
				onSelect={handleTabChange}
				id="uncontrolled-tab-example"
				className="mb-3"
			>
				<Tab eventKey="profile" title="Mi Perfil">
					{activeTab === "profile" && (
						<div className="d-flex flex-row flex-wrap gap-5 justify-content-around align-items-start">
							<Myperfil />
						</div>
					)}
				</Tab>
				{userLoged?.roll?.permissions?.create_user && (
					<Tab eventKey="newUser" title="Usuarios">
						{activeTab === "newUser" && (
							<div className="d-flex flex-row flex-wrap gap-5 justify-content-around align-items-start">
								<Newusers />
							</div>
						)}
					</Tab>
				)}

				<Tab eventKey="roll" title="Roll">
					{activeTab === "roll" && (
						<div className="d-flex flex-row flex-wrap gap-5 justify-content-around align-items-start">
							<Newroll />
						</div>
					)}
				</Tab>

				<Tab eventKey="permissions" title="Permisos">
					{activeTab === "permissions" && (
						<div className="d-flex flex-row flex-wrap gap-5 justify-content-around align-items-start">
							<Newpermissions />
						</div>
					)}
				</Tab>
			</Tabs>
		</div>
	);
};

// Config.propTypes = {

// };

export default Config;
