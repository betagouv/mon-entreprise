import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Font,
	PDFViewer,
	PDFDownloadLink
} from '@react-pdf/renderer'
import React from 'react'
import robotoUrl from './Roboto-Regular.ttf'
import montserratUrl from './Montserrat-SemiBold.ttf'
import { formatValue } from 'publicodes'
import emoji from 'react-easy-emoji'

// function FormPDFViewer({ fields, title, description }) {
// 	return (
// 		<div
// 			css={`
// 				width: 100%;
// 				padding-bottom: 141.4%;
// 				position: relative;
// 			`}
// 		>
// 			<PDFViewer
// 				css={`
// 					position: absolute;
// 					width: 100%;
// 					height: 100%;
// 					top: 0;
// 					bottom: 0;
// 					left: 0;
// 					right: 0;
// 				`}
// 			>
// 				<FormPDF fields={fields} title={title} description={description} />
// 			</PDFViewer>
// 		</div>
// 	)
// }

export default function FormPDFDownloadLink({
	fields,
	title,
	className,
	description,
	fileName,
	children
}) {
	return (
		<PDFDownloadLink
			document={
				<FormPDF fields={fields} title={title} description={description} />
			}
			fileName={fileName}
			className={className}
		>
			{({ blob, url, loading, error }) => children}
		</PDFDownloadLink>
	)
	// 	<PDFDownloadLink document={<MyDoc />} fileName="somename.pdf">
	// 	{({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
	// </PDFDownloadLink>
}

function FormPDF({ fields, title, description }) {
	return (
		<Document>
			<Page style={styles.body}>
				<View>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.description}>{description}</Text>
				</View>
				{fields.map(field => (
					<View style={styles.field} key={field.dottedName} wrap={false}>
						{field.type === 'groupe' ? (
							<Text style={styles.subtitle}>{field.title}</Text>
						) : (
							<>
								<Text style={styles.name}>{field.question ?? field.title}</Text>
								{field.nodeValue != null && (
									<Text style={styles.value}>{formatValue(field)}</Text>
								)}
							</>
						)}
					</View>
				))}
			</Page>
		</Document>
	)
}

Font.register({
	family: 'Roboto',
	src: robotoUrl
})

Font.register({
	family: 'Montserrat',
	src: montserratUrl
})
const styles = StyleSheet.create({
	body: {
		paddingTop: 35,
		color: '#18457B',
		lineHeight: 1.5,
		paddingBottom: 65,
		paddingHorizontal: 35
	},
	title: {
		fontSize: 20,
		marginBottom: 20,
		fontFamily: 'Montserrat'
	},
	description: {
		fontFamily: 'Roboto',
		marginBottom: 12,
		fontSize: 14
	},
	subtitle: {
		paddingTop: 10,
		fontFamily: 'Montserrat',
		fontSize: 16
	},
	field: {
		marginBottom: 12,
		lineHeight: 1.2
	},
	name: {
		fontSize: 11,
		marginBottom: 4,
		opacity: 0.7,
		fontFamily: 'Roboto'
	},
	value: {
		fontSize: 14,
		fontFamily: 'Roboto'
	}
})
