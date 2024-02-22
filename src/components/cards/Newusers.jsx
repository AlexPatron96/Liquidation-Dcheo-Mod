import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
	Button,
	Form,
	ListGroup,
	OverlayTrigger,
	Stack,
	Tooltip,
} from "react-bootstrap";
import {
	createUserThunk,
	deleteUserThunk,
	listTempRollThunk,
	listUserThunk,
	updateUserThunk,
} from "../../store/slices/listUser.slice";
import Swal from "sweetalert2";

const Newusers = () => {
	const userLoged = useSelector((state) => state.userLoged);
	const roll = useSelector((state) => state.temporary);
	const listUsersAvailables = useSelector((state) => state.listUser);
	const dispatch = useDispatch();

	useEffect(() => {
		roll && dispatch(listTempRollThunk());
		listUsersAvailables && dispatch(listUserThunk());
	}, []);

	//console.log(listUsersAvailables);
	const initialValue = {
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

	const onSubmit = (data) => {
		//console.log(data);
		data.id_roll = parseInt(data.id_roll);
		const id_users = data.id;

		// dispatch(createUserThunk(data));
		//console.log(data);
		isEditing ? null : delete data.id;

		isEditing
			? dispatch(updateUserThunk(id_users, data))
			: dispatch(createUserThunk(data));
		reset();
		Swal.fire({
			position: "center",
			icon: "success",
			title: `${isEditing ? "¡Editado!" : "Creado"}`,
			showConfirmButton: false,
			timer: 1500,
		});
		reset();
		setIsEditing(false);
		setIsViewPerm(false);
	};

	const clearForm = () => {
		setIsEditing(false);
		setIsViewPerm(false);
		reset();
	};

	const [passwordAvailable, setPasswordAvailable] = useState(false);
	const viewPassword = () => {
		passwordAvailable
			? setPasswordAvailable(false)
			: setPasswordAvailable(true);
	};

	const [isEditing, setIsEditing] = useState(false);
	const [isViewuser, setIsViewPerm] = useState(false);

	const editAvailable = (data) => {
		//console.log("Accediendo al editAVailable");
		// //console.log(data);
		setIsViewPerm(false);
		if (isEditing) {
			setIsEditing(false);
			reset();
		} else {
			setIsEditing(true);
			setValue("id", data.id);
			setValue("fullname", data.fullname);
			setValue("username", data.username);
			setValue("dni", data.dni);
			setValue("mail", data.mail);
			setValue("id_roll", data.roll?.id);
		}
		//console.log(isEditing);
	};

	const viewAvailable = (data) => {
		// //console.log(isEditing);
		setIsEditing(false);
		//console.log("Accediendo al viewAvilable");
		if (isViewuser) {
			setIsViewPerm(false);
			reset();
		} else {
			setIsViewPerm(true);
			setValue("id", data.id);
			setValue("fullname", data.fullname);
			setValue("username", data.username);
			setValue("dni", data.dni);
			setValue("mail", data.mail);
			setValue("id_roll", data.roll?.id);
		}
	};

	const deletePermissions = (id_permir) => {
		Swal.fire({
			title: "¿Está seguro?",
			text: "Deseas Eliminar el usuario Seleccionado",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#029C63",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Eliminar!",
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				dispatch(deleteUserThunk(id_permir));
				reset();
				Swal.fire({
					position: "center",
					icon: "success",
					title: "¡Eliminado!",
					showConfirmButton: false,
					timer: 1500,
				});
			} else if (result.dismiss) {
			}
		});
	};

	return (
		<>
			<div>
				{/* <h6>Crear Nuevos Usuarios</h6> */}
				<h6>
					{isEditing
						? "Editando"
						: isViewuser
						? "Visualizando"
						: "Crear Nuevo"}{" "}
					Usuario {isEditing ? "Selecionado" : null}
				</h6>
				<div className="form-newUser">
					<Form
						// className="formModal"
						style={{ justifyContent: "space-between" }}
						onSubmit={handleSubmit(onSubmit)}
					>
						{/* fullnmae */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="bx bx-rename bx-fw"></i>
							<Form.Label className="form-labelED">
								Nombre Completo:
							</Form.Label>
							<Form.Control
								disabled={isViewuser}
								placeholder="Ingrese el Nombre Completo..."
								className="form-controlED"
								{...register("fullname", { required: true })}
							/>
							<p
								className={`error-message ${
									errors["fullname"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Username */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-user bx-fw"></i>
							<Form.Label className="form-labelED">
								Nombre de usuario :
							</Form.Label>
							<Form.Control
								disabled={isViewuser}
								placeholder="Ejemplo: CheoM2023..."
								className="form-controlED"
								{...register("username", { required: true })}
							/>
							<p
								className={`error-message ${
									errors["username"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Dni */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-id-card bx-fw"></i>
							<Form.Label className="form-labelED">
								# Identificacion:
							</Form.Label>
							<Form.Control
								disabled={isViewuser}
								placeholder="Ingrese el Nombre Completo..."
								className="form-controlED"
								{...register("dni", { required: true })}
							/>
							<p
								className={`error-message ${
									errors["dni"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Mail */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-envelope bx-fw"></i>
							<Form.Label className="form-labelED">
								Correo:
							</Form.Label>
							<Form.Control
								disabled={isViewuser}
								type="mail"
								placeholder="Ejemplo: cheo@gmail.com"
								className="form-controlED"
								{...register("mail", { required: true })}
							/>
							<p
								className={`error-message ${
									errors["mail"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Password */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
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
								disabled={isViewuser}
								type={
									passwordAvailable ? "text" : "password"
								}
								placeholder="Ejemplo: Cheo2022*"
								className="form-controlED"
								{...register("password", {
									required: !isEditing,
								})}
							/>
							<p
								className={`error-message ${
									errors["password"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Roll */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-sitemap bx-fw"></i>
							<Form.Label className="form-labelED">
								Roll:
							</Form.Label>
							<Form.Select
								disabled={isViewuser}
								className="form-controlED"
								{...register("id_roll", { required: true })}
							>
								<option value="">Seleccione el Rol</option>
								{roll.map((rolling) => (
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
									errors["id_roll"]
										? "showError showErrorPermissions"
										: ""
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
										Permite Limpiar la informacion
										Ingresada.
									</Tooltip>
								}
							>
								<Button variant="danger" onClick={clearForm}>
									<i className="fa-solid fa-brush bx-fw"></i>
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
										la informacion Ingresada
									</Tooltip>
								}
							>
								<Button
									disabled={isViewuser}
									onClick={handleSubmit(onSubmit)}
								>
									{isEditing ? "Editar" : "Crear"}
								</Button>
							</OverlayTrigger>
						</div>
					</Stack>
				</div>
			</div>

			<div>
				<h6>Lista de Usuarios Creados</h6>

				<div className="form-newUser">
					<ListGroup style={{ width: "300px" }}>
						{listUsersAvailables.map((user) => (
							<ListGroup.Item
								key={user.id}
								className={`font-size12 d-flex justify-content-between ${
									isEditing && valoresObt.id === user.id
										? "bg-success"
										: null
								} `}
							>
								<div>{user?.fullname}</div>

								<Stack
									direction="horizontal"
									gap={1}
									className="row-md-1 justify-content-center"
								>
									<div>
										<OverlayTrigger
											placement="top"
											overlay={
												<Tooltip
													id={`tooltip-top}`}
												>
													Permite Visualizar
													los usuarios
													Creados.
												</Tooltip>
											}
										>
											<Button
												size="sm"
												variant="info"
												onClick={() =>
													viewAvailable(user)
												}
											>
												<i
													className={`fa-solid ${
														isViewuser &&
														user.id ===
															valoresObt.id
															? "fa-eye-slash"
															: "fa-eye"
													} bx-fw`}
												></i>{" "}
											</Button>
										</OverlayTrigger>
									</div>

									<div>
										<OverlayTrigger
											placement="top"
											overlay={
												<Tooltip
													id={`tooltip-top}`}
												>
													Permite Editar el
													usuario
													seleccionado.
												</Tooltip>
											}
										>
											<Button
												size="sm"
												variant="primary"
												onClick={() =>
													editAvailable(user)
												}
											>
												<i className="fa-solid fa-pen-to-square bx-fw"></i>{" "}
											</Button>
										</OverlayTrigger>
									</div>

									<div>
										<OverlayTrigger
											placement="top"
											overlay={
												<Tooltip
													id={`tooltip-top}`}
												>
													Permite Eliminar El
													usuario
													Seleccionado.
												</Tooltip>
											}
										>
											<Button
												disabled={
													user?.id ===
													userLoged.id
														? true
														: false
												}
												variant="danger"
												size="sm"
												onClick={() =>
													deletePermissions(
														user.id
													)
												}
											>
												<i className="fa-solid fa-trash bx-fw"></i>
											</Button>
										</OverlayTrigger>
									</div>
								</Stack>
							</ListGroup.Item>
						))}
					</ListGroup>
				</div>
			</div>
		</>
	);
};

export default Newusers;
