# This grammar is inspired by the "fancier grammar" tab of the nearley playground : https://omrelli.ug/nearley-playground

# Look for the PEMDAS system : Parentheses, Exponents (omitted here), Multiplication, and you should guess the rest :)

@preprocessor esmodule

@{%
import {string, filteredVariable, variable, temporalVariable,  operation, boolean, number, percentage } from './grammarFunctions'

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
  comparisonOperator: ['>','<','>=','<=','=','!='],
  additionSubstractionOperator: /[\+-]/,
  multiplicationDivisionOperator: ['*','/'],
  temporality: ['annuel' , 'mensuel'],
  words: new RegExp(words),
  string: /'[ \t\.'a-zA-Z\-\u00C0-\u017F0-9 ]+'/,
  dot: ' . ',
  _: { match: /[\s]/, lineBreaks: true }
});
%}

@lexer lexer

main ->
    AdditionSubstraction {% id %}
  | Comparison {% id %}
  | NonNumericTerminal {% id %}

NumericTerminal ->
	 	Variable {% id %}
  | TemporalVariable {% id %}
  | FilteredVariable {% id %}
  | number {% id %}

Parentheses ->
    "(" AdditionSubstraction ")"  {% ([,e]) => e %}
  |  NumericTerminal               {% id %}

Comparison -> Comparable %_ %comparisonOperator %_ Comparable {% operation('comparison')%}

Comparable -> (  AdditionSubstraction | NonNumericTerminal) {% ([[e]]) => e %}

NonNumericTerminal ->
	  boolean  {% id %}
	| string   {% id %}



Variable -> %words (%dot %words {% ([,words]) => words %}):*
{% variable %}


Filter -> "[" %words "]" {% ([,filter]) => filter %}
FilteredVariable -> Variable %_ Filter {% filteredVariable %}

TemporalTransform -> "[" %temporality "]" {% ([,temporality]) => temporality %}
TemporalVariable -> Variable %_ TemporalTransform {% temporalVariable %}

#-----

# Addition and subtraction
AdditionSubstraction ->
    AdditionSubstraction %_ %additionSubstractionOperator %_ MultiplicationDivision  {%  operation('calculation') %}
  | MultiplicationDivision  {% id %}


# Multiplication and division
MultiplicationDivision ->
    MultiplicationDivision %_ %multiplicationDivisionOperator %_ Parentheses  {% operation('calculation') %}
  | Parentheses   {% id %}


boolean ->
    "oui" {% boolean(true) %}
  | "non" {% boolean(false) %}

number ->
    %number {% number %}
  | %percentage {% percentage %}
string -> %string {% string %}