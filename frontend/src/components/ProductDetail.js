import React from "react";
import axios from "axios";
import {Button, Icon, Rate, Spin, Comment, Form, List, Input, message} from "antd";
import moment from "moment";
import Cookies from "js-cookie";

const {TextArea} = Input;

const CommentList = ({comments}) => (
    <List
        dataSource={comments}
        header={`${comments.length > 1 ? 'Comments' : 'Comment'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
    />
);

const Editor = ({onChange, onRatingChange, onSubmit, submitting, value, rating}) => (
    <div>
        <Form.Item>
            <Rate allowHalf allowClear defaultValue={rating} value={rating} onChange={onRatingChange}/>
        </Form.Item>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value}/>
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </div>
);

class ProductDetail extends React.Component {

    state = {
        book: null,
        comments: [],
        submitting: false,
        value: '',
        rating: 0,
        comment_loading: true,
        isWishlisted: false,
    };

    componentDidMount() {
        const id = this.props.match.params.id;
        const self = this;

        // Wishlist axios.
        let token = null;
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

        // Actual book axios.
        axios.get('/api/book/' + id + '/', {

            headers:
                {
                    'Content-Type': 'application/json',
                }
        })
            .then(function (response) {
                self.setState({
                    book: response['data']
                });
            })
            .catch(function (error) {
                console.log(error)
            });


        // Comments book axios.
        axios.get('/api/book/' + id + '/load_comments/', {
            headers:
                {
                    'Content-Type': 'application/json',
                }
        })
            .then(function (response) {
                let data_resp = response['data'];
                for (let i = 0; i < data_resp.length; i++) {
                    let r = data_resp[i]['rating'];
                    self.setState({
                        comments: [
                            {
                                author: data_resp[i]['username'],
                                avatar: null,
                                content: data_resp[i]['content'],
                                datetime: data_resp[i]['created_at'],
                                actions: [
                                    <Rate allowHalf disabled defaultValue={r} value={r}/>,
                                ]
                            },
                            ...self.state.comments,
                        ]
                    })
                }
                self.setState({
                    comment_loading: true,
                });
            })
            .catch(function (error) {
                console.log(error)
            })
    }


    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        let token = null;
        let user = '';
        if (localStorage.getItem('auth_token')) {
            token = localStorage.getItem('auth_token');
            user = localStorage.getItem('email');
        }
        else if (sessionStorage.getItem('auth_token')) {
            token = sessionStorage.getItem('auth_token');
            user = sessionStorage.getItem('email');
        }
        let contentFrom = this.state.value;
        let rate = this.state.rating;
        const csrfCookie = Cookies.get('XSRF-TOKEN');
        const id = this.props.match.params.id;

        axios.post('/api/book/' + id + '/post_comment/',
            {
                content: contentFrom,
                rating: rate,
                book: id,
                },
            {
                headers: {
                    'X-CSRFToken': csrfCookie,
                    'Content-Type': 'application/json',
                    'Authentication': 'Token' + token
                },
            })
            .then(function (response) {
                console.log(response);
                if (response['data']['message'] === true) {
                    message.success('Comment posted successfully')
                }
            })
            .catch(function (error) {
                console.log(error)
            })
        ;

        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                rating: 0,
                comments: [
                    {
                        author: user,
                        avatar: null,
                        content: contentFrom,
                        datetime: moment().fromNow(),
                        actions: [
                            <Rate allowHalf disabled defaultValue={rate} value={rate}/>,
                        ]
                    },
                    ...this.state.comments,
                ],
            });
        }, 1000);
    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    handleRatingChange = value => {
        this.setState({
            rating: value,
        })
    };


    handleRemoveWish = () => {
        let token = null;
        const id = this.props.match.params.id;
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
        const id = this.props.match.params.id;
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

        let wish = null;
        if (this.state.isWishlisted) {
            wish =
                <div className="details-btn detail-wl" onClick={this.handleRemoveWish}>
                    <Icon type="heart" key="heart" style={{color: '#fc56d0'}} theme='filled'/>
                </div>
        } else {
            wish =
                <div className="details-btn detail-wl" onClick={this.handleAddWish}>
                    <Icon type="heart" key="heart" twoToneColor='#fc56d0' theme='twoTone'/>
                </div>
        }

        let commentPart = null;
        if (this.state.comment_loading) {
            commentPart = <div className="comments">
                <h3>Comments</h3>
                {this.state.comments.length > 0 && <CommentList comments={this.state.comments}/>}
                <Comment
                    content={
                        <Editor
                            onChange={this.handleChange}
                            onSubmit={this.handleSubmit}
                            onRatingChange={this.handleRatingChange}
                            submitting={this.state.submitting}
                            value={this.state.value}
                            rating={this.state.rating}
                        />}
                />
            </div>
        }
        else {
            commentPart = <Spin />
        }

        return (
            (this.state.book ?
                <div>
                    <div className="details-wrapper">
                        <div className="details-main-section">
                            <div className="details-main-wrapper">
                                <div className="details-cover">
                                    <img src={this.state.book.cover} alt="book cover"/>
                                </div>
                                <div className="details-infos">
                                    <p className="details-title">{this.state.book.title}</p>
                                    <p>Game: {this.state.book.game.name}</p>
                                    <p>Designed by: {this.state.book.game.designer.name}</p>
                                </div>
                            </div>
                            <div className="details-summary">
                                <h3>Summary</h3>
                                <p>{this.state.book.summary}</p>
                            </div>
                            <hr style={{height: 1 + 'px'}}/>
                            <div className="details-about">
                                <h3>About the authors</h3>
                                <p>{this.state.book.game.designer.bio}</p>
                            </div>
                        </div>
                        <div className="details-aside">
                            <div className="details-btn details-cart" onClick={this.handleCartClick}>
                                <Icon type="shopping-cart" key="shopping-cart"/>
                            </div>
                            {wish}
                            <div className="details-rating">
                                <Rate disabled allowHalf defaultValue={this.state.book.rating}
                                      className="rating-lower-size"/>
                            </div>
                            <div className="details-price">
                                {this.state.book.price}€
                            </div>
                        </div>
                    </div>
                    <hr style={{height: 1 + 'px'}}/>
                    {commentPart}
                </div>
                : <Spin/>)
        )
    }
}

export default ProductDetail;