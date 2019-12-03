import React from 'react'
import {Card, Icon, notification, Spin} from 'antd';
import axios from "axios";
import ProductCardDescription from "./ProductCardDescription";

const {Meta} = Card;

class ProductCard extends React.Component {
    state = {
        isWishlisted: false,
        cover_url: '../../static/frontend/dice.png',
        loaded: false
    };

    constructor(props) {
        super(props);
        if (this.props.cover) {
            this.state.cover_url =
                this.props.cover.substring(this.props.cover.indexOf('/media'))
        }
    }

    componentDidMount() {
        const id = this.props.id;
        let token = null;
        let self = this;
        if (localStorage.getItem('auth_token')) {
            token = localStorage.getItem('auth_token');
        } else if (sessionStorage.getItem('auth_token')) {
            token = sessionStorage.getItem('auth_token')
        }
        if (token) {
            axios.get('/api/book/' + id + '/is_a_wish/', {
                    headers:
                        {
                            'Content-Type': 'application/json',
                            'Authentication': 'Token' + token
                        }
                }
            )
                .then(function (response) {
                    if (response['data']['message'] === true) {
                        self.setState({
                            isWishlisted: true
                        })
                    }
                    self.setState({
                        loaded: true
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            self.setState({
                loaded: true
            });
        }
    }

    handleCartClick = e => {
        const cart = JSON.parse(sessionStorage.getItem('cart'));
        cart.push(this.props.id);
        sessionStorage.setItem('cart', JSON.stringify(cart));
        notification.open({
            message: 'Product added',
            description: 'The book has been successfully added to your cart.',
        });
    };

    handleRemoveWish = () => {
        let token = null;
        const id = this.props.id;
        let self = this;
        if (localStorage.getItem('auth_token')) {
            token = localStorage.getItem('auth_token');
        } else if (sessionStorage.getItem('auth_token')) {
            token = sessionStorage.getItem('auth_token')
        }
        if (token) {
            axios.get('/api/book/' + id + '/remove_a_wish/', {
                    headers:
                        {
                            'Content-Type': 'application/json',
                            'Authentication': 'Token' + token
                        }
                }
            )
                .then(function (response) {
                    if (response['data']['message'] === true) {
                        self.setState({
                            isWishlisted: false
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    handleAddWish = () => {
        let token = null;
        const id = this.props.id;
        let self = this;
        if (localStorage.getItem('auth_token')) {
            token = localStorage.getItem('auth_token');
        } else if (sessionStorage.getItem('auth_token')) {
            token = sessionStorage.getItem('auth_token')
        }
        if (token) {
            axios.get('/api/book/' + id + '/make_a_wish/', {
                    headers:
                        {
                            'Content-Type': 'application/json',
                            'Authentication': 'Token' + token
                        }
                }
            )
                .then(function (response) {
                    if (response['data']['message'] === true) {
                        self.setState({
                            isWishlisted: true
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };


    render() {
        let actions = [];
        if (this.state.isWishlisted) {
            actions = [
                <Icon type="shopping-cart" key="shopping-cart" onClick={this.handleCartClick}/>,
                <Icon type="heart" key="heart" style={{color: '#fc56d0'}} theme='filled' onClick={this.handleRemoveWish} />,
            ]
        }
        else {
            actions = [
                <Icon type="shopping-cart" key="shopping-cart" onClick={this.handleCartClick}/>,
                <Icon type="heart" key="heart" twoToneColor='#fc56d0' theme='twoTone' onClick={this.handleAddWish} />,
            ]
        }

        return (
            (this.state.loaded ?
            <Card
                hoverable
                style={{width: 100 + '%'}}
                cover={<img alt="book cover" src={this.state.cover_url} className="product-list-img"/>}
                actions={actions}
            >
                <Meta title={this.props.title}
                      description={<ProductCardDescription editedAt={this.props.editedAt} price={this.props.price}
                                                           rating={this.props.rating}/>}/>
            </Card>
                    : <Spin />)
        );
    }


}

export default ProductCard
