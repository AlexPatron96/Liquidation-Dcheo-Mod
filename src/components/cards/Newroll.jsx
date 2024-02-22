import React, { useEffect, useState } from "react";
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
	createRollThunk,
	createUserThunk,
	listPermissionsThunk,
	listRollThunk,
	updateRollThunk,
} from "../../store/slices/listUser.slice";
import Swal from "sweetalert2";

const Newroll = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.userLoged);
	const roll = useSelector((state) => state.listUser);
	const permissions = useSelector((state) => state.temporary);
	const dataUserLoged = user?.roll;

	useEffect(() => {
		roll && dispatch(listRollThunk());
		permissions && dispatch(listPermissionsThunk());
		//	console.log(dataUserLoged);
		if (!dataUserLoged?.permissions?.create_newroll) {
			//	console.log("Ingreso a negative");
			setIsViewPerm(true);
			setValue("id", dataUserLoged?.id);
			setValue("rol_user", dataUserLoged?.rol_user);
			setValue("isActive", dataUserLoged?.isActive);
			setValue("id_permissions", dataUserLoged?.id_permissions);
		}
	}, []);

	const initialValue = {
		id: "",
		rol_user: "",
		isActive: "",
		id_permissions: "",
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
		//	console.log(data);
		parseInt(data.id_roll);
		isEditing ? null : delete data.id;
		const id_rolling = data.id;
		isEditing
			? dispatch(updateRollThunk(id_rolling, data))
			: dispatch(createRollThunk(data));
		// reset();
		Swal.fire({
			position: "center",
			icon: "success",
			title: `${isEditing ? "¡Editado!" : "Creado"}`,
			showConfirmButton: false,
			timer: 1500,
		});
	};

	const clearForm = () => {
		setIsEditing(false);
		setIsViewPerm(false);
		reset();
	};

	const [isEditing, setIsEditing] = useState(false);
	const [isViewPerm, setIsViewPerm] = useState(false);

	const editAvailable = (data) => {
		//	console.log(isEditing);
		//	console.log(data);
		setIsViewPerm(false);
		if (isEditing) {
			setIsEditing(false);
			reset();
		} else {
			setIsEditing(true);
			setValue("id", data.id);
			setValue("rol_user", data.rol_user);
			setValue("isActive", data.isActive);
			setValue("id_permissions", data.id_permissions);
		}
	};

	const viewAvailable = (data) => {
		//	console.log(isEditing);
		setIsEditing(false);
		//	console.log(data);
		if (isViewPerm) {
			setIsViewPerm(false);
			reset();
		} else {
			setIsViewPerm(true);
			setValue("id", data.id);
			setValue("rol_user", data.rol_user);
			setValue("isActive", data.isActive);
			setValue("id_permissions", data.id_permissions);
		}
	};

	const deletePermissions = (id_permir) => {
		// dispatch(deletePermissionsThunk(id_rolling));
		Swal.fire({
			position: "center",
			icon: "success",
			title: "¡Eliminado!",
			showConfirmButton: false,
			timer: 1500,
		});
		reset();
	};

	// console.log(roll);
	return (
		<>
			<div>
				<div>
					{dataUserLoged?.permissions?.create_newroll ? (
						<h6>
							{isEditing
								? "Editando"
								: isViewPerm
								? "Visualizando"
								: "Crear"}{" "}
							Roll {isEditing ? "Selecionado" : null}
						</h6>
					) : (
						<h6>Roll Del Usuario Actual</h6>
					)}
				</div>
				<div className="form-newUser">
					<Form
						// className="formModal"
						style={{ justifyContent: "space-between" }}
						onSubmit={handleSubmit(onSubmit)}
					>
						{/* Rol User */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="bx bx-rename bx-fw"></i>
							<Form.Label className="form-labelED">
								Nombre Del Roll:
							</Form.Label>
							<Form.Control
								disabled={isViewPerm}
								placeholder="Ejemplo: Administrador..."
								className="form-controlED"
								{...register("rol_user", { required: true })}
							/>
							<p
								className={`error-message ${
									errors["rol_user"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* isActive */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-toggle-on bx-fw"></i>
							<Form.Label className="form-labelED">
								Roll Activo:
							</Form.Label>
							<Form.Select
								disabled={isViewPerm}
								className="form-controlED"
								{...register("isActive", { required: true })}
							>
								<option value="">Seleccione</option>
								<option value={true}>Si</option>
								<option value={false}>No</option>
							</Form.Select>
							<p
								className={`error-message ${
									errors["isActive"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Permissions */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-person-walking-dashed-line-arrow-right bx-fw"></i>
							<Form.Label className="form-labelED">
								Permisos:
							</Form.Label>
							<Form.Select
								disabled={isViewPerm}
								className="form-controlED"
								{...register("id_permissions", {
									required: true,
								})}
							>
								<option value="">Seleccione</option>
								{permissions.map((perm) => (
									<option key={perm?.id} value={perm?.id}>
										{perm?.name_permissions}
									</option>
								))}
							</Form.Select>
							<p
								className={`error-message ${
									errors["id_permissions"]
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
								<Button
									disabled={
										!dataUserLoged?.permissions
											?.create_newroll
									}
									variant="warning"
									onClick={() => clearForm()}
								>
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
									disabled={
										!dataUserLoged?.permissions
											?.create_newroll
											? true
											: isViewPerm
									}
									onClick={handleSubmit(onSubmit)}
								>
									<i className="fa-solid fa-floppy-disk bx-fw">
										{" "}
									</i>
								</Button>
							</OverlayTrigger>
						</div>
					</Stack>
				</div>
			</div>

			<div>
				<h6>Lista de Roles</h6>
				<div className="form-newUser">
					<ListGroup style={{ width: "300px" }}>
						{roll?.map((rolling) => (
							<ListGroup.Item
								disabled={
									!dataUserLoged?.permissions
										?.create_newroll
								}
								key={rolling.id}
								className={`font-size12 d-flex justify-content-between ${
									isEditing &&
									valoresObt.id === rolling.id
										? "bg-success"
										: null
								} `}
							>
								<div>
									{rolling.rol_user}{" "}
									{rolling.isActive ? null : (
										<i className="fa-solid fa-power-off"></i>
									)}
								</div>
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
												</Tooltip>
											}
										>
											<Button
												disabled={
													!dataUserLoged
														?.permissions
														?.create_newroll
												}
												size="sm"
												variant="info"
												onClick={() =>
													viewAvailable(
														rolling
													)
												}
											>
												<i
													className={`fa-solid ${
														isViewPerm &&
														rolling.id ===
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
													Permite Editar los
													rolles
												</Tooltip>
											}
										>
											<Button
												disabled={
													!dataUserLoged
														?.permissions
														?.create_newroll
												}
												size="sm"
												variant="primary"
												onClick={() =>
													editAvailable(
														rolling
													)
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
													Permite Eliminar el
													roll seleccionado
												</Tooltip>
											}
										>
											<Button
												disabled={
													!dataUserLoged
														?.permissions
														?.create_newroll
												}
												variant="danger"
												size="sm"
												onClick={() =>
													deletePermissions(
														rolling.id
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

export default Newroll;
