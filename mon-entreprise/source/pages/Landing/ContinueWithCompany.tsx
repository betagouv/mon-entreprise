import CompanyDetails from 'Components/CompanyDetails'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Card } from 'DesignSystem/card'
import { H3 } from 'DesignSystem/typography/heading'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Company } from 'reducers/inFranceAppReducer'

type ContinueWithCompanyProps = {
	company: Company
}

export const ContinueWithCompany = ({ company }: ContinueWithCompanyProps) => {
	const sitePaths = useContext(SitePathsContext)

	return (
		<>
			<H3>
				<Trans i18nKey="landing.choice.continue">
					Continuer avec l'entreprise
				</Trans>
			</H3>
			<Card compact to={sitePaths.gérer.index} id="currently-selected-company">
				<CompanyDetails {...company} />
			</Card>
		</>
	)
}
