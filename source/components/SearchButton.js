import React, { Component } from 'react'
import { connect } from 'react-redux'
import './SearchButton.css'
import Overlay from './Overlay'
import { SearchBar } from './pages/RulesList'
import withColours from 'Components/withColours'

@connect(
	state => ({
		flatRules: state.flatRules
	})
)
@withColours
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
					<Overlay onOuterClick={this.close}>
						<h2>Chercher une règle</h2>
						<SearchBar showDefaultList={false} finally={this.close} rules={flatRules} />
					</Overlay>
				) : (
					<button onClick={() => this.setState({ visible: true })}>
						<i
							style={{ color: this.props.colours.colour }}
							className="fa fa-search"
							aria-hidden="true"
						/>
					</button>
				)}
			</div>
		)
	}
}
