import { Message } from '@/design-system'
import { Strong } from '@/design-system/typography'
import { H4 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import Value from '../EngineValue'

export function CompanyDetails() {
	return (
		<StyledCompanyContainer>
			<H4 data-test-id="currently-selected-company">
				{' '}
				<Value expression="entreprise . nom" linkToRule={false} />{' '}
				<Value expression="entreprise . SIREN" linkToRule={false} />
			</H4>
			<Body>
				<Trans>
					Créee le{' '}
					<Strong>
						<Value
							expression="entreprise . date de création"
							linkToRule={false}
						/>
					</Strong>{' '}
					et domiciliée à{' '}
					<Strong>
						<Value
							expression="établissement . localisation"
							linkToRule={false}
						/>
					</Strong>
				</Trans>
			</Body>
		</StyledCompanyContainer>
	)
}

const StyledCompanyContainer = styled(Message).attrs({ border: false })``
