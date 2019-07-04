/* @flow */

import { ScrollToElement } from 'Components/utils/Scroll'
import withTracker from 'Components/utils/withTracker'
import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import type { Tracker } from 'Components/utils/withTracker'

type Props = { onEnd: () => void, tracker: Tracker, onCancel: () => void }

class FeedbackForm extends Component<Props> {
	formRef: ?HTMLFormElement

	handleFormSubmit = e => {
		this.props.tracker.push([
			'trackEvent',
			'Feedback',
			'written feedback submitted'
		])
		e.preventDefault()
		fetch('/', {
			method: 'POST',
			// $FlowFixMe
			body: new FormData(this.formRef)
		})
		this.props.onEnd()
	}

	render() {
		return (
			<ScrollToElement onlyIfNotVisible>
				<div style={{ textAlign: 'end' }}>
					<button
						onClick={() => this.props.onCancel()}
						className="ui__ link-button"
						style={{ textDecoration: 'none', marginLeft: '0.3rem' }}
						aria-label="close">
						X
					</button>
				</div>
				<form
					name="feedback"
					style={{ flex: 1 }}
					method="post"
					ref={ref => (this.formRef = ref)}
					onSubmit={this.handleFormSubmit}>
					<input type="hidden" name="form-name" value="feedback" />
					<label htmlFor="message">
						<p>
							<Trans i18nKey="feedback.bad.form.headline">
								Votre retour nous est précieux afin d'améliorer ce site en
								continu. Sur quoi devrions nous travailler afin de mieux
								répondre à vos attentes ?
							</Trans>
						</p>
					</label>
					<textarea
						name="message"
						rows="5"
						style={{ resize: 'none', width: '100%', padding: '0.6rem' }}
					/>
					<br />
					<br />
					<label htmlFor="email">
						<p>
							<Trans i18nKey="feedback.bad.form.email">
								Votre email (si vous souhaitez une réponse de notre part)
							</Trans>
						</p>
					</label>
					<input type="email" name="email" />
					<input hidden name="url" value={window.location.href} />
					<input hidden name="pageTitle" value={document.title} />
					<br />
					<div style={{ margin: '1rem 0' }}>
						<button className="ui__ button small" type="submit">
							<Trans>Envoyer</Trans>
						</button>
					</div>
				</form>
			</ScrollToElement>
		)
	}
}

export default withTracker(FeedbackForm)
