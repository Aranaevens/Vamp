import React from "react";
import axios from "axios";
import {Avatar, Button, Icon, List, notification, message, Popconfirm} from "antd";

class CartOverview extends React.Component {

    state = {
        empty: true,
        cart: [],
        loaded: false,
        confirm_visible: false,
    };

    componentDidMount() {
        const cart = JSON.parse(sessionStorage.getItem('cart'));
        const len = cart.length;
        if (len > 0) {
            this.setState({
                empty: false,
            });
            const self = this;
            for (let i = 0; i < len; i++) {
                let id = cart[i];
                axios.get('/api/book/' + id + '/', {
                    headers:
                        {
                            'Content-Type': 'application/json',
                        }
                })
                    .then(function (response) {
                        self.state.cart.push(response['data']);
                        if (i === len - 1) {
                            self.setState({
                                loaded: true,
                                cart: self.state.cart
                            })
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }

    }

    handleRemoveCart = (e, item) => {
        const cart = JSON.parse(sessionStorage.getItem('cart'));
        const comp_cart = this.state.cart;
        cart.splice(cart.indexOf(item.id), 1);
        let index;
        for (let j = 0; j < comp_cart.length; j++) {
            if (comp_cart[j]['id'] === item.id) {
                index = j;
            }
        }
        comp_cart.splice(index, 1);
        this.setState({
            cart: comp_cart,
        });
        sessionStorage.setItem('cart', JSON.stringify(cart));
        notification.open({
            message: 'Product removed',
            description: 'The book has been successfully removed from your cart.',
        });
    };

    handleValidate = () => {

    };

    handleEmptyCart = () => {
        this.setState({
            cart: []
        });
        sessionStorage.setItem('cart', []);
        message.success("Cart successfully emptied.")
    };

    handleSaveCart = () => {
        const cart = JSON.parse(sessionStorage.getItem('cart'));
        localStorage.setItem('cart', JSON.stringify(cart));
        message.success("Cart successfully saved.")
    };

    totalPrice = () => {
        let total = 0;
        this.state.cart.forEach(element => total += element['price']);
        return <div className="price-total">
            <p>{total} € excl.</p>
            <p>20% VAT</p>
            <p style={{fontWeight: 'bold', fontSize: 1.2 + 'em'}}>{total * 1.2} € incl.</p>
        </div>
    };

    render() {
        return (
            <div className="cart-overview">
                <div className="cart-save-btn">
                    <Button
                        block
                        onClick={this.handleSaveCart}
                        shape="round"
                        icon="save"
                        type="primary"
                    >
                        Save the cart
                    </Button>
                </div>
                <List
                    // loading={this.state.loaded}
                    itemLayout="horizontal"
                    dataSource={this.state.cart}
                    renderItem={item => (
                        <List.Item
                            actions={[<Icon type="delete" onClick={(e) => this.handleRemoveCart(e, item)}/>]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={(item.cover ? item.cover.substring(item.cover.indexOf('/media')) : '../../static/frontend/dice.png')}/>
                                }
                                title={item.title}
                            />
                            <div>{item.price} €</div>
                        </List.Item>
                    )}
                />
                <hr style={{height: 1 + 'px'}}/>
                {this.totalPrice()}
                <hr style={{height: 1 + 'px'}}/>
                <div className="cart-manipulation-btn-wrapper">
                    <div className="cart-empty-btn">
                        <Popconfirm title="Do you want to empty the cart ?" okText="Yes" cancelText="No"
                                    onConfirm={this.handleEmptyCart}>
                            <Button
                                shape="circle"
                                icon="delete"
                                type="primary"
                                ghost
                            />
                        </Popconfirm>
                    </div>
                    <div className="cart-checkout-btn">
                        <Button
                            block
                            onClick={this.handleValidate}
                            shape="round"
                            icon="euro"
                            type="primary"
                        >Place the order
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default CartOverview