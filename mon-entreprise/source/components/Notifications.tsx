import { hideNotification } from 'Actions/actions'
import animate from 'Components/ui/animate'
import { useEngine, useInversionFail } from 'Components/utils/EngineContext'
import { DottedName } from 'modele-social'
import Engine, { RuleNode } from 'publicodes'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import './Notifications.css'
import RuleLink from './RuleLink'
import { Markdown } from './utils/markdown'
import { ScrollToElement } from './utils/Scroll'

// To add a new notification to a simulator, you should create a publicodes rule
// with the "type: notification" attribute. The display can be customized with
// the "sévérité" attribute. The notification will only be displayed if the
// publicodes rule is applicable.
type Notification = {
	dottedName: DottedName
	description: RuleNode['rawNode']['description']
	résumé?: RuleNode['rawNode']['description']
	sévérité: 'avertissement' | 'information'
}

export function getNotifications(engine: Engine) {
	return Object.values(engine.getParsedRules())
		.filter(
			(rule) =>
				rule.rawNode['type'] === 'notification' &&
				!!engine.evaluate(rule.dottedName).nodeValue
		)
		.map(({ dottedName, rawNode: { sévérité, résumé, description } }) => ({
			dottedName,
			sévérité,
			résumé,
			description,
		}))
}
export default function Notifications() {
	const { t } = useTranslation()
	const engine = useEngine()
	const inversionFail = useInversionFail()
	const hiddenNotifications = useSelector(
		(state: RootState) => state.simulation?.hiddenNotifications
	)
	const dispatch = useDispatch()

	const messages: Array<Notification> = inversionFail
		? [
				{
					dottedName: 'inversion fail' as any,
					description: t(
						'simulateurs.inversionFail',
						'Le montant saisi abouti à un résultat impossible. Cela est dû à un effet de seuil dans le calcul des cotisations.\n\nNous vous invitons à réessayer en modifiant légèrement le montant renseigné (quelques euros de plus par exemple).'
					),
					sévérité: 'avertissement',
				},
		  ]
		: (getNotifications(engine) as Array<Notification>)
	if (!messages?.length) return null

	return (
		<div id="notificationsBlock">
			<ul style={{ margin: 0, padding: 0 }}>
				{messages.map(({ sévérité, dottedName, résumé, description }) =>
					hiddenNotifications?.includes(dottedName) ? null : (
						<animate.fromTop key={dottedName}>
							<li>
								<div className="notification">
									{emoji(sévérité == 'avertissement' ? '⚠️' : '💁🏻')}
									<div className="notificationText ui__ card">
										<Markdown source={résumé ?? description} />{' '}
										{résumé && (
											<RuleLink dottedName={dottedName}>
												<Trans>En savoir plus</Trans>
											</RuleLink>
										)}
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
