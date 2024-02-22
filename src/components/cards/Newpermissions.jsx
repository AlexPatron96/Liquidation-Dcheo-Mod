import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Button, Form, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
	createPermissionsThunk,
	createRollThunk,
	createUserThunk,
	deletePermissionsThunk,
	listPermissionsThunk,
	updatePermissionsThunk,
} from "../../store/slices/listUser.slice";
import Stack from "react-bootstrap/Stack";
import Swal from "sweetalert2";

const Newpermissions = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.userLoged);
	const Permissions = useSelector((state) => state.temporary);

	const dataUserLoged = user?.roll?.permissions;
	useEffect(() => {
		Permissions && dispatch(listPermissionsThunk());
		//console.log(dataUserLoged);
		if (!dataUserLoged?.create_newpermissions) {
			setIsViewPerm(true);
			setValue("id", dataUserLoged.id);
			setValue("name_permissions", dataUserLoged.name_permissions);
			setValue("create_newroll", dataUserLoged.create_newroll);
			setValue(
				"create_newpermissions",
				dataUserLoged.create_newpermissions
			);
			setValue("create_user", dataUserLoged.create_user);
			setValue("create_seller", dataUserLoged.create_seller);
			setValue("create_vehicle", dataUserLoged.create_vehicle);
			setValue(
				"edited_seller_maxtotal",
				dataUserLoged.edited_seller_maxtotal
			);
		}
	}, []);

	const initialValue = {
		id: "",
		name_permissions: "",
		create_newroll: false,
		create_newpermissions: false,
		create_user: false,
		create_seller: false,
		create_vehicle: false,
		edited_seller_maxtotal: false,
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
		const id_permissions = data.id;
		isEditing ? null : delete data.id;
		isEditing
			? dispatch(updatePermissionsThunk(id_permissions, data))
			: dispatch(createPermissionsThunk(data));
		reset();
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
	//console.log(errors);

	const [isEditing, setIsEditing] = useState(false);
	const [isViewPerm, setIsViewPerm] = useState(false);

	const editAvailable = (data) => {
		//console.log(isEditing);
		//console.log(data);
		setIsViewPerm(false);
		if (isEditing) {
			setIsEditing(false);
			reset();
		} else {
			setIsEditing(true);
			setValue("id", data.id);
			setValue("name_permissions", data.name_permissions);
			setValue("create_newroll", data.create_newroll);
			setValue("create_newpermissions", data.create_newpermissions);
			setValue("create_user", data.create_user);
			setValue("create_seller", data.create_seller);
			setValue("create_vehicle", data.create_vehicle);
			setValue("edited_seller_maxtotal", data.edited_seller_maxtotal);
		}
	};

	const viewAvailable = (data) => {
		//console.log(isEditing);
		setIsEditing(false);
		//console.log(data);
		if (isViewPerm) {
			setIsViewPerm(false);
			reset();
		} else {
			setIsViewPerm(true);
			setValue("id", data.id);
			setValue("name_permissions", data.name_permissions);
			setValue("create_newroll", data.create_newroll);
			setValue("create_newpermissions", data.create_newpermissions);
			setValue("create_user", data.create_user);
			setValue("create_seller", data.create_seller);
			setValue("create_vehicle", data.create_vehicle);
			setValue("edited_seller_maxtotal", data.edited_seller_maxtotal);
		}
	};

	const deletePermissions = (id_permir) => {
		dispatch(deletePermissionsThunk(id_permir));
		Swal.fire({
			position: "center",
			icon: "success",
			title: "¡Eliminado!",
			showConfirmButton: false,
			timer: 1500,
		});
		reset();
	};

	return (
		<>
			<div>
				<div>
					{dataUserLoged?.create_newpermissions ? (
						<h6>
							{isEditing
								? "Editando"
								: isViewPerm
								? "Visualizando"
								: "Crear"}{" "}
							Permisos de Acceso{" "}
							{isEditing ? "Selecionado" : null}
						</h6>
					) : (
						<h6>Permisos Del Usuario Actual</h6>
					)}
				</div>
				<div className="form-newUser">
					<Form
						// className="formModal"

						style={{ justifyContent: "space-between" }}
						onSubmit={handleSubmit(onSubmit)}
					>
						{/* Nombre de Permiso */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="bx bx-rename bx-fw"></i>

							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`tooltip-top}`}>
										Aqui expresara como desea que se
										llame el permiso que va ah
										asignarle a los usuarios.
									</Tooltip>
								}
							>
								<Form.Label className="form-labelED form-labelED-checkbox">
									Nombre del Permiso:
								</Form.Label>
							</OverlayTrigger>

							<Form.Control
								disabled={isViewPerm}
								placeholder="Ejemplo: Permiso Administrador..."
								className="form-controlED form-controlED-checkbox"
								{...register("name_permissions", {
									required: true,
								})}
							/>
							<p
								className={`error-message ${
									errors["name_permissions"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* create_newroll */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-sitemap bx-fw"></i>

							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`tooltip-top}`}>
										Le permitira crear, eliminar y
										editar, Rolles de usuarios, ademas
										de permitirle editar el roll que se
										le a asigando.
									</Tooltip>
								}
							>
								<Form.Label className="form-labelED form-labelED-checkbox">
									Permisos de Roll:
								</Form.Label>
							</OverlayTrigger>
							<Form.Check
								disabled={isViewPerm}
								size="lg"
								type="switch"
								className="form-controlED form-controlED-checkbox"
								{...register("create_newroll", {
									required: false,
								})}
							></Form.Check>
							<p
								className={`error-message ${
									errors["create_newroll"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* create_newPermiso */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-person-walking-dashed-line-arrow-right bx-fw"></i>

							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`tooltip-top}`}>
										Le permitira crear, eliminar y
										editar, Permisos de acceso que
										tiene los rolles de usuarios.
									</Tooltip>
								}
							>
								<Form.Label className="form-labelED form-labelED-checkbox">
									Permisos de acceso:
								</Form.Label>
							</OverlayTrigger>

							<Form.Check
								disabled={isViewPerm}
								size="lg"
								type="switch"
								className="form-controlED form-controlED-checkbox"
								{...register("create_newpermissions", {
									required: false,
								})}
							></Form.Check>
							<p
								className={`error-message ${
									errors["create_newpermissions"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* create_newuser */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-user bx-fw"></i>

							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`tooltip-top}`}>
										Le permitira crear, eliminar y
										editar, Los usuarios existentes.
									</Tooltip>
								}
							>
								<Form.Label className="form-labelED form-labelED-checkbox">
									Permisos de Usuarios:
								</Form.Label>
							</OverlayTrigger>

							<Form.Check
								disabled={isViewPerm}
								size="lg"
								type="switch"
								className="form-controlED form-controlED-checkbox"
								{...register("create_user", {
									required: false,
								})}
							></Form.Check>
							<p
								className={`error-message ${
									errors["create_user"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* create_seller */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-universal-access bx-fw"></i>

							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`tooltip-top}`}>
										Le permitira crear, eliminar y
										editar, Los vendedores existentes.
									</Tooltip>
								}
							>
								<Form.Label className="form-labelED form-labelED-checkbox">
									Permisos de Vendedores:
								</Form.Label>
							</OverlayTrigger>

							<Form.Check
								disabled={isViewPerm}
								size="lg"
								type="switch"
								className="form-controlED form-controlED-checkbox"
								{...register("create_seller", {
									required: false,
								})}
							></Form.Check>
							<p
								className={`error-message ${
									errors["create_seller"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* create_vehicle */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-truck bx-fw"></i>

							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`tooltip-top}`}>
										Le permitira crear, eliminar y
										editar, Los vendedores existentes.
									</Tooltip>
								}
							>
								<Form.Label className="form-labelED form-labelED-checkbox">
									Permisos los de Entrega:
								</Form.Label>
							</OverlayTrigger>

							<Form.Check
								disabled={isViewPerm}
								size="lg"
								type="switch"
								className="form-controlED form-controlED-checkbox"
								{...register("create_vehicle", {
									required: false,
								})}
							></Form.Check>
							<p
								className={`error-message ${
									errors["create_vehicle"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* edited_seller_maxtotal */}
						<Form.Group
							className="mb-3 d-flex flex-row position-relative"
							style={{ textAlign: "center" }}
						>
							<i className="fa-solid fa-credit-card bx-fw"></i>

							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`tooltip-top}`}>
										Le permitira crear liquidaciones,
										realizar la entrega de facturas de
										cobro, Realizar abonos de Facturas,
										crear, eliminar y editar Facturas y
										crear, eliminar y editar Clientes.
									</Tooltip>
								}
							>
								<Form.Label className="form-labelED form-labelED-checkbox">
									Permisos de Liquidaciones:
								</Form.Label>
							</OverlayTrigger>

							<Form.Check
								disabled={isViewPerm}
								size="lg"
								type="switch"
								className="form-controlED form-controlED-checkbox"
								{...register("edited_seller_maxtotal", {
									required: false,
								})}
							></Form.Check>
							<p
								className={`error-message ${
									errors["edited_seller_maxtotal"]
										? "showError showErrorPermissions"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>
					</Form>
					{/* Botones de Crear y editar  */}
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
										!dataUserLoged?.create_newpermissions
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
										!dataUserLoged?.create_newpermissions
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
			{/* <div className="vr" /> */}

			<div>
				<h6>Lista de Permisos de Acceso</h6>
				<div className="form-newUser">
					<ListGroup style={{ width: "300px" }}>
						{Permissions.map((perm) => (
							<ListGroup.Item
								disabled={
									!dataUserLoged?.create_newpermissions
								}
								key={perm.id}
								className={`font-size12 d-flex justify-content-between ${
									isEditing && valoresObt.id === perm.id
										? "bg-success"
										: null
								} `}
							>
								<div>{perm.name_permissions}</div>
								{/* <div>
									{rolling.name_permissions}{" "}
									{rolling.isActive ? null : (
										<i class="fa-solid fa-power-off"></i>
									)}
								</div> */}
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
													los Permisos
													Habilitados.
												</Tooltip>
											}
										>
											<Button
												disabled={
													!dataUserLoged?.create_newpermissions
												}
												size="sm"
												variant="info"
												onClick={() =>
													viewAvailable(perm)
												}
											>
												<i
													className={`fa-solid ${
														isViewPerm &&
														perm.id ===
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
													Permite Editar El
													permiso de acceso
													Seleccionado.
												</Tooltip>
											}
										>
											<Button
												disabled={
													!dataUserLoged?.create_newpermissions
												}
												size="sm"
												variant="primary"
												onClick={() =>
													editAvailable(perm)
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
													Permiso de acceso
													seleccionado.
												</Tooltip>
											}
										>
											<Button
												disabled={
													!dataUserLoged?.create_newpermissions
												}
												variant="danger"
												size="sm"
												onClick={() =>
													deletePermissions(
														perm.id
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

export default Newpermissions;
