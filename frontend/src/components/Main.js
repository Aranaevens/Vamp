import React from 'react'
import {Switch, Route, HashRouter} from 'react-router-dom'
import Home from './Home'
import RegistrationForm from './RegistrationForm'
import NoUrlMatch from "./NoUrlMatch";
import LoginForm from "./LoginForm";
import MyBreadCrumb from "./Breadcrumb";
import ProductList from "./ProductList";
import CartOverview from "./CartOverview";

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"

const BreadCrumbMap = {
    '/register': 'Registration',
    '/shop': 'Shop',
    '/shop/details': 'Product',
    '/blog': 'Blog',
    '/blog/details': 'Article',
    '/cart': 'Cart',
};

const Main = () => (
    <main>
        <MyBreadCrumb NameMap={BreadCrumbMap}/>
        <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/register' component={RegistrationForm}/>
            <Route exact path='/shop' component={ProductList}/>
            <Route path='/login' component={LoginForm}/>
            <Route path='/cart' component={CartOverview}/>
            <Route path='*' component={NoUrlMatch}/>
        </Switch>
    </main>
)

export default Main
