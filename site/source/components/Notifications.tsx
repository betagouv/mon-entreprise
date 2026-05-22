import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Emoji, Markdown, Message, typography } from '@/design-system'
import { getNotifications } from '@/domaine/publicodes/Notification'
import { useInversionFail } from '@/hooks/useInversionFail'
import { hideNotification } from '@/store/actions/actions'
import { RootState } from '@/store/reducers/rootReducer'
import { useOptionalEngine } from '@/utils/publicodes/EngineContext'

import { ExplicableRule } from './conversation/Explicable'
import { Appear } from './ui/animate'

const { Body, Strong, SmallBody } = typography

export default function Notifications() {
	const engine = useOptionalEngine()
	const inversionFail = useInversionFail()
	const hiddenNotifications = useSelector(
		(state: RootState) => state.simulation?.hiddenNotifications
	)
	const dispatch = useDispatch()

	if (!engine) {
		return null
	}

	const messages = getNotifications(engine).filter(
		({ dottedName }) => !hiddenNotifications?.includes(dottedName)
	)

	const isMultiline = (str: string) => str.trim().split('\n').length > 1

	return (
		<div
			role="status"
			style={{
				marginTop: '1rem',
			}}
		>
			<Appear>
				{inversionFail && (
					<Message icon={<StyledEmoji emoji="🤯" />} type="info">
						<Trans i18nkey="simulateurs.inversionFail">
							<Body>
								Le montant demandé n'est <Strong>pas calculable…</Strong>
							</Body>

							<SmallBody $grey>
								Il n'est pas possible d'obtenir ce montant dans la vraie vie à
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
						dismissible
						onDismiss={() => dispatch(hideNotification(dottedName))}
					>
						<StyledBody
							as="div"
							$isMultiline={isMultiline(résumé ?? description ?? '')}
						>
							<Markdown>{résumé ?? description ?? ''}</Markdown>
						</StyledBody>
						<Absolute $isMultiline={isMultiline(résumé ?? description ?? '')}>
							<ExplicableRule dottedName={dottedName} light />
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
		$isMultiline ? theme.spacings.xxs : theme.spacings.md};
	right: ${({ theme }) => theme.spacings.xxl};
	padding-top: 2px;
`

const StyledEmoji = styled(Emoji)`
	transform: scale(1.5);
`
