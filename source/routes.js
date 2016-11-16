import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './containers/Layout'
import Home from './containers/Home'
import Rule from './components/Rule'

export default (
  <Route path="/" component={Layout}>
    <Route path="règle" component={Rule} />
    <IndexRoute component={Home} />
    <Route path="*" component={() => <h2>On vous a perdu !</h2>} />
  </Route>
)
