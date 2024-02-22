import React from "react";
import Card from "react-bootstrap/Card";

const CardBtn = ({ title, body, img }) => {
	return (
		<div className="cardBtn">
			<div className="cardBtn-cont-img-top">
				<img
					className="cardBtn-img-top"
					src={img}
					alt="Card image cap"
				/>
			</div>
			<div className="cardBtn-body">
				<h5 className="cardBtn-title">{title}</h5>
				<p className="cardBtn-text">{body}</p>
			</div>
		</div>
	);
};

export default CardBtn;
