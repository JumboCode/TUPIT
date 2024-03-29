import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import AuthProvider from '../components/auth';

import '../styles/global/base.scss';

import Navbar from '../components/Navbar';

// _app.jsx should not be converted to typescript
export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </Head>

      <Navbar {...pageProps.navbar}>
        <Component {...pageProps} />
      </Navbar>
    </AuthProvider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};
