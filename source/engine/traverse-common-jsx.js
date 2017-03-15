import React from 'react'
import R from 'ramda'
import classNames from 'classnames'

let treatValue = data => data == null ?
		'?'
	: ( R.is(Number)(data) ?
				Math.round(data)
			: ( data ? 'oui' : 'non')
	)

let NodeValue = ({data}) =>
	<span className={"situationValue " + treatValue(data)}>←&nbsp;
		{treatValue(data)}
	</span>


// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export let Node = ({classes, name, value, child}) =>
<div className={classNames(classes, 'node')}>
	{name &&
		<span className="nodeHead">
			<span className="name">{name}</span>
			<NodeValue data={value}/>
		</span>
	}
	{child}
	{!name && <NodeValue data={value}/>}
</div>



// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export let Leaf = ({classes, name, value}) =>
<span className={classNames(classes, 'leaf')}>
	{name &&
		<span className="nodeHead">
			<span className="name">{name}<NodeValue data={value}/></span>
		</span>
	}
</span>
