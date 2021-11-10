import { BlobProvider } from '@react-pdf/renderer'
import { ThemeColorsContext } from 'Components/utils/colors'
import Emoji from 'Components/utils/Emoji'
import { EngineContext, EngineProvider } from 'Components/utils/EngineContext'
import { Button } from 'DesignSystem/buttons'
import { Checkbox, TextField } from 'DesignSystem/field'
import PopoverWithTrigger from 'DesignSystem/PopoverWithTrigger'
import { H2 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { Body, SmallBody } from 'DesignSystem/typography/paragraphs'
import { RuleNode } from 'publicodes'
import { lazy, Suspense, useContext, useRef, useState } from 'react'
import SignaturePad from 'react-signature-pad-wrapper'
import { TrackingContext, TrackPage } from '../../../ATInternetTracking'
import PDFDocument from './PDFDocument'

const IS_TOUCH_DEVICE = isOnTouchDevice()
type SignaturePadInstance = {
	clear: () => void
	toDataURL: () => string
}

type EndBlockProps = {
	fields: Array<RuleNode>
	isMissingValues: boolean
}

export default function EndBlock({ fields, isMissingValues }: EndBlockProps) {
	const [isCertified, setCertified] = useState(false)
	const [place, setPlace] = useState<string>()
	const engine = useContext(EngineContext)
	const { darkColor } = useContext(ThemeColorsContext)
	const signatureRef = useRef<SignaturePadInstance>()
	const tracker = useContext(TrackingContext)

	if (isMissingValues) {
		return (
			<blockquote>
				<strong>Certains champs ne sont pas renseignés.</strong>
				<br />{' '}
				<small>
					Vous devez compléter l'intégralité du formulaire avant de pouvoir le
					signer et générer votre demande.
				</small>
			</blockquote>
		)
	}
	return (
		<>
			<H2>Déclaration sur l'honneur</H2>
			<Checkbox
				name="certified"
				id="certified"
				onChange={(checked) => setCertified(checked)}
				defaultSelected={isCertified}
				label="Je certifie l’exactitude des informations communiquées ci-dessus."
			/>
			<p className="ui__ notice">
				L’auteur d’une fausse déclaration est passible d’une condamnation au
				titre de l’article 441-1 du code pénal.
			</p>

			<TextField
				defaultValue={place}
				onChange={(value) => setPlace(value)}
				label="Fait à"
			/>
			{IS_TOUCH_DEVICE && (
				<div>
					<small>
						Signez ci dessous en utilisant la totalité de l'espace :{' '}
					</small>
					<div
						css={`
							border: 1px solid var(--darkColor);
							border-radius: 0.3rem;
							position: relative;
						`}
					>
						<SignaturePad
							height={200}
							options={{ penColor: darkColor }}
							ref={signatureRef}
						/>
					</div>
					<div
						css={`
							text-align: right;
						`}
					>
						<button
							className="ui__ simple small button"
							onClick={() => signatureRef.current?.clear()}
						>
							<Emoji emoji="🗑️" /> Recommencer{' '}
						</button>
					</div>
				</div>
			)}
			<p>
				<PopoverWithTrigger
					title="Votre demande de mobilité"
					trigger={(propsToDispatch) => (
						<Button {...propsToDispatch}>Générer la demande</Button>
					)}
				>
					<Body>
						Afin d’examiner votre situation au regard des règlements
						communautaires UE/EEE de Sécurité sociale (CE 883/2004), veuillez
						envoyer ce document à{' '}
						<Link href="mailto:mobilite-internationale@urssaf.fr">
							mobilite-internationale@urssaf.fr
						</Link>
					</Body>
					<Suspense
						fallback={
							<blockquote>
								<small>Génération du pdf en cours...</small>
							</blockquote>
						}
					>
						<LazyBlobProvider
							document={
								<EngineProvider value={engine}>
									<PDFDocument
										fields={fields}
										signatureURL={
											IS_TOUCH_DEVICE && signatureRef.current?.toDataURL()
										}
										place={place}
									/>
								</EngineProvider>
							}
						>
							{({ url, loading, error }) =>
								error ? (
									<blockquote>
										<strong>Erreur lors de la génération du pdf</strong>
										<br />
										<small>
											Veuillez envoyer un mail à
											contact@mon-entreprise.beta.gouv.fr
										</small>
									</blockquote>
								) : loading ? (
									<blockquote>
										<small>Génération du pdf en cours...</small>
									</blockquote>
								) : (
									url && (
										<>
											{!IS_TOUCH_DEVICE && (
												<blockquote>
													<strong>
														N'oubliez pas de signer le document avant de
														l'envoyer
													</strong>
												</blockquote>
											)}
											<a
												href={url}
												onClick={() => {
													tracker.click.set({
														type: 'download',
														name: 'demande-mobilité-internationale.pdf',
													})
												}}
												className="ui__ cta plain button"
												download="demande-mobilité-internationale.pdf"
											>
												Télécharger le fichier
											</a>
											<TrackPage name="pdf généré" />
										</>
									)
								)
							}
						</LazyBlobProvider>
					</Suspense>
				</PopoverWithTrigger>
			</p>
			<SmallBody>
				<strong>Vie privée :</strong> aucune donnée n'est transmise à nos
				serveurs, la génération du formulaire se fait entièrement depuis votre
				navigateur.
			</SmallBody>
		</>
	)
}

const LazyBlobProvider = lazy<typeof BlobProvider>(
	() =>
		new Promise((resolve) =>
			setTimeout(() => resolve({ default: BlobProvider }), 300)
		)
)

// From https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
function isOnTouchDevice() {
	const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
	const mq = function (query: string) {
		return window.matchMedia(query).matches
	}
	if (
		'ontouchstart' in window ||
		('DocumentTouch' in window &&
			document instanceof (window as any).DocumentTouch)
	) {
		return true
	}
	// include the 'heartz' as a way to have a non matching MQ to help terminate the join
	// https://git.io/vznFH
	const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')
	return mq(query)
}
