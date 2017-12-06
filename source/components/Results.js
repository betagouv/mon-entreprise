import R from "ramda"
import React, { Component } from "react"
import classNames from "classnames"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { withRouter } from "react-router"

import "./Results.css"
import { clearDict } from "Engine/traverse"
import { encodeRuleName } from "Engine/rules"
import RuleValueVignette from "./rule/RuleValueVignette"
import ProgressTip from "Components/ProgressTip"

@withRouter
@connect(state => ({
  analysis: state.analysis,
  targetName: state.targetName,
  conversationStarted: !R.isEmpty(state.form),
  conversationFirstAnswer: R.path(["form", "conversation", "values"])(state),
  situationGate: state.situationGate,
  done: state.done,
}))
export default class Results extends Component {
  render() {
    let {
      analysis,
      targetName,
      conversationStarted,
      conversationFirstAnswer,
      location,
      done
    } = this.props

    if (!analysis) return null

    let { targets } = analysis

    let onRulePage = R.contains("/regle/")(location.pathname)
    return (
      <div id="resultsZone">
        <section id="results">
          <ProgressTip />
          <div id="resultsContent">
            <Link className="edit" to="/">
              <i className="fa fa-pencil-square-o" aria-hidden="true" />
              {"  "}
              <span>Changer d'objectif</span>
            </Link>
            <ul>
              {targets.map(rule => (
                <li key={rule.nom}>
                  <RuleValueVignette
                    {...rule}
                    conversationStarted={conversationStarted}
                  />
                </li>
              ))}
            </ul>
          </div>
          <button className="scrollButton down" style={{opacity: done ? 1 : 0}}>↓ Comprendre mes résultats</button>
        </section>
      </div>
    )
  }
}
