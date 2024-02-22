import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { setUserLoged, setUserThunk } from "../../store/slices/userLoged";
import { setIsLoading } from "../../store/slices/isLoading.slice";
import { useDispatch, useSelector } from "react-redux";
import sigin from "./../../img/siginSVG.svg";
import logoempresa from "./../../img/logo-dcheo.png";
import logoempresanew from "./../../img/logo-dcheonew.png";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Popover from "react-bootstrap/Popover";

const Login = () => {
	const userLoged = useSelector((state) => state.userLoged);
	const { register, handleSubmit } = useForm();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [errPassword, setErrPassword] = useState(false);
	const [errUser, setErrUSer] = useState(false);

	const isLoggedUser = () => {
		const IsLogeed = localStorage.getItem("tokenLiquidation");
		if (IsLogeed) {
			navigate("/dashboard");
		} else {
			navigate("/login");
		}
	};

	//// console.log(userLoged);

	const validationPassword = () => {
		const text = userLoged.toString().toLowerCase();
		// console.log(text);
		if (text === "password is not correct") {
			setErrPassword(true);
			// console.log("la contrasena mala ");
		}
		if (text === "user does not exist") {
			setErrUSer(true);
			// console.log("el correo es malo ");
		}
	};

	useEffect(() => {
		isLoggedUser();
	}, [userLoged]);

	const submit = (data) => {
		dispatch(setUserThunk(data));
		validationPassword();
		if (!userLoged) {
			navigate("/dashboard");
		} else {
			navigate("/login");
		}
	};

	return (
		<div className="compenents-login">
			<img className="img-sigin" src={sigin} alt="" />

			<Row className="justify-content-md-center conte-box-sigin">
				<Col xs lg="6">
					<div className="box-public">
						{/* <h3>DISTRIBUIDORA DCHEO</h3> */}
						{/* <img className='img-sigin-logo' src={logoempresa} alt="" /> */}
						<img
							className="img-sigin-logo"
							src={logoempresanew}
							alt=""
						/>
					</div>
				</Col>

				<Col xs lg="4">
					<div className="box-sigin">
						<h3 className="title-h3 login">INICIO DE SESION</h3>
						<Form onSubmit={handleSubmit(submit)}>
							<Form.Group
								className="mb-3 form-cont"
								controlId="formBasicEmail"
							>
								<Form.Label>Correo Electronico</Form.Label>
								<Form.Control
									className="input-sigin"
									placeholder="Email"
									{...register("mail")}
									style={{
										borderColor: errUser
											? "#FF5252"
											: null,
									}}
								/>
								<Form.Text className="text-muted">
									{errUser ? (
										<span
											style={{
												fontSize: "13px",
												color: "#FFD8D8",
											}}
										>
											El correo o el Username no es
											valido
										</span>
									) : null}
								</Form.Text>
							</Form.Group>

							<Form.Group
								className="mb-3 form-cont"
								controlId="formBasicPassword"
							>
								<Form.Label>Contraseña</Form.Label>
								<Form.Control
									className="input-sigin"
									type="password"
									placeholder="Password"
									{...register("password")}
									style={{
										borderColor:
											errPassword || errUser
												? "#FF5252"
												: null,
									}}
								/>
								{errPassword ? (
									<span
										style={{
											fontSize: "13px",
											color: "#FFD8D8",
										}}
									>
										La contrasena no es valida para el
										Usuario
									</span>
								) : null}
							</Form.Group>

							{/* <Form.Group>
                                <Form.Label>
                                    By logging in, you agree to BossDesing {" "}
                                    <Alert.Link href='#'>Privacy Policy</Alert.Link>{" "}
                                    and{" "}
                                    <Alert.Link href='#'>Terms of Use</Alert.Link>.
                                </Form.Label>
                            </Form.Group> */}
							<div className="cont-btn-recoveryPass">
								<button className="btn-recoveryPass">
									<Link to={"/auth/sigin"}>
										Olvido su Contraseña{" "}
										<i className="fa-solid fa-arrow-pointer bx-fw"></i>
									</Link>
								</button>
							</div>
							<div className="cont-btn-sigin">
								<button type="submit" className="btn-sigin">
									INGRESAR
								</button>
							</div>
						</Form>
					</div>
					<div>
						<p className="developer">
							LiquidationAPP - Copyright © 2023 BossDesign.
							Todos los derechos reservados.
						</p>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default Login;
