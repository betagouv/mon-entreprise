import { Grid } from '@mui/material'
import { ThemeColorsProvider } from '@/components/utils/colors'
import { IsEmbeddedProvider } from '@/components/utils/embeddedContext'
import Emoji from '@/components/utils/Emoji'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Article } from '@/design-system/card'
import { Item, Select } from '@/design-system/field/Select'
import { Spacing } from '@/design-system/layout'
import PopoverWithTrigger from '@/design-system/PopoverWithTrigger'
import { H1, H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import urssafLogo from '@/images/Urssaf.svg'
import { lazy, Suspense, useContext, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Route } from 'react-router'
import { MemoryRouter, useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { TrackPage } from '../../ATInternetTracking'
import { hexToHSL } from '../../hexToHSL'
import Créer from '../Creer'
import Documentation from '../Documentation'
import Iframes from '../Iframes'
import Simulateurs from '../Simulateurs'
import useSimulatorsData, { SimulatorData } from '../Simulateurs/metadata'
import './iframe.css'
import apecLogo from './images/apec.png'
import cciLogo from './images/cci.png'
import minTraLogo from './images/min-tra.jpg'
import poleEmploiLogo from './images/pole-emploi.png'

const LazyColorPicker = lazy(() => import('../Dev/ColorPicker'))

const checkIframe = (obj: SimulatorData[keyof SimulatorData]) =>
	'iframePath' in obj && obj.iframePath && !('private' in obj && obj.private)

const getFromSimu = <S extends SimulatorData, T extends string>(
	obj: S,
	key: T
) =>
	key in obj &&
	obj[key as keyof SimulatorData] &&
	checkIframe(obj[key as keyof SimulatorData])
		? obj[key as keyof SimulatorData]
		: undefined

function IntegrationCustomizer() {
	const { search } = useLocation()
	const simulatorsData = useSimulatorsData()
	const sitePaths = useContext(SitePathsContext)
	const history = useHistory()

	const defaultModuleFromUrl =
		new URLSearchParams(search ?? '').get('module') ?? ''

	const [currentModule, setCurrentModule] = useState(
		getFromSimu(simulatorsData, defaultModuleFromUrl)
			? defaultModuleFromUrl
			: 'salarié'
	)

	useEffect(() => {
		history.replace({ search: `?module=${currentModule}` })
	}, [currentModule, history])

	const [color, setColor] = useState<string | undefined>()

	const currentSimulator = getFromSimu(simulatorsData, currentModule)

	const currentIframePath =
		(currentSimulator &&
			'iframePath' in currentSimulator &&
			currentSimulator.iframePath) ||
		''

	return (
		<>
			<H2>
				<Trans>Personnalisez l'intégration</Trans>
			</H2>

			<Grid container spacing={3}>
				<Grid item lg={4}>
					<H3>
						<Trans i18nKey="pages.développeurs.module">Quel module ?</Trans>
					</H3>
					<Select
						label="Assistant ou simulateur"
						onSelectionChange={(val) => setCurrentModule(String(val))}
						selectedKey={currentModule}
					>
						{Object.entries(simulatorsData)
							.map(
								([module, s]) =>
									getFromSimu(simulatorsData, module) && (
										<Item
											key={module}
											textValue={s.shortName ?? ('title' in s ? s.title : '')}
										>
											{s.icône && (
												<>
													<Emoji emoji={s.icône} />
													&nbsp;
												</>
											)}
											{s.shortName ?? ('title' in s ? s.title : '')}
										</Item>
									)
							)
							.filter(((el) => Boolean(el)) as <T>(x: T | undefined) => x is T)}
					</Select>

					<H3>
						<Trans i18nKey="pages.développeurs.couleur">
							Quelle couleur ?{' '}
						</Trans>
						<Emoji emoji="🎨" />
					</H3>
					<Suspense fallback={<div>Chargement...</div>}>
						<LazyColorPicker color={color} onChange={setColor} />
					</Suspense>
					<H3>
						<Trans i18nKey="pages.développeurs.code.titre">
							Code d'intégration
						</Trans>
						<Emoji emoji="🛠" />
					</H3>
					<Body>
						<Trans i18nKey="pages.développeurs.code.description">
							Voici le code à copier-coller sur votre site&nbsp;:
						</Trans>
					</Body>
					<IntegrationCode color={color} module={currentIframePath} />
				</Grid>
				<Grid item lg={8}>
					<H3>
						<Trans>Prévisualisation</Trans>
					</H3>
					<PrevisualisationContainer columns={10}>
						<MemoryRouter
							key={currentModule}
							initialEntries={[`/iframes/${currentIframePath}`]}
						>
							<ThemeColorsProvider
								color={color == null ? color : hexToHSL(color)}
							>
								<IsEmbeddedProvider isEmbeded>
									<Route
										path={sitePaths.simulateurs.index}
										component={Simulateurs}
									/>
									<Route path={sitePaths.créer.index} component={Créer} />
									<Route
										path={sitePaths.documentation.index}
										component={Documentation}
									/>
									<Iframes />
								</IsEmbeddedProvider>
							</ThemeColorsProvider>
						</MemoryRouter>
					</PrevisualisationContainer>
				</Grid>
			</Grid>
		</>
	)
}

const PrevisualisationContainer = styled(Grid)`
	background-color: white;
	border: 1px solid ${({ theme }) => theme.colors.extended.grey[300]};
	box-shadow: ${({ theme }) => theme.elevations[2]};
	border-radius: 0.3rem;
	padding: 1rem;
`

const Logo = styled.img`
	max-width: 100%;
	max-height: 3rem;
`

export default function Integration() {
	return (
		<>
			<TrackPage name="module_web" />
			<Trans i18nKey="pages.développeurs.iframe.intro">
				<div>
					<H1>Intégrez le module Web</H1>
					<Body>
						Nos simulateurs sont intégrables de manière transparente en ajoutant
						une simple ligne de code à votre page Web.
					</Body>
					<Body>
						Vous pouvez choisir le simulateur à intégrer et{' '}
						<strong>personnaliser la couleur principale du module</strong> pour
						le fondre dans le thème visuel de votre page.
					</Body>
					<Body>
						L'attribut <i>data-lang="en"</i> vous permet quant à lui de choisir
						l'anglais comme langue du simulateur.
					</Body>
				</div>
				<IntegrationCustomizer />
				<Spacing lg />
				<Body>
					À noter que si votre site utilise une politique de sécurité de contenu
					via l'en-tête de réponse HTTP <i>Content-Security-Policy</i>, une
					erreur bénigne peut apparaître dans la console. <EnSavoirPlusCSP />
				</Body>
			</Trans>
			<section className="blocks" id="integrations">
				<H2>
					<Trans>Liste des intégrations</Trans>
				</H2>
				<Grid container id="integrationList" spacing={2}>
					<Grid item xs={12} md={6} xl={4}>
						<Article
							title="Urssaf"
							href="https://www.urssaf.fr/portail/home/utile-et-pratique/estimateur-de-cotisations-2019.html?ut=estimateurs"
							ctaLabel="Voir l'intégration"
						>
							<Logo src={urssafLogo} alt="urssaf.fr" />
						</Article>
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<Article
							title="CCI de France"
							href="http://les-aides.fr/embauche"
							ctaLabel="Voir l'intégration"
						>
							<Logo src={cciLogo} alt="Les-aides.fr" />
						</Article>
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<Article
							title="APEC"
							href="https://recruteurs.apec.fr/Recrutement/Pratique-RH/Tous-les-dossiers-Recrutement/Diagnostiquer/Vous-envisagez-de-recruter-calculez-le-cout-de-cette-embauche"
							ctaLabel="Voir le simulateur"
						>
							<Logo src={apecLogo} alt="Agence pour l'emploi des cadres" />
						</Article>
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<Article
							title="Code du travail numérique"
							href="https://code.travail.gouv.fr/outils/simulateur-embauche"
							ctaLabel="Voir le simulateur"
						>
							<Logo src={minTraLogo} alt="Ministère du travail" />
						</Article>
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<Article
							title="Pôle Emploi"
							href="https://entreprise.pole-emploi.fr/cout-salarie/"
							ctaLabel="Voir le simulateur"
						>
							<Logo src={poleEmploiLogo} alt="Pôle Emploi" />
						</Article>
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<Article
							title="Une idée&nbsp;?"
							href="mailto:contact@mon-entreprise.beta.gouv.fr?subject=Proposition de réutilisation"
							ctaLabel="Contactez-nous"
						>
							Vous avez un projet ou une idée à nous partager?
						</Article>
					</Grid>
				</Grid>
			</section>
		</>
	)
}

function EnSavoirPlusCSP() {
	const { t } = useTranslation()
	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<Link {...buttonProps}>
					<Trans>En savoir plus</Trans>
				</Link>
			)}
			title={t(
				'pages.développeurs.iframe.csp-title',
				'Intégration iframe et politique de sécurité de contenu'
			)}
		>
			<Trans i18nKey="pages.développeurs.iframe.csp-1">
				<Body>
					L'erreur ci-dessous qui s'affiche dans la console est liée à la
					communication entre la page parente et l'iframe pour le
					redimensionnement automatique au contenu affiché.
				</Body>
			</Trans>
			<blockquote>
				Failed to execute 'postMessage' on 'DOMWindow': The target origin
				provided ('https://mon-entreprise.urssaf.fr') does not match the
				recipient window's origin
			</blockquote>
			<Body>
				<Trans i18nKey="pages.développeurs.iframe.csp-2">
					Vous pouvez la corriger avec la politique suivante :
				</Trans>
			</Body>
			<code>
				script-src 'self' 'unsafe-inline' https://mon-entreprise.urssaf.fr;
				<br />
				img-src 'self' https://mon-entreprise.urssaf.fr;
			</code>
		</PopoverWithTrigger>
	)
}

type IntegrationCodeProps = {
	module?: string
	color?: string
}

function IntegrationCode({
	module = 'simulateur-embauche',
	color,
}: IntegrationCodeProps) {
	const codeRef = useRef<HTMLDivElement>(null)
	const [secondClick, setSecondClick] = useState(false)
	const selectAllCode = () => {
		if (codeRef.current && !secondClick) {
			const range = document.createRange()
			range.selectNode(codeRef.current)
			window.getSelection()?.removeAllRanges()
			window.getSelection()?.addRange(range)
			setSecondClick(true)
		}
		if (secondClick) {
			setSecondClick(false)
		}
	}
	return (
		<code
			ref={codeRef}
			onClick={selectAllCode}
			css={`
				display: block;
				font-size: 80%;
				padding: 1em;
				background: #f8f8f8;
				margin: auto;
				margin-bottom: 1em;
				overflow: auto;
				line-height: 1.6em;
				box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05),
					-1px 1px 1px rgba(0, 0, 0, 0.02);

				em {
					font-weight: 300;
					color: black;
				}
			`}
		>
			<span>{'<'}</span>
			<em>script</em>
			<br />
			<em>data-module</em>="
			<span>{module}</span>"
			{color ? (
				<>
					<br />
					<em>data-couleur</em>="
					<span id="scriptColor">{color}</span>"
				</>
			) : (
				''
			)}
			<br />
			<em>src</em>
			="https://mon-entreprise.urssaf.fr/simulateur-iframe-integration.js"{'>'}
			<span>{'<'}</span>
			<span>/</span>
			<em>script</em>
			<span>{'>'}</span>
		</code>
	)
}
