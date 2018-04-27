import CurrencyInput from './CurrencyInput'
import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { spy, match } from 'sinon'

let getInput = component => shallow(component).find('input')
describe('CurrencyInput', () => {
	it('should render an input', () => {
		expect(getInput(<CurrencyInput />)).to.have.length(1)
	})
	it('should accept both . and , as decimal separator', () => {
		let onChange = spy()
		const input = getInput(<CurrencyInput value={0} onChange={onChange} />)
		input.simulate('change', { target: { value: '12.1' } })
		expect(onChange).to.have.been.calledWith(
			match.hasNested('target.value', '12.1')
		)
		input.simulate('change', { target: { value: '12,1' } })
		expect(onChange).to.have.been.calledWith(
			match.hasNested('target.value', '12.1')
		)
	})
	it('should not accept negative number', () => {
		let onChange = spy()
		const input = getInput(<CurrencyInput value={0} onChange={onChange} />)
		input.simulate('change', { target: { value: '-12' } })
		expect(onChange).to.have.been.calledWith(
			match.hasNested('target.value', '12')
		)
	})

	it('should not accept anything else than number', () => {
		let onChange = spy()
		const input = getInput(<CurrencyInput value={0} onChange={onChange} />)
		input.simulate('change', { target: { value: '*1/2abc3' } })
		expect(onChange).to.have.been.calledWith(
			match.hasNested('target.value', '123')
		)
	})
	it('should pass other props to the input', () => {
		const input = getInput(<CurrencyInput autoFocus />)
		expect(input.prop('autoFocus')).to.be.true
	})
	it('should not call onChange while the decimal part is being written', () => {
		let onChange = spy()
		const input = getInput(<CurrencyInput value={0} onChange={onChange} />)
		input.simulate('change', { target: { value: '111,' } })
		expect(onChange).not.to.have.been.called
	})

	it('should change the position of the currency symbol depending on the language', () => {
		const inputFr = shallow(<CurrencyInput value={0} language="fr" />)
		expect(
			inputFr
				.children()
				.last()
				.text()
		).to.includes('€')
		const inputEn = shallow(<CurrencyInput value={0} language="en" />)
		expect(
			inputEn
				.children()
				.first()
				.text()
		).to.includes('€')
	})
})
