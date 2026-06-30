import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { DottedName } from '@/domaine/publicodes/DottedName'

import RuleLink from '../RuleLink'

type Props = {
	id?: string
	dottedName: DottedName
	'aria-label'?: string
}

export const LienDocumentation = ({
	id,
	dottedName,
	'aria-label': ariaLabel,
}: Props) => {
	const { t } = useTranslation()

	return (
		<RuleLink id={id} dottedName={dottedName} aria-label={ariaLabel}>
			<StyledSpan>
				{t('pages.simulateurs.commun.documentation', 'Documentation')}
			</StyledSpan>
		</RuleLink>
	)
}

const StyledSpan = styled.span`
	font-size: ${({ theme }) => theme.fontSizes.min};
	font-weight: initial;
`
