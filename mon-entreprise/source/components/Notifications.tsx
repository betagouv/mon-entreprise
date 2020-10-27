import { hideNotification } from 'Actions/actions'
import animate from 'Components/ui/animate'
import { useInversionFail, EngineContext } from 'Components/utils/EngineContext'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import './Notifications.css'
import { Markdown } from './utils/markdown'
import { ScrollToElement } from './utils/Scroll'
import { EvaluatedRule } from 'publicodes'

// To add a new notification to a simulator, you should create a publicode rule
// with the "type: notification" attribute. The display can be customized with
// the "sévérité" attribute. The notification will only be displayed if the
// publicode rule is applicable.
type Notification = Pick<EvaluatedRule, 'dottedName' | 'description'> & {
	type: 'notification'
	sévérité: 'avertissement' | 'information'
}

export default function Notifications() {
	const { t } = useTranslation()
	const engine = useContext(EngineContext)
	const notifications = Object.values(engine.getParsedRules())
		.filter(rule => rule['type'] === 'notification')
		.filter(
			notification =>
				![null, false].includes(
					engine.evaluate(notification.dottedName).isApplicable
				)
		)
	const inversionFail = useInversionFail()
	const hiddenNotifications = useSelector(
		(state: RootState) => state.simulation?.hiddenNotifications
	)
	const dispatch = useDispatch()

	const messages: Array<Notification> = inversionFail
		? [
				{
					dottedName: 'inversion fail',
					description: t(
						'simulateurs.inversionFail',
						'Le montant saisi abouti à un résultat impossible. Cela est dû à un effet de seuil dans le calcul des cotisations.\n\nNous vous invitons à réessayer en modifiant légèrement le montant renseigné (quelques euros de plus par exemple).'
					),
					type: 'notification',
					sévérité: 'avertissement'
				}
		  ]
		: ((notifications as any) as Array<Notification>)
	if (!messages?.length) return null

	return (
		<div id="notificationsBlock">
			<ul style={{ margin: 0, padding: 0 }}>
				{messages.map(({ sévérité, dottedName, description }) =>
					hiddenNotifications?.includes(dottedName) ? null : (
						<animate.fromTop key={dottedName}>
							<li>
								<div className="notification">
									{emoji(sévérité == 'avertissement' ? '⚠️' : 'ℹ️')}
									<div className="notificationText ui__ card">
										<Markdown source={description} />
										<button
											className="hide"
											aria-label="close"
											onClick={() => dispatch(hideNotification(dottedName))}
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
