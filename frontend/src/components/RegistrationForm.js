import {
    Form,
    Input,
    Tooltip,
    Icon,
    Row,
    Col,
    Checkbox,
    Button,
} from 'antd';
import React from "react";
// import 'antd/dist/antd.css';
import axios from "axios";
import CSRFToken from "./csrftoken";
import Cookies from 'js-cookie';


class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
    };

    handleSubmit = e => {
        e.preventDefault();
        var csrfCookie = Cookies.get('XSRF-TOKEN');
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                axios.post('/api/reg/',
                    {
                        username: values['username'],
                        email: values['email'],
                        password1: values['password1'],
                        password2: values['password2'],
                    },
                    {
                        headers: {
                            'X-CSRFToken': csrfCookie,
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    })
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }
        });
    };

    handleConfirmBlur = e => {
        const {value} = e.target;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };

    compareToFirstPassword = (rule, value, callback) => {
        const {form} = this.props;
        if (value && value !== form.getFieldValue('password1')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const {form} = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['password2'], {force: true});
        }
        callback();
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 8},
            },
            wrapperCol: {
                xs: {span: 12},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 16,
                    offset: 0,
                },
                sm: {
                    span: 8,
                    offset: 8,
                },
            },
        };

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="E-mail">
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ],
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="Password" hasFeedback>
                    {getFieldDecorator('password1', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                            {
                                validator: this.validateToNextPassword,
                            },
                        ],
                    })(<Input.Password/>)}
                </Form.Item>
                <Form.Item label="Confirm Password" hasFeedback>
                    {getFieldDecorator('password2', {
                        rules: [
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            {
                                validator: this.compareToFirstPassword,
                            },
                        ],
                    })(<Input.Password onBlur={this.handleConfirmBlur}/>)}
                </Form.Item>
                <Form.Item
                    label={
                        <span>
              Nickname&nbsp;
                            <Tooltip title="What do you want others to call you?">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
                    }
                >
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: 'Please input your nickname!', whitespace: true}],
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="Captcha" extra="We must make sure that your are a human.">
                    <Row gutter={8}>
                        <Col span={12}>
                            {getFieldDecorator('captcha', {
                                rules: [{required: true, message: 'Please input the captcha you got!'}],
                            })(<Input/>)}
                        </Col>
                        <Col span={12}>
                            <Button>Get captcha</Button>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                    })(
                        <Checkbox>
                            I have read the <a href="">agreement</a>
                        </Checkbox>,
                    )}
                </Form.Item>
                {/*<CSRFToken/>*/}
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedRegistrationForm = Form.create({name: 'register'})(RegistrationForm);

// ReactDOM.render(<WrappedRegistrationForm />, mountNode);

export default WrappedRegistrationForm;