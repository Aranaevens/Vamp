import React from 'react'
import { Card } from 'antd';

const { Meta } = Card;

class ProductCard extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        <Card
            hoverable
            style={{width: 23%}}
            cover={<img alt="book cover" src={this.props.cover} />}
        >
            <Meta title={this.props.title}
    }


}