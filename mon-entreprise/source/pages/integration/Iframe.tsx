import {
	ThemeColorsContext,
	ThemeColorsProvider,
} from 'Components/utils/colors'
import Emoji from 'Components/utils/Emoji'
import { ScrollToTop } from 'Components/utils/Scroll'
import PopoverWithTrigger from 'DesignSystem/PopoverWithTrigger'
import { H1, H2, H3 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { Body } from 'DesignSystem/typography/paragraphs'
import urssafLogo from 'Images/Urssaf.svg'
import React, {
	Suspense,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { MemoryRouter, useHistory, useLocation } from 'react-router-dom'
import { TrackPage } from '../../ATInternetTracking'
import Iframes from '../Iframes'
import useSimulatorsData from '../Simulateurs/metadata'
import './iframe.css'
import apecLogo from './images/apec.png'
import cciLogo from './images/cci.png'
import minTraLogo from './images/min-tra.jpg'
import poleEmploiLogo from './images/pole-emploi.png'

const LazyColorPicker = React.lazy(() => import('../Dev/ColorPicker'))

function IntegrationCustomizer() {
	const { search } = useLocation()
	const simulators = useSimulatorsData()
	const history = useHistory()
	const integrableModuleNames = useMemo(
		() =>
			Object.values(simulators)
				.filter((s) => s.iframePath && !s.private)
				.map((s) => s.iframePath),
		[simulators]
	)
	const defaultModuleFromUrl =
		new URLSearchParams(search ?? '').get('module') ?? ''
	const [currentModule, setCurrentModule] = React.useState(
		integrableModuleNames.includes(defaultModuleFromUrl)
			? defaultModuleFromUrl
			: integrableModuleNames[0]
	)

	useEffect(() => {
		history.replace({ search: `?module=${currentModule}` })
	}, [currentModule])

	const { color: defaultColor } = useContext(ThemeColorsContext)
	const [color, setColor] = useState(defaultColor)
	return (
		<section>
			<H2>
				<Trans>Personnalisez l'intégration</Trans>
			</H2>
			<div
				className="ui__ full-width"
				css={`
					background-color: var(--lightestColor);
				`}
			>
				<div
					css={`
						display: flex;
						padding: 20px 5%;
						max-width: 1400px;
						margin: auto;

						.ui__.left-side {
							width: 30%;
							padding-right: 1rem;

							select {
								padding: 7px;
							}
						}

						.ui__.right-side {
							width: 70%;
							padding-left: 1rem;
						}

						@media (max-width: 800px) {
							flex-direction: column;

							.ui__.left-side,
							.ui__.right-side {
								border: none;
								width: 100%;
							}
						}
					`}
				>
					<div className="ui__ left-side">
						<H3>
							<Trans i18nKey="pages.développeurs.module">Quel module ?</Trans>
							<Emoji emoji="🚩" />
						</H3>
						<select
							onChange={(event) => setCurrentModule(event.target.value)}
							value={currentModule}
						>
							{integrableModuleNames.map((name) => (
								<option key={name}>{name}</option>
							))}
						</select>

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
						<p>
							<Trans i18nKey="pages.développeurs.code.description">
								Voici le code à copier-coller sur votre site&nbsp;:
							</Trans>
						</p>
						<IntegrationCode color={color} module={currentModule} />
					</div>
					<div
						className="ui__ right-side"
						css={`
							overflow: hidden;

							/* The .full-width class is implemented using the calc() function
							and rely on the width of the page, which doesn't work in this case
							because the width of the preview "page" is smaller than the width
							of the actual screen. */
							.ui__.full-width {
								margin-left: initial !important;
								margin-right: initial !important;
							}
						`}
					>
						<H3>
							<Trans>Prévisualisation</Trans>
						</H3>
						<div
							css={`
								background-color: white;
								border: 2px solid var(--lighterColor);
								border-radius: 0.3rem;
								padding: 1rem;
							`}
						>
							<MemoryRouter
								key={currentModule}
								initialEntries={[`/iframes/${currentModule}`]}
							>
								<ThemeColorsProvider color={color}>
									<Iframes />
								</ThemeColorsProvider>
							</MemoryRouter>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default function Integration() {
	return (
		<>
			<ScrollToTop />
			<TrackPage name="module_web" />
			<Trans i18nKey="pages.développeurs.iframe.intro">
				<div>
					<H1>Intégrez le module Web</H1>
					<p>
						Nos simulateurs sont intégrables de manière transparente en ajoutant
						une simple ligne de code à votre page Web.
					</p>
					<p>
						Vous pouvez choisir le simulateur à intégrer et{' '}
						<strong>personnaliser la couleur principale du module</strong> pour
						le fondre dans le thème visuel de votre page.
					</p>
					<p>
						L'attribut <i>data-lang="en"</i> vous permet quant à lui de choisir
						l'anglais comme langue du simulateur.
					</p>
				</div>
				<IntegrationCustomizer />
				<p>
					À noter que si votre site utilise une politique de sécurité de contenu
					via l'en-tête de réponse HTTP <i>Content-Security-Policy</i>, une
					erreur bénigne peut apparaître dans la console. <EnSavoirPlusCSP />
				</p>
			</Trans>
			<section className="blocks" id="integrations">
				<H2>
					<Trans>Quelques intégrations</Trans>
				</H2>
				<div id="integrationList">
					<article>
						<a href="https://www.urssaf.fr/portail/home/utile-et-pratique/estimateur-de-cotisations-2019.html?ut=estimateurs">
							<img src={urssafLogo} alt="urssaf.fr" />
							<H2 as="h3">Urssaf</H2>
						</a>
					</article>
					<article>
						<a href="http://les-aides.fr/embauche">
							<img src={cciLogo} alt="Les-aides.fr" />
							<H2 as="h3">CCI de France</H2>
						</a>
					</article>
					<article>
						<a href="https://recruteurs.apec.fr/Recrutement/Pratique-RH/Tous-les-dossiers-Recrutement/Diagnostiquer/Vous-envisagez-de-recruter-calculez-le-cout-de-cette-embauche">
							<img src={apecLogo} alt="" />
							<H2 as="h3">APEC</H2>
						</a>
					</article>
					<article>
						<a href="https://code.travail.gouv.fr/outils/simulateur-embauche">
							<img src={minTraLogo} alt="Ministère du travail" />
							<H2 as="h3">Code du travail numérique</H2>
						</a>
					</article>
					<article>
						<a href="https://entreprise.pole-emploi.fr/cout-salarie/">
							<img src={poleEmploiLogo} alt="Pôle Emploi" />
							<H2 as="h3">Pôle Emploi</H2>
						</a>
					</article>
					<article>
						<a href="mailto:contact@mon-entreprise.beta.gouv.fr?subject=Proposition de réutilisation">
							<span className="question-mark">?</span>
							<H2 as="h3">
								<Trans>
									Une idée&nbsp;?
									<br />
									Contactez-nous&nbsp;!
								</Trans>
							</H2>
						</a>
					</article>
				</div>
			</section>
		</>
	)
}

function EnSavoirPlusCSP() {
	const { t } = useTranslation()
	return (
		<PopoverWithTrigger
			trigger={
				<Link linkType="button">
					<Trans>En savoir plus</Trans>
				</Link>
			}
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
				provided ('https://mon-entreprise.fr') does not match the recipient
				window's origin
			</blockquote>
			<Body>
				<Trans i18nKey="pages.développeurs.iframe.csp-2">
					Vous pouvez la corriger avec la politique suivante :
				</Trans>
			</Body>
			<code>
				script-src 'self' 'unsafe-inline' https://mon-entreprise.fr;
				<br />
				img-src 'self' https://mon-entreprise.fr;
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

				:before {
					content: '';
					position: absolute;
					top: 0;
					right: 0;
					border-width: 0 16px 16px 0;
					border-style: solid;
					border-color: #e8e8e8 white;
				}
				#scriptColor {
					color: #2975d1;
				}
			`}
		>
			<span>{'<'}</span>
			<em>
				script
				<br />
				id
			</em>
			="script-simulateur-embauche"
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
			="https://mon-entreprise.fr/simulateur-iframe-integration.js"{'>'}
			<span>{'<'}</span>
			<span>/</span>
			<em>script</em>
			<span>{'>'}</span>
		</code>
	)
}
