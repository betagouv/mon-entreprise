import { Trans } from 'react-i18next'
import styled from 'styled-components'

import Value from '@/components/EngineValue'
import { CardContainer } from '@/design-system/card/Card'
import { EditIcon } from '@/design-system/icons'
import { Grid } from '@/design-system/layout'
import { StyledLink } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { useGetFullURL } from '@/hooks/useGetFullURL'

const RevenuEstimé = () => {
	const fullURL = useGetFullURL()

	return (
		<CardContainer
			css={`
				padding: 1.5rem !important;
			`}
			$inert
		>
			<Grid container>
				<Grid item xs={12} lg={3}>
					<Label>
						<Trans>Votre chiffre d'affaires estimé</Trans>
					</Label>
					<StyledValue
						linkToRule={false}
						expression="entreprise . chiffre d'affaires"
					/>
				</Grid>

				<StyledGrid item xs={12} lg={5}>
					<Label>
						<Trans>Vos charges estimées</Trans>
					</Label>
					<StyledValue linkToRule={false} expression="entreprise . charges" />
				</StyledGrid>
				<Grid
					item
					css={`
						justify-content: flex-end;
						align-items: center;
						display: flex;
					`}
					xs={12}
					lg={3}
				>
					<StyledLink
						href={`${fullURL}#simulation-comparateur`}
						$noUnderline
						css={`
							display: inline-flex;
							align-items: center;
						`}
					>
						<StyledEditIcon /> Modifier les informations
					</StyledLink>
				</Grid>
			</Grid>
		</CardContainer>
	)
}

const Label = styled(Body)`
	margin: 0;
	color: ${({ theme }) => theme.colors.extended.grey[600]}!important;
	font-size: 0.875rem;
`

const StyledValue = styled(Value)`
	margin: 0;
	color: ${({ theme }) => theme.colors.bases.primary[700]}!important;
	font-size: 1.25rem;
	font-weight: 700;
	font-family: ${({ theme }) => theme.fonts.main};
`

const StyledGrid = styled(Grid)`
	border-left: 1px solid ${({ theme }) => theme.colors.extended.grey[400]};
	margin-left: 1.5rem;
	padding-left: 1.5rem;
`

const StyledEditIcon = styled(EditIcon)`
	margin-right: ${({ theme }) => theme.spacings.xxs};
`

export default RevenuEstimé
