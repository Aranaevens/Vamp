import {Breadcrumb} from "antd";
import {Link, withRouter} from "react-router-dom";
import React from "react";

class MyBreadCrumb extends React.Component {
    NameMap;

    render() {

        const Bread = withRouter(props => {
            const {location} = props;
            const pathSnippets = location.pathname.split('/').filter(i => i);
            const extraBreadcrumbItems = pathSnippets.map((_, index) => {
                const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
                const first_member = `${pathSnippets.slice(0, 1)}`;
                const last_member = `${pathSnippets.slice(index, index + 1)}`;
                    if(isNaN(last_member)) {
                        return (
                            <Breadcrumb.Item key={url}>
                                <Link to={url}>{this.props.NameMap[url]}</Link>
                            </Breadcrumb.Item>
                        );
                    }
                    else {
                        if (first_member === 'blog') {
                            return (
                                <Breadcrumb.Item key={url}>
                                    <Link to={url}>Article</Link>
                                </Breadcrumb.Item>
                            );
                        }
                        else if (first_member === 'shop') {
                            return (
                                <Breadcrumb.Item key={url}>
                                    <Link to={url}>Product details</Link>
                                </Breadcrumb.Item>
                            );
                        }
                    }
                });
            const breadcrumbItems = [
                <Breadcrumb.Item key="home">
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>,
            ].concat(extraBreadcrumbItems);
            return (
                <div id="breadcrumb">
                    <Breadcrumb>{breadcrumbItems}</Breadcrumb>
                </div>
            )
        });
        return(
            <Bread />
        )
    }
}

export default MyBreadCrumb