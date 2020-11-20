import { explainVariable } from 'Actions/actions'
import Overlay from 'Components/Overlay'
import { Markdown } from 'Components/utils/markdown'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { References } from 'publicodes'
import { Trans } from 'react-i18next'
import './Aide.css'
import { EngineContext } from 'Components/utils/EngineContext'

export default function Aide() {
	const explained = useSelector((state: RootState) => state.explainedVariable)
	const rules = useContext(EngineContext).getParsedRules()
	const dispatch = useDispatch()

	const stopExplaining = () => dispatch(explainVariable())

	if (!explained) return null

	const rule = rules[explained],
		text = rule.description,
		refs = rule.références

	return (
		<Overlay onClose={stopExplaining}>
			<div
				css={`
					padding: 0.6rem;
				`}
			>
				<h2>{rule.title}</h2>
				<Markdown source={text} />
				{refs && (
					<>
						<h3>
							<Trans>En savoir plus</Trans>
						</h3>
						<References refs={refs} />
					</>
				)}
			</div>
		</Overlay>
	)
}
