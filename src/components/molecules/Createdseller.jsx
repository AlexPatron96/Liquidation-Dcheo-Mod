import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { getSellerThunk, postSellerthunk } from '../../store/slices/seller.slice';

const Createdseller = (props) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [listShowReplaceID, setListShowReplaceID] = useState(props.listshow.slice(1));
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const dispatch = useDispatch();

    const route = useSelector(state => state.temporary);

    const onSubmit = (data) => {
        dispatch(postSellerthunk(data));
        reset();
        props.onHide();
        setShowSuccessModal(true);
    }

    useEffect(() => {
        if (showSuccessModal) {
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 1750);
        }
    }, [showSuccessModal]);

    return (
        <div>

            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className='formModal' onSubmit={handleSubmit(onSubmit)}>

                        <Form.Group className="mb-3">
                            <Form.Label>{listShowReplaceID[0]}</Form.Label>
                            <Form.Control  {...register(`${props.listdb[0]}`, { required: true })} />
                            <p className={`error-message ${errors[props.listdb[0]] ? 'showError' : ''}`}>Este campo es requerido</p>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{listShowReplaceID[1]}</Form.Label>
                            <Form.Select {...register(`${props.listdb[1]}`, { required: true })}>
                                <option value={true}>Si</option>
                                <option value={false}>No</option>
                            </Form.Select>
                            <p className={`error-message ${errors[props.listdb[1]] ? 'showError' : ''}`}>Este campo es requerido</p>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{listShowReplaceID[2]}</Form.Label>
                            <Form.Select {...register(`${props.listdb[2]}`, { required: true })}>
                                {
                                    route.map((rou, index) => (
                                        <option key={index} value={parseInt(rou.id)}>{rou.dia}</option>
                                    ))
                                }
                            </Form.Select>
                            <p className={`error-message ${errors[props.listdb[2]] ? 'showError' : ''}`}>Este campo es requerido</p>
                        </Form.Group>

                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" type="submit" onClick={handleSubmit(onSubmit)}>
                        Submit
                    </Button>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal >

        </div>
    );
};

export default Createdseller;