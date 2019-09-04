import React from 'react'
import MonacoEditor from 'react-monaco-editor'

export default class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			code: '// type your code...'
		}
	}
	editorDidMount(editor, monaco) {
		console.log('editorDidMount', editor)
		editor.focus()
	}
	onChange(newValue, e) {
		console.log('onChange', newValue, e)
	}
	render() {
		const code = this.state.code
		const options = {
			selectOnLineNumbers: true
		}
		return (
			<section className="ui__ container" id="about">
				<p>Fais-toi plaiz</p>
				<MonacoEditor
					width="800"
					height="600"
					language="yaml"
					theme="vs-dark"
					value={code}
					options={options}
					onChange={this.onChange}
					editorDidMount={this.editorDidMount}
				/>
			</section>
		)
	}
}
