import Mocha from 'mocha';
import chokidar from 'chokidar';

const fs = require('fs');

const noop = () => {}

const loadYaml = (module, filename) =>  {
	const yaml = require('js-yaml');
	module.exports = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
}

const loadNearley = (module, filename) =>  {
	var nearley = require('nearley/lib/nearley.js');
	var compile = require('nearley/lib/compile.js');
	var generate = require('nearley/lib/generate.js');
	var grammar = require('nearley/lib/nearley-language-bootstrapped.js');

	var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
	parser.feed(fs.readFileSync(filename, 'utf8'));
	var compilation = compile(parser.results[0], {});
	var content = generate(compilation, 'Grammar');

	module._compile(content,filename)
}

require.extensions['.yaml'] = loadYaml
require.extensions['.ne'] = loadNearley
require.extensions['.css'] = noop

let fileList = [];
function runSuite() {
  Object.keys( require.cache ).forEach( key => delete require.cache[ key ] );
  const mocha = new Mocha( { reporter: 'dot' } );
  fileList.forEach( filepath => mocha.addFile( filepath ) );
  mocha.run();
}

/**
 * Chokidar watches all the files for any kind of change and calls the run function
 * from above. Read more: https://github.com/paulmillr/chokidar
 * @param  {string} a glob of files to watch
 * @param  {object} settings
 */
chokidar.watch( 'test/**/*.test.js', { persistent: true } )
  .on( 'add', path => fileList.push( path ) )
  .on( 'change', path => runSuite() )
  .on( 'ready', () => runSuite() );

chokidar.watch( 'source/**/*.js', { persistent: true } )
  .on( 'change', path => runSuite() )
