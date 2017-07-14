import R from 'ramda'
import {expect} from 'chai'
import daggy from 'daggy'

describe('simplified tree walks', function() {

	// Notre domaine peut se simplifier à une liste d'équations à trous:
	// a: 45
	// b: a + c
	// d: a + 4
	// e: b + d
	// Disons que je veux connaitre "e", alors il va me manquer "c"
	// Si je connais "c", alors je peux calculer "e"
	// Et mon ambition est aussi de pouvoir visualiser le calcul en HTML
	// Donc j'ai une structure plate que je transforme en arbre (ce n'est pas
	// le focus de la présente exploration), je veux pouvoir demander des choses
	// diverses à cet arbre: l'évaluer, repérer les trous, le transformer en HTML

	// Plus tard je vais avoir des trucs plus sophistiqués, par exemple:
	// 	b: a + (bleu: b, vert: c)
	// qui est équivalent à:
	// 	b: b-bleu + b-vert
	// 	b-bleu: a + b
	// 	b-vert: a + c
	// Le but du jeu est de pouvoir le représenter de façon compacte, mais
	// d'avoir un arbre simple à manipuler

	let evaluate = tree => tree.evaluate()
	let missing = tree => tree.missing()

	const Tree = daggy.taggedSum('Tree',
	{
		Number: ['number'],
		Sum: ['children'],
		Variable: ['name']
	})

	Tree.prototype.evaluate = function (f) {
		return this.cata({
			Number: (number) => parseInt(number),
			Sum: (children) => R.reduce(R.add,0,R.map(evaluate,children)),
		})
	}

	Tree.prototype.missing = function (f) {
		return this.cata({
			Number: (number) => [],
			Variable: (name) => [name],
			Sum: (children) => R.reduce(R.concat,[],R.map(missing,children)),
		})
	}

	it('should provide a protocol for evaluation', function() {
		let tree = Tree.Number("45"),
			result = tree.evaluate()
		expect(result).to.equal(45)
	});

	it('should evaluate expressions', function() {
		let tree = Tree.Sum([Tree.Number("45"),Tree.Number("25")]),
			result = tree.evaluate()
		expect(result).to.equal(70)
	});

	it('should evaluate nested expressions', function() {
		let tree = Tree.Sum([
						Tree.Sum([Tree.Number("35"),Tree.Number("10")]),
						Tree.Number("25")]),
			result = tree.evaluate()
		expect(result).to.equal(70)
	});

	it('should provide a protocol for missing variables', function() {
		let tree = Tree.Variable("a"),
			result = tree.missing()
		expect(result).to.deep.equal(["a"])
	});

	it('should locate missing variables in expressions', function() {
		let tree = Tree.Sum([Tree.Number("45"),Tree.Variable("a")]),
			result = tree.missing()
		expect(result).to.deep.equal(["a"])
	});

	it('should locate missing variables in nested expressions', function() {
		let tree = Tree.Sum([
						Tree.Sum([Tree.Number("35"),Tree.Variable("a")]),
						Tree.Number("25")]),
			result = tree.missing()
		expect(result).to.deep.equal(["a"])
	});

});
