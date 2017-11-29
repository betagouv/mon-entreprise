import React, { Component } from "react"
import "./Layout.css"
import "./reset.css"
import "./ribbon.css"

import { Link, Route, Router, Switch, Redirect } from "react-router-dom"

import Home from "Components/Home"
import RulePage from "Components/RulePage"
import Route404 from "Components/Route404"
import Contact from "Components/Contact"
import Simulateur from "Components/Simulateur"
import RulesList from "Components/RulesList"
import Mecanisms from 'Components/Mecanisms'

import ReactPiwik from "Components/Tracker"
import createHistory from "history/createBrowserHistory"

const piwik = new ReactPiwik({
  url: "stats.data.gouv.fr",
  siteId: 39,
  trackErrors: true
})

export default class Layout extends Component {
  history = createHistory()
  render() {
    // track the initial pageview
    ReactPiwik.push(["trackPageView"])

    return (
      <Router history={piwik.connectToHistory(this.history)}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/contact" component={Contact} />
          <Route path="/regle/:name" component={RulePage} />
          <Route path="/regles" component={RulesList} />
          <Route path="/simu/:targets" component={Simulateur} />
          <Redirect from="/simu/" to="/" />
          <Redirect from="/simu/:name/intro" to="/simu/:name" />
          <Route path="/mecanisms" component={Mecanisms} />
          <Route component={Route404} />
        </Switch>
      </Router>
    )
  }
}
