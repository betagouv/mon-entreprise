import { compose } from 'ramda'
import React, { Component } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import Overlay from './Overlay'
import SearchBar from './SearchBar'

export default compose(
	connect(state => ({
		flatRules: flatRulesSelector(state)
	})),
	withNamespaces()
)(
	class SearchButton extends Component {
		componentDidMount() {
			// removeEventListener will need the exact same function instance
			this.boundHandleKeyDown = this.handleKeyDown.bind(this)

			window.addEventListener('keydown', this.boundHandleKeyDown)
		}
		handleKeyDown(e) {
			if (!(e.ctrlKey && e.key === 'k')) return
			this.setState({ visible: true })
			e.preventDefault()
			e.stopPropagation()
			return false
		}
		componentWillUnmount() {
			window.removeEventListener('keydown', this.boundHandleKeyDown)
		}
		state = {
			visible: false
		}
		close = () => this.setState({ visible: false })
		render() {
			let { flatRules } = this.props
			return this.state.visible ? (
				<Overlay onClose={this.close}>
					<h2>
						<Trans>Chercher dans la documentation</Trans>
					</h2>
					<SearchBar
						showDefaultList={false}
						finally={this.close}
						rules={flatRules}
					/>
				</Overlay>
			) : (
				<button
					className="ui__ link-button"
					onClick={() => this.setState({ visible: true })}>
					{emoji('🔍')}
					<Trans>Rechercher</Trans>
				</button>
			)
		}
	}
)
