import { hideNotification } from 'Actions/actions'
import { useEngine, useInversionFail } from 'Components/utils/EngineContext'
import { Button } from 'DesignSystem/buttons'
import { GenericButtonOrLinkProps } from 'DesignSystem/typography/link'
import { DottedName } from 'modele-social'
import Engine, { RuleNode } from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import styled from 'styled-components'
import RuleLink from './RuleLink'
import Emoji from './utils/Emoji'
import { Markdown } from './utils/markdown'

// To add a new notification to a simulator, you should create a publicodes rule
// with the "type: notification" attribute. The display can be customized with
// the "sévérité" attribute. The notification will only be displayed if the
// publicodes rule is applicable.
type Notification = {
	dottedName: DottedName | 'inversion fail'
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

	const messages: Array<Notification> = (
		inversionFail
			? [
					{
						dottedName: 'inversion fail',
						description: t(
							'simulateurs.inversionFail',
							'Le montant saisi abouti à un résultat impossible. Cela est dû à un effet de seuil dans le calcul des cotisations.\n\nNous vous invitons à réessayer en modifiant légèrement le montant renseigné (quelques euros de plus par exemple).'
						),
						sévérité: 'avertissement',
					} as Notification,
			  ]
			: (getNotifications(engine) as Array<Notification>)
	).filter(({ dottedName }) => !hiddenNotifications?.includes(dottedName))

	return (
		<NotificationsContainer id="notificationsBlock">
			{messages.map(({ sévérité, dottedName, résumé, description }) => (
				<Notification className="notification" key={dottedName}>
					<Emoji emoji={sévérité == 'avertissement' ? '⚠️' : '💁🏻'} />
					<NotificationContent className="notificationText">
						<Markdown>{résumé ?? description ?? ''}</Markdown>{' '}
						{résumé && (
							<RuleLink dottedName={dottedName as DottedName}>
								<Trans>En savoir plus</Trans>
							</RuleLink>
						)}
					</NotificationContent>
					<HideButton
						className="hide"
						aria-label="close"
						onClick={() => dispatch(hideNotification(dottedName))}
					>
						×
					</HideButton>
				</Notification>
			))}
		</NotificationsContainer>
	)
}

const NotificationsContainer = styled.ul`
	list-style-type: none;
	padding: 0;
`

const Notification = styled.li`
	display: flex;
	position: relative;
	flex-direction: row;
	align-items: center;

	padding: 0.5rem 1rem;
	background-color: ${({ theme }) => theme.colors.bases.primary[100]};
	border: 2px solid;
	border-color: ${({ theme }) => theme.colors.bases.primary[500]};
	border-radius: 0.375rem;

	margin-bottom: 1rem;

	&:last-child {
		margin-bottom: 0;
	}
	& img {
		height: ${({ theme }) => theme.spacings.xl} !important;
		width: ${({ theme }) => theme.spacings.xl} !important;
		margin-right: ${({ theme }) => theme.spacings.sm} !important;
	}
`

const NotificationContent = styled.div`
	flex-grow: 1;
	margin-right: 2rem;
	margin-left: 0.5rem;
`

const HideButton = styled(Button)<GenericButtonOrLinkProps>`
	&& {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 1.5rem;
		width: 1.5rem;
		padding: 0;
		background: ${({ theme }) => theme.colors.extended.grey[100]};
		color: ${({ theme }) => theme.colors.bases.primary[600]};
		font-weight: bold;
		margin-left: 1rem;

		position: absolute;
		top: 0.375rem;
		right: 0.375rem;

		&:hover {
			background: ${({ theme }) => theme.colors.bases.primary[300]};
		}
	}
`
