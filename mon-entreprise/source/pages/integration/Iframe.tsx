import Overlay from 'Components/Overlay'
import HSLInterface from 'Components/utils/color/HSLInterface'
import {
	ThemeColorsContext,
	ThemeColorsProvider,
} from 'Components/utils/colors'
import { ScrollToTop } from 'Components/utils/Scroll'
import urssafLogo from 'Images/Urssaf.svg'
import React, {
	Suspense,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
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
	const [ color, setColor ] = useState(defaultColor)
	return (
		<section>
			<h2>
				<Trans>Personnalisez l'intégration</Trans>
			</h2>
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
						<h3>
							<Trans i18nKey="pages.développeurs.module">Quel module ?</Trans>
							{emoji('🚩')}
						</h3>
						<select
							onChange={(event) => setCurrentModule(event.target.value)}
							value={currentModule}
						>
							{integrableModuleNames.map((name) => (
								<option key={name}>{name}</option>
							))}
						</select>

						<h3>
							<Trans i18nKey="pages.développeurs.couleur">
								Quelle couleur ?{' '}
							</Trans>
							{emoji('🎨')}
						</h3>
						<Suspense fallback={<div>Chargement...</div>}>
							<LazyColorPicker color={color} onChange={ setColor } />
						</Suspense>
						<h3>
							<Trans i18nKey="pages.développeurs.code.titre">
								Code d'intégration
							</Trans>
							{emoji('🛠')}
						</h3>
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
						<h3>
							<Trans>Prévisualisation</Trans>
						</h3>
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
					<h1>Intégrez le module Web</h1>
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
				<h2>
					<Trans>Quelques intégrations</Trans>
				</h2>
				<div id="integrationList">
					<article>
						<a href="https://www.urssaf.fr/portail/home/utile-et-pratique/estimateur-de-cotisations-2019.html?ut=estimateurs">
							<img src={urssafLogo} alt="urssaf.fr" />
							<h2>Urssaf</h2>
						</a>
					</article>
					<article>
						<a href="http://les-aides.fr/embauche">
							<img src={cciLogo} alt="Les-aides.fr" />
							<h2>CCI de France</h2>
						</a>
					</article>
					<article>
						<a href="https://recruteurs.apec.fr/Recrutement/Pratique-RH/Tous-les-dossiers-Recrutement/Diagnostiquer/Vous-envisagez-de-recruter-calculez-le-cout-de-cette-embauche">
							<img src={apecLogo} alt="" />
							<h2>APEC</h2>
						</a>
					</article>
					<article>
						<a href="https://code.travail.gouv.fr/outils/simulateur-embauche">
							<img src={minTraLogo} alt="Ministère du travail" />
							<h2>Code du travail numérique</h2>
						</a>
					</article>
					<article>
						<a href="https://entreprise.pole-emploi.fr/cout-salarie/">
							<img src={poleEmploiLogo} alt="Pôle Emploi" />
							<h2>Pôle Emploi</h2>
						</a>
					</article>
					<article>
						<a href="mailto:contact@mon-entreprise.beta.gouv.fr?subject=Proposition de réutilisation">
							<span className="question-mark">?</span>
							<h2>
								<Trans>
									Une idée&nbsp;?
									<br />
									Contactez-nous&nbsp;!
								</Trans>
							</h2>
						</a>
					</article>
				</div>
			</section>
		</>
	)
}

function EnSavoirPlusCSP() {
	const [opened, setOpened] = useState(false)
	return (
		<>
			<button onClick={() => setOpened(true)} className="ui__ link-button">
				<Trans>En savoir plus</Trans>
			</button>
			{opened && (
				<Overlay onClose={() => setOpened(false)} style={{ textAlign: 'left' }}>
					<Trans i18nKey="pages.développeurs.iframe.csp-1">
						<h3>Intégration iframe et politique de sécurité de contenu</h3>
						<p>
							L'erreur ci-dessous qui s'affiche dans la console est liée à la
							communication entre la page parente et l'iframe pour le
							redimensionnement automatique au contenu affiché.
						</p>
					</Trans>
					<blockquote>
						Failed to execute 'postMessage' on 'DOMWindow': The target origin
						provided ('https://mon-entreprise.fr') does not match the recipient
						window's origin
					</blockquote>
					<p>
						<Trans i18nKey="pages.développeurs.iframe.csp-2">
							Vous pouvez la corriger avec la politique suivante :
						</Trans>
					</p>
					<code>
						script-src 'self' 'unsafe-inline' https://mon-entreprise.fr;
						<br />
						img-src 'self' https://mon-entreprise.fr;
					</code>
				</Overlay>
			)}
		</>
	)
}

type IntegrationCodeProps = {
	module?: string
	color?: HSLInterface
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
				background: hsl(0, 0%, 97.255%);
				margin: auto;
				margin-bottom: 1em;
				overflow: auto;
				line-height: 1.6em;
				box-shadow: 0 1px 1px hsla(0, 0%, 0%, 0.05),
					-1px 1px 1px hsla(0, 0%, 0%, 0.02);

				em {
					font-weight: 300;
					color: hsl(0, 0%, 0%);
				}

				:before {
					content: '';
					position: absolute;
					top: 0;
					right: 0;
					border-width: 0 16px 16px 0;
					border-style: solid;
					border-color: hsl(0, 0%, 90.98%) white;
				}
				#scriptColor {
					color: hsl(212.857, 67.2%, 49.02%);
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
					<span id="scriptColor">{color.toString()}</span>"
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
