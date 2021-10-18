import { FromBottom } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { H2 } from 'DesignSystem/typography/heading'
import { Trans } from 'react-i18next'

export default function CotisationsRégularisation() {
	const rule = useEngine().getRule(
		'dirigeant . indépendant . cotisations et contributions . régularisation'
	)
	return (
		<FromBottom>
			<div
				className="ui__  lighter-bg card"
				css={`
					padding: 1rem;
					padding-top: 0.1rem;
				`}
			>
				<H2>{rule.title}</H2>
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
							target="_blank"
						>
							<Emoji emoji="👉" /> <Trans>Voir la fiche Urssaf</Trans>
						</a>
					</p>
				)}
			</div>
		</FromBottom>
	)
}
