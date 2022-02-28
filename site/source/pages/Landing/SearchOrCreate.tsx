import { Grid } from '@mui/material'
import { useSetEntreprise } from '@/actions/companyStatusActions'
import { FabriqueSocialEntreprise } from '@/api/fabrique-social'
import { CompanySearchField } from '@/components/CompanySearchField'
import Emoji from '@/components/utils/Emoji'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Button } from '@/design-system/buttons'
import { H3 } from '@/design-system/typography/heading'
import { useCallback, useContext } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { RootState } from '@/reducers/rootReducer'
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
				<CompanySearchField onSubmit={handleCompanySubmit} />
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
