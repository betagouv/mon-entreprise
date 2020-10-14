import { TrackerContext } from 'Components/utils/withTracker'
import React, { useCallback, useContext, useState } from 'react'
import { Trans } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import safeLocalStorage from '../../storage/safeLocalStorage'
import './Feedback.css'
import Form from './FeedbackForm'

type PageFeedbackProps = {
	blacklist?: Array<string>
	customMessage?: React.ReactNode
	customEventName?: string
}

const localStorageKey = (feedback: [string, string]) =>
	`app::feedback::v2::${feedback.join('::')}`
const saveFeedbackOccurrenceInLocalStorage = ([name, path, rating]: [
	string,
	string,
	number
]) => {
	safeLocalStorage.setItem(
		localStorageKey([name, path]),
		JSON.stringify(rating)
	)
}
const feedbackAlreadyGiven = (feedback: [string, string]) => {
	return !!safeLocalStorage.getItem(localStorageKey(feedback))
}

export default function PageFeedback({
	customMessage,
	customEventName
}: PageFeedbackProps) {
	const location = useLocation()
	const tracker = useContext(TrackerContext)
	const [state, setState] = useState({
		showForm: false,
		showThanks: false,
		feedbackAlreadyGiven: feedbackAlreadyGiven([
			customEventName || 'rate page usefulness',
			location.pathname
		])
	})

	const handleFeedback = useCallback(({ useful }: { useful: boolean }) => {
		tracker.push([
			'trackEvent',
			'Feedback',
			useful ? 'positive rating' : 'negative rating',
			location.pathname
		])
		const feedback = [
			customEventName || 'rate page usefulness',
			location.pathname,
			useful ? 10 : 0.1
		] as [string, string, number]
		tracker.push(['trackEvent', 'Feedback', ...feedback])
		saveFeedbackOccurrenceInLocalStorage(feedback)
		setState({
			showThanks: useful,
			feedbackAlreadyGiven: true,
			showForm: !useful
		})
	}, [])

	const handleErrorReporting = useCallback(() => {
		tracker.push(['trackEvent', 'Feedback', 'report error', location.pathname])
		setState({ ...state, showForm: true })
	}, [])

	if (state.feedbackAlreadyGiven && !state.showForm && !state.showThanks) {
		return null
	}

	return (
		<div
			className="ui__ container"
			style={{ display: 'flex', justifyContent: 'center' }}
		>
			<div className="feedback-page ui__ notice ">
				{!state.showForm && !state.showThanks && (
					<>
						<div style={{ flexShrink: 0 }}>
							{customMessage || (
								<Trans i18nKey="feedback.question">
									Cette page vous est utile ?
								</Trans>
							)}{' '}
						</div>
						<div className="feedbackButtons">
							<button
								className="ui__ link-button"
								onClick={() => handleFeedback({ useful: true })}
							>
								<Trans>Oui</Trans>
							</button>{' '}
							<button
								className="ui__ link-button"
								onClick={() => handleFeedback({ useful: false })}
							>
								<Trans>Non</Trans>
							</button>
							<button
								className="ui__ link-button"
								onClick={handleErrorReporting}
							>
								<Trans i18nKey="feedback.reportError">
									Faire une suggestion
								</Trans>
							</button>
						</div>
					</>
				)}
				{state.showThanks && (
					<div>
						<Trans i18nKey="feedback.thanks">
							Merci pour votre retour ! Vous pouvez nous contacter directement à{' '}
							<a href="mailto:contact@mon-entreprise.beta.gouv.fr">
								contact@mon-entreprise.beta.gouv.fr
							</a>
						</Trans>
					</div>
				)}
				{state.showForm && (
					<Form
						onEnd={() =>
							setState({ ...state, showThanks: true, showForm: false })
						}
						onCancel={() =>
							setState({ ...state, showThanks: false, showForm: false })
						}
					/>
				)}
			</div>
		</div>
	)
}
