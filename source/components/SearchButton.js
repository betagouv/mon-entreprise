import React, { Component } from 'react'
import './SearchButton.css'
import Overlay from './Overlay'
import { SearchBar } from './pages/RulesList'
import withColours from 'Components/withColours'

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
		return (
			<div id="searchButton">
				{this.state.visible ? (
					<Overlay onOuterClick={this.close}>
						<h2>Chercher une règle</h2>
						<SearchBar showDefaultList={false} finally={this.close} />
					</Overlay>
				) : (
					<button
						onClick={() => this.setState({ visible: true })}
						style={{ color: this.props.colours.colour }}
					>
						<i className="fa fa-search" aria-hidden="true" /> Recherche
					</button>
				)}
			</div>
		)
	}
}
