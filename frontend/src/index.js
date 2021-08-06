import React from "react";
import { render } from 'react-dom';
import { App } from './App.js'
import store from './store'
import { Provider } from 'react-redux'
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { FallBack } from "./FallBack.js";

require('dotenv').config()

Sentry.init({
    dsn: "https://75fdedc350834ff883310e368b49362d@o946206.ingest.sentry.io/5895081",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
});

class ErrorBoundary extends React.Component {

    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        return this.state.hasError ? <FallBack /> : this.props.children;
    }
}


render(
    <Provider store={store}>
        <ErrorBoundary >
            <App />
        </ErrorBoundary>
    </Provider >
    , document.getElementById('app'));