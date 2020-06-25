import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { formatValue } from 'publicodes'
import React from 'react'

export default function FieldsPDF({ fields }) {
	return fields.map(field => (
		<View style={styles.field} key={field.dottedName} wrap={false}>
			{field.type === 'groupe' ? (
				<>
					<Text style={styles.subtitle}>
						{field.title}{' '}
						{field.note && (
							<Text style={styles.fieldNumber}>({field.note})</Text>
						)}
					</Text>
				</>
			) : (
				<>
					<Text style={styles.name}>
						{field.question ?? field.title}{' '}
						{field.note && (
							<Text style={styles.fieldNumber}>({field.note})</Text>
						)}
					</Text>
					{field.nodeValue != null && (
						<Text style={styles.value}>{formatValue(field)}</Text>
					)}
				</>
			)}
		</View>
	))
}

export const styles = StyleSheet.create({
	fieldNumber: {
		opacity: 0.7
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
