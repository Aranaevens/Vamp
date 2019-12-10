import React from 'react'
import {Link, NavLink} from 'react-router-dom'
import axios from "axios";
import Cookies from "js-cookie";
import {Modal, Icon} from 'antd'
import LoginForm from "./LoginForm";
import SearchForm from "./Search";

// The Header creates links that can be used to navigate
// between routes.
class Header extends React.Component {
    state = {loginVisible: false};

    constructor(props) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogout = e => {
        e.preventDefault();
        var csrfCookie = Cookies.get('XSRF-TOKEN');
        axios.post('/api/auth/logout/',
            {},
            {
                headers: {
                    'X-CSRFToken': csrfCookie,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }).then(function (response) {
            console.log(response);
        });
        this.props.logoutHandler();
    };

    showLogin = e => {
        e.preventDefault();
        this.setState({
            loginVisible: true,
        });
    };

    onLoginModalCancel = () => {
        this.setState({
            loginVisible: false,
        });
    };

    dontDoThing = e => {
        e.preventDefault();
    };

    render() {
        return (
            <header>
                <nav>
                    <div className="nav-wrapper">
                        <ul className="ant-menu ant-menu-horizontal ant-menu-root">
                            <NavLink to='/shop' activeClassName="ant-menu-item-selected" className="ant-menu-item">
                                Shop
                            </NavLink>
                        </ul>
                        <NavLink to='/' className="icon-header">
                            <img src='../../static/frontend/dice.png' alt='site icon' />
                        </NavLink>
                        <ul className="ant-menu ant-menu-horizontal ant-menu-root">
                            <NavLink to='/search' activeClassName="ant-menu-item-selected" className="ant-menu-item">
                                <Icon type="search" style={{fontSize: 1.5 + 'em'}} />
                                {/*<SearchForm />*/}
                            </NavLink>
                            <NavLink to='/cart' activeClassName="ant-menu-item-selected" className="ant-menu-item">
                                <Icon type="shopping-cart" style={{fontSize: 1.5 + 'em'}}/>
                            </NavLink>
                            {(this.props.logged) ?
                                null
                                : <NavLink to='/register' activeClassName="ant-menu-item-selected"
                                           className="ant-menu-item">Register</NavLink>
                            }
                            {(this.props.logged) ?
                                <NavLink to='/logout' onClick={this.handleLogout}
                                         activeClassName="ant-menu-item-selected"
                                         className="ant-menu-item">Logout</NavLink>
                                : <NavLink to='/login' onClick={this.showLogin} activeClassName="ant-menu-item-selected"
                                           className="ant-menu-item">Login</NavLink>
                            }
                        </ul>

                    </div>
                </nav>
                <Modal
                    title="Login form"
                    footer={null}
                    visible={this.state.loginVisible}
                    onCancel={this.onLoginModalCancel}
                >
                    <LoginForm loginHandler={this.props.loginHandler} onLoginModalCancel={this.onLoginModalCancel}/>
                </Modal>
            </header>

        )
    }
}

export default Header