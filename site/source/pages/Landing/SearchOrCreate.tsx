import { Grid } from '@mui/material'
import { useSetEntreprise } from 'Actions/companyStatusActions'
import { Etablissement } from 'api/sirene'
import { CompanySearchField } from 'Components/CompanySearchField'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import { H3 } from 'DesignSystem/typography/heading'
import { GenericButtonOrLinkProps } from 'DesignSystem/typography/link'
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
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<H3 as="h2">
					<Trans>Rechercher une entreprise</Trans>{' '}
					<span>
						ou{' '}
						<CreateCompanyButton
							size="XS"
							light
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
						</CreateCompanyButton>
					</span>
				</H3>
			</Grid>
			<Grid item xs={12}>
				<CompanySearchField autoFocus onSubmit={handleCompanySubmit} />
			</Grid>
		</Grid>
	)
}

const CreateCompanyButton = styled(Button)<GenericButtonOrLinkProps>`
	margin-left: 0.25rem;
	white-space: nowrap;
	margin-top: 0.5rem;
	display: inline-block;
	width: auto;
`

function useHandleCompanySubmit() {
	const history = useHistory()
	const sitePaths = useContext(SitePathsContext)
	const setEntreprise = useSetEntreprise()
	const handleCompanySubmit = useCallback(
		(établissement: Etablissement) => {
			setEntreprise(établissement.siren).then(() => {
				history.push(sitePaths.gérer.index)
			})
		},
		[history, setEntreprise, sitePaths]
	)
	return handleCompanySubmit
}
