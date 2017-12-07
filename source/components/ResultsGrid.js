import R from "ramda"
import React, { Component } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { formValueSelector } from "redux-form"
import "./Results.css"
import "../engine/mecanismViews/Somme.css"
import { humanFigure } from "./rule/RuleValueVignette"

import { capitalise0 } from "../utils"
import { nameLeaf } from "Engine/rules"
import "./ResultsGrid.css"


// Filtered variables and rules can't be filtered in a uniform way, for now
let paidBy = R.pathEq(["explanation", "cotisation", "dû par"])
let filteredBy = R.pathEq(["cotisation", "dû par"])
export let byName = R.groupBy(R.prop("dottedName"))

export let cell = (branch, payer, analysis) => {
  let row = byBranch(analysis)[branch],
    items = R.filter(
      item => paidBy(payer)(item) || filteredBy(payer)(item),
      row
    ),
    values = R.map(R.prop("nodeValue"), items)

  return R.sum(values)
}

export let subCell = (row, name, payer) => {
  let cells = row[name],
    items = R.filter(
      item => paidBy(payer)(item) || filteredBy(payer)(item),
      cells
    ),
    values = R.map(R.prop("nodeValue"), items)

  return R.sum(values)
}

export let byBranch = analysis => {
  let sal = analysis.dict["contrat salarié . cotisations salariales"]
  let pat = analysis.dict["contrat salarié . cotisations patronales"]

  let l1 = sal ? sal.explanation.formule.explanation.explanation : [],
    l2 = pat ? pat.explanation.formule.explanation.explanation : [],
    explanations = R.concat(l1, l2),
    byBranch = R.groupBy(
      R.pathOr("autre", ["explanation", "cotisation", "branche"]),
      explanations
    )

  return byBranch
}

@withRouter
@connect(state => ({
  analysis: state.analysis,
  targetNames: state.targetNames,
  situationGate: state.situationGate,
  inversions: formValueSelector("conversation")(state, "inversions"),
  done: state.done
}))
export default class ResultsGrid extends Component {
  render() {
    let { analysis, situationGate, targetNames, inversions, done } = this.props

    if (!done) return null

    if (!analysis) return null

    let extract = x => (x && x.nodeValue) || 0,
      fromSituation = name => situationGate(name),
      fromEval = name => R.find(R.propEq("dottedName", name), analysis.targets),
      fromDict = name => analysis.dict[name],
      get = name =>
        extract(fromSituation(name) || fromEval(name) || fromDict(name))
    let results = byBranch(analysis),
      brut = get("contrat salarié . salaire brut"),
      net = get("contrat salarié . salaire net"),
      total = get("contrat salarié . salaire total")

    let inversion = R.path(
        ["contrat salarié ", " salaire de base"],
        inversions
      ),
      relevantSalaries = new Set(
        targetNames
          .concat(inversion ? [nameLeaf(inversion)] : [])
          .concat(["salaire de base"])
      )

    return (
      <div className="somme resultsGrid">
        <table>
          <thead>
            <tr>
              <td className="element" />
              <td
                colSpan={(relevantSalaries.size - 1) * 2}
                className="element value"
                id="sommeBase"
              >
                {humanFigure(2)(brut)}{" "}
                <span className="annotation">Salaire brut</span>
              </td>
            </tr>
          </thead>
          <tbody>
            {R.keys(results).map(branch => {
              let props = { branch, values: results[branch], analysis }
              return (
                <Row
                  key={branch}
                  {...props}
                  relevantSalaries={relevantSalaries}
                />
              )
            })}
            <tr>
              <td key="blank" className="element" />
              {relevantSalaries.has("salaire net") && (
                <>
                  <td key="netOperator" className="operator">
                    =
                  </td>
                  <td key="net" className="element value">
                    {humanFigure(2)(net)}{" "}
                    <span className="annotation">Salaire net</span>
                  </td>
                </>
              )}
              {relevantSalaries.has("salaire total") && [
                <td key="totalOperator" className="operator">
                  =
                </td>,
                <td key="total" className="element value">
                  {humanFigure(2)(total)}{" "}
                  <span className="annotation">Salaire total</span>
                </td>
              ]}
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

class Row extends Component {
  state = {
    folded: true
  }
  render() {
    let { branch, values, analysis, relevantSalaries } = this.props,
      detail = byName(values)

    let title = name => {
      let node = R.head(detail[name])
      return node.title || capitalise0(node.name)
    }

    let aggregateRow = (
      <tr
        key="aggregateRow"
        onClick={() => this.setState({ folded: !this.state.folded })}
      >
        <td key="category" className="element category name">
          {capitalise0(branch)}&nbsp;<span className="unfoldIndication">
            {this.state.folded ? "déplier >" : "replier"}
          </span>
        </td>
        {this.state.folded ? (
          <>
            {relevantSalaries.has("salaire net") && (
              <>
                <td key="operator1" className="operator">
                  -
                </td>
                <td key="value1" className="element value">
                  {humanFigure(2)(cell(branch, "salarié", analysis))}
                </td>
              </>
            )}
            {relevantSalaries.has("salaire total") && (
              <>
                <td key="operator2" className="operator">
                  +
                </td>
                <td key="value2" className="element value">
                  {humanFigure(2)(cell(branch, "employeur", analysis))}
                </td>
              </>
            )}
          </>
        ) : (
          <td key="blank" colSpan="4" />
        )}
      </tr>
    )

    let detailRows = this.state.folded
      ? []
      : R.keys(detail).map(subCellName => (
          <tr key={"detailsRow" + subCellName} className="detailsRow">
            <td className="element name">&nbsp;{title(subCellName)}</td>
            {relevantSalaries.has("salaire net") && (
              <>
                <td key="operator1" className="operator">
                  -
                </td>
                <td key="value1" className="element value">
                  {humanFigure(2)(subCell(detail, subCellName, "salarié"))}
                </td>
              </>
            )}
            {relevantSalaries.has("salaire total") && (
              <>
                <td key="operator2" className="operator">
                  +
                </td>
                <td key="value2" className="element value">
                  {humanFigure(2)(subCell(detail, subCellName, "employeur"))}
                </td>
              </>
            )}
          </tr>
        ))

    // returns an array of <tr>
    return R.concat([aggregateRow], detailRows)
  }
}
