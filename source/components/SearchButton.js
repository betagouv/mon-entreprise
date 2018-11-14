import { compose } from 'ramda'
import React, { Component } from 'react'
import { Trans, withI18n } from 'react-i18next'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { LinkButton } from 'Ui/Button'
import Overlay from './Overlay'
import SearchBar from './SearchBar'

export default compose(
	connect(state => ({
		flatRules: flatRulesSelector(state)
	})),
	withI18n()
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
						<Trans>Chercher une règle</Trans>
					</h2>
					<SearchBar
						showDefaultList={false}
						finally={this.close}
						rules={flatRules}
						rulePagesBasePath={this.props.rulePagesBasePath}
					/>
				</Overlay>
			) : (
				<LinkButton
					onClick={() => this.setState({ visible: true })}
					className={this.props.className}
					style={this.props.style}>
					<i
						className="fa fa-search"
						aria-hidden="true"
						style={{ marginRight: '0.4em' }}
					/>
					<span>
						<Trans>Rechercher</Trans>
					</span>
				</LinkButton>
			)
		}
	}
)
