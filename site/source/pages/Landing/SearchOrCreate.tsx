import { resetCompany } from '@/actions/companyActions'
import { useSetEntreprise } from '@/actions/companyStatusActions'
import { FabriqueSocialEntreprise } from '@/api/fabrique-social'
import { CompanyDetails } from '@/components/company/Details'
import { CompanySearchField } from '@/components/company/SearchField'
import Value from '@/components/EngineValue'
import Emoji from '@/components/utils/Emoji'
import { useEngine } from '@/components/utils/EngineContext'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Message } from '@/design-system'
import AnswerGroup from '@/design-system/answer-group'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { H3, H4 } from '@/design-system/typography/heading'
import { RootState } from '@/reducers/rootReducer'
import { Grid } from '@mui/material'
import { useCallback, useContext } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

export default function SearchOrCreate() {
	const sitePaths = useContext(SitePathsContext)
	const statutChoisi = useSelector(
		(state: RootState) => state.choixStatutJuridique.companyStatusChoice
	)
	const companySIREN = useEngine().evaluate('entreprise . SIREN').nodeValue
	const handleCompanySubmit = useHandleCompanySubmit()
	const dispatch = useDispatch()

	return (
		<Grid container spacing={3}>
			<Grid item xl={8} lg={10} md={12}>
				{companySIREN ? (
					<>
						<H3 as="h2">Votre entreprise</H3>
						<CompanyDetails />
						<Spacing md />
						<AnswerGroup>
							<Button to={sitePaths.gérer.index}>
								Continuer avec cette entreprise
							</Button>
							<Button light onPress={() => dispatch(resetCompany())}>
								Supprimer ma situation
							</Button>
						</AnswerGroup>
					</>
				) : (
					<>
						<H3 as="h2">
							<Trans>Rechercher votre entreprise</Trans>{' '}
						</H3>
						<CompanySearchField onSubmit={handleCompanySubmit} />
						<Spacing md />

						<Button
							size="XL"
							to={
								statutChoisi
									? sitePaths.créer[statutChoisi]
									: sitePaths.créer.index
							}
						>
							<Emoji emoji="💡" />{' '}
							<Trans i18nKey="landing.choice.create.title">
								Je n'ai pas encore d'entreprise
							</Trans>
						</Button>
					</>
				)}
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
