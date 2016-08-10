import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './containers/Layout'
import Explorer from './containers/Explorer'
import Analyse from './containers/Analyse'

export default (
  <Route path="/" component={Layout}>
    <Route path="analyse" component={Analyse} />
		<Route path="variables" component={Explorer} />
    <IndexRoute component={Explorer} />
    <Route path="*" component={() => <h2>On vous a perdu !</h2>} />
  </Route>
)
