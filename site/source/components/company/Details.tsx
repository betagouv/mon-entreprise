import { Message } from '@/design-system'
import { CardContainer } from '@/design-system/card/Card'
import { Strong } from '@/design-system/typography'
import { H4 } from '@/design-system/typography/heading'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import styled from 'styled-components'
import Value from '../EngineValue'

export function CompanyDetails() {
	return (
		<StyledCompanyContainer>
			<H4>
				{' '}
				<Value expression="entreprise . nom" linkToRule={false} />{' '}
				<Value expression="entreprise . SIREN" linkToRule={false} />
			</H4>
			<Body>
				Crée le{' '}
				<Strong>
					<Value
						expression="entreprise . date de création"
						linkToRule={false}
					/>
				</Strong>{' '}
				et domiciliée à{' '}
				<Strong>
					<Value expression="établissement . localisation" linkToRule={false} />
				</Strong>
			</Body>
		</StyledCompanyContainer>
	)
}

const StyledCompanyContainer = styled(Message).attrs({ border: false })``
