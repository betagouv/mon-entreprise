import React, { Component } from 'react'
import { findIndex, path, values } from 'ramda'
import taux_versement_transport from 'Règles/taux-versement-transport.json'
import { Node } from './common'

let indexOf = explanation =>
	explanation.value
		? findIndex(
				x => x['nomLaposte'] == explanation.value,
				taux_versement_transport
			)
		: 0
let indexOffset = 8

export default dataTargetName => ({ value, explanation }) => (
	<Node
		classes="mecanism"
		name="sélection"
		value={value}
		child={
			<BigTable explanation={explanation} dataTargetName={dataTargetName} />
		}
	/>
)

class BigTable extends Component {
	state = {
		ready: false
	}
	componentDidMount() {
		import('react-virtualized').then(module => {
			this.rv = module
			this.setState({ ready: true })
		})
	}
	render() {
		if (!this.state.ready) return null
		let { explanation, dataTargetName } = this.props
		let { Table, Column } = this.rv
		return (
			<Table
				width={300}
				height={300}
				headerHeight={20}
				rowHeight={30}
				rowCount={taux_versement_transport.length}
				scrollToIndex={indexOf(explanation) + indexOffset}
				rowStyle={({ index }) =>
					index == indexOf(explanation) ? { fontWeight: 'bold' } : {}
				}
				rowGetter={({ index }) => {
					// transformation de données un peu crade du fichier taux.json qui gagnerait à être un CSV
					let line = taux_versement_transport[index],
						getLastTaux = dataTargetName => {
							let lastTaux = values(path([dataTargetName, 'taux'], line))
							return (lastTaux && lastTaux.length && lastTaux[0]) || 0
						}
					return {
						nom: line['nomLaposte'],
						taux: getLastTaux(dataTargetName)
					}
				}}
			>
				<Column label="Nom de commune" dataKey="nom" width={200} />
				<Column width={100} label={'Taux ' + dataTargetName} dataKey="taux" />
			</Table>
		)
	}
}
