import { ComponentType } from 'react'
import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import { Body, Grid, H4, Message, Spacing, Strong } from '@/design-system'

import SeeAnswersButton from '../conversation/SeeAnswersButton'
import Value from '../EngineValue/Value'

export function EntrepriseDetails({
	showSituation = false,
	headingTag = 'h3',
}: {
	showSituation?: boolean
	headingTag?: string | ComponentType | undefined
}) {
	return (
		<StyledCompanyContainer>
			<Grid
				container
				style={{
					alignItems: 'flex-end',
					justifyContent: 'center',
				}}
				spacing={3}
			>
				<Grid item xs={12} lg>
					<StyledH4 data-test-id="currently-selected-company" as={headingTag}>
						<Value expression="entreprise . nom" linkToRule={false} />{' '}
						<Value expression="entreprise . SIREN" linkToRule={false} />
					</StyledH4>
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
									expression="établissement . commune"
									linkToRule={false}
								/>
							</Strong>
						</Trans>
					</Body>
				</Grid>
				{showSituation && (
					<Grid item xs={12} sm="auto">
						<SeeAnswersButton label={<Trans>Afficher le détail</Trans>} />
						<Spacing sm />
					</Grid>
				)}
			</Grid>
		</StyledCompanyContainer>
	)
}

const StyledCompanyContainer = styled(Message).attrs({ border: false })``

const StyledH4 = styled(H4)`
	& span {
		color: ${({ theme }) => theme.colors.bases.primary[700]};
	}
`
