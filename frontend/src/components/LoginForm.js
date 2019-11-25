import {Form, Icon, Input, Button, Checkbox} from 'antd';
import React from 'react'
import axios from "axios";
import Cookies from "js-cookie";
import key from "weak-key";

class LoginForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        var csrfCookie = Cookies.get('XSRF-TOKEN');
        var itself = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                axios.post('/api/auth/login/',
                    {
                        email: values['email'],
                        password: values['password'],
                    },
                    {
                        headers: {
                            'X-CSRFToken': csrfCookie,
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    })
                    .then(function (response) {
                        if (values['remember']){
                            localStorage.setItem('auth_token', response['data']['key']);
                            console.log(response['data']['key']);
                        }
                        else{
                            sessionStorage.setItem('auth_token', response['data']['key']);
                            console.log(response['data']['key']);
                        }
                        itself.props.loginHandler();
                        itself.props.onLoginModalCancel();
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const loginLayout = {
            wrapperCol: {
                xs: {
                    offset: 6,
                }
            }
        };
        return (
            <Form onSubmit={this.handleSubmit} loginHandler={this.props.loginHandler} onLoginModalCancel={this.onLoginModalCancel} className="login-form">
                <Form.Item>
                    {getFieldDecorator('email', {
                        rules: [{required: true, message: 'Please input your email!'}],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="Email adress"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: 'Please input your Password!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="Password"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(<Checkbox>Remember me</Checkbox>)}
                    <a className="login-form-forgot" href="">
                        Forgot password
                    </a>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    Or <a href="">register now!</a>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(LoginForm);

// ReactDOM.render(<WrappedNormalLoginForm />, mountNode);

export default WrappedNormalLoginForm