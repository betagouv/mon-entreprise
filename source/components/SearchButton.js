import withColours from 'Components/withColours'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import Overlay from './Overlay'
import './SearchButton.css'
import { SearchBar } from './pages/RulesList'

@connect(state => ({
	flatRules: state.flatRules
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
		if (!(e.ctrlKey && e.key === 'p')) return
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
		return (
			<div id="searchButton">
				{this.state.visible ? (
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
					<button
						onClick={() => this.setState({ visible: true })}
						style={{ color: this.props.colours.colour }}>
						<i className="fa fa-search" aria-hidden="true" />
						<span>
							{' '}
							<Trans>Recherche</Trans>
						</span>
					</button>
				)}
			</div>
		)
	}
}
