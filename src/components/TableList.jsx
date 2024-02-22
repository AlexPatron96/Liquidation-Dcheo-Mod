import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import lodash from 'lodash';
import { Row } from 'react-bootstrap';


const TableList = ({ header, data, updateData, deleteData }) => {

    const [editingIndex, setEditingIndex] = useState(null);
    const [editedData, setEditedData] = useState([]);
    const [id, setId] = useState(0);

   

    const handleEdit = (index, obj) => {
        const claves = Object.keys(obj);
        let objetoModificado = {};
        claves.forEach((clave,) => {
            if (lodash.isObject(obj[clave])) {
                //console.log(obj[clave]);
                let newKey = `id_${clave}`
                objetoModificado[newKey] = obj[clave];
            } else {
                objetoModificado[clave] = obj[clave]
            }
        });
        //console.log(objetoModificado);
        setEditingIndex(index);
        setEditedData(objetoModificado);
        setId(objetoModificado.id);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedData({ ...editedData, [name]: value });
        //console.log(editedData);
    };

    const handleSave = (index) => {
        //console.log(editedData); 
        editedData.id_seller ? editedData.id_sellers = editedData.id_seller : editedData.id_sellers = editedData.seller
        delete editedData.id_seller// Salida de Datos de edicion de la tabla
        updateData(id, editedData);
        //console.log(editedData);
        setEditingIndex(null);
        setEditedData({});
    };

    const handleDelete = () => {
        deleteData(id, editedData);
        setEditingIndex(null);
        setEditedData({});
    }
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    {
                        header.map((title, index) => (
                            <th key={index}>{title}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {data?.map((row, index) => (
                    <tr key={index}>
                        {
                            Object.keys(row).map((value, index1) => (
                                <td key={index1} >
                                    {editingIndex === index ? (
                                        <input
                                            style={{ width: "100%" }}
                                            name={lodash.isObject(row[`${value}`])
                                                ? `id_${value}` : value}

                                            type={lodash.isObject(row[`${value}`])
                                                ? "number" : "text"}
                                            // type="text"

                                            disabled={(value === "id") ? true : false}
                                            value= {editedData[`${value}`]}
                                            
                                            // value={(lodash.isObject(editedData[`id_${value}`]) ? editedData[`id_${value}`].nombre : editedData[`${value}`]) ||
                                            //     (lodash.isObject(editedData[`id_${value}`]) ? editedData[`id_${value}`].dia : editedData[`${value}`]) ||
                                            //     (lodash.isObject(editedData[`id_${value}`]) ? editedData[`id_${value}`].placa : editedData[`${value}`]) ||
                                            //     (lodash.isObject(editedData[`id_${value}`]) ? editedData[`id_${value}`].num_Fact : editedData[`${value}`]) ||
                                            //     (lodash.isObject(editedData[`id_${value}`]) ? editedData[`id_${value}`].id : editedData[`${value}`])
                                            // }

                                            onChange={handleInputChange}

                                        />) : (
                                        (row[value] !== null && !row[value] ? "No" : row[value] === true ? "Si" : null) ||
                                        (lodash.isObject(row[value]) ? row[value].nombre : row[value]) ||
                                        (lodash.isObject(row[value]) ? row[value].dia : row[value]) ||
                                        (lodash.isObject(row[value]) ? row[value].placa : row[value]) ||
                                        (lodash.isObject(row[value]) ? row[value].num_Fac : row[value]) ||
                                        (lodash.isObject(row[value]) ? row[value].id : row[value])                                
                                    )}
                                </td>
                            ))
                        }
                        <td className='tdBtn'>
                            {editingIndex === index ? (
                                <>
                                    <button type="button" className="btn btn-success mb-0 p-1 d-flex flex-row" onClick={() => handleSave(index)}>
                                        <i className="fa-solid fa-floppy-disk bx-fw"></i>
                                        Save
                                    </button>
                                    <button type="button" className="btn btn-danger m-1 p-1 d-flex flex-row" style={{ alignItems: 'center' }} onClick={() => handleDelete()}>
                                        <i className="fa-solid fa-trash-can bx-fw"></i>
                                        Delete
                                    </button>
                                    <button type="button" className="btn btn-warning m-1 p-1 d-flex flex-row" style={{ alignItems: 'center' }} onClick={() => setEditingIndex(null)}>
                                        <i className="fa-solid fa-xmark bx-fw"></i>
                                    </button>
                                </>
                            ) : (
                                <button type="button" className="btn btn-primary mb-0 p-1 d-flex flex-row" onClick={() => handleEdit(index, row)}>
                                    <i className="fa-solid fa-pen-to-square bx-fw"></i>
                                    Edit
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default TableList;
