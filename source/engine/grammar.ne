# This grammar is inspired by the "fancier grammar" tab of the nearley playground : https://omrelli.ug/nearley-playground

# Look for the PEMDAS system : Parentheses, Exponents (omitted here), Multiplication, and you should guess the rest :)

# This preprocessor was disabled because it doesn't work with Jest
# @preprocessor esmodule

@{%
const {string, filteredVariable, date, variable, temporalVariable,  binaryOperation, unaryOperation, boolean, number, numberWithUnit, percentage } = require('./grammarFunctions')

const moo = require("moo");

const dateRegexp = /(?:(?:0?[1-9]|[12][0-9]|3[01])\/)?(?:0?[1-9]|1[012])\/\d{4}/
const letter = '[a-zA-Z\u00C0-\u017F]';
const letterOrNumber = '[a-zA-Z\u00C0-\u017F0-9\']';
const word = `${letter}(?:[\-']?${letterOrNumber}+)*`;
const wordOrNumber = `(?:${word}|${letterOrNumber}+)`
const words = `${word}(?:[\\s]?${wordOrNumber}+)*`
const numberRegExp = '-?(?:[1-9][0-9]+|[0-9])(?:\\.[0-9]+)?';
const percentageRegExp = numberRegExp + '\\%'
const lexer = moo.compile({
  date: dateRegexp,
  percentage: new RegExp(percentageRegExp),
  '(': '(',
  ')': ')',
  '[': '[',
  ']': ']',
  comparison: ['>','<','>=','<=','=','!='],
  words: new RegExp(words),
  number: new RegExp(numberRegExp),
  string: /'[ \t\.'a-zA-Z\-\u00C0-\u017F0-9 ]+'/,
  additionSubstraction: /[\+-]/,
  multiplicationDivision: ['*','/'],
  '€': '€',
  dot: ' . ',
  letterOrNumber: new RegExp(letterOrNumber),
  space: { match: /[\s]+/, lineBreaks: true }
});

const join = (args) => ({value: (args.map(x => x && x.value).join(""))})
const flattenJoin = ([a, b]) => Array.isArray(b) ? join([a, ...b]) : a
%}

@lexer lexer

main ->
    AdditionSubstraction {% id %}
  | Comparison {% id %}
  | NonNumericTerminal {% id %}
  | Negation {% id %}
  | Date {% id %}

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

Date -> 
    Variable {% id %}
  | %date {% date %}

Comparison -> 
    Comparable %space %comparison %space Comparable {% binaryOperation('comparison')%}
  | Date %space %comparison %space Date {% binaryOperation('comparison')%}

Comparable -> (  AdditionSubstraction | NonNumericTerminal) {% ([[e]]) => e %}

NonNumericTerminal ->
	  boolean  {% id %}
	| string   {% id %}

Variable -> %words (%dot %words {% ([,words]) => words %}):* {% variable %}

BaseUnit ->
  %words {% id %}
  | "€" {% id %}

Unit -> BaseUnit ("/" BaseUnit {% join %}):? {% join %}

Filter -> "[" %words "]" {% ([,filter]) => filter %}
FilteredVariable -> Variable %space Filter {% filteredVariable %}

TemporalTransform -> "[" ("mensuel" | "annuel" {% id %}) "]" {% ([,temporality]) => temporality %}
TemporalVariable -> Variable %space TemporalTransform {% temporalVariable %}

AdditionSubstraction ->
    AdditionSubstraction %space %additionSubstraction %space MultiplicationDivision  {%  binaryOperation('calculation') %}
  | MultiplicationDivision  {% id %}

MultiplicationDivision ->
    MultiplicationDivision %space %multiplicationDivision %space Parentheses  {% binaryOperation('calculation') %}
  | Parentheses   {% id %}


boolean ->
    "oui" {% boolean(true) %}
  | "non" {% boolean(false) %}

number ->
    %number {% number %}
  | %number %space Unit {% numberWithUnit %}
  | %percentage {% percentage %}

string -> %string {% string %}