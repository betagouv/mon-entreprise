import PDFElement from '@react-pdf/renderer'
import urssafPng from 'Images/destinataires/Urssaf.png'
import { RuleNode } from 'publicodes'
import FieldsPDF, { styles as fieldStyles } from './FieldsPDF'
import montserratUrl from './Montserrat-SemiBold.ttf'
import robotoUrl from './Roboto-Regular.ttf'

const { Document, Font, Image, Link, Page, StyleSheet, Text, View } = PDFElement

export type PDFDocumentProps = {
	fields: Array<RuleNode>
	signatureURL?: string | false
	place?: string
}

export default function PDFDocument({
	fields,
	signatureURL,
	place,
}: PDFDocumentProps) {
	return (
		<Document>
			<Page style={styles.body} wrap>
				<View style={styles.header}>
					<Image src={urssafPng} style={styles.logo} />
				</View>
				<View>
					<Text style={styles.title}>
						{fields.find(({ dottedName }) => dottedName === 'détachement')
							? 'Demande de détachement'
							: "Demande d'activité transfrontalière"}
					</Text>
					<Text style={styles.texte}>
						Afin d’examiner votre situation au regard des règlements
						communautaires de Sécurité sociale (CE 883/2004 et CE 987/2009),
						veuillez envoyer ce document à{' '}
						<Link src="mailto:mobilite-internationale@urssaf.fr">
							mobilite-internationale@urssaf.fr
						</Link>
					</Text>
				</View>
				<FieldsPDF fields={fields} />
				<View style={styles.texte}>
					<View style={fieldStyles.field}>
						<Text style={fieldStyles.subtitle}>Déclaration sur l'honneur</Text>
					</View>
					<View style={fieldStyles.field}>
						<Text style={fieldStyles.value}>
							Je certifie l’exactitude des informations communiquées ci-dessus.
						</Text>
					</View>
					<View style={fieldStyles.field}>
						<Text style={fieldStyles.value}>
							Fait le{' '}
							{new Date()
								.toISOString()
								.split('T')[0]
								.replace(/([\d]{4})-([\d]{2})-([\d]{2})/, '$3/$2/$1')}{' '}
							à {place}
						</Text>
					</View>
					<View style={fieldStyles.field}>
						<Text style={fieldStyles.name}>Signature :</Text>
					</View>
					{signatureURL ? (
						<Image src={signatureURL} style={styles.signature} />
					) : (
						<View style={styles.signatureBox} />
					)}
				</View>
				<View fixed style={styles.footer}>
					<Text>
						La loi n° 78-17 du 6 janvier 1978 relative à l’informatique, aux
						fichiers et aux libertés, s’applique aux réponses faites sur ce
						formulaire. Elle garantit un droit d’accès et de rectification pour
						les données vous concernant auprès de notre organisme.
					</Text>
				</View>
			</Page>
		</Document>
	)
}
Font.registerHyphenationCallback((word) => [word])
Font.register({
	family: 'Roboto',
	src: robotoUrl,
})

Font.register({
	family: 'Montserrat',
	src: montserratUrl,
})

const styles = StyleSheet.create({
	body: {
		paddingTop: 35,
		color: '#18457B',
		lineHeight: 1.5,
		paddingBottom: 65,
		paddingHorizontal: 35,
	},
	header: {
		display: 'flex',
		justifyContent: 'flex-end',
		marginBottom: 20,
	},
	logo: {
		objectFit: 'scale-down',
		width: 100,
	},
	title: {
		fontSize: 20,
		marginBottom: 20,
		fontFamily: 'Montserrat',
	},
	texte: {
		fontFamily: 'Roboto',
		marginBottom: 12,
		fontSize: 14,
	},
	signature: {
		objectFit: 'scale-down',
		maxWidth: 300,
	},
	signatureBox: {
		height: 100,
	},
	footer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		marginHorizontal: 35,
		paddingVertical: 5,
		opacity: 0.7,
		fontSize: 6,
	},
})
