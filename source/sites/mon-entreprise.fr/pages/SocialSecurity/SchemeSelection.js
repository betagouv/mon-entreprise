import { T } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import animate from 'Ui/animate'

const SchemeChoice = withSitePaths(({ sitePaths }) => (
	<animate.fromBottom>
		<h1>
			<T>Quel régime souhaitez-vous explorer ?</T>
		</h1>
		<p>
			<Link
				to={sitePaths.sécuritéSociale['assimilé-salarié']}
				className="ui__ button-choice">
				{emoji('☂')}
				<span>
					<T>Assimilé salarié</T>{' '}
					<small>
						(<T>SAS, SASU ou SARL minoritaires</T>)
					</small>
				</span>
			</Link>
			<Link
				to={sitePaths.sécuritéSociale.indépendant}
				className="ui__ button-choice">
				{emoji('👩‍🔧')}
				<span>
					<T>Indépendant</T>{' '}
					<small>
						(<T>EI, EURL, SARL ou SARL majoritaires</T>)
					</small>
				</span>
			</Link>
			<Link
				to={sitePaths.sécuritéSociale['auto-entrepreneur']}
				className="ui__ button-choice">
				{emoji('🚶‍♂️')}
				Auto-entrepreneur
			</Link>
		</p>
		<h2>Vous ne savez pas lequel choisir ?</h2>
		<p>
			Le régime social du dirigeant a une très grande influence sur votre
			protection sociale et sur le revenu que vous aller toucher. Pour vous
			aider à y voir plus clair, nous avons conçu un petit comparatif, afin que
			vous puissiez choisir le régime qui vous convient le mieux.
		</p>
		<p style={{ textAlign: 'center', marginTop: '1rem' }}>
			<Link
				className={
					'ui__  plain button ' +
					(process.env.MASTER ? ' button-choice--soon' : '')
				}
				to={sitePaths.sécuritéSociale.comparaison}>
				<T>Comparer les régimes </T>
				{process.env.MASTER && (
					<span className="ui__ button-choice-label">
						<T>prochainement</T>
					</span>
				)}
			</Link>
		</p>
	</animate.fromBottom>
))

export default SchemeChoice
