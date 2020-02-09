import { goToQuestion, hideControl } from 'Actions/actions'
import { makeJsx } from 'Engine/evaluation'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import animate from 'Ui/animate'
import './Controls.css'
import { Markdown } from './utils/markdown'
import { ScrollToElement } from './utils/Scroll'

export default function Controls() {
	const { t } = useTranslation()
	const foldedSteps = useSelector(
		(state: RootState) => state.simulation?.foldedSteps
	)
	const analysis = useSelector(analysisWithDefaultsSelector)
	const controls = analysis?.controls
	const inversionFail = analysis?.cache._meta.inversionFail
	const hiddenControls = useSelector(
		(state: RootState) => state.simulation?.hiddenControls
	)
	const dispatch = useDispatch()

	if (!controls) {
		return null
	}
	let messages = inversionFail
		? [
				{
					message: t([
						'simulateurs.inversionFail',
						'Le montant saisi ne permet pas de calculer un résultat, nous vous invitons à essayer une autre valeur.'
					]),
					level: 'avertissement'
				}
		  ]
		: controls
	if (!messages?.length) return null

	return (
		<div id="controlsBlock">
			<ul style={{ margin: 0, padding: 0 }}>
				{messages.map(({ level, test, message, solution, evaluated }) =>
					hiddenControls?.includes(test) ? null : (
						<animate.fromTop key={message}>
							<li key={test}>
								<div className="control">
									{emoji(level == 'avertissement' ? '⚠️' : 'ℹ️')}
									<div className="controlText ui__ card">
										{message ? (
											<Markdown source={message} />
										) : (
											<span id="controlExplanation">{makeJsx(evaluated)}</span>
										)}

										{solution && !foldedSteps?.includes(solution.cible) && (
											<div>
												<button
													key={solution.cible}
													className="ui__ link-button"
													onClick={() => dispatch(goToQuestion(solution.cible))}
												>
													{solution.texte}
												</button>
											</div>
										)}
										<button
											className="hide"
											aria-label="close"
											onClick={() => dispatch(hideControl(test))}
										>
											×
										</button>
									</div>
								</div>
							</li>
							<ScrollToElement />
						</animate.fromTop>
					)
				)}
			</ul>
		</div>
	)
}
