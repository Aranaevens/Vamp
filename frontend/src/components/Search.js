import { Input, Dropdown, Icon } from 'antd';
import React from 'react';

const { Search } = Input;

class SearchForm extends React.Component {


    render() {
        const over = (
            <Search
                placeholder="Search anything"
                onSearch={value => console.log(value)}
                style={{ width: 100 + '%', height: 100 + '%'}}
                className="search-form"
            />
                );
        return(
            <Dropdown overlay={over} placement="bottomLeft">
                <Icon type="search" style={{fontSize: 1.5 + 'em'}} />
            </Dropdown>
        )
    }
}

export default SearchForm