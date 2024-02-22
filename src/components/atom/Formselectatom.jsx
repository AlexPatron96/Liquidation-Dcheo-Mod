import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

const Formselectatom = ({ title, iterador, firstdata, secunddata , disabledAction , dataSelect }) => {

    // const [items, setItems] = useState(iterador);
    // console.log(items);
    //Lista de seleccion
    return (
        <Form.Select size="sm" className='w-30' aria-label="Default select example" onChange={e => dataSelect(e)}>
            <option>{title}</option>
            {
                iterador?.map((itr, index) => (
                    <option key={index} value={itr.value} disabled={disabledAction}>

                        {` ${itr[firstdata]}  ${itr[secunddata] ? "- "+itr[secunddata] : " "}`}

                    </option>
                ))
            }
        </Form.Select>
    );
};

export default Formselectatom;