import { Grid } from '@mui/material'
import { useSetEntreprise } from 'Actions/companyStatusActions'
import { FabriqueSocialEntreprise } from 'API/fabrique-social'
import { CompanySearchField } from 'Components/CompanySearchField'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import { H3 } from 'DesignSystem/typography/heading'
import { useCallback, useContext } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import styled from 'styled-components'

export default function SearchOrCreate() {
	const sitePaths = useContext(SitePathsContext)
	const statutChoisi = useSelector(
		(state: RootState) => state.inFranceApp.companyStatusChoice
	)
	const handleCompanySubmit = useHandleCompanySubmit()

	return (
		<Grid container spacing={3}>
			<Grid item lg={8} md={12}>
				<H3 as="h2">
					<Trans>Rechercher une entreprise</Trans>{' '}
				</H3>
				<CompanySearchField autoFocus onSubmit={handleCompanySubmit} />
			</Grid>
			<Grid item lg md={12}>
				<ButtonContainer>
					<Button
						size="XL"
						to={
							statutChoisi
								? sitePaths.créer[statutChoisi]
								: sitePaths.créer.index
						}
					>
						<Trans i18nKey="landing.choice.create.title">
							Créer une entreprise
						</Trans>{' '}
						<Emoji emoji="💡" />
					</Button>
				</ButtonContainer>
			</Grid>
		</Grid>
	)
}

function useHandleCompanySubmit() {
	const history = useHistory()
	const sitePaths = useContext(SitePathsContext)
	const setEntreprise = useSetEntreprise()
	const handleCompanySubmit = useCallback(
		(établissement: FabriqueSocialEntreprise) => {
			setEntreprise(établissement)
			history.push(sitePaths.gérer.index)
		},
		[history, setEntreprise, sitePaths]
	)
	return handleCompanySubmit
}

const ButtonContainer = styled.h2`
	text-align: center;
	margin: 0;
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		position: relative;
		top: 4.25rem;
	}
`
