/* eslint-disable import/extensions */
import React, {lazy, Suspense} from 'react';
//HashRouter
import { BrowserRouter, Route, Switch, Redirect, withRouter } from 'react-router-dom';
import routers from './config';
function LoadingPage (props) {

    return (
        <div>
        </div>
    );
}
function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg
    }

    if (funcs.length === 1) {
        return funcs[0]
    }
    // console.log(...arguments)
    return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
const renderRoutes = routes => {
    if (!Array.isArray(routes)) {
        return null;
    }

    return (
        routes.map((route, index) => {
            if (route.redirect) {
                return (
                    <Redirect
                        key={route.path || index}
                        exact={route.exact}
                        strict={route.strict}
                        from={route.path}
                        to={route.redirect}
                    />
                );
            }
            return (
                <Route
                    key={route.path || index}
                    path={route.path}
                    exact={route.exact}
                    strict={route.strict}
                    render={() => {
                        const midRouter = [withRouter,lazy]
                        // const renderChildRoutes = renderRoutes(route.children);
                        const Wraprouter = compose(...midRouter)(route.component)
                        document.title = route.meta.title || "";
                        return <Suspense fallback={LoadingPage()}>
                            <Wraprouter></Wraprouter>
                        </Suspense>
                        // return renderChildRoutes;
                    }}
                />
            );
        })
    );
};

const AppRouter = () => {
    return <BrowserRouter><Switch>{renderRoutes(routers)}</Switch></BrowserRouter>;
};

export default AppRouter;
