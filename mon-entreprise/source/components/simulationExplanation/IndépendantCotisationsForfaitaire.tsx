import Value from 'Components/EngineValue'
import * as Animate from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { Trans } from 'react-i18next'

export default function CotisationsForfaitaires() {
	const rule = useEngine().getRule(
		'dirigeant . indépendant . cotisations et contributions . début activité'
	)
	return (
		<Animate.fromBottom>
			<div
				className="ui__  lighter-bg card"
				css={`
					padding: 1rem;
					padding-top: 0.1rem;
				`}
			>
				<h2>{rule.title}</h2>
				<p className="ui__ lead">
					Montant des cotisations forfaitaires :{' '}
					<strong>
						<Value expression="dirigeant . indépendant . cotisations et contributions . début activité" />
					</strong>
				</p>
				<div className="ui__ notice">
					<Markdown source={rule.rawNode.description} />
				</div>

				{rule.rawNode.références && (
					<p
						css={`
							text-align: right;
						`}
					>
						<a
							className="ui__  small button"
							href={Object.values(rule.rawNode.références)[0]}
						>
							<Emoji emoji="👉" /> <Trans>Voir la fiche Urssaf</Trans>
						</a>
					</p>
				)}
			</div>
		</Animate.fromBottom>
	)
}
