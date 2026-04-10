import { useEffect } from 'react'
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
	const dispatch = useDispatch()
	const engine = useEngine()
	const radiéeCetteAnnée = engine.evaluate('entreprise . radiée cette année')
		.nodeValue as boolean

	useEffect(() => {
		if (!radiéeCetteAnnée) {
			const date =
				engine.evaluate({
					valeur: "période . fin d'année",
					contexte: {
						date: 'entreprise . date de cessation',
					},
				}).nodeValue ?? undefined
			dispatch(
				ajusteLaSituation({
					date,
				} as Record<DottedName, ValeurPublicodes | undefined>)
			)
		}
	}, [dispatch, engine, radiéeCetteAnnée])

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
`
const CessationQuestion = styled(H3)`
	overflow-wrap: break-word;
`
const CessationDateWrapper = styled.div`
	margin-top: -1.5rem;
`
