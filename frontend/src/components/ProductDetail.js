import React from "react";
import axios from "axios";
import {Button, Icon, Rate, Spin} from "antd";

class ProductDetail extends React.Component{

    state = {
        book: null
    };

    componentDidMount() {
        const { id } = this.props.match.params.id;
        const self = this;

        axios.get('/api/book/' + id, {

            headers:
                {
                    'Content-Type': 'application/json',
                }
        })
            .then(function(response){
                self.setState({
                    book: response['data']
                })
            })
            .catch(function(error){
                console.log(error)
            })
    }

    render() {
        let wish = null;
        if (this.state.isWishlisted) {
            wish =
                <div className="details-btn detail-wl" onClick={this.handleRemoveWish}>
                    <Icon type="heart" key="heart" style={{color: '#fc56d0'}} theme='filled' />
                </div>
        }
        else {
            wish =
                <div className="details-btn detail-wl" onClick={this.handleAddWish}>
                    <Icon type="heart" key="heart" twoToneColor='#fc56d0' theme='twoTone' />;
                </div>
        }
        return (
            (this.state.book ?
                <div className="details-wrapper">
                    <div className="details-main-section">
                        <div className="details-main-wrapper">
                            <div className="details-cover">
                                <img src={this.state.book.cover} alt="book cover" />
                            </div>
                            <div className="details-infos">
                                <p className="details-title">{this.state.book.title}</p>
                                <p>Game: {this.state.book.game.name}</p>
                                <p>Designed by: {this.state.book.game.designer.name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="details-aside">
                        <div className="details-btn details-cart" onClick={this.handleCartClick}>
                            <Icon type="shopping-cart" key="shopping-cart" />
                        </div>
                        {wish}
                        <div className="details-rating">
                            <Rate disabled allowHalf defaultValue={this.state.book.rating} className="rating-lower-size" />
                        </div>
                        <div className="details-price">
                            {this.state.book.price}€
                        </div>
                    </div>
                </div>
            : <Spin />)
        )
    }
}

export default ProductDetail;