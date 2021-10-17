import React from 'react';
import PropTypes from 'prop-types';

import Head from 'next/head';
import { AppProps } from 'next/app';

import '../styles/global/base.scss';

const App: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    </Head>

    <Component {...pageProps} />
  </>
);

export default App;

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};
