import React from 'react'
import axios from "axios";
import ProductCard from "./ProductCard";
import {Col, Row, Spin} from "antd";

class SearchResults extends React.Component {

    state = {
        data: null,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let self = this;
        const kw = this.props.match.params.kw;
        axios.get('/api/book/search/?kw=' + kw, {
            headers:
                {
                    'Content-Type': 'application/json',
                }
        })
            .then(function (response) {
                self.setState({
                    data: response['data'],
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    createRows = () => {
        const nbRows = Math.floor(this.state.data.length / 3);
        const max_loop = this.state.data.length % 3;
        let container = [];

        for (let i = 0; i <= nbRows; i++) {
            let children = [];
            let that_loop = 3;
            if (i === nbRows){
                that_loop = max_loop;
            }
            for (let j = 0; j < that_loop; j++) {
                let item = this.state.data[i * 3 + j];
                children.push(
                    <Col span={8} key={item['id']}>
                        <ProductCard
                            id={item['id']}
                            title={item['title']}
                            game={item['game']}
                            tags={item['tags']}
                            cover={item['cover']}
                            editedAt={item['edited_at']}
                            price={item['price']}
                            rating={item['rating']}
                        />
                    </Col>)
            }
            container.push(<Row gutter={16} key={i*1000}>{children}</Row>)
        }
        return container;
    };

    render() {


        return (
            (this.state.data ?
                <div>
                    {this.createRows()}
                </div>
                :
                <div className="spinnin">
                    <Spin />
                </div>)
        )
    }
}

export default SearchResults