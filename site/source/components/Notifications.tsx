import { DottedName } from 'modele-social'
import Engine, { RuleNode } from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { useEngine, useInversionFail } from '@/components/utils/EngineContext'
import { Message } from '@/design-system'
import { CloseButton } from '@/design-system/buttons'
import { Body } from '@/design-system/typography/paragraphs'
import { hideNotification } from '@/store/actions/actions'
import { RootState } from '@/store/reducers/rootReducer'

import RuleLink from './RuleLink'
import { Appear } from './ui/animate'
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

function getNotifications(engine: Engine) {
	return Object.values(engine.getParsedRules())
		.filter(
			(rule) =>
				rule.rawNode.type === 'notification' &&
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
		<div
			css={`
				margin-top: 1rem;
			`}
		>
			<Appear>
				{messages.map(({ sévérité, dottedName, résumé, description }) => (
					<Message
						icon
						type={sévérité === 'avertissement' ? 'info' : 'primary'}
						key={dottedName}
					>
						<Markdown>{résumé ?? description ?? ''}</Markdown>{' '}
						<Body>
							{résumé && (
								<RuleLink dottedName={dottedName as DottedName}>
									<Trans>En savoir plus</Trans>
								</RuleLink>
							)}
						</Body>
						<AbsoluteCloseButton
							aria-label={t('Fermer')}
							onPress={() => dispatch(hideNotification(dottedName))}
							color={sévérité === 'avertissement' ? 'tertiary' : 'primary'}
						/>
					</Message>
				))}
			</Appear>
		</div>
	)
}

const AbsoluteCloseButton = styled(CloseButton)`
	position: absolute;
	top: ${({ theme }) => theme.spacings.xs};
	right: ${({ theme }) => theme.spacings.sm};
`
