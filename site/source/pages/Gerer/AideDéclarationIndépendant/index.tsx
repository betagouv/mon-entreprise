import { resetCompany } from '@/actions/companyActions'
import { useSetEntreprise } from '@/actions/companyStatusActions'
import { CompanyDetails } from '@/components/company/Details'
import { CompanySearchField } from '@/components/company/SearchField'
import {
	Condition,
	WhenAlreadyDefined,
	WhenNotAlreadyDefined,
} from '@/components/EngineValue'
import PageHeader from '@/components/PageHeader'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { Grid } from '@mui/material'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import illustration from './undraw_fill_in_mie5.svg'

export default function AideDéclarationIndépendant() {
	const setEntreprise = useSetEntreprise()
	const sitePaths = useContext(SitePathsContext)
	const dispatch = useDispatch()
	return (
		<>
			<Trans i18nKey="assistant-DRI.description">
				<PageHeader picture={illustration}>
					<Intro>
						Cet outil vous aidera à remplir votre{' '}
						<Strong>déclaration de revenu</Strong> sur impot.gouv.fr. Vous aurez
						à la fin :
					</Intro>
					<Ul size="XL">
						<Li>
							La liste des cases qui vous concernent avec le montant à remplir
						</Li>
						<Li>
							Une estimation des cotisations sociales à payer à l'Urssaf en 2022
						</Li>
					</Ul>
				</PageHeader>
				<H2>Mon entreprise</H2>
			</Trans>
			<Grid container>
				<Grid item lg={8}>
					<WhenNotAlreadyDefined dottedName="entreprise . SIREN">
						<Body>
							Cherchez avec votre nom, le nom de votre entreprise, le SIREN ou
							le SIRET
						</Body>
						<CompanySearchField onSubmit={setEntreprise} />
					</WhenNotAlreadyDefined>
					<WhenAlreadyDefined dottedName="entreprise . SIREN">
						<CompanyDetails />
						<Button onPress={() => dispatch(resetCompany())}>
							<Trans>Modifier</Trans>
						</Button>
					</WhenAlreadyDefined>
				</Grid>
			</Grid>
			<Condition expression="entreprise . catégorie juridique . SAS">
				<Spacing md />
				<Message type="info">
					<H3>Cet assistant ne gère pas le cas des dirigeants de SAS(U)</H3>
					<Body>
						Nous sommes désolés. Si vous rencontrez des difficultés à remplir
						votre déclaration, rapprochez-vous de votre comptable. Si vous êtes
						sans comptable, vous pouvez contacter le service des impôts.
					</Body>
					<Body>
						Si vous souhaitez que cet assistant à la déclaration gère votre cas
						dans le futur, laissez-nous message en cliquant sur le bouton "Faire
						une suggestion" en bas de la page.
					</Body>
					<Body>
						Ce site propose d'autres outils qui pourraient vous intéresser (par
						exemple un simulateur de revenu net après impôt).
					</Body>
					<Link to={sitePaths.gérer.index}>
						Découvrir les outils pour mon entreprise
					</Link>
					<Spacing md />
				</Message>
			</Condition>
		</>
	)
}
