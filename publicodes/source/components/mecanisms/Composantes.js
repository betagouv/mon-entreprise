import { toPairs } from 'ramda'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { makeJsx } from '../../evaluation'
import writtenNumbers from '../../locales/writtenNumbers.yaml'
import colors from './colors'
import { InlineMecanismName, Mecanism } from './common'

export default function Composantes({ nodeValue, explanation, unit }) {
	const { i18n } = useTranslation()

	return (
		<Mecanism
			name="composantes"
			inline
			displayName={false}
			value={nodeValue}
			unit={unit}
		>
			<StyledComponent>
				<div
					css={`
						font-weight: bold;
						:first-letter {
							text-transform: capitalize;
						}
					`}
				>
					<Trans>La somme de</Trans>{' '}
					{writtenNumbers[i18n.language][explanation.length]}{' '}
					<InlineMecanismName name="composantes" /> :
				</div>
				<ol>
					{explanation.map((c, i) => [
						<li className="composante" key={JSON.stringify(c.composante)}>
							<ul
								className="composanteAttributes"
								style={{
									borderLeft: `4px solid ${colors('composantes')}`
								}}
							>
								{toPairs(c.composante).map(([k, v]) => (
									<li key={k} className="composanteName">
										<span
											style={{
												color: colors('composantes')
											}}
										>
											<Trans>{k}</Trans>:{' '}
										</span>
										<span>
											<Trans>{v}</Trans>
										</span>
									</li>
								))}
							</ul>
							<div className="content">{makeJsx(c)}</div>
							<div
								style={{
									textAlign: 'center',
									width: '100%',
									fontSize: '2.6rem',
									margin: '0.4em 0 0.2em'
								}}
							>
								{i === explanation.length - 1 ? null : '+'}
							</div>
						</li>
					])}
				</ol>
			</StyledComponent>
		</Mecanism>
	)
}

const StyledComponent = styled.div`
	> ol {
		list-style: none;
		counter-reset: li;
		padding-left: 1em;
	}
	> ol > li > ul > li {
		list-style-type: none;
	}

	.composanteAttributes {
		display: inline-block;
	}
`
