import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import React from 'react'
import { match, spy, useFakeTimers } from 'sinon'
import CurrencyInput from './CurrencyInput'

let getInput = component => mount(component).find('input')
describe('CurrencyInput', () => {
	it('should render an input', () => {
		expect(getInput(<CurrencyInput />)).to.have.length(1)
	})

	it('should accept both . and , as decimal separator', () => {
		let onChange = spy()
		const input = getInput(<CurrencyInput onChange={onChange} />)
		input.simulate('change', { target: { value: '12.1', focus: () => {} } })
		expect(onChange).to.have.been.calledWith(
			match.hasNested('target.value', '12.1')
		)
		input.simulate('change', { target: { value: '12,1', focus: () => {} } })
		expect(onChange).to.have.been.calledWith(
			match.hasNested('target.value', '12.1')
		)
	})

	it('should separate thousand groups', () => {
		const input1 = getInput(<CurrencyInput value={1000} language="fr" />)
		const input2 = getInput(<CurrencyInput value={1000} language="en" />)
		const input3 = getInput(<CurrencyInput value={1000.5} language="en" />)
		const input4 = getInput(<CurrencyInput value={1000000} language="en" />)
		expect(input1.instance().value).to.equal('1 000')
		expect(input2.instance().value).to.equal('1,000')
		expect(input3.instance().value).to.equal('1,000.5')
		expect(input4.instance().value).to.equal('1,000,000')
	})

	it('should handle decimal separator', () => {
		const input = getInput(<CurrencyInput value={0.5} language="fr" />)
		expect(input.instance().value).to.equal('0,5')
	})

	it('should not accept negative number', () => {
		let onChange = spy()
		const input = getInput(<CurrencyInput onChange={onChange} />)
		input.simulate('change', { target: { value: '-12', focus: () => {} } })
		expect(onChange).to.have.been.calledWith(
			match.hasNested('target.value', '12')
		)
	})

	it('should not accept anything else than number', () => {
		let onChange = spy()
		const input = getInput(<CurrencyInput onChange={onChange} />)
		input.simulate('change', { target: { value: '*1/2abc3', focus: () => {} } })
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
		const input = getInput(<CurrencyInput value="111" onChange={onChange} />)
		input.simulate('change', { target: { value: '111,', focus: () => {} } })
		expect(onChange).not.to.have.been.called
	})

	it('should change the position of the currency symbol depending on the language', () => {
		const inputFr = shallow(<CurrencyInput language="fr" />)
		expect(
			inputFr
				.children()
				.last()
				.text()
		).to.includes('€')
		const inputEn = shallow(<CurrencyInput language="en" />)
		expect(
			inputEn
				.children()
				.first()
				.text()
		).to.includes('€')
	})

	it('should debounce onChange call', () => {
		const clock = useFakeTimers()
		let onChange = spy()
		const input = getInput(
			<CurrencyInput onChange={onChange} debounce={1000} />
		)
		input.simulate('change', { target: { value: '1', focus: () => {} } })
		expect(onChange).not.to.have.been.called
		clock.tick(500)
		input.simulate('change', { target: { value: '12', focus: () => {} } })
		clock.tick(600)
		expect(onChange).not.to.have.been.called
		clock.tick(400)
		expect(onChange).to.have.been.calledWith(
			match.hasNested('target.value', '12')
		)
		clock.restore()
	})

	it('should initialize with value of the value prop', () => {
		const wrapper = shallow(<CurrencyInput value={1} />)
		expect(wrapper.state('value')).to.eq(1)
	})

	it('should update its value if the value prop changes', () => {
		const wrapper = shallow(<CurrencyInput value={1} />)
		wrapper.setProps({ value: 2 })
		expect(wrapper.state('value')).to.equal(2)
	})

	it('should not call onChange the value is the same as the current input value', () => {
		let onChange = spy()
		const wrapper = mount(<CurrencyInput value={2000} onChange={onChange} />)
		const input = wrapper.find('input')
		input.simulate('change', { target: { value: '2000', focus: () => {} } })
		wrapper.setProps({ value: '2000' })
		expect(onChange).not.to.have.been.called
	})

	it('should adapt its size to its content', () => {
		const wrapper = mount(<CurrencyInput value={1000} />)
		// It would be better to use `input.offsetWidth` but it's not supported by
		// Enzyme/JSDOM
		const getInlineWidth = () =>
			getComputedStyle(
				wrapper.find('.currencyInput__container').getDOMNode()
			).getPropertyValue('width')
		expect(getInlineWidth()).to.equal('')
		wrapper.setProps({ value: '1000000' })
		expect(Number(getInlineWidth().replace(/em$/, ''))).to.be.greaterThan(5)
	})
})
