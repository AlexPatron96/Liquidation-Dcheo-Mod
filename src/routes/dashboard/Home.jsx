import React from 'react';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row';
import CardBtn from '../../components/CardBtn';
import imgHome1 from '../../img/enviado.png';
import imgHome2 from '../../img/vendedor.png';
import dashboardimg from '../../img/metric.svg';


const Home = () => {

    return (
        <div className='home pages'>
            <h1>Bienvenido a la App de Liquidacion</h1>
            <img className='dashboardimg' src={dashboardimg} alt="" />
            <div className='card-btn' style={{margin:"5em"}}>
                <Row>
                    <Col>
                        
                        <Link className='linkStyle' to={"/dashboard/liquidation/vehicles"}>
                            <CardBtn title={"Liquidar Vehiculo"} img={imgHome1} />
                        </Link>
                    </Col>
                    <Col>
                        
                        <Link className='linkStyle' to={"/dashboard/liquidation/sellers"}>
                            <CardBtn title={"Liquidar Vendedor"} img={imgHome2} />
                        </Link>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Home;