import { BlobProvider } from '@react-pdf/renderer'
import { RuleNode, utils } from 'publicodes'
import { lazy, Suspense, useContext, useRef, useState } from 'react'
import SignaturePad from 'react-signature-pad-wrapper'
import { useTheme } from 'styled-components'

import { TrackingContext, TrackPage } from '@/components/ATInternetTracking'
import { Condition } from '@/components/EngineValue'
import { EngineContext, EngineProvider } from '@/components/utils/EngineContext'
import { Message, PopoverWithTrigger } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Checkbox, TextField } from '@/design-system/field'
import { Grid, Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, Intro, SmallBody } from '@/design-system/typography/paragraphs'

import PDFDocument from './PDFDocument'

const IS_TOUCH_DEVICE = isOnTouchDevice()

type EndBlockProps = {
	fields: Array<RuleNode>
	missingValues: Array<RuleNode>
}

export default function EndBlock({ fields, missingValues }: EndBlockProps) {
	const [isCertified, setCertified] = useState(false)
	const [place, setPlace] = useState<string>()
	const engine = useContext(EngineContext)
	const signatureRef = useRef<SignaturePad | null>(null)
	const tracker = useContext(TrackingContext)
	const { colors } = useTheme()
	if (missingValues.length) {
		return (
			<Message type="info" icon>
				<Body>
					<strong>Certains champs ne sont pas renseignés.</strong>
				</Body>
				<Body>
					Vous devez compléter l'intégralité du formulaire avant de pouvoir le
					signer et générer votre demande.
				</Body>
				<PopoverWithTrigger
					title="Champs manquants"
					trigger={(props) => (
						<Button
							{...props}
							light
							size="XS"
							aria-haspopup="dialog"
							color="tertiary"
						>
							Voir les champs manquants
						</Button>
					)}
					small
				>
					<Ul>
						{missingValues.map(({ title, dottedName }) => (
							<Li key={dottedName}>
								<Strong>{title}</Strong>{' '}
								<small>({utils.ruleParents(dottedName)[0]})</small>
							</Li>
						))}
					</Ul>
				</PopoverWithTrigger>
				<Spacing md />
			</Message>
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
			<SmallBody>
				L’auteur d’une fausse déclaration est passible d’une condamnation au
				titre de l’article 441-1 du code pénal.
			</SmallBody>
			<Grid item xs={12} sm={6}>
				<TextField
					defaultValue={place}
					onChange={(value) => setPlace(value)}
					label="Fait à"
				/>
			</Grid>
			{IS_TOUCH_DEVICE && (
				<div>
					<SmallBody>
						Signez ci dessous en utilisant la totalité de l'espace :{' '}
					</SmallBody>
					<div
						style={{
							border: `1px solid ${colors.bases.primary[700]}`,
							borderRadius: '0.3rem',
							position: 'relative',
						}}
					>
						<SignaturePad
							height={200}
							options={{ penColor: colors.extended.grey[600] }}
							ref={signatureRef}
						/>
					</div>
					<div
						style={{
							textAlign: 'right',
						}}
					>
						<Link onPress={() => signatureRef.current?.clear()}>
							<Emoji emoji="🗑️" /> Recommencer{' '}
						</Link>
					</div>
				</div>
			)}
			<Spacing lg />
			<PopoverWithTrigger
				title="Votre demande de mobilité"
				trigger={(buttonProps) => (
					<Button
						{...buttonProps}
						isDisabled={!isCertified || !place}
						aria-haspopup="dialog"
					>
						Générer la demande
					</Button>
				)}
				small
			>
				<Body>
					Afin d’examiner votre situation au regard des règlements
					communautaires UE/EEE de Sécurité sociale (CE 883/2004), veuillez
					envoyer ce document à{' '}
					<Link href="mailto:mobilite-internationale@urssaf.fr">
						mobilite-internationale@urssaf.fr
					</Link>
				</Body>
				<Condition expression="situation . intermittent">
					<Intro>
						Merci de joindre également à votre formulaire les documents suivants
						:
					</Intro>
					<Ul>
						<Li>La copie du contrat</Li>
						<Li>L’attestation Pôle Emploi Service </Li>
					</Ul>
				</Condition>
				<Condition expression="situation . non actif">
					<Intro>
						Merci de joindre également à votre formulaire tout document
						permettant de justifier de votre statut
					</Intro>
					<Ul>
						<Li> Etudiant : une copie de votre carte d’étudiant</Li>
						<Li> Demandeur d’emploi : une attestation pôle emploi</Li>
						<Li> Retraité : notification de pension </Li>
					</Ul>
				</Condition>
				<Suspense
					fallback={
						<blockquote role="presentation">
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
								<blockquote role="presentation">
									<strong>Erreur lors de la génération du pdf</strong>
									<br />
									<small>
										Veuillez envoyer un mail à
										contact@mon-entreprise.beta.gouv.fr
									</small>
								</blockquote>
							) : loading ? (
								<blockquote role="presentation">
									<small>Génération du pdf en cours...</small>
								</blockquote>
							) : (
								url && (
									<>
										{!IS_TOUCH_DEVICE && (
											<Intro>
												N'oubliez pas de signer le document avant de l'envoyer
											</Intro>
										)}
										<Spacing xxl />

										<Button
											href={url}
											size="XL"
											onPress={() => {
												tracker.setProp(
													'evenement_type',
													'telechargement',
													false
												)
												tracker.events.send('demarche.document', {
													click: 'demande_formulaire_a1',
												})
											}}
											download="demande-mobilité-internationale.pdf"
											id="button-download"
										>
											Télécharger le fichier
										</Button>
										<Spacing xxl />

										<TrackPage name="pdf généré" />
									</>
								)
							)
						}
					</LazyBlobProvider>
				</Suspense>
			</PopoverWithTrigger>
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
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
			document instanceof (window as any).DocumentTouch)
	) {
		return true
	}
	// include the 'heartz' as a way to have a non matching MQ to help terminate the join
	// https://git.io/vznFH
	const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')

	return mq(query)
}
