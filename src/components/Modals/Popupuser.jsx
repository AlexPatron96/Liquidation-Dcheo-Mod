import { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Popupuser = ({ show, onhide, handleclick, target }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const ref = useRef(null);
	const user = useSelector((state) => state.userLoged);

	useEffect(() => {
		// seller[0] ? null : dispatch(getSellerThunk());
		// customer[0] ? null : dispatch(getCustomerThunk());
	}, []);

	const openConfiguration = () => {
		navigate("/dashboard/auth/config");
		onhide();
	};

	return (
		<div ref={ref}>
			{/* <Button style={{textAlign:"center"}} onClick={handleclick}>
               
                {(user.fullname)?.split(' ')[0]}
                <i className="fa-solid fa-user bx-fw"></i>
                <i className="fa-solid fa-gear bx-fw"></i>
            </Button> */}

			<Overlay
				show={show}
				target={target}
				placement="bottom"
				container={ref}
				containerPadding={20}
			>
				<Popover id="popover-contained">
					<Popover.Header as="h3">
						Usuario, {user.fullname}
					</Popover.Header>
					<Popover.Body>
						<div>
							<h6>Correo:</h6>
							<span>{user.mail}</span>
						</div>
						<div>
							<h6>Nombre:</h6>
							<span>{user.fullname}</span>
						</div>
						<div
							aria-controls="responsive-navbar-nav"
							className="d-flex flex-row"
						>
							<Button
								variant="light"
								onClick={openConfiguration}
							>
								{/* Holy guacamole! */}

								{/* <i className="fa-solid fa-user bx-fw"></i> */}
								<i className="fa-solid fa-gear bx-fw"></i>
							</Button>
						</div>
					</Popover.Body>
				</Popover>
			</Overlay>
		</div>
	);
};
export default Popupuser;
