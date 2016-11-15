import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './containers/Layout'
import Home from './containers/Home'

export default (
  <Route path="/" component={Layout}>
    <IndexRoute component={Home} />
    <Route path="*" component={() => <h2>On vous a perdu !</h2>} />
  </Route>
)
