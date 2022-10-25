import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import { withAuthenticator } from '@aws-amplify/ui-react';
import HomePage from './pages/HomePage';
import Routes from './routers/Routes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// AntUI

// Amplify Auth

function App() {
  return (
    <Router>
      <>
        <Layout className="layout" style={styles.layout}>
          <Navbar />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route component={Routes} />
          </Switch>
          <Footer />
        </Layout>
      </>
    </Router>
  );
}

const styles = {
  layout: {
    minHeight: '100vh',
  },
};
export default withAuthenticator(App);
