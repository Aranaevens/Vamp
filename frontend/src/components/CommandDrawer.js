import Cookies from "js-cookie";
import axios from "axios";
import {Button, Drawer, Input, message, Result} from "antd";
import React from "react";

class CommandDrawer extends React.Component {

    state = {
        step: 0,
        visible: false,
        name: '',
        address: '',
        zip: '',
        items: '',
        email: '',
        order: 0,
    };

    showDrawer = () => {
        this.setState({
            visible: true,
        })
    };

    onClose = () => {
        this.setState({
            visible: false,
        })
    };

    onNameChange = e => {
        this.setState({
            name: e.target.value,
        })
    };

    onAddressChange = e => {
        this.setState({
            address: e.target.value
        })
    };

    onZipChange = e => {
        this.setState({
            zip: e.target.value
        })
    };

    onEmailChange = e => {
        this.setState({
            email: e.target.value
        });
        e.target.value = '';
        console.log(e.target.value)
    };

    onStep = () => {
        const step = this.state.step + 1;
        this.setState({
            step: step,
        })
    };

    onPlaceOrder = () => {
        let token = null;
        if (localStorage.getItem('auth_token')) {
            token = localStorage.getItem('auth_token');
        } else if (sessionStorage.getItem('auth_token')) {
            token = sessionStorage.getItem('auth_token');
        }
        const self = this;
        const csrfCookie = Cookies.get('XSRF-TOKEN');
        const cart = sessionStorage.getItem('cart');

        axios.post('/api/order/place_order/',
            {
                name: self.state.name,
                address: self.state.address,
                zip: self.state.zip,
                email_contact: self.state.email,
                items: cart,
            },
            {
                headers: {
                    'X-CSRFToken': csrfCookie,
                    'Content-Type': 'application/json',
                    'Authentication': 'Token' + token
                },
            })
            .then(function (response) {
                if (response['data']['message'] === true) {
                    self.setState({
                        order: response['data']['num']
                    });
                    self.onStep();
                    setTimeout(function () {
                        self.onStep()
                    }, 2000)
                } else {
                    message.error("A problem occurred with your order")
                }
            })
            .catch(function (error) {
                console.log(error)
            })
        ;
    };

    componentDidMount() {
        if (localStorage.getItem('email')) {
            this.setState({
                email: localStorage.getItem('email')
            })
        } else if (sessionStorage.getItem('email')) {
            this.setState({
                email: sessionStorage.getItem('email')
            })
        }

    }

    render() {
        let content = null;
        if (this.state.step === 0) {
            content =
                <div>
                    <h3>Please enter your email or log in :</h3>
                    <Input id='1' defaultValue={this.state.email} placeholder="example@placeholder.com"
                           onChange={this.onEmailChange}/>
                    <br/><br/>
                    <Button type='primary' onClick={this.onStep}>Next step</Button>
                </div>
        } else if (this.state.step === 1) {
            content =
                <div>
                    <h3>Please enter your delivery information :</h3>
                    <Input id='2' defaultValue={null} placeholder="Enter your name" onChange={this.onNameChange}/>
                    <br/><br/>
                    <Input id="3" defaultValue={null} placeholder="Enter your address" onChange={this.onAddressChange}/>
                    <br/><br/>
                    <Input id='4' defaultValue={null} placeholder="Enter your zip code" onChange={this.onZipChange}/>
                    <br/><br/>
                    <Button type='primary' onClick={this.onPlaceOrder}>Place order</Button>
                </div>
        } else if (this.state.step === 2) {
            content =
                <Result
                    status="success"
                    title="Successfully ordered"
                    subTitle="You're gonna be redirected to the payment platform"/>
        } else if (this.state.step === 3) {
            content =
                <div>
                    <p>Ceci marque la fin de la démo</p>
                </div>
        }

        return (
            <div>
                <div className="cart-checkout-btn">
                    <Button
                        type="primary"
                        onClick={this.showDrawer}
                        shape="round"
                        icon="euro"
                        >
                        Checkout
                    </Button>
                </div>
                <Drawer
                    title="Checkout order"
                    placement="right"
                    closable={true}
                    width={50 + 'vw'}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    {content}
                </Drawer>
            </div>
        )
    }
}

export default CommandDrawer