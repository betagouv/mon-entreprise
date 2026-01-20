import { DottedName } from 'modele-social'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import RuleInput from '@/components/conversation/RuleInput'
import { H3 } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { ajusteLaSituation } from '@/store/actions/actions'

export const RégimeImpositionQuestion = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()

	return (
		<Container>
			<StyledH3 as="h2">
				{t(
					'pages.simulateurs.cessation-activité.régime-imposition.question',
					"Quel est votre régime d'imposition ?"
				)}
			</StyledH3>
			<RuleInput
				hideDefaultValue
				dottedName="entreprise . imposition"
				onChange={(imposition) => {
					dispatch(
						ajusteLaSituation({
							'entreprise . imposition': imposition,
						} as Record<DottedName, ValeurPublicodes>)
					)
				}}
			/>
		</Container>
	)
}

const Container = styled.div`
	margin-bottom: ${({ theme }) => theme.spacings.md};
`

const StyledH3 = styled(H3)`
	margin-bottom: ${({ theme }) => theme.spacings.sm};
	text-align: left;
`
