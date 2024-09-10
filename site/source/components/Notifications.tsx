import { DottedName } from 'modele-social'
import Engine, { RuleNode } from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { useEngine, useInversionFail } from '@/components/utils/EngineContext'
import { Message } from '@/design-system'
import { CloseButton } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Strong } from '@/design-system/typography'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import { hideNotification } from '@/store/actions/actions'
import { RootState } from '@/store/reducers/rootReducer'

import { ExplicableRule } from './conversation/Explicable'
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
		getNotifications(engine) as Array<Notification>
	).filter(({ dottedName }) => !hiddenNotifications?.includes(dottedName))

	const isMultiline = (str: string) => str.trim().split('\n').length > 1

	return (
		<div
			style={{
				marginTop: '1rem',
			}}
		>
			<Appear>
				{inversionFail && (
					<Message icon={<StyledEmoji emoji="🤯" />} type="info">
						<Trans i18nkey="simulateurs.inversionFail">
							<Body>
								Le montant demandé n'est <Strong>pas calculable...</Strong>
							</Body>

							<SmallBody $grey>
								Il n'est pas possible d'obtenir ce montant dans la vrai vie à
								cause d'un effet de seuil dans le calcul des cotisations ou de
								l'impôt. Vous pouvez réessayer en modifiant la valeur
								renseignée.
							</SmallBody>
						</Trans>
					</Message>
				)}
				{messages.map(({ sévérité, dottedName, résumé, description }) => (
					<Message
						icon
						type={sévérité === 'avertissement' ? 'info' : 'primary'}
						key={dottedName}
					>
						<StyledBody
							as="div"
							$isMultiline={isMultiline(résumé ?? description ?? '')}
						>
							<Markdown>{résumé ?? description ?? ''}</Markdown>
						</StyledBody>
						<Absolute $isMultiline={isMultiline(résumé ?? description ?? '')}>
							<ExplicableRule dottedName={dottedName} light />
							<CloseButton
								aria-label={t('Fermer')}
								onPress={() => dispatch(hideNotification(dottedName))}
								color={sévérité === 'avertissement' ? 'tertiary' : 'primary'}
							/>
						</Absolute>
					</Message>
				))}
			</Appear>
		</div>
	)
}

const StyledBody = styled(Body)<{ $isMultiline: boolean }>`
	margin-right: ${({ $isMultiline }) => ($isMultiline ? '3rem' : '5rem')};
`

const Absolute = styled.div<{ $isMultiline: boolean }>`
	display: flex;
	flex-direction: column;

	flex-direction: ${({ $isMultiline }) =>
		$isMultiline ? 'column-reverse' : 'row'};
	align-items: flex-end;
	position: absolute;
	top: ${({ theme, $isMultiline }) =>
		$isMultiline ? theme.spacings.xxs : theme.spacings.xs};
	right: ${({ theme }) => theme.spacings.sm};
	${CloseButton} {
		margin-left: ${({ theme }) => theme.spacings.xxs};
		margin-bottom: ${({ theme }) => theme.spacings.xxs};
	}
`

const StyledEmoji = styled(Emoji)`
	transform: scale(1.5);
`
