import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { connect } from 'react-redux'
import { safeLoad } from 'js-yaml'
import { Link } from 'react-router-dom'

export default connect(
	state => ({ rules: state.rules }),
	dispatch => ({ setRules: rules => dispatch({ type: 'SET_RULES', rules }) })
)(
	class Studio extends React.Component {
		constructor(props) {
			super(props)
			this.state = {
				code: '# ajoutez ici vos nouvelles règles'
			}
		}
		editorDidMount(editor, monaco) {
			editor.focus()
		}
		onChange = (newValue, e) => {
			this.setState({ code: newValue })
		}
		updateRules() {
			this.props.setRules([...this.props.rules, ...safeLoad(this.state.code)])
		}
		render() {
			const code = this.state.code
			const options = {
				selectOnLineNumbers: true,
				autoIndent: true,
				formatOnPaste: true,
				formatOnType: true,
				tabSize: 2
			}
			return (
				<section className="" id="about">
					<p>Fais-toi plaiz</p>
					<MonacoEditor
						width="100%"
						height="600"
						language="yaml"
						theme="vs-dark"
						value={code}
						options={options}
						onChange={this.onChange}
						editorDidMount={this.editorDidMount}
					/>
					<button
						onClick={() => this.updateRules()}
						className="ui__ buttton plain">
						Sauver
					</button>
					<Link to="/documentation">Doc</Link>
				</section>
			)
		}
	}
)
