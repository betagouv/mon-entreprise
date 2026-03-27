import ColorPicker from '@atomik-color/component'
import { str2Color } from '@atomik-color/core'
import * as R from 'effect/Record'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import urssafLogo from '@/assets/images/Urssaf.svg'
import { TrackPage } from '@/components/ATInternetTracking'
import {
	Article,
	Body,
	Button,
	Emoji,
	Grid,
	H1,
	H2,
	H3,
	Intro,
	Item,
	Link,
	PopoverWithTrigger,
	Select,
	Spacing,
	TextField,
	Ul,
} from '@/design-system'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useNavigation } from '@/lib/navigation'

import Meta from '../../components/utils/Meta'

import './iframe.css'

import { pipe } from 'effect'

import { SimulatorData } from '@/pages/simulateurs-et-assistants/metadata-src'

import cciLogo from './images/cci.png'
import minTraLogo from './images/min-tra.jpg'
import poleEmploiLogo from './images/pole-emploi.png'

function IntegrationCustomizer() {
	const { t } = useTranslation()
	const simulatorsData = useSimulatorsData()
	const { searchParams, setSearchParams, useHref } = useNavigation()

	const simulateursValidesPourIntégration = pipe(
		simulatorsData,
		R.filter((simulateur: SimulatorData[keyof SimulatorData]) => {
			const simulateurIsNotPrivate = !(
				'private' in simulateur && simulateur.private
			)
			const simulateurHasIframePath =
				'iframePath' in simulateur && !!simulateur.iframePath

			return simulateurIsNotPrivate && simulateurHasIframePath
		})
	)
	type SimulateurValideId = keyof typeof simulateursValidesPourIntégration

	const estSimulateurValidePourIntégration = useCallback(
		(simulateur: string): simulateur is SimulateurValideId =>
			!!simulateur && simulateur in simulateursValidesPourIntégration,
		[simulateursValidesPourIntégration]
	)

	const simulateurFromUrl = searchParams.get('simulateur') ?? ''
	const defaultSimulateur = estSimulateurValidePourIntégration(
		simulateurFromUrl
	)
		? simulateurFromUrl
		: ('salarié' as SimulateurValideId)

	const [currentSimulateur, setCurrentSimulateur] =
		useState<SimulateurValideId>(defaultSimulateur)

	useEffect(() => {
		setSearchParams({ simulateur: currentSimulateur }, { replace: true })
	}, [currentSimulateur, setSearchParams])

	const currentSimulator = useMemo(
		() => simulateursValidesPourIntégration[currentSimulateur],
		[currentSimulateur, simulateursValidesPourIntégration]
	)

	const currentIframePath = currentSimulator.iframePath
	const currentIframeTitle = currentSimulator.title

	const iframeSrc = useHref(`/iframes/${currentIframePath}`)
	const iframeRef = useRef<HTMLIFrameElement>(null)

	useEffect(() => {
		window.addEventListener(
			'message',
			function (evt: MessageEvent<{ kind: string; value: number }>) {
				if (iframeRef.current && evt.data.kind === 'resize-height') {
					iframeRef.current.style.height = `${evt.data.value}px`
				}
			}
		)
	}, [iframeRef])

	const [color, setColor] = useState<string>('#005aa1')

	useEffect(() => {
		iframeRef.current?.contentWindow?.postMessage({
			kind: 'change-theme-color',
			value: color,
		})
	}, [iframeRef, color])

	return (
		<>
			<H2>
				<Trans>Personnalisez l'intégration</Trans>
			</H2>
			<Meta
				title={t('iframe.title', 'Intégrer un simulateur')}
				description={t('iframe.description', 'Outils pour les développeurs')}
			/>
			<Grid
				container
				spacing={4}
				style={{
					justifyContent: 'space-between',
				}}
			>
				<Grid item xl={4} lg={5} md>
					<H3>
						<Trans i18nKey="pages.développeur.module">Quel module ?</Trans>
					</H3>
					<Select
						label="Assistant ou simulateur"
						onSelectionChange={(value) =>
							estSimulateurValidePourIntégration(value as string) &&
							setCurrentSimulateur(value as keyof SimulatorData)
						}
						selectedKey={currentSimulateur}
					>
						{Object.values(simulateursValidesPourIntégration).map(
							({ id, shortName, title, icône }) => (
								<Item key={id} textValue={shortName ?? title ?? ''}>
									{icône && (
										<>
											<Emoji emoji={icône} />
											&nbsp;
										</>
									)}
									{shortName ?? title ?? ''}
								</Item>
							)
						)}
					</Select>
				</Grid>
				<Grid item xs={'auto'}>
					<H3>
						<Trans i18nKey="pages.développeur.couleur">Quelle couleur ? </Trans>
						<Emoji emoji="🎨" />
					</H3>
					<TextField
						aria-label="Code hexadécimal de la couleur du simulateur"
						value={color}
						onChange={setColor}
					/>
					<Spacing md />
					{/*
						Conflit de scrolling sur Firefox sur mobile
						Issue ouverte : https://github.com/deebov/atomik-color-picker/issues/2
					*/}
					<ColorPicker
						value={str2Color(color)}
						onChange={({ hex }: { hex: string }) => setColor(`#${hex}`)}
					/>
				</Grid>
				<Grid item xs>
					<H3>
						<Trans i18nKey="pages.développeur.code.titre">
							Code d'intégration
						</Trans>
						<Emoji emoji="🛠" />
					</H3>
					<Body>
						<Trans i18nKey="pages.développeur.code.description">
							Voici le code à copier-coller sur votre site&nbsp;:
						</Trans>
					</Body>
					<IntegrationCode color={color} module={currentIframePath} />
				</Grid>
				<Grid item xs={12}>
					<H3>
						<Trans>Prévisualisation</Trans>
					</H3>

					<PrevisualisationContainer>
						<PreviewIframe
							src={iframeSrc}
							ref={iframeRef}
							title={currentIframeTitle}
						/>
					</PrevisualisationContainer>
				</Grid>
			</Grid>
		</>
	)
}

const PreviewIframe = styled.iframe`
	width: 100%;
	height: 700px;
	border: 0px;
`

const PrevisualisationContainer = styled.div`
	outline: 2px solid ${({ theme }) => theme.colors.extended.grey[300]};
	margin-top: 2rem;
	background-color: white;
	overflow: hidden;
	outline-offset: 1rem;
`

const Logo = styled.img`
	max-width: 100%;
	max-height: 3rem;
`

export default function Integration() {
	const { t } = useTranslation()

	return (
		<>
			<TrackPage name="module_web" />
			<Trans i18nKey="pages.développeur.iframe.intro">
				<div>
					<H1>Intégrez le module Web</H1>
					<Intro>
						Nos simulateurs sont intégrables de manière transparente en ajoutant
						une simple ligne de code à votre page Web.
					</Intro>
					<Body>
						Vous pouvez choisir le simulateur à intégrer et{' '}
						<strong>personnaliser la couleur principale du module</strong> pour
						le fondre dans le thème visuel de votre page.
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
					{t(
						'pages.développeur.iframe.intégrations.titre',
						'Liste des intégrations'
					)}
				</H2>
				<Grid as={Ul} container id="integrationList" spacing={2}>
					<Grid as="li" item xs={12} md={6} xl={4}>
						<Article
							title="Urssaf"
							href="https://www.urssaf.fr/portail/home/utile-et-pratique/estimateur-de-cotisations-2019.html?ut=estimateurs"
							ctaLabel={t(
								'pages.développeur.iframe.intégrations.urssaf.cta-label',
								'Voir l’intégration'
							)}
							aria-label={t(
								'pages.développeur.iframe.intégrations.urssaf.aria-label',
								'Urssaf, voir l’intégration, nouvelle fenêtre'
							)}
						>
							<Logo src={urssafLogo} alt="" />
						</Article>
					</Grid>
					<Grid as="li" item xs={12} md={6} xl={4}>
						<Article
							title="CCI de France"
							href="http://les-aides.fr/embauche"
							ctaLabel={t(
								'pages.développeur.iframe.intégrations.CCI.cta-label',
								'Voir l’intégration'
							)}
							aria-label={t(
								'pages.développeur.iframe.intégrations.CCI.aria-label',
								'CCI de France, voir l’intégration, nouvelle fenêtre'
							)}
						>
							<Logo src={cciLogo} alt="" />
						</Article>
					</Grid>
					<Grid as="li" item xs={12} md={6} xl={4}>
						<Article
							title="Code du travail numérique"
							href="https://code.travail.gouv.fr/outils/simulateur-embauche"
							ctaLabel={t(
								'pages.développeur.iframe.intégrations.code-du-travail-numérique.cta-label',
								'Voir le simulateur'
							)}
							aria-label={t(
								'pages.développeur.iframe.intégrations.code-du-travail-numérique.aria-label',
								'Code du travail numérique", voir le simulateur, nouvelle fenêtre'
							)}
						>
							<Logo src={minTraLogo} alt="" />
						</Article>
					</Grid>
					<Grid as="li" item xs={12} md={6} xl={4}>
						<Article
							title="France Travail"
							href="https://entreprise.francetravail.fr/cout-salarie/"
							ctaLabel={t(
								'pages.développeur.iframe.intégrations.france-travail.cta-label',
								'Voir le simulateur'
							)}
							aria-label={t(
								'pages.développeur.iframe.intégrations.france-travail.aria-label',
								'France Travail, voir le simulateur, nouvelle fenêtre'
							)}
						>
							<Logo src={poleEmploiLogo} alt="" />
						</Article>
					</Grid>
					<Grid as="li" item xs={12} md={6} xl={4}>
						<Article
							title="Une idée&nbsp;?"
							href="mailto:contact@mon-entreprise.beta.gouv.fr?subject=Proposition de réutilisation"
							ctaLabel={t('Contactez-nous')}
						>
							{t(
								'pages.développeur.iframe.intégrations.suggestion',
								'Vous avez un projet ou une idée à nous partager ?'
							)}
						</Article>
					</Grid>
				</Grid>
			</section>
			<Spacing md />
		</>
	)
}

function EnSavoirPlusCSP() {
	const { t } = useTranslation()

	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<Link {...buttonProps} aria-haspopup="dialog">
					<Trans>En savoir plus</Trans>
				</Link>
			)}
			title={t(
				'pages.développeur.iframe.csp-title',
				'Intégration iframe et politique de sécurité de contenu'
			)}
			small
		>
			<Trans i18nKey="pages.développeur.iframe.csp-1">
				<Body>
					L'erreur ci-dessous qui s'affiche dans la console est liée à la
					communication entre la page parente et l'iframe pour le
					redimensionnement automatique au contenu affiché.
				</Body>
			</Trans>
			<blockquote role="presentation">
				Failed to execute 'postMessage' on 'DOMWindow': The target origin
				provided ('https://mon-entreprise.urssaf.fr') does not match the
				recipient window's origin
			</blockquote>
			<Body>
				<Trans i18nKey="pages.développeur.iframe.csp-2">
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
	const { t } = useTranslation()

	const codeRef = useRef<HTMLDivElement>(null)
	const [copied, setCopied] = useState(false)

	const copyCodeToClipboard = (): void => {
		navigator.clipboard
			.writeText(codeRef.current?.innerText || '')
			.then(() => setCopied(true))
			.catch(() => setCopied(false))
	}

	useEffect(() => {
		// Réinitialise l'état de la copie après 3 secondes
		let timeout: NodeJS.Timeout
		if (copied) {
			timeout = setTimeout(() => setCopied(false), 3000)
		}

		return () => clearTimeout(timeout)
	}, [copied])

	useEffect(() => {
		// Si le code change, on réinitialise l'état de la copie
		setCopied(false)
	}, [module, color])

	return (
		<StyledDiv>
			<code ref={codeRef}>
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
				="https://mon-entreprise.urssaf.fr/simulateur-iframe-integration.js"
				{'>'}
				<span>{'<'}</span>
				<span>/</span>
				<em>script</em>
				<span>{'>'}</span>
			</code>
			<div
				style={{
					display: 'block',
					right: '0',
					top: '0',
					position: 'absolute',
					margin: '8px',
				}}
			>
				<Button
					size="XXS"
					type="button"
					aria-label={
						copied
							? t('copied', 'Copié')
							: t(
									'pages.développeur.code.copy-code',
									'Copier le code dans le presse-papier'
							  )
					}
					color={copied ? 'secondary' : 'primary'}
					onPress={copyCodeToClipboard}
				>
					<Emoji emoji={copied ? '✔️' : '📑'} />
				</Button>
			</div>
		</StyledDiv>
	)
}

const StyledDiv = styled.div`
	padding: 1rem;
	background: ${({ theme }) => (theme.darkMode ? '#484848' : '#f8f8f8')};
	overflow: auto;
	border-radius: ${({ theme }) => theme.box.borderRadius};
	line-height: 1.6em;
	box-shadow:
		0 1px 1px rgba(0, 0, 0, 0.05),
		-1px 1px 1px rgba(0, 0, 0, 0.02);

	em {
		font-weight: 300;
		color: ${({ theme }) => (theme.darkMode ? 'white' : 'black')};
		background-color: inherit;
	}
`
