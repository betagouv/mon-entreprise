import { DottedName } from '@/../../modele-social'
import { resetSimulation } from '@/actions/actions'
import { resetCompany } from '@/actions/companyActions'
import { TrackPage } from '@/ATInternetTracking'
import { CompanyDetails } from '@/components/company/Details'
import { CompanySearchField } from '@/components/company/SearchField'
import {
	WhenAlreadyDefined,
	WhenApplicable,
	WhenNotAlreadyDefined,
} from '@/components/EngineValue'
import PageHeader from '@/components/PageHeader'
import { FromTop } from '@/components/ui/animate'
import Warning from '@/components/ui/WarningBlock'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Grid, Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useSetEntreprise } from '@/hooks/useSetEntreprise'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { SimpleField } from '../_components/Fields'
import Exceptions from './_components/Exceptions'
import { useProgress } from './_components/hooks'
import NotHandledCase from './_components/NotHandledCase'
import illustration from './_components/undraw_fill_in_mie5.svg'

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
		<TrackPage name="entreprise">
			<Trans i18nKey="assistant-DRI.intro">
				<PageHeader picture={illustration}>
					<Intro>
						Nous vous proposons une aide pour remplir les revenus issus de votre
						activité professionnelle dans votre{' '}
						<Strong>déclaration des revenu de 2021</Strong> sur{' '}
						<Link href="https://www.impots.gouv.fr/accueil">impot.gouv.fr</Link>
						.<br />
					</Intro>
					<Body>Répondez à ces quelques questions, à la fin vous aurez :</Body>
					<Ul>
						<Li>Les formulaires qui vous concernent</Li>
						<Li>
							La liste des cases qui vous concernent avec le montant à remplir
						</Li>
						<Li>
							Une estimation des cotisations sociales à payer à l'Urssaf en 2022
						</Li>
					</Ul>
				</PageHeader>
			</Trans>
			<Grid container>
				<Grid item lg={10} xl={8}>
					<Warning localStorageKey="DRI">
						<Ul>
							<Li>
								Cet assistant est proposé à titre indicatif. Vous restez
								entièrement responsable d'éventuels oublis ou inexactitudes dans
								votre déclaration. En cas de doutes, rapprochez-vous de votre
								expert-comptable.
							</Li>
							<Li>
								Cet assistant ne prend pas en compte tous les types
								d'entreprises ni tous les dispositifs fiscaux applicables.{' '}
								<Exceptions />
							</Li>
							<Li>
								Le calcul des cotisations est une estimation : seuls les montant
								effectivement appelés par l'Urssaf seront valides en fin de
								compte.
							</Li>
						</Ul>
					</Warning>
					<WhenNotAlreadyDefined dottedName="entreprise . SIREN">
						<Message border={false} icon>
							<Body>
								Vous pouvez rechercher votre entreprise avec{' '}
								<Strong>votre prénom et votre nom</Strong>, le{' '}
								<Strong>nom de votre entreprise</Strong>, le SIREN ou le SIRET
							</Body>
						</Message>
						<CompanySearchField onSubmit={setEntreprise} />
					</WhenNotAlreadyDefined>
					<WhenAlreadyDefined dottedName="entreprise . SIREN">
						<CompanyDetails />

						<Button
							size="XS"
							light
							onPress={() => {
								dispatch(resetSimulation())
								dispatch(resetCompany())
							}}
						>
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
							<NotHandledCase>
								<Markdown>
									{engine.evaluate('DRI . cas exclus').nodeValue as string}
								</Markdown>
							</NotHandledCase>
						</FromTop>
					</WhenApplicable>
					{showGoToNextStep && (
						<FromTop>
							<Message>
								<Trans i18nKey="assistant-DRI.precision">
									<H3>Quelques précisions avant de continuer</H3>
									<Ul>
										<Li>
											Si c'est votre expert-comptable qui remplit votre
											déclaration, cet assistant peut quand même vous être utile
											pour connaître le{' '}
											<Strong>
												montant des cotisations sociales à payer en 2022
											</Strong>
										</Li>
										<Li>
											Cet outil est <Strong>100 % confidentiel</Strong> : toutes
											les informations que vous renseignez resteront dans votre
											navigateur.
										</Li>
										<Li>
											Pour faire votre déclaration de revenu, il faudra vous
											connecter sur{' '}
											<Link href="https://www.impots.gouv.fr/accueil">
												impot.gouv.fr
											</Link>
											.
										</Li>
									</Ul>
								</Trans>
								<div
									css={`
										text-align: center;
									`}
								>
									<Spacing lg />
									<Button
										size="XL"
										to={sitePaths.gérer.déclarationIndépendant.beta.imposition}
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
		</TrackPage>
	)
}
