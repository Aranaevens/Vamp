import React from 'react'
import Header from './Header'
import Main from './Main'

class App extends React.Component{

    constructor(props){
        super(props);
        this.state = {};
        this.logoutHandler = this.logoutHandler.bind(this);
        this.loginHandler = this.loginHandler.bind(this);
    };

    componentDidMount() {
        if (sessionStorage.getItem('auth_token') != null || localStorage.getItem('auth_token') != null)
        {
            this.setState({logged: true})
        }
        else{
            this.setState({logged: false})
        }
        if (sessionStorage.getItem('cart') != null) {
            sessionStorage.setItem('cart', sessionStorage.getItem('cart'));
        }
        else if (localStorage.getItem('cart') != null) {
            sessionStorage.setItem('cart', localStorage.getItem('cart'));
        }
        else {
            sessionStorage.setItem('cart', '[]');
        }
    };

    logoutHandler(){
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('cart');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('email');
        localStorage.removeItem('cart');
        this.setState({logged: false})
    };

    loginHandler(){
        this.setState({
            logged: true,
        })
    };

    render() {
        return (
            <div>
                <Header logoutHandler={this.logoutHandler} loginHandler={this.loginHandler} logged={this.state.logged} />
                <Main />
            </div>
        )
    }
}


export default App