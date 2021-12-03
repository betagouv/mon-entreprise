import { useSetEntreprise } from 'Actions/companyStatusActions'
import { Etablissement } from 'api/sirene'
import { CompanySearchField } from 'Components/CompanySearchField'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import { GenericButtonOrLinkProps } from 'DesignSystem/buttons/Button'
import { Spacing } from 'DesignSystem/layout'
import { H4 } from 'DesignSystem/typography/heading'
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
		<div
			css={`
				display: flex;
				flex-wrap: wrap;
				gap: 0.6rem;
				align-items: end;
				padding-bottom: 1rem;
				justify-content: end;
			`}
		>
			<div
				css={`
					min-width: min(20rem, 100%);
					flex: 1.2;
					z-index: 1;
					position: relative;
				`}
			>
				<H4>
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
							<span>
								<Trans i18nKey="landing.choice.create.title">
									Créer une entreprise
								</Trans>
							</span>{' '}
							<Emoji emoji="💡" />
						</CreateCompanyButton>
					</span>
				</H4>
				<Spacing xs />
				<CompanySearchField onSubmit={handleCompanySubmit} />
			</div>
		</div>
	)
}

const CreateCompanyButton = styled(Button)<GenericButtonOrLinkProps>`
	margin-left: 0.25rem;
`

function useHandleCompanySubmit() {
	const history = useHistory()
	const sitePaths = useContext(SitePathsContext)
	const setEntreprise = useSetEntreprise()
	const handleCompanySubmit = useCallback(
		(établissement: Etablissement) => {
			setEntreprise(établissement.siren)
			history.push(sitePaths.gérer.index)
		},
		[history, setEntreprise, sitePaths]
	)
	return handleCompanySubmit
}
