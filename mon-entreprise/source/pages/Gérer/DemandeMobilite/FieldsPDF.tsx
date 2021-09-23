import { StyleSheet, Text, View } from '@react-pdf/renderer'
import Value from 'Components/EngineValue'
import { EngineContext } from 'Components/utils/EngineContext'
import { formatValue } from 'publicodes'
import { RuleNode } from 'publicodes/dist/types/rule'
import { useContext } from 'react'

type FieldsPDFProps = {
	fields: Array<RuleNode>
}

export default function FieldsPDF({ fields }: FieldsPDFProps) {
	const engine = useContext(EngineContext)
	return (
		<>
			{fields.map(
				({ rawNode: { type, question, note, API }, title, dottedName }) => (
					<View style={styles.field} key={dottedName} wrap={false}>
						{type === 'groupe' ? (
							<>
								<Text style={styles.subtitle}>
									{title}{' '}
									{note && <Text style={styles.fieldNumber}>({note})</Text>}
								</Text>
							</>
						) : (
							<>
								<Text style={styles.name}>
									{question ?? title}{' '}
									{note && <Text style={styles.fieldNumber}>({note})</Text>}
								</Text>

								<Text style={styles.value}>
									{formatValue(engine.evaluate(dottedName)) +
										(API === 'commune'
											? ` (${
													(
														engine.evaluate(dottedName).nodeValue as Record<
															string,
															unknown
														>
													)?.codePostal as string
											  })`
											: '')}{' '}
								</Text>
							</>
						)}
					</View>
				)
			)}
		</>
	)
}

export const styles = StyleSheet.create({
	fieldNumber: {
		opacity: 0.7,
	},
	subtitle: {
		paddingTop: 10,
		fontFamily: 'Montserrat',
		fontSize: 16,
	},
	field: {
		marginBottom: 12,
		lineHeight: 1.2,
	},
	name: {
		fontSize: 11,
		marginBottom: 4,
		opacity: 0.7,
		fontFamily: 'Roboto',
	},
	value: {
		fontSize: 14,
		fontFamily: 'Roboto',
	},
})
