import React, { Component } from "react"
import R from "ramda"
import Aide from "../Aide"
import Satisfaction from "../Satisfaction"
import { reduxForm } from "redux-form"
import { scroller, Element } from "react-scroll"

@reduxForm({
  form: "conversation",
  destroyOnUnmount: false
})
export default class Conversation extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.foldedSteps.length == this.props.foldedSteps.length)
      return null

		console.log('will scroll')
    setTimeout(
      () =>
        scroller.scrollTo("myScrollToElement", {
          duration: 200,
          delay: 0,
          smooth: true
        }),
      1
    )
  }
  render() {
    let {
      foldedSteps,
      currentQuestion,
      reinitalise,
      textColourOnWhite,
      done,
      nextSteps
    } = this.props

    return (
      <>
        {!R.isEmpty(foldedSteps) && (
          <div id="foldedSteps">
            <div className="header">
              <button
                onClick={reinitalise}
                style={{ color: textColourOnWhite }}
              >
                <i className="fa fa-trash" aria-hidden="true" />
                Tout effacer
              </button>
            </div>
            {foldedSteps}
          </div>
        )}
        <Element name="myScrollToElement" id="myScrollToElement">
          {foldedSteps.length != 0 && <button>↑ Modifier mes réponses</button>}
          <div id="currentQuestion">
            {currentQuestion || <Satisfaction simu={this.props.simu} />}
          </div>
        </Element>
        <Aide />
      </>
    )
  }
}
