import React from 'react'
import axios from "axios";
import {Carousel, Spin} from "antd";

class HomeCarousel extends React.Component {

    state = {
        data: null,
    };

    componentDidMount() {
        let self = this;
        axios.get('/api/book/get_highlighted/', {
            headers:
                {
                    'Content-Type': 'application/json',
                }
        })
            .then(function (response) {
                self.setState({
                    data: response['data'],
                })
                console.log(self.state.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        let firstTitle;
        let secondTitle;
        let thirdTitle;

        let firstBg;
        let secondBg;
        let thirdBg;

        if (this.state.data) {
            firstTitle = this.state.data[0]['title'];
            secondTitle = this.state.data[1]['title'];
            thirdTitle = this.state.data[2]['title'];

            firstBg = this.state.data[0]['cover'];
            secondBg = this.state.data[1]['cover'];
            thirdBg = this.state.data[2]['cover'];
        }

        return (
            (this.state.data ?
            <Carousel autoplay>
                <div style={{backgroundImage: firstBg}}>
                    <h3>{firstTitle}</h3>
                </div>
                <div style={{backgroundImage: secondBg}}>
                    <h3>{secondTitle}</h3>
                </div>
                <div style={{backgroundImage: thirdBg}}>
                    <h3>{thirdTitle}</h3>
                </div>
            </Carousel> :
                <Spin/>)
        );
    }
}

export default HomeCarousel