import React, { useState } from "react";

const Functionalitiesbtn = ({
	aditional,
	buttons,
	listAvailable,
	search,
	filterList,
}) => {
	const [inputSearch, setInputSearch] = useState("");

	const handleChange = (event) => {
		const value = event.target.value.trim();
		setInputSearch(value);
	};

	const searchComp = () => {
		search(inputSearch);
	};
	return (
		<div className="functionalities w-100">
			<div className="fun-btn-cont w-50">{buttons ? buttons() : null}</div>
			<div className="d-flex flex gap-3 align-items-lg-stretch">
				{filterList ? filterList() : null}
			</div>
			<div className="d-flex flex gap-3 align-items-lg-stretch">
				{aditional ? aditional() : null}
			</div>

			<div className="d-flex flex gap-3 align-items-lg-stretch">
				{listAvailable ? listAvailable() : null}
			</div>

			{search ? (
				<div className="input-group inputFunc">
					<input
						type="text"
						className="form-control"
						placeholder="Ingresa lo que deseas buscar"
						aria-describedby="button-addon2"
						onChange={handleChange}
						value={inputSearch}
					/>
					<button
						className="btn btn-primary"
						type="button"
						id="button-addon2"
						onClick={() => searchComp()}
					>
						Buscar
					</button>
				</div>
			) : null}
		</div>
	);
};

export default Functionalitiesbtn;
