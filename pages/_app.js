import App from 'next/app';
import React from 'react';
import Layout from '../components/layout';

export default class MyApp extends App {
  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <Lafyout>
        <Component {...pageProps} key={router.pathname} />
      </Lafyout>
    );
  }
}
