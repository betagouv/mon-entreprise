import React, { Component } from 'react'
import './SearchButton.css'
import Overlay from './Overlay'
import { SearchBar } from './pages/RulesList'
import withColours from 'Components/withColours'

@withColours
export default class SearchButton extends Component {
	state = {
		visible: false
	}
	render() {
		return (
			<div id="searchButton">
				{this.state.visible ? (
					<Overlay onOuterClick={() => this.setState({ visible: false })}>
						<h2>Chercher une règle</h2>
						<SearchBar showDefaultList={false} />
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
