import React from 'react'
import R from 'ramda'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import {encodeRuleName} from './rules'

let treatValue = data =>
	data == null
		? '?'
		: !isNaN(data) ? Math.round(+data*100)/100 : data ? 'oui' : 'non'

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
				<Link to={"/regle/" + encodeRuleName(name)} >
					<span className="name">{name}<NodeValue data={value} /></span>
				</Link>
			</span>}
	</span>
)
