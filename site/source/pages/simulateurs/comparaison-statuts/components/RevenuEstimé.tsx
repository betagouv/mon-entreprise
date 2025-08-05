import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import Value from '@/components/EngineValue/Value'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import { WhenNotAlreadyDefined } from '@/components/EngineValue/WhenNotAlreadyDefined'
import {
	Body,
	CardContainer,
	EditIcon,
	Grid,
	Li,
	Link,
	Ul,
} from '@/design-system'
import { useSitePaths } from '@/sitePaths'

const RevenuEstimé = () => {
	const { absoluteSitePaths } = useSitePaths()

	return (
		<CardContainer
			style={{
				padding: '1.5rem !important',
			}}
			$inert
		>
			<Grid container>
				<WhenAlreadyDefined dottedName="entreprise . chiffre d'affaires">
					<Grid item xs={12} sm={6} lg={9}>
						<Grid container as={Ul}>
							<GridLi
								style={{
									paddingRight: '1.5rem',
								}}
								item
								xs={12}
								sm={6}
								lg={4}
								as={Li}
							>
								<Label>
									<Trans>Votre chiffre d'affaires estimé</Trans>
								</Label>
								<StyledValue
									linkToRule={false}
									expression="entreprise . chiffre d'affaires"
								/>
							</GridLi>
							<StyledGrid item xs={12} sm={6} lg={6} as={Li}>
								<Label>
									<Trans>Vos charges estimées</Trans>
								</Label>
								<StyledValue
									linkToRule={false}
									unit="€/an"
									expression="entreprise . charges"
								/>
							</StyledGrid>
						</Grid>
					</Grid>
				</WhenAlreadyDefined>

				<WhenNotAlreadyDefined dottedName="entreprise . chiffre d'affaires">
					<Grid item xs>
						<Label>
							<Trans>Votre rémunération totale estimée</Trans>
						</Label>
						<StyledValue
							linkToRule={false}
							expression="dirigeant . rémunération . totale"
						/>
					</Grid>
				</WhenNotAlreadyDefined>

				<GridEditLink item xs={12} sm="auto">
					<Link
						to={absoluteSitePaths.assistants['choix-du-statut'].rémunération}
						// $noUnderline
						style={{
							display: 'inline-flex',
							alignItems: 'center',
						}}
					>
						<StyledEditIcon /> Modifier les informations
					</Link>
				</GridEditLink>
			</Grid>
		</CardContainer>
	)
}

const Label = styled(Body)`
	margin: 0;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[200]
			: theme.colors.extended.grey[700]}!important;
	font-size: 0.875rem;
`

const StyledValue = styled(Value)`
	margin: 0;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]}!important;
	font-size: 1.25rem;
	font-weight: 700;
	font-family: ${({ theme }) => theme.fonts.main};
`

const StyledGrid = styled(Grid)`
	border-left: 1px solid ${({ theme }) => theme.colors.extended.grey[400]};
	padding-left: 1.5rem;

	&::before {
		content: none !important;
	}

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		border-left: none;
		padding-left: 0;
		margin-top: ${({ theme }) => theme.spacings.md};
	}
`
const GridLi = styled(Grid)`
	&::before {
		content: none !important;
	}
`

const StyledEditIcon = styled(EditIcon)`
	margin-right: ${({ theme }) => theme.spacings.xxs};
	fill: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]}!important;
`

const GridEditLink = styled(Grid)`
	justify-content: flex-end;
	align-items: center;
	display: flex;
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		padding-top: ${({ theme }) => theme.spacings.lg};
		justify-content: center;
	}
`

export default RevenuEstimé
