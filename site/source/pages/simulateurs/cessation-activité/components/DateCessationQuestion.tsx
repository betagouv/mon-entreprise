import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { H3 } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { ajusteLaSituation } from '@/store/actions/actions'
import { useEngine } from '@/utils/publicodes/EngineContext'
import { evaluateQuestion } from '@/utils/publicodes/publicodes'

export const DateCessationQuestion = () => {
	const { t } = useTranslation().i18n
	const dispatch = useDispatch()
	const engine = useEngine()
	const radiéeCetteAnnée = engine.evaluate('entreprise . radiée cette année')
		.nodeValue as boolean
	const débutAnnée = engine.evaluate("période . début d'année")
		.nodeValue as string
	const finAnnée = engine.evaluate("période . fin d'année").nodeValue as string

	return (
		<CessationBlock>
			<CessationQuestion as="h2">
				{evaluateQuestion(
					engine,
					engine.getRule('entreprise . date de cessation')
				)}
				<ExplicableRule light dottedName={'entreprise . date de cessation'} />
			</CessationQuestion>
			<CessationDateWrapper>
				<RuleInput
					dottedName="entreprise . date de cessation"
					onChange={(date) => {
						dispatch(
							ajusteLaSituation({
								'entreprise . date de cessation': date,
							} as Record<DottedName, ValeurPublicodes | undefined>)
						)
					}}
					errorMessage={
						!radiéeCetteAnnée
							? t(
									'pages.simulateurs.cessation-activité.date-cessation.error-message',
									'Veuillez saisir une date comprise entre {{- débutAnnée }} et {{- finAnnée }}.',
									{
										débutAnnée,
										finAnnée,
									}
							  )
							: undefined
					}
				/>
			</CessationDateWrapper>
		</CessationBlock>
	)
}

const CessationBlock = styled.div`
	display: flex;
	flex-direction: column;
	align-items: start;
	flex-wrap: wrap;
	margin-bottom: -1rem;
	margin-top: -3rem;
	width: 100%;
	text-align: left;
`
const CessationQuestion = styled(H3)`
	overflow-wrap: break-word;
`
const CessationDateWrapper = styled.div`
	margin-top: -1.5rem;
`
