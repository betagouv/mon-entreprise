import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './containers/Layout'
import Home from './containers/Home'
import Rule from './components/Rule'
import About from './components/About'

export default (
  <Route path="/" component={Layout}>
    <Route path="regle/:name" component={Rule} />
      <Route path="a-propos" component={About} />
    <IndexRoute component={Home} />
    <Route path="*" component={() => <h2>On vous a perdu !</h2>} />
  </Route>
)
