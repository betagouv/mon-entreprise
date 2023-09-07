import { useWorkerEngine, WorkerEngine } from '@publicodes/worker-react'
import { DottedName } from 'modele-social'
import { RuleNode } from 'publicodes'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

// import { useEngine, useInversionFail } from '@/components/utils/EngineContext'
import { Message } from '@/design-system'
import { CloseButton } from '@/design-system/buttons'
import { Body } from '@/design-system/typography/paragraphs'
import { usePromise } from '@/hooks/usePromise'
import { hideNotification } from '@/store/actions/actions'
import { RootState } from '@/store/reducers/rootReducer'
import { isNotNull } from '@/utils'

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

async function getNotifications(workerEngine: WorkerEngine) {
	return (
		await Promise.all(
			Object.values(workerEngine.getParsedRules()).map(async (rule) =>
				rule.rawNode.type === 'notification' &&
				!!(await workerEngine.asyncEvaluate(rule.dottedName)).nodeValue
					? {
							dottedName: rule.dottedName,
							sévérité: rule.rawNode.sévérité,
							résumé: rule.rawNode.résumé,
							description: rule.rawNode.description,
					  }
					: null
			)
		)
	).filter(isNotNull)
	// .map(({ dottedName, rawNode: { sévérité, résumé, description } }) => ({
	// 	dottedName,
	// 	sévérité,
	// 	résumé,
	// 	description,
	// }))
}

export default function Notifications() {
	const { t } = useTranslation()
	const workerEngine = useWorkerEngine()
	// const inversionFail = useInversionFail()
	const hiddenNotifications = useSelector(
		(state: RootState) => state.simulation?.hiddenNotifications
	)
	const dispatch = useDispatch()

	const messages = usePromise(
		async () =>
			(await getNotifications(workerEngine)).filter(
				({ dottedName }) => !hiddenNotifications?.includes(dottedName)
			),
		[hiddenNotifications, workerEngine],
		[]
	)
	// const messages: Array<Notification> = (
	// 	inversionFail
	// 		? [
	// 				{
	// 					dottedName: 'inversion fail',
	// 					description: t(
	// 						'simulateurs.inversionFail',
	// 						'Le montant saisi abouti à un résultat impossible. Cela est dû à un effet de seuil dans le calcul des cotisations.\n\nNous vous invitons à réessayer en modifiant légèrement le montant renseigné (quelques euros de plus par exemple).'
	// 					),
	// 					sévérité: 'avertissement',
	// 				} as Notification,
	// 		  ]
	// 		: (getNotifications(engine) as Array<Notification>)
	// )
	// .filter(({ dottedName }) => !hiddenNotifications?.includes(dottedName))

	const isMultiline = (str: string) => str.trim().split('\n').length > 1

	return (
		<div
			style={{
				marginTop: '1rem',
			}}
		>
			<Appear>
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
