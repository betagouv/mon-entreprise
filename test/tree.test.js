import R from 'ramda'
import {expect} from 'chai'
import daggy from 'daggy'
import {Maybe as M} from 'ramda-fantasy'

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

	const Fx = daggy.tagged('Fx',['x'])
	const unFix = R.prop('x')

	const Expr = daggy.taggedSum('Expr',{
		Num: ['x'],
		Add: ['x', 'y'],
		Var: ['name']
	})
	const {Num, Add, Var} = Expr;

	// fold :: Functor f => (f a -> a) -> Fix f -> a
	const fold = R.curry((alg, x) => R.compose(alg, R.map(fold(alg)), unFix)(x))

	// Cette fonction fournit la traversée
	Expr.prototype.map = function(f) {
		return this.cata({
			Num: (x) => this, // fixed
			Add: (x, y) => Add(f(x), f(y)),
			Var: (name) => this
		})
	}

	// Celle-ci l'évaluation
	const evaluator = state => a => {
		return a.cata({
			Num: (x) => x,
			Add: (x, y) => R.lift(R.add)(x,y),
			Var: (name) => M.toMaybe(state[name]) // Doesn't typecheck
		})
	}

	let evaluate = (expr, state={}) =>
		fold(evaluator(state), expr)
		.getOrElse(null) // for convenience

	let num = x => Fx(Num(M.Just(x)))
	let add = (x, y) => Fx(Add(x,y))
	let ref = (name) => Fx(Var(name))

	it('should provide a protocol for evaluation', function() {
		let tree = num(45),
			result = evaluate(tree)
		expect(result).to.equal(45)
	});

	it('should evaluate expressions', function() {
		let tree = add(num(45),num(25)),
			result = evaluate(tree)
		expect(result).to.equal(70)
	});

	it('should evaluate nested expressions', function() {
		let tree = add(num(45),add(num(15),num(10))),
			result = evaluate(tree)
		expect(result).to.equal(70)
	});

	it('should evaluate expressions involving variables', function() {
		let tree = add(num(45),ref("a")),
			result = evaluate(tree,{a:25})
		expect(result).to.equal(70)
	});

	it('should evaluate expressions involving missing variables', function() {
		let tree = add(num(45),ref("b")),
			result = evaluate(tree,{a:25})
		expect(result).to.equal(null)
	});

/*
	it('should provide a protocol for missing variables', function() {
		let tree = Tree.Variable("a"),
			result = missing(tree)
		expect(result).to.deep.equal(["a"])
	});

	it('should locate missing variables in expressions', function() {
		let tree = Tree.Sum([Tree.Number("45"),Tree.Variable("a")]),
			result = missing(tree)
		expect(result).to.deep.equal(["a"])
	});

	it('should locate missing variables in nested expressions', function() {
		let tree = Tree.Sum([
						Tree.Sum([Tree.Number("35"),Tree.Variable("a")]),
						Tree.Number("25")]),
			result = missing(tree)
		expect(result).to.deep.equal(["a"])
	});
*/
});
