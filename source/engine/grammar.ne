# This grammar is inspired by the "fancier grammar" tab of the nearley playground : https://omrelli.ug/nearley-playground

# Look for the PEMDAS system : Parentheses, Exponents (omitted here), Multiplication, and you should guess the rest :)

@preprocessor esmodule

@{%
import {string, filteredVariable, variable, temporalVariable,  binaryOperation, unaryOperation, boolean, number, percentage } from './grammarFunctions'

const moo = require("moo");

const letter = '[a-zA-Z\u00C0-\u017F]';
const letterOrNumber = '[a-zA-Z\u00C0-\u017F0-9\']';
const word = `${letter}(?:[\-']?${letterOrNumber}+)*`;
const words = `${word}(?: ${word}|${letterOrNumber}*)*`
const numberRegExp = '-?(?:[1-9][0-9]+|[0-9])(?:\.[0-9]+)?';
const percentageRegExp = numberRegExp + '\\%'

const lexer = moo.compile({
  percentage: new RegExp(percentageRegExp),
  number: new RegExp(numberRegExp),
  '(': '(',
  ')': ')',
  '[': '[',
  ']': ']',
  comparison: ['>','<','>=','<=','=','!='],
  additionSubstraction: /[\+-]/,
  multiplicationDivision: ['*','/'],
  temporality: ['annuel' , 'mensuel'],
  words: new RegExp(words),
  string: /'[ \t\.'a-zA-Z\-\u00C0-\u017F0-9 ]+'/,
  dot: ' . ',
  space: { match: /[\s]+/, lineBreaks: true }
});
%}

@lexer lexer

main ->
    AdditionSubstraction {% id %}
  | Comparison {% id %}
  | NonNumericTerminal {% id %}
  | Negation {% id %}

NumericTerminal ->
	 	Variable {% id %}
  | TemporalVariable {% id %}
  | FilteredVariable {% id %}
  | number {% id %}

Negation ->
    "-" %space Parentheses {% unaryOperation('calculation') %}
Parentheses ->
    "(" AdditionSubstraction ")"  {% ([,e]) => e %}
  | "(" Negation ")" {% ([,e]) => e %}
  |  NumericTerminal               {% id %}

Comparison -> Comparable %space %comparison %space Comparable {% binaryOperation('comparison')%}

Comparable -> (  AdditionSubstraction | NonNumericTerminal) {% ([[e]]) => e %}

NonNumericTerminal ->
	  boolean  {% id %}
	| string   {% id %}



Variable -> %words (%dot %words {% ([,words]) => words %}):* {% variable %}


Filter -> "[" %words "]" {% ([,filter]) => filter %}
FilteredVariable -> Variable %space Filter {% filteredVariable %}

TemporalTransform -> "[" %temporality "]" {% ([,temporality]) => temporality %}
TemporalVariable -> Variable %space TemporalTransform {% temporalVariable %}

#-----

# Addition and subtraction
AdditionSubstraction ->
    AdditionSubstraction %space %additionSubstraction %space MultiplicationDivision  {%  binaryOperation('calculation') %}
  | MultiplicationDivision  {% id %}


# Multiplication and division
MultiplicationDivision ->
    MultiplicationDivision %space %multiplicationDivision %space Parentheses  {% binaryOperation('calculation') %}
  | Parentheses   {% id %}


boolean ->
    "oui" {% boolean(true) %}
  | "non" {% boolean(false) %}

number ->
    %number {% number %}
  | %percentage {% percentage %}

string -> %string {% string %}