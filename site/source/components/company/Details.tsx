import { Message } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H4 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import SeeAnswersButton from '../conversation/SeeAnswersButton'
import Value from '../EngineValue'

export function CompanyDetails({
	showSituation = false,
}: {
	showSituation?: boolean
}) {
	return (
		<StyledCompanyContainer>
			<div
				css={`
					display: flex;
					align-items: flex-end;
					gap: 1rem;
					justify-content: flex-end;
				`}
			>
				<div
					css={`
						flex: 1;
					`}
				>
					<H4 data-test-id="currently-selected-company">
						{' '}
						<Value expression="entreprise . nom" linkToRule={false} />{' '}
						<Value expression="entreprise . SIREN" linkToRule={false} />
					</H4>
					<Body>
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
								<Value
									expression="établissement . localisation"
									linkToRule={false}
								/>
							</Strong>
						</Trans>
					</Body>
				</div>
				{showSituation && (
					<div
						css={`
							text-align: right;
						`}
					>
						<SeeAnswersButton />
						<Spacing xs />
					</div>
				)}
			</div>
		</StyledCompanyContainer>
	)
}

const StyledCompanyContainer = styled(Message).attrs({ border: false })``
