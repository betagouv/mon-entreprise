import { DottedName } from '@/../../modele-social'
import { resetCompany } from '@/actions/companyActions'
import { useSetEntreprise } from '@/hooks/useSetEntreprise'
import { CompanyDetails } from '@/components/company/Details'
import { CompanySearchField } from '@/components/company/SearchField'
import {
	WhenAlreadyDefined,
	WhenApplicable,
	WhenNotAlreadyDefined,
} from '@/components/EngineValue'
import { FromBottom, FromTop } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body, Intro, SmallBody } from '@/design-system/typography/paragraphs'
import { Grid } from '@mui/material'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { SimpleField } from '../_components/Fields'
import { useProgress } from './_components/hooks'
import notHandled from './_components/undraw_access_denied_re_awnf.svg'

export const OBJECTIFS: DottedName[] = [
	'entreprise . SIREN',
	'entreprise . catégorie juridique . EI . auto-entrepreneur',
	'entreprise . catégorie juridique . SARL . unipersonnelle',
]

export default function Accueil() {
	const setEntreprise = useSetEntreprise()
	const sitePaths = useContext(SitePathsContext)
	const dispatch = useDispatch()
	const engine = useEngine()
	const progress = useProgress(OBJECTIFS)
	const showGoToNextStep =
		progress === 1 && engine.evaluate('DRI . cas exclus').nodeValue === null

	return (
		<>
			<Grid container>
				<Grid item lg={10} xl={8}>
					<Intro>
						La première étape est de <Strong>trouver votre entreprise</Strong>.
						Nous utiliserons les informations disponibles ouvertement sur
						l'INSEE pour mieux vous guider par la suite.
					</Intro>

					<WhenNotAlreadyDefined dottedName="entreprise . SIREN">
						<Body>
							Vous pouvez rechercher avec votre nom, le nom de votre entreprise,
							le SIREN ou le SIRET
						</Body>
						<CompanySearchField onSubmit={setEntreprise} />
					</WhenNotAlreadyDefined>
					<WhenAlreadyDefined dottedName="entreprise . SIREN">
						<FromBottom>
							<CompanyDetails />
						</FromBottom>

						<Button size="XS" light onPress={() => dispatch(resetCompany())}>
							<Trans>Modifier l'entreprise</Trans>
						</Button>
					</WhenAlreadyDefined>

					<SimpleField dottedName="entreprise . catégorie juridique . EI . auto-entrepreneur" />
					<SimpleField dottedName="entreprise . catégorie juridique . SARL . unipersonnelle" />

					<Spacing xxl />
				</Grid>
			</Grid>
			<Grid container>
				<Grid item lg={10} xl={8}>
					<WhenApplicable dottedName="DRI . cas exclus">
						<FromTop>
							<Message type="info">
								<Grid
									container
									justifyContent="center"
									spacing={3}
									alignItems="center"
								>
									<Grid
										item
										xs={6}
										md={3}
										sx={{ order: { md: 0, xs: 1, sm: 1 } }}
									>
										<img
											src={notHandled}
											alt=""
											css={`
												width: 100%;
												padding: 1rem;
											`}
										/>
									</Grid>
									<Grid item md={9}>
										<Markdown>
											{engine.evaluate('DRI . cas exclus').nodeValue as string}
										</Markdown>
									</Grid>
									<Grid item lg={2} />
									<Grid item md="auto">
										<Button color="tertiary" to={sitePaths.gérer.index}>
											Découvrir les simulateur et assistant pour mon entreprise
										</Button>
									</Grid>
									<Grid item>
										<SmallBody>
											Si vous souhaitez que cet assistant à la déclaration gère
											votre cas dans le futur, laissez-nous message en cliquant
											sur le bouton "Faire une suggestion" en bas de la page.
										</SmallBody>
									</Grid>
								</Grid>
							</Message>
						</FromTop>
					</WhenApplicable>
					{showGoToNextStep && (
						<FromTop>
							<Message border={false}>
								<Trans i18nKey="assistant-DRI.precision">
									<H3>Quelques précisions avant de continuer</H3>
									<Body>
										Pour faire votre déclaration de revenu, il faudra vous
										connecter sur{' '}
										<Link href="https://www.impots.gouv.fr/accueil">
											impot.gouv.fr
										</Link>{' '}
										à partir du <Strong>8 avril 2022</Strong>.
									</Body>
									<Body>
										Si vous faites remplir votre déclaration de revenu par votre
										expert-comptable, cet assistant peut quand même vous être
										utile pour connaître le{' '}
										<Strong>
											montant des cotisations sociales à payer en 2022
										</Strong>
									</Body>
								</Trans>
								<div
									css={`
										text-align: center;
									`}
								>
									<Spacing lg />
									<Button
										size="XL"
										to={sitePaths.gérer.déclarationIndépendant.imposition}
									>
										Continuer avec cette entreprise
									</Button>
									<Spacing lg />
								</div>
							</Message>
						</FromTop>
					)}
				</Grid>
			</Grid>
		</>
	)
}
