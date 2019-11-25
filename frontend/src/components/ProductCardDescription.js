import React from "react";
import {Rate} from "antd";


class ProductCardDescription extends React.Component{

    render() {
        const rating = parseFloat((Math.round(this.props.rating * 2) / 2).toFixed(1));
        return(
            <div>
                <section>Paru en {this.props.editedAt}</section>
                <div className="price-card">{this.props.price}€</div>
                <Rate disabled allowHalf defaultValue={rating} className="rating-lower-size" />
            </div>
        )
    }
}

export default ProductCardDescription