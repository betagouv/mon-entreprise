import React from 'react'
import R from 'ramda'
import classNames from 'classnames'

let treatValue = data => console.log('data', data) ||
	data == null
		? '?'
		: !isNaN(data) ? Math.round(+data) : data ? 'oui' : 'non'

let NodeValue = ({data}) => (
	<span className={'situationValue ' + treatValue(data)}>
		←&nbsp;
		{treatValue(data)}
	</span>
)

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export class Node extends React.Component {
	render() {
		let
			{classes, name, value, child} = this.props,
			termDefinition = R.contains('mecanism', classes) && name

		return (
			<div className={classNames(classes, 'node')}>
				{name &&
					<span className="nodeHead">
						<span className="name" data-term-definition={termDefinition} >{name}</span>
						<NodeValue data={value} />
					</span>}
				{child}
				{!name && <NodeValue data={value} />}
			</div>
		)
	}
}

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export let Leaf = ({classes, name, value}) => (
	<span className={classNames(classes, 'leaf')}>
		{name &&
			<span className="nodeHead">
				<span className="name">{name}<NodeValue data={value} /></span>
			</span>}
	</span>
)
