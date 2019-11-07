import React from 'react'
import {Link} from 'react-router-dom'
import axios from "axios";
import Cookies from "js-cookie";
import {Modal} from 'antd'
import LoginForm from "./LoginForm";

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
            }).then(function (response){
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

    render() {
        return (
            <header>
                <nav>
                    <ul>
                        <li><Link to='/'>Home</Link></li>
                        {(this.props.logged) ?
                            null
                            : <li><Link to='/register'>Register</Link></li>
                        }
                        {(this.props.logged) ?
                            <li><Link to='/logout' onClick={this.handleLogout}>Logout</Link></li>
                            : <li><Link to='/login' onClick={this.showLogin}>Login</Link></li>
                        }
                    </ul>
                </nav>
                <Modal
                    title="Login form"
                    footer={null}
                    visible={this.state.loginVisible}
                    onCancel={this.onLoginModalCancel}
                >
                    <LoginForm loginHandler={this.props.loginHandler} onLoginModalCancel={this.onLoginModalCancel} />
                </Modal>
            </header>

        )
    }
}

export default Header