import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import './css/BalancesERC20.css';

export default class Navbars extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Navbar bg="primary" variant="dark">
                <Navbar.Brand>DataUnion Test</Navbar.Brand>
            </Navbar>
        )
    };

}