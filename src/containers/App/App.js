// @flow
// global localStorage, window
import * as React from "react";
import { connect } from 'react-redux';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from "components/Header";
import Footer from "components/Footer";
import Menu from "components/Menu";
import Modal from "components/Modal";

import Logout from "containers/Logout";

import Login from "routes/Login";
import Signup from "routes/Signup";
import About from "routes/About";
import Faq from "routes/Faq";
import Transfer from "routes/Transfer";
import Transactions from "routes/Transactions";
import Users from "routes/Users";
import Profile from "routes/Profile";
import Permissions from "routes/Permissions";
import Preferences from "routes/Preferences";
import NoMatch from "routes/NoMatch";

import {
  toggleMenu,
  closeMenu,
  routeLoad
} from "./reducer";

import "./App.scss";

const RoutesAuthenticated = () => ([
  <Route path="/" exact component={Transfer} key="transfer" />,
  <Route path="/transactions" component={Transactions} key="transactions" />,
  <Route path="/users" component={Users} key="users" />,
  <Route path="/user/:id" component={Profile} key="user" />,
  <Route path="/permissions" component={Permissions} key="permissions" />,
  <Route path="/preferences" component={Preferences} key="preferences" />,
  <Route path="/logout" component={Logout} key="logout" />,
]);

const renderModalRoutes = () => (
  <Switch>
    <Redirect from="/create-account" to="/signup" />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
  </Switch>
);

const modalRoutes = [
  '/login',
  '/signup',
  '/create-account',
  '/connect-account',
];

class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    /* eslint-disable */
    this.previousLocation = this.unauthLocation = {
      pathname: '/about',
      hash: '',
      search: '',
    };
    /* eslint-enable */
  }

  componentWillUpdate(nextProps) {
    const { auth, location } = this.props;
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = auth ? this.props.location : this.unauthLocation;
    }
  }

  handleModalClose() {
    const { history } = this.props;
    history.push(this.previousLocation);
  }

  render() {
    const {
      history: { location } = { location: window.location },
      isAuthenticated,
      isMenuOpen,
    } = this.props;
    const handleModalClose = this.handleModalClose.bind(this);
    const isModalOpen = modalRoutes.some(path => new RegExp(path).test(location.pathname));

    return (
      <main className={`${isMenuOpen ? 'open' : 'closed'}`}>
        <Helmet titleTemplate="%s | EOS Wallet" defaultTitle="EOS Wallet" />
    
        <Header />
        
        <aside>
          <Menu />
        </aside>
  
        <section>
          <div  
            onClick={closeMenu}
            className="menu-closer"
            role="button"
            tabIndex="0" />

          <Switch location={isModalOpen ? this.previousLocation : location}>
            <Route path="/about" component={About} />
            <Route path="/faq" component={Faq} />
            <RoutesAuthenticated isAuthenticated={isAuthenticated} />
            <Route path="*" component={NoMatch} />
          </Switch>
  
          <Footer />
        </section>

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          renderRoute={renderModalRoutes} />
      </main>
    );
  }
}

const mapStateToProps = ({ 
  app: { isMenuOpen },
  login: { isAuthenticated },
}) => ({
  isAuthenticated,
  isMenuOpen,
});

const AppContainer = connect(
  mapStateToProps,
)(App);

export default AppContainer;
