import withColours from 'Components/withColours'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import Overlay from './Overlay'
import { SearchBar } from './pages/RulesList'
import './SearchButton.css'
import { SimpleButton } from './ui/Button'

@connect(state => ({
	flatRules: flatRulesSelector(state)
}))
@withColours
@translate()
export default class SearchButton extends Component {
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
				/>
			</Overlay>
		) : (
			<SimpleButton
				onClick={() => this.setState({ visible: true })}
				style={{ color: this.props.colours.colour }}>
				<i
					className="fa fa-search"
					aria-hidden="true"
					style={{ marginRight: '0.4em' }}
				/>
				<span>
					<Trans>Rechercher</Trans>
				</span>
			</SimpleButton>
		)
	}
}
