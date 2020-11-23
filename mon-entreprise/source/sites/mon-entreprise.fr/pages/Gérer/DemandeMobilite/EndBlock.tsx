import { BlobProvider } from '@react-pdf/renderer'
import Overlay from 'Components/Overlay'
import Checkbox from 'Components/ui/Checkbox'
import { ThemeColorsContext } from 'Components/utils/colors'
import { TrackerContext } from 'Components/utils/withTracker'
import { lazy, Suspense, useContext, useRef, useState } from 'react'
import emoji from 'react-easy-emoji'
import SignaturePad from 'react-signature-pad-wrapper'
import PDFDocument, { PDFDocumentProps } from './PDFDocument'

const IS_TOUCH_DEVICE = isOnTouchDevice()
type SignaturePadInstance = {
	clear: () => void
	toDataURL: () => string
}

type EndBlockProps = {
	fields: PDFDocumentProps['fields']
	isMissingValues: boolean
}

export default function EndBlock({ fields, isMissingValues }: EndBlockProps) {
	const [isCertified, setCertified] = useState(false)
	const [place, setPlace] = useState<string>()
	const [showDownloadLink, toggleDownloadLink] = useState(false)

	const { darkColor } = useContext(ThemeColorsContext)
	const signatureRef = useRef<SignaturePadInstance>()
	const tracker = useContext(TrackerContext)

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
			<h2>Déclaration sur l'honneur</h2>
			<Checkbox
				name="certified"
				id="certified"
				onChange={e => setCertified(e.target.checked)}
				checked={isCertified}
				label="Je certifie l’exactitude des informations communiquées ci-dessus."
			/>
			<p className="ui__ notice">
				L’auteur d’une fausse déclaration est passible d’une condamnation au
				titre de l’article 441-1 du code pénal.
			</p>

			<label>
				<small>Fait à :</small>
				<br />
				<input
					type="text"
					className="ui__"
					value={place}
					onChange={e => setPlace(e.target.value)}
				/>
			</label>
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
							{emoji('🗑️')} Recommencer{' '}
						</button>
					</div>
				</div>
			)}
			<div>
				<button
					className="ui__ cta plain button"
					disabled={!place || !isCertified}
					onClick={() => toggleDownloadLink(true)}
				>
					Générer la demande
				</button>
			</div>
			<p className="ui__ notice">
				<strong>Vie privée :</strong> aucune donnée n'est transmise à nos
				serveurs, la génération du formulaire se fait entièrement depuis votre
				navigateur.
			</p>
			{showDownloadLink && (
				<Overlay onClose={() => toggleDownloadLink(false)}>
					<h2>Votre demande de mobilité</h2>
					<p>
						Afin d’examiner votre situation au regard des règlements
						communautaires UE/EEE de Sécurité sociale (CE 883/2004), veuillez
						envoyer ce document à{' '}
						<a href="mailto:relations.internationales@urssaf.fr">
							relations.internationales@urssaf.fr
						</a>
					</p>
					<Suspense
						fallback={
							<blockquote>
								<small>Génération du pdf en cours...</small>
							</blockquote>
						}
					>
						<LazyBlobProvider
							document={
								<PDFDocument
									fields={fields}
									signatureURL={
										IS_TOUCH_DEVICE && signatureRef.current?.toDataURL()
									}
									place={place}
								/>
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
												onClick={() =>
													tracker.push([
														'trackEvent',
														'Demande mobilité',
														'Formulaire téléchargé'
													])
												}
												className="ui__ cta plain button"
												download="demande-mobilité-europe.pdf"
											>
												Télécharger le fichier
											</a>
										</>
									)
								)
							}
						</LazyBlobProvider>
					</Suspense>
				</Overlay>
			)}
		</>
	)
}

const LazyBlobProvider = lazy<typeof BlobProvider>(
	() =>
		new Promise(resolve =>
			setTimeout(() => resolve({ default: BlobProvider }), 300)
		)
)

// From https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
function isOnTouchDevice() {
	const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
	const mq = function(query: string) {
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
