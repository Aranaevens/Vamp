import { Input, Dropdown, Icon } from 'antd';
import React from 'react';
import {Redirect} from "react-router";

const { Search } = Input;

class SearchForm extends React.Component {


    render() {
        const over = (
            <Search
                placeholder="Search anything"
                onSearch={value => <Redirect to={'/search/' + value}/>}
                style={{ width: 100 + '%', height: 100 + '%'}}
                className="search-form"
            />
                );
        {/*<Dropdown overlay={over} placement="bottomLeft">*/}
        {/*    <Icon type="search" style={{fontSize: 1.5 + 'em'}} />*/}
        {/*</Dropdown>*/}
        return(
            <Search
                placeholder="Search anything"
                // onSearch={value => <Redirect to={'/search/' + value}/>}
                onSearch={value => window.location.assign('/search/' + value)}
                enterButton
            />
        )
    }
}

export default SearchForm