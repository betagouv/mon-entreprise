import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import { Strong } from '@/design-system/typography'
import { H4 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

import Value from '../EngineValue/Value'

const StyledH4 = styled(H4)`
	margin: ${({ theme }) => theme.spacings.xxs} 0;
`
const StyledBody = styled(Body)`
	margin: ${({ theme }) => theme.spacings.xxs} 0;
`
const StyledEntrepriseContainer = styled.div`
	padding: 0 ${({ theme }) => theme.spacings.xs};
`

export default function SelectedEntrepriseDetails() {
	return (
		<StyledEntrepriseContainer>
			<StyledH4>
				<Value expression="entreprise . nom" linkToRule={false} />{' '}
				<Value expression="entreprise . SIREN" linkToRule={false} />
			</StyledH4>
			<StyledBody>
				<Trans>
					Entreprise créée le{' '}
					<Strong>
						<Value
							expression="entreprise . date de création"
							linkToRule={false}
						/>
					</Strong>{' '}
					et domiciliée à{' '}
					<Strong>
						<Value expression="établissement . commune" linkToRule={false} />
					</Strong>
				</Trans>
			</StyledBody>
		</StyledEntrepriseContainer>
	)
}
