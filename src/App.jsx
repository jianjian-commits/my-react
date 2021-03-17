import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import Index from './views/Layout'

export default function App() {
    const history = createBrowserHistory()
    return (
        <Router>
            <Switch>
                <Route history={ history } path='/' component={ Index }></Route>
            </Switch>
        </Router>
    )
}
