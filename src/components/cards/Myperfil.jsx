import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Button, Form, OverlayTrigger, Stack, Tooltip } from "react-bootstrap";
import {
	createUserThunk,
	listRollThunk,
	updateUserThunk,
} from "../../store/slices/listUser.slice";

const Myperfil = ({ activecomponent }) => {
	const dispatch = useDispatch();
	const roll = useSelector((state) => state.listUser);
	const userLoged = useSelector((state) => state.userLoged);
	const [isRollLoaded, setIsRollLoaded] = useState(false);

	useEffect(() => {
		// roll ? dispatch(listRollThunk()) : null;
		setValue("id", userLoged.id);
		setValue("fullname", userLoged.fullname);
		setValue("username", userLoged.username);
		setValue("dni", userLoged.dni);
		setValue("mail", userLoged.mail);
		setValue("id_roll", userLoged.roll?.id);
		roll &&
			dispatch(listRollThunk())
				.then(() => {
					setIsRollLoaded(true);
				})
				.catch((error) => {
					console.error("Error al cargar los datos de roll:", error);
				});
	}, [activecomponent]);
	// console.log(userLoged);

	const initialValue = {
		id: "",
		fullname: "",
		username: "",
		dni: "",
		mail: "",
		password: "",
		id_roll: "",
	};

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		setValue,
		getValues,
	} = useForm({
		defaultValues: initialValue,
	});

	const valoresObt = getValues();
	//console.log(valoresObt);
	function onSubmit(data) {
		//console.log("Al Guardar Tendra que volver a Logearse");
		//console.log(data);
		data.password ? data.password : delete data.password;
		parseInt(data.id_roll);
		dispatch(updateUserThunk(data.id, data));
		// reset();
	}

	// const clearForm = () => {
	// 	reset();
	// };

	const [editAvailable, setEditAvailable] = useState(true);
	const EditingData = () => {
		editAvailable ? setEditAvailable(false) : setEditAvailable(true);
	};
	const [passwordAvailable, setPasswordAvailable] = useState(false);
	const viewPassword = () => {
		passwordAvailable
			? setPasswordAvailable(false)
			: setPasswordAvailable(true);
	};

	//console.log(roll);
	return (
		<div>
			<div>
				<h6>Perfil de Usuario</h6>
				<div className="form-newUser">
					<Form
						// className="formModal"
						style={{ justifyContent: "space-between" }}
						onSubmit={handleSubmit(onSubmit)}
					>
						{/* fullnmae */}
						<Form.Group
							className="m-3 d-flex flex-row"
							style={{ textAlign: "center" }}
						>
							<i className="bx bx-rename bx-fw"></i>
							<Form.Label className="form-labelED">
								Nombre Completo:
							</Form.Label>
							<Form.Control
								disabled={editAvailable}
								placeholder="Ingrese el Nombre Completo..."
								className="form-controlED"
								{...register("fullname")}
							/>
							<p
								className={`error-message ${
									errors["fullname"] ? "showError" : ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Username */}
						<Form.Group
							className="m-3 d-flex flex-row"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-user bx-fw"></i>
							<Form.Label className="form-labelED">
								Nombre de usuario :
							</Form.Label>
							<Form.Control
								disabled={editAvailable}
								placeholder="Ejemplo: CheoM2023..."
								className="form-controlED"
								{...register("username")}
							/>
							<p
								className={`error-message ${
									errors["username"] ? "showError" : ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Dni */}
						<Form.Group
							className="m-3 d-flex flex-row"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-id-card bx-fw"></i>
							<Form.Label className="form-labelED">
								# Identificacion:
							</Form.Label>
							<Form.Control
								disabled={editAvailable}
								placeholder="Ingrese un Numero Identidad..."
								className="form-controlED"
								{...register("dni")}
							/>
							<p
								className={`error-message ${
									errors["dni"] ? "showError" : ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Mail */}
						<Form.Group
							className="m-3 d-flex flex-row"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-envelope bx-fw"></i>
							<Form.Label className="form-labelED">
								Correo:
							</Form.Label>
							<Form.Control
								disabled={editAvailable}
								type="mail"
								placeholder="Ejemplo: cheo@gmail.com"
								className="form-controlED"
								{...register("mail")}
							/>
							<p
								className={`error-message ${
									errors["mail"] ? "showError" : ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Password */}
						<Form.Group
							className="m-3 d-flex flex-row"
							style={{ textAlign: "center" }}
						>
							<div
								className="view-password-newuser"
								onClick={viewPassword}
							>
								<i
									className={`fa-solid ${
										passwordAvailable
											? "fa-eye-slash"
											: "fa-eye"
									}`}
								></i>
							</div>
							<i className="fa-solid fa-key bx-fw"></i>
							<Form.Label className="form-labelED">
								Contraseña:
							</Form.Label>
							<Form.Control
								disabled={editAvailable}
								type={
									passwordAvailable ? "text" : "password"
								}
								placeholder="Ejemplo: Cheo2022*"
								className="form-controlED"
								{...register("password")}
							/>
							<p
								className={`error-message ${
									errors["password"] ? "showError" : ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Roll */}
						<Form.Group
							className="m-3 d-flex flex-row"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-sitemap bx-fw"></i>
							<Form.Label className="form-labelED">
								Roll:
							</Form.Label>
							<Form.Select
								disabled={
									!userLoged?.roll?.permissions
										?.create_newroll
										? true
										: editAvailable
								}
								className="form-controlED"
								{...register("id_roll")}
							>
								{isRollLoaded && (
									<option value={valoresObt.id_roll}>
										{editAvailable
											? userLoged.roll?.rol_user
											: "Seleccione un Roll"}
										{/* {userLoged.id_roll === valoresObt.id ?  valoresObt.: null} */}
									</option>
								)}
								{isRollLoaded &&
									roll.map((rolling) => (
										<option
											key={rolling.id}
											value={rolling.id}
										>
											{rolling.rol_user}
										</option>
									))}
							</Form.Select>
							<p
								className={`error-message ${
									errors["id_roll"] ? "showError" : ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>
					</Form>

					<Stack
						direction="horizontal"
						gap={4}
						className="row-md-6 mx-auto justify-content-center"
					>
						<div>
							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`tooltip-top}`}>
										Permite Editar los datos del
										usuario Registrado.
									</Tooltip>
								}
							>
								<Button variant="info" onClick={EditingData}>
									<i className="fa-solid fa-pen-to-square bx-fw"></i>
								</Button>
							</OverlayTrigger>
						</div>
						<div className="vr" />
						<div>
							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`tooltip-top}`}>
										Permite Guardar en la Base de datos
										la informacion Editada.
									</Tooltip>
								}
							>
								<Button
									disabled={editAvailable}
									onClick={handleSubmit(onSubmit)}
								>
									<i className="fa-solid fa-floppy-disk bx-fw">
										{" "}
									</i>
									Guardar
								</Button>
							</OverlayTrigger>
						</div>
					</Stack>
				</div>
			</div>
		</div>
	);
};

export default Myperfil;
