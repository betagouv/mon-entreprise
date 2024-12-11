var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/nearley/lib/nearley.js
var require_nearley = __commonJS({
  "../../node_modules/nearley/lib/nearley.js"(exports, module) {
    (function(root, factory) {
      if (typeof module === "object" && module.exports) {
        module.exports = factory();
      } else {
        root.nearley = factory();
      }
    })(exports, function() {
      function Rule2(name, symbols, postprocess) {
        this.id = ++Rule2.highestId;
        this.name = name;
        this.symbols = symbols;
        this.postprocess = postprocess;
        return this;
      }
      Rule2.highestId = 0;
      Rule2.prototype.toString = function(withCursorAt) {
        var symbolSequence = typeof withCursorAt === "undefined" ? this.symbols.map(getSymbolShortDisplay).join(" ") : this.symbols.slice(0, withCursorAt).map(getSymbolShortDisplay).join(" ") + " \u25CF " + this.symbols.slice(withCursorAt).map(getSymbolShortDisplay).join(" ");
        return this.name + " \u2192 " + symbolSequence;
      };
      function State(rule, dot2, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot2;
        this.reference = reference;
        this.data = [];
        this.wantedBy = wantedBy;
        this.isComplete = this.dot === rule.symbols.length;
      }
      State.prototype.toString = function() {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
      };
      State.prototype.nextState = function(child) {
        var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
          state.data = state.build();
          state.right = void 0;
        }
        return state;
      };
      State.prototype.build = function() {
        var children = [];
        var node = this;
        do {
          children.push(node.right.data);
          node = node.left;
        } while (node.left);
        children.reverse();
        return children;
      };
      State.prototype.finish = function() {
        if (this.rule.postprocess) {
          this.data = this.rule.postprocess(this.data, this.reference, Parser2.fail);
        }
      };
      function Column(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = {};
        this.scannable = [];
        this.completed = {};
      }
      Column.prototype.process = function(nextColumn) {
        var states = this.states;
        var wants = this.wants;
        var completed = this.completed;
        for (var w = 0; w < states.length; w++) {
          var state = states[w];
          if (state.isComplete) {
            state.finish();
            if (state.data !== Parser2.fail) {
              var wantedBy = state.wantedBy;
              for (var i = wantedBy.length; i--; ) {
                var left = wantedBy[i];
                this.complete(left, state);
              }
              if (state.reference === this.index) {
                var exp = state.rule.name;
                (this.completed[exp] = this.completed[exp] || []).push(state);
              }
            }
          } else {
            var exp = state.rule.symbols[state.dot];
            if (typeof exp !== "string") {
              this.scannable.push(state);
              continue;
            }
            if (wants[exp]) {
              wants[exp].push(state);
              if (completed.hasOwnProperty(exp)) {
                var nulls = completed[exp];
                for (var i = 0; i < nulls.length; i++) {
                  var right = nulls[i];
                  this.complete(state, right);
                }
              }
            } else {
              wants[exp] = [state];
              this.predict(exp);
            }
          }
        }
      };
      Column.prototype.predict = function(exp) {
        var rules = this.grammar.byName[exp] || [];
        for (var i = 0; i < rules.length; i++) {
          var r = rules[i];
          var wantedBy = this.wants[exp];
          var s = new State(r, 0, this.index, wantedBy);
          this.states.push(s);
        }
      };
      Column.prototype.complete = function(left, right) {
        var copy = left.nextState(right);
        this.states.push(copy);
      };
      function Grammar2(rules, start) {
        this.rules = rules;
        this.start = start || this.rules[0].name;
        var byName = this.byName = {};
        this.rules.forEach(function(rule) {
          if (!byName.hasOwnProperty(rule.name)) {
            byName[rule.name] = [];
          }
          byName[rule.name].push(rule);
        });
      }
      Grammar2.fromCompiled = function(rules, start) {
        var lexer2 = rules.Lexer;
        if (rules.ParserStart) {
          start = rules.ParserStart;
          rules = rules.ParserRules;
        }
        var rules = rules.map(function(r) {
          return new Rule2(r.name, r.symbols, r.postprocess);
        });
        var g = new Grammar2(rules, start);
        g.lexer = lexer2;
        return g;
      };
      function StreamLexer() {
        this.reset("");
      }
      StreamLexer.prototype.reset = function(data, state) {
        this.buffer = data;
        this.index = 0;
        this.line = state ? state.line : 1;
        this.lastLineBreak = state ? -state.col : 0;
      };
      StreamLexer.prototype.next = function() {
        if (this.index < this.buffer.length) {
          var ch = this.buffer[this.index++];
          if (ch === "\n") {
            this.line += 1;
            this.lastLineBreak = this.index;
          }
          return { value: ch };
        }
      };
      StreamLexer.prototype.save = function() {
        return {
          line: this.line,
          col: this.index - this.lastLineBreak
        };
      };
      StreamLexer.prototype.formatError = function(token, message) {
        var buffer = this.buffer;
        if (typeof buffer === "string") {
          var lines = buffer.split("\n").slice(
            Math.max(0, this.line - 5),
            this.line
          );
          var nextLineBreak = buffer.indexOf("\n", this.index);
          if (nextLineBreak === -1)
            nextLineBreak = buffer.length;
          var col = this.index - this.lastLineBreak;
          var lastLineDigits = String(this.line).length;
          message += " at line " + this.line + " col " + col + ":\n\n";
          message += lines.map(function(line, i) {
            return pad2(this.line - lines.length + i + 1, lastLineDigits) + " " + line;
          }, this).join("\n");
          message += "\n" + pad2("", lastLineDigits + col) + "^\n";
          return message;
        } else {
          return message + " at index " + (this.index - 1);
        }
        function pad2(n, length) {
          var s = String(n);
          return Array(length - s.length + 1).join(" ") + s;
        }
      };
      function Parser2(rules, start, options) {
        if (rules instanceof Grammar2) {
          var grammar = rules;
          var options = start;
        } else {
          var grammar = Grammar2.fromCompiled(rules, start);
        }
        this.grammar = grammar;
        this.options = {
          keepHistory: false,
          lexer: grammar.lexer || new StreamLexer()
        };
        for (var key in options || {}) {
          this.options[key] = options[key];
        }
        this.lexer = this.options.lexer;
        this.lexerState = void 0;
        var column = new Column(grammar, 0);
        var table = this.table = [column];
        column.wants[grammar.start] = [];
        column.predict(grammar.start);
        column.process();
        this.current = 0;
      }
      Parser2.fail = {};
      Parser2.prototype.feed = function(chunk) {
        var lexer2 = this.lexer;
        lexer2.reset(chunk, this.lexerState);
        var token;
        while (true) {
          try {
            token = lexer2.next();
            if (!token) {
              break;
            }
          } catch (e) {
            var nextColumn = new Column(this.grammar, this.current + 1);
            this.table.push(nextColumn);
            var err = new Error(this.reportLexerError(e));
            err.offset = this.current;
            err.token = e.token;
            throw err;
          }
          var column = this.table[this.current];
          if (!this.options.keepHistory) {
            delete this.table[this.current - 1];
          }
          var n = this.current + 1;
          var nextColumn = new Column(this.grammar, n);
          this.table.push(nextColumn);
          var literal = token.text !== void 0 ? token.text : token.value;
          var value = lexer2.constructor === StreamLexer ? token.value : token;
          var scannable = column.scannable;
          for (var w = scannable.length; w--; ) {
            var state = scannable[w];
            var expect = state.rule.symbols[state.dot];
            if (expect.test ? expect.test(value) : expect.type ? expect.type === token.type : expect.literal === literal) {
              var next = state.nextState({ data: value, token, isToken: true, reference: n - 1 });
              nextColumn.states.push(next);
            }
          }
          nextColumn.process();
          if (nextColumn.states.length === 0) {
            var err = new Error(this.reportError(token));
            err.offset = this.current;
            err.token = token;
            throw err;
          }
          if (this.options.keepHistory) {
            column.lexerState = lexer2.save();
          }
          this.current++;
        }
        if (column) {
          this.lexerState = lexer2.save();
        }
        this.results = this.finish();
        return this;
      };
      Parser2.prototype.reportLexerError = function(lexerError) {
        var tokenDisplay, lexerMessage;
        var token = lexerError.token;
        if (token) {
          tokenDisplay = "input " + JSON.stringify(token.text[0]) + " (lexer error)";
          lexerMessage = this.lexer.formatError(token, "Syntax error");
        } else {
          tokenDisplay = "input (lexer error)";
          lexerMessage = lexerError.message;
        }
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
      };
      Parser2.prototype.reportError = function(token) {
        var tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== void 0 ? token.value : token);
        var lexerMessage = this.lexer.formatError(token, "Syntax error");
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
      };
      Parser2.prototype.reportErrorCommon = function(lexerMessage, tokenDisplay) {
        var lines = [];
        lines.push(lexerMessage);
        var lastColumnIndex = this.table.length - 2;
        var lastColumn = this.table[lastColumnIndex];
        var expectantStates = lastColumn.states.filter(function(state) {
          var nextSymbol = state.rule.symbols[state.dot];
          return nextSymbol && typeof nextSymbol !== "string";
        });
        if (expectantStates.length === 0) {
          lines.push("Unexpected " + tokenDisplay + ". I did not expect any more input. Here is the state of my parse table:\n");
          this.displayStateStack(lastColumn.states, lines);
        } else {
          lines.push("Unexpected " + tokenDisplay + ". Instead, I was expecting to see one of the following:\n");
          var stateStacks = expectantStates.map(function(state) {
            return this.buildFirstStateStack(state, []) || [state];
          }, this);
          stateStacks.forEach(function(stateStack) {
            var state = stateStack[0];
            var nextSymbol = state.rule.symbols[state.dot];
            var symbolDisplay = this.getSymbolDisplay(nextSymbol);
            lines.push("A " + symbolDisplay + " based on:");
            this.displayStateStack(stateStack, lines);
          }, this);
        }
        lines.push("");
        return lines.join("\n");
      };
      Parser2.prototype.displayStateStack = function(stateStack, lines) {
        var lastDisplay;
        var sameDisplayCount = 0;
        for (var j = 0; j < stateStack.length; j++) {
          var state = stateStack[j];
          var display = state.rule.toString(state.dot);
          if (display === lastDisplay) {
            sameDisplayCount++;
          } else {
            if (sameDisplayCount > 0) {
              lines.push("    ^ " + sameDisplayCount + " more lines identical to this");
            }
            sameDisplayCount = 0;
            lines.push("    " + display);
          }
          lastDisplay = display;
        }
      };
      Parser2.prototype.getSymbolDisplay = function(symbol) {
        return getSymbolLongDisplay(symbol);
      };
      Parser2.prototype.buildFirstStateStack = function(state, visited) {
        if (visited.indexOf(state) !== -1) {
          return null;
        }
        if (state.wantedBy.length === 0) {
          return [state];
        }
        var prevState = state.wantedBy[0];
        var childVisited = [state].concat(visited);
        var childResult = this.buildFirstStateStack(prevState, childVisited);
        if (childResult === null) {
          return null;
        }
        return [state].concat(childResult);
      };
      Parser2.prototype.save = function() {
        var column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
      };
      Parser2.prototype.restore = function(column) {
        var index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;
        this.results = this.finish();
      };
      Parser2.prototype.rewind = function(index) {
        if (!this.options.keepHistory) {
          throw new Error("set option `keepHistory` to enable rewinding");
        }
        this.restore(this.table[index]);
      };
      Parser2.prototype.finish = function() {
        var considerations = [];
        var start = this.grammar.start;
        var column = this.table[this.table.length - 1];
        column.states.forEach(function(t) {
          if (t.rule.name === start && t.dot === t.rule.symbols.length && t.reference === 0 && t.data !== Parser2.fail) {
            considerations.push(t);
          }
        });
        return considerations.map(function(c) {
          return c.data;
        });
      };
      function getSymbolLongDisplay(symbol) {
        var type = typeof symbol;
        if (type === "string") {
          return symbol;
        } else if (type === "object") {
          if (symbol.literal) {
            return JSON.stringify(symbol.literal);
          } else if (symbol instanceof RegExp) {
            return "character matching " + symbol;
          } else if (symbol.type) {
            return symbol.type + " token";
          } else if (symbol.test) {
            return "token matching " + String(symbol.test);
          } else {
            throw new Error("Unknown symbol type: " + symbol);
          }
        }
      }
      function getSymbolShortDisplay(symbol) {
        var type = typeof symbol;
        if (type === "string") {
          return symbol;
        } else if (type === "object") {
          if (symbol.literal) {
            return JSON.stringify(symbol.literal);
          } else if (symbol instanceof RegExp) {
            return symbol.toString();
          } else if (symbol.type) {
            return "%" + symbol.type;
          } else if (symbol.test) {
            return "<" + String(symbol.test) + ">";
          } else {
            throw new Error("Unknown symbol type: " + symbol);
          }
        }
      }
      return {
        Parser: Parser2,
        Grammar: Grammar2,
        Rule: Rule2
      };
    });
  }
});

// ../../node_modules/moo/moo.js
var require_moo = __commonJS({
  "../../node_modules/moo/moo.js"(exports, module) {
    (function(root, factory) {
      if (typeof define === "function" && define.amd) {
        define([], factory);
      } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
      } else {
        root.moo = factory();
      }
    })(exports, function() {
      "use strict";
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var toString = Object.prototype.toString;
      var hasSticky = typeof new RegExp().sticky === "boolean";
      function isRegExp(o) {
        return o && toString.call(o) === "[object RegExp]";
      }
      function isObject(o) {
        return o && typeof o === "object" && !isRegExp(o) && !Array.isArray(o);
      }
      function reEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      }
      function reGroups(s) {
        var re = new RegExp("|" + s);
        return re.exec("").length - 1;
      }
      function reCapture(s) {
        return "(" + s + ")";
      }
      function reUnion(regexps) {
        if (!regexps.length)
          return "(?!)";
        var source = regexps.map(function(s) {
          return "(?:" + s + ")";
        }).join("|");
        return "(?:" + source + ")";
      }
      function regexpOrLiteral(obj) {
        if (typeof obj === "string") {
          return "(?:" + reEscape(obj) + ")";
        } else if (isRegExp(obj)) {
          if (obj.ignoreCase)
            throw new Error("RegExp /i flag not allowed");
          if (obj.global)
            throw new Error("RegExp /g flag is implied");
          if (obj.sticky)
            throw new Error("RegExp /y flag is implied");
          if (obj.multiline)
            throw new Error("RegExp /m flag is implied");
          return obj.source;
        } else {
          throw new Error("Not a pattern: " + obj);
        }
      }
      function pad2(s, length) {
        if (s.length > length) {
          return s;
        }
        return Array(length - s.length + 1).join(" ") + s;
      }
      function lastNLines(string2, numLines) {
        var position = string2.length;
        var lineBreaks = 0;
        while (true) {
          var idx = string2.lastIndexOf("\n", position - 1);
          if (idx === -1) {
            break;
          } else {
            lineBreaks++;
          }
          position = idx;
          if (lineBreaks === numLines) {
            break;
          }
          if (position === 0) {
            break;
          }
        }
        var startPosition = lineBreaks < numLines ? 0 : position + 1;
        return string2.substring(startPosition).split("\n");
      }
      function objectToRules(object) {
        var keys = Object.getOwnPropertyNames(object);
        var result = [];
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var thing = object[key];
          var rules = [].concat(thing);
          if (key === "include") {
            for (var j = 0; j < rules.length; j++) {
              result.push({ include: rules[j] });
            }
            continue;
          }
          var match = [];
          rules.forEach(function(rule) {
            if (isObject(rule)) {
              if (match.length)
                result.push(ruleOptions(key, match));
              result.push(ruleOptions(key, rule));
              match = [];
            } else {
              match.push(rule);
            }
          });
          if (match.length)
            result.push(ruleOptions(key, match));
        }
        return result;
      }
      function arrayToRules(array) {
        var result = [];
        for (var i = 0; i < array.length; i++) {
          var obj = array[i];
          if (obj.include) {
            var include = [].concat(obj.include);
            for (var j = 0; j < include.length; j++) {
              result.push({ include: include[j] });
            }
            continue;
          }
          if (!obj.type) {
            throw new Error("Rule has no type: " + JSON.stringify(obj));
          }
          result.push(ruleOptions(obj.type, obj));
        }
        return result;
      }
      function ruleOptions(type, obj) {
        if (!isObject(obj)) {
          obj = { match: obj };
        }
        if (obj.include) {
          throw new Error("Matching rules cannot also include states");
        }
        var options = {
          defaultType: type,
          lineBreaks: !!obj.error || !!obj.fallback,
          pop: false,
          next: null,
          push: null,
          error: false,
          fallback: false,
          value: null,
          type: null,
          shouldThrow: false
        };
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            options[key] = obj[key];
          }
        }
        if (typeof options.type === "string" && type !== options.type) {
          throw new Error("Type transform cannot be a string (type '" + options.type + "' for token '" + type + "')");
        }
        var match = options.match;
        options.match = Array.isArray(match) ? match : match ? [match] : [];
        options.match.sort(function(a, b) {
          return isRegExp(a) && isRegExp(b) ? 0 : isRegExp(b) ? -1 : isRegExp(a) ? 1 : b.length - a.length;
        });
        return options;
      }
      function toRules(spec) {
        return Array.isArray(spec) ? arrayToRules(spec) : objectToRules(spec);
      }
      var defaultErrorRule = ruleOptions("error", { lineBreaks: true, shouldThrow: true });
      function compileRules(rules, hasStates) {
        var errorRule = null;
        var fast = /* @__PURE__ */ Object.create(null);
        var fastAllowed = true;
        var unicodeFlag = null;
        var groups = [];
        var parts = [];
        for (var i = 0; i < rules.length; i++) {
          if (rules[i].fallback) {
            fastAllowed = false;
          }
        }
        for (var i = 0; i < rules.length; i++) {
          var options = rules[i];
          if (options.include) {
            throw new Error("Inheritance is not allowed in stateless lexers");
          }
          if (options.error || options.fallback) {
            if (errorRule) {
              if (!options.fallback === !errorRule.fallback) {
                throw new Error("Multiple " + (options.fallback ? "fallback" : "error") + " rules not allowed (for token '" + options.defaultType + "')");
              } else {
                throw new Error("fallback and error are mutually exclusive (for token '" + options.defaultType + "')");
              }
            }
            errorRule = options;
          }
          var match = options.match.slice();
          if (fastAllowed) {
            while (match.length && typeof match[0] === "string" && match[0].length === 1) {
              var word2 = match.shift();
              fast[word2.charCodeAt(0)] = options;
            }
          }
          if (options.pop || options.push || options.next) {
            if (!hasStates) {
              throw new Error("State-switching options are not allowed in stateless lexers (for token '" + options.defaultType + "')");
            }
            if (options.fallback) {
              throw new Error("State-switching options are not allowed on fallback tokens (for token '" + options.defaultType + "')");
            }
          }
          if (match.length === 0) {
            continue;
          }
          fastAllowed = false;
          groups.push(options);
          for (var j = 0; j < match.length; j++) {
            var obj = match[j];
            if (!isRegExp(obj)) {
              continue;
            }
            if (unicodeFlag === null) {
              unicodeFlag = obj.unicode;
            } else if (unicodeFlag !== obj.unicode && options.fallback === false) {
              throw new Error("If one rule is /u then all must be");
            }
          }
          var pat = reUnion(match.map(regexpOrLiteral));
          var regexp = new RegExp(pat);
          if (regexp.test("")) {
            throw new Error("RegExp matches empty string: " + regexp);
          }
          var groupCount = reGroups(pat);
          if (groupCount > 0) {
            throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: \u2026 ) instead");
          }
          if (!options.lineBreaks && regexp.test("\n")) {
            throw new Error("Rule should declare lineBreaks: " + regexp);
          }
          parts.push(reCapture(pat));
        }
        var fallbackRule = errorRule && errorRule.fallback;
        var flags = hasSticky && !fallbackRule ? "ym" : "gm";
        var suffix = hasSticky || fallbackRule ? "" : "|";
        if (unicodeFlag === true)
          flags += "u";
        var combined = new RegExp(reUnion(parts) + suffix, flags);
        return { regexp: combined, groups, fast, error: errorRule || defaultErrorRule };
      }
      function compile(rules) {
        var result = compileRules(toRules(rules));
        return new Lexer2({ start: result }, "start");
      }
      function checkStateGroup(g, name, map) {
        var state = g && (g.push || g.next);
        if (state && !map[state]) {
          throw new Error("Missing state '" + state + "' (in token '" + g.defaultType + "' of state '" + name + "')");
        }
        if (g && g.pop && +g.pop !== 1) {
          throw new Error("pop must be 1 (in token '" + g.defaultType + "' of state '" + name + "')");
        }
      }
      function compileStates(states, start) {
        var all = states.$all ? toRules(states.$all) : [];
        delete states.$all;
        var keys = Object.getOwnPropertyNames(states);
        if (!start)
          start = keys[0];
        var ruleMap = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          ruleMap[key] = toRules(states[key]).concat(all);
        }
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var rules = ruleMap[key];
          var included = /* @__PURE__ */ Object.create(null);
          for (var j = 0; j < rules.length; j++) {
            var rule = rules[j];
            if (!rule.include)
              continue;
            var splice = [j, 1];
            if (rule.include !== key && !included[rule.include]) {
              included[rule.include] = true;
              var newRules = ruleMap[rule.include];
              if (!newRules) {
                throw new Error("Cannot include nonexistent state '" + rule.include + "' (in state '" + key + "')");
              }
              for (var k = 0; k < newRules.length; k++) {
                var newRule = newRules[k];
                if (rules.indexOf(newRule) !== -1)
                  continue;
                splice.push(newRule);
              }
            }
            rules.splice.apply(rules, splice);
            j--;
          }
        }
        var map = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          map[key] = compileRules(ruleMap[key], true);
        }
        for (var i = 0; i < keys.length; i++) {
          var name = keys[i];
          var state = map[name];
          var groups = state.groups;
          for (var j = 0; j < groups.length; j++) {
            checkStateGroup(groups[j], name, map);
          }
          var fastKeys = Object.getOwnPropertyNames(state.fast);
          for (var j = 0; j < fastKeys.length; j++) {
            checkStateGroup(state.fast[fastKeys[j]], name, map);
          }
        }
        return new Lexer2(map, start);
      }
      function keywordTransform(map) {
        var isMap = typeof Map !== "undefined";
        var reverseMap = isMap ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
        var types = Object.getOwnPropertyNames(map);
        for (var i = 0; i < types.length; i++) {
          var tokenType = types[i];
          var item = map[tokenType];
          var keywordList = Array.isArray(item) ? item : [item];
          keywordList.forEach(function(keyword) {
            if (typeof keyword !== "string") {
              throw new Error("keyword must be string (in keyword '" + tokenType + "')");
            }
            if (isMap) {
              reverseMap.set(keyword, tokenType);
            } else {
              reverseMap[keyword] = tokenType;
            }
          });
        }
        return function(k) {
          return isMap ? reverseMap.get(k) : reverseMap[k];
        };
      }
      var Lexer2 = function(states, state) {
        this.startState = state;
        this.states = states;
        this.buffer = "";
        this.stack = [];
        this.reset();
      };
      Lexer2.prototype.reset = function(data, info) {
        this.buffer = data || "";
        this.index = 0;
        this.line = info ? info.line : 1;
        this.col = info ? info.col : 1;
        this.queuedToken = info ? info.queuedToken : null;
        this.queuedText = info ? info.queuedText : "";
        this.queuedThrow = info ? info.queuedThrow : null;
        this.setState(info ? info.state : this.startState);
        this.stack = info && info.stack ? info.stack.slice() : [];
        return this;
      };
      Lexer2.prototype.save = function() {
        return {
          line: this.line,
          col: this.col,
          state: this.state,
          stack: this.stack.slice(),
          queuedToken: this.queuedToken,
          queuedText: this.queuedText,
          queuedThrow: this.queuedThrow
        };
      };
      Lexer2.prototype.setState = function(state) {
        if (!state || this.state === state)
          return;
        this.state = state;
        var info = this.states[state];
        this.groups = info.groups;
        this.error = info.error;
        this.re = info.regexp;
        this.fast = info.fast;
      };
      Lexer2.prototype.popState = function() {
        this.setState(this.stack.pop());
      };
      Lexer2.prototype.pushState = function(state) {
        this.stack.push(this.state);
        this.setState(state);
      };
      var eat = hasSticky ? function(re, buffer) {
        return re.exec(buffer);
      } : function(re, buffer) {
        var match = re.exec(buffer);
        if (match[0].length === 0) {
          return null;
        }
        return match;
      };
      Lexer2.prototype._getGroup = function(match) {
        var groupCount = this.groups.length;
        for (var i = 0; i < groupCount; i++) {
          if (match[i + 1] !== void 0) {
            return this.groups[i];
          }
        }
        throw new Error("Cannot find token type for matched text");
      };
      function tokenToString() {
        return this.value;
      }
      Lexer2.prototype.next = function() {
        var index = this.index;
        if (this.queuedGroup) {
          var token = this._token(this.queuedGroup, this.queuedText, index);
          this.queuedGroup = null;
          this.queuedText = "";
          return token;
        }
        var buffer = this.buffer;
        if (index === buffer.length) {
          return;
        }
        var group = this.fast[buffer.charCodeAt(index)];
        if (group) {
          return this._token(group, buffer.charAt(index), index);
        }
        var re = this.re;
        re.lastIndex = index;
        var match = eat(re, buffer);
        var error = this.error;
        if (match == null) {
          return this._token(error, buffer.slice(index, buffer.length), index);
        }
        var group = this._getGroup(match);
        var text = match[0];
        if (error.fallback && match.index !== index) {
          this.queuedGroup = group;
          this.queuedText = text;
          return this._token(error, buffer.slice(index, match.index), index);
        }
        return this._token(group, text, index);
      };
      Lexer2.prototype._token = function(group, text, offset) {
        var lineBreaks = 0;
        if (group.lineBreaks) {
          var matchNL = /\n/g;
          var nl = 1;
          if (text === "\n") {
            lineBreaks = 1;
          } else {
            while (matchNL.exec(text)) {
              lineBreaks++;
              nl = matchNL.lastIndex;
            }
          }
        }
        var token = {
          type: typeof group.type === "function" && group.type(text) || group.defaultType,
          value: typeof group.value === "function" ? group.value(text) : text,
          text,
          toString: tokenToString,
          offset,
          lineBreaks,
          line: this.line,
          col: this.col
        };
        var size = text.length;
        this.index += size;
        this.line += lineBreaks;
        if (lineBreaks !== 0) {
          this.col = size - nl + 1;
        } else {
          this.col += size;
        }
        if (group.shouldThrow) {
          var err = new Error(this.formatError(token, "invalid syntax"));
          throw err;
        }
        if (group.pop)
          this.popState();
        else if (group.push)
          this.pushState(group.push);
        else if (group.next)
          this.setState(group.next);
        return token;
      };
      if (typeof Symbol !== "undefined" && Symbol.iterator) {
        var LexerIterator = function(lexer2) {
          this.lexer = lexer2;
        };
        LexerIterator.prototype.next = function() {
          var token = this.lexer.next();
          return { value: token, done: !token };
        };
        LexerIterator.prototype[Symbol.iterator] = function() {
          return this;
        };
        Lexer2.prototype[Symbol.iterator] = function() {
          return new LexerIterator(this);
        };
      }
      Lexer2.prototype.formatError = function(token, message) {
        if (token == null) {
          var text = this.buffer.slice(this.index);
          var token = {
            text,
            offset: this.index,
            lineBreaks: text.indexOf("\n") === -1 ? 0 : 1,
            line: this.line,
            col: this.col
          };
        }
        var numLinesAround = 2;
        var firstDisplayedLine = Math.max(token.line - numLinesAround, 1);
        var lastDisplayedLine = token.line + numLinesAround;
        var lastLineDigits = String(lastDisplayedLine).length;
        var displayedLines = lastNLines(
          this.buffer,
          this.line - token.line + numLinesAround + 1
        ).slice(0, 5);
        var errorLines = [];
        errorLines.push(message + " at line " + token.line + " col " + token.col + ":");
        errorLines.push("");
        for (var i = 0; i < displayedLines.length; i++) {
          var line = displayedLines[i];
          var lineNo = firstDisplayedLine + i;
          errorLines.push(pad2(String(lineNo), lastLineDigits) + "  " + line);
          if (lineNo === token.line) {
            errorLines.push(pad2("", lastLineDigits + token.col + 1) + "^");
          }
        }
        return errorLines.join("\n");
      };
      Lexer2.prototype.clone = function() {
        return new Lexer2(this.states, this.state);
      };
      Lexer2.prototype.has = function(tokenType) {
        return true;
      };
      return {
        compile,
        states: compileStates,
        error: Object.freeze({ error: true }),
        fallback: Object.freeze({ fallback: true }),
        keywords: keywordTransform
      };
    });
  }
});

// src/error.ts
var isPublicodesError = (error, name) => error instanceof PublicodesError && (name === void 0 ? true : error.name === name);
var PublicodesError = class extends Error {
  name;
  info;
  constructor(name, message, info, originalError) {
    super(buildMessage(name, message, info, originalError));
    this.name = name;
    this.info = info;
  }
};
var buildMessage = (name, message, info, originalError) => {
  const types = {
    SyntaxError: "Erreur syntaxique",
    EvaluationError: "Erreur d'\xE9valuation",
    UnknownRule: "R\xE8gle inconnue",
    PrivateRule: "R\xE8gle priv\xE9e"
  };
  const isError = /error/i.test(name);
  return `
[ ${types[name] ?? name} ]` + (info && "dottedName" in info && info.dottedName?.length ? `
\u27A1\uFE0F  Dans la r\xE8gle "${info.dottedName}"` : "") + `
${isError ? "\u2716\uFE0F" : "\u26A0\uFE0F"}  ${message}` + (originalError ? "\n" + (isError ? "    " : "\u2139\uFE0F  ") + originalError.message : "");
};
var PublicodesInternalError = class extends PublicodesError {
  constructor(payload) {
    super(
      "InternalError",
      `
Erreur interne du moteur.

Cette erreur est le signe d'un bug dans publicodes. Pour nous aider \xE0 le r\xE9soudre, vous pouvez copier ce texte dans un nouveau ticket : https://github.com/betagouv/mon-entreprise/issues/new.

payload:
${JSON.stringify(payload, null, 2)}
`,
      payload
    );
  }
};
var UnreachableCaseError = class extends PublicodesInternalError {
  constructor(value) {
    super(value);
  }
};
function warning(logger, message, information, originalError) {
  logger.warn(
    buildMessage("Avertissement", message, information, originalError)
  );
}
function experimentalRuleWarning(logger, dottedName) {
  logger.warn(
    buildMessage(
      "Avertissement",
      "Cette r\xE8gle est taggu\xE9e comme experimentale. \n\nCela veut dire qu'elle peut \xEAtre modifi\xE9e, renomm\xE9e, ou supprim\xE9e sans qu'il n'y ait de changement de version majeure dans l'API.\n",
      { dottedName }
    )
  );
}

// src/utils.ts
function addToMapSet(map, key, value) {
  if (map.has(key)) {
    map.get(key).add(value);
    return;
  }
  map.set(key, /* @__PURE__ */ new Set([value]));
}
function mergeWithArray(obj1, obj2) {
  return Object.entries(obj2).reduce(
    (obj, [key, value]) => ({
      ...obj,
      [key]: [...obj[key] ?? [], ...value]
    }),
    obj1
  );
}
var weakCopyObj = (obj) => {
  const copy = {};
  for (const key in obj) {
    copy[key] = obj[key];
  }
  return copy;
};

// src/AST/index.ts
function makeASTTransformer(fn, stopOnUpdate = true) {
  function transform(node) {
    const updatedNode = fn(node, transform);
    if (updatedNode === false) {
      return node;
    }
    if (updatedNode === void 0) {
      return traverseASTNode(transform, node);
    }
    return stopOnUpdate ? updatedNode : traverseASTNode(transform, updatedNode);
  }
  return transform;
}
function makeASTVisitor(fn) {
  function visit(node) {
    switch (fn(node, visit)) {
      case "continue":
        traverseASTNode(transformizedVisit, node);
        return;
      case "stop":
        return;
    }
  }
  const transformizedVisit = (node) => {
    visit(node);
    return node;
  };
  return visit;
}
function reduceAST(fn, start, node) {
  function traverseFn(acc, node2) {
    const result = fn(acc, node2, traverseFn.bind(null, start));
    if (result === void 0) {
      return getChildrenNodes(node2).reduce(traverseFn, acc);
    }
    return result;
  }
  return traverseFn(start, node);
}
function getChildrenNodes(node) {
  const nodes = [];
  traverseASTNode((node2) => {
    nodes.push(node2);
    return node2;
  }, node);
  return nodes;
}
function traverseParsedRules(fn, parsedRules) {
  const ret = {};
  for (const name in parsedRules) {
    ret[name] = fn(parsedRules[name]);
  }
  return ret;
}
var traverseASTNode = (fn, node) => {
  node = traverseSourceMap(fn, node);
  switch (node.nodeKind) {
    case "rule":
      return traverseRuleNode(fn, node);
    case "reference":
    case "constant":
      return node;
    case "arrondi":
      return traverseArrondiNode(fn, node);
    case "simplifier unit\xE9":
    case "variable manquante":
    case "est non applicable":
    case "est non d\xE9fini":
      return traverseUnaryOperationNode(fn, node);
    case "bar\xE8me":
    case "taux progressif":
    case "grille":
      return traverseNodeWithTranches(fn, node);
    case "une possibilit\xE9":
      return traverseArrayNode(fn, node);
    case "dur\xE9e":
      return traverseDur\u00E9eNode(fn, node);
    case "r\xE9soudre r\xE9f\xE9rence circulaire":
      return traverseR\u00E9soudreR\u00E9f\u00E9renceCirculaireNode(fn, node);
    case "inversion":
      return traverseInversionNode(fn, node);
    case "operation":
      return traverseOperationNode(fn, node);
    case "contexte":
      return traverseContexteNode(fn, node);
    case "unit\xE9":
      return traverseUnit\u00E9Node(fn, node);
    case "variations":
      return traverseVariationNode(fn, node);
    case "replacementRule":
      return traverseReplacementNode(fn, node);
    case "texte":
      return traverseTextNode(fn, node);
    case "condition":
      return traverseConditionNode(fn, node);
    default:
      throw new UnreachableCaseError(node);
  }
};
var traverseSourceMap = (fn, node) => {
  if (!("sourceMap" in node) || !node.sourceMap || !node.sourceMap.args) {
    return node;
  }
  const sourceMap = node.sourceMap;
  const args = {};
  for (const key in sourceMap.args) {
    const value = sourceMap.args[key];
    args[key] = Array.isArray(value) ? value.map((v) => fn(v)) : fn(value);
  }
  return {
    ...node,
    sourceMap: {
      ...sourceMap,
      args
    }
  };
};
var traverseRuleNode = (fn, node) => {
  const copy = weakCopyObj(node);
  copy.suggestions = {};
  for (const key in node.suggestions) {
    copy.suggestions[key] = fn(node.suggestions[key]);
  }
  copy.replacements = node.replacements.map(fn);
  copy.explanation = {
    ruleDisabledByItsParent: node.explanation.ruleDisabledByItsParent,
    nullableParent: node.explanation.nullableParent ? fn(node.explanation.nullableParent) : void 0,
    parents: node.explanation.parents.map(fn),
    valeur: fn(node.explanation.valeur)
  };
  return copy;
};
var traverseReplacementNode = (fn, node) => ({
  ...node,
  definitionRule: fn(node.definitionRule),
  replacedReference: fn(node.replacedReference),
  whiteListedNames: node.whiteListedNames.map(fn),
  blackListedNames: node.blackListedNames.map(fn)
});
var traverseUnaryOperationNode = (fn, node) => ({
  ...node,
  explanation: fn(node.explanation)
});
function traverseTranche(fn, tranches) {
  return tranches.map((tranche) => ({
    ...tranche,
    ...tranche.plafond && { plafond: fn(tranche.plafond) },
    ..."montant" in tranche && { montant: fn(tranche.montant) },
    ..."taux" in tranche && { taux: fn(tranche.taux) }
  }));
}
var traverseNodeWithTranches = (fn, node) => ({
  ...node,
  explanation: {
    assiette: fn(node.explanation.assiette),
    multiplicateur: fn(node.explanation.multiplicateur),
    tranches: traverseTranche(fn, node.explanation.tranches)
  }
});
var traverseArrayNode = (fn, node) => ({
  ...node,
  explanation: node.explanation.map(fn)
});
var traverseOperationNode = (fn, node) => {
  const copy = weakCopyObj(node);
  copy.explanation = [fn(node.explanation[0]), fn(node.explanation[1])];
  return copy;
};
var traverseDur\u00E9eNode = (fn, node) => ({
  ...node,
  explanation: {
    depuis: fn(node.explanation.depuis),
    "jusqu'\xE0": fn(node.explanation["jusqu'\xE0"])
  }
});
var traverseInversionNode = (fn, node) => ({
  ...node,
  explanation: {
    ...node.explanation,
    inversionCandidates: node.explanation.inversionCandidates.map(fn)
    // TODO
  }
});
var traverseArrondiNode = (fn, node) => ({
  ...node,
  explanation: {
    valeur: fn(node.explanation.valeur),
    arrondi: fn(node.explanation.arrondi)
  }
});
var traverseR\u00E9soudreR\u00E9f\u00E9renceCirculaireNode = (fn, node) => ({
  ...node,
  explanation: {
    ...node.explanation,
    valeur: fn(node.explanation.valeur)
  }
});
var traverseTextNode = (fn, node) => ({
  ...node,
  explanation: node.explanation.map(
    (element) => typeof element === "string" ? element : fn(element)
  )
});
var traverseContexteNode = (fn, node) => ({
  ...node,
  explanation: {
    ...node.explanation,
    contexte: node.explanation.contexte.map(([name, value]) => [
      fn(name),
      fn(value)
    ]),
    valeur: fn(node.explanation.valeur)
  }
});
var traverseUnit\u00E9Node = (fn, node) => {
  const copy = weakCopyObj(node);
  copy.explanation = fn(node.explanation);
  return copy;
};
var traverseVariationNode = (fn, node) => ({
  ...node,
  explanation: node.explanation.map(({ condition, consequence }) => ({
    condition: fn(condition),
    consequence: consequence && fn(consequence)
  }))
});
var traverseConditionNode = (fn, node) => {
  const copy = weakCopyObj(node);
  copy.explanation = {
    si: fn(node.explanation.si),
    alors: fn(node.explanation.alors),
    sinon: fn(node.explanation.sinon)
  };
  return copy;
};

// src/evaluationFunctions.ts
var evaluationFunctions = {
  constant: (node) => node
};
function registerEvaluationFunction(nodeKind, evaluationFunction) {
  evaluationFunctions ??= {};
  if (evaluationFunctions[nodeKind]) {
    throw new PublicodesError(
      "EvaluationError",
      `Multiple evaluation functions registered for the nodeKind \x1B[4m${nodeKind}`,
      { dottedName: "" }
    );
  }
  evaluationFunctions[nodeKind] = evaluationFunction;
}

// src/inferNodeType.ts
var UNDEFINED_TYPE = {
  isNullable: void 0,
  type: void 0
};
function inferNodesTypes(newRulesNames, parsedRules, nodesTypes) {
  function inferNodeUnitAndCache(node) {
    if (!node || typeof node !== "object") {
      return UNDEFINED_TYPE;
    }
    if (nodesTypes.has(node)) {
      return nodesTypes.get(node);
    }
    nodesTypes.set(node, UNDEFINED_TYPE);
    const type = inferNodeType(node);
    nodesTypes.set(node, type);
    return type;
  }
  function inferNodeType(node) {
    switch (node.nodeKind) {
      case "bar\xE8me":
      case "dur\xE9e":
      case "grille":
      case "taux progressif":
        return { isNullable: false, type: "number" };
      case "est non d\xE9fini":
      case "est non applicable":
        return { isNullable: false, type: "boolean" };
      case "constant":
        return {
          isNullable: node.isNullable ?? node.nodeValue === null,
          type: node.type
        };
      case "operation":
        return {
          isNullable: ["<", "<=", ">", ">=", "/", "*"].includes(node.operationKind) ? inferNodeUnitAndCache(node.explanation[0]).isNullable || inferNodeUnitAndCache(node.explanation[1]).isNullable : node.operationKind === "-" ? inferNodeUnitAndCache(node.explanation[0]).isNullable : false,
          type: ["<", "<=", ">", ">=", "=", "!=", "et", "ou"].includes(
            node.operationKind
          ) ? "boolean" : "number"
        };
      case "inversion":
      case "replacementRule":
      case "r\xE9soudre r\xE9f\xE9rence circulaire":
        return { isNullable: false, type: "number" };
      case "texte":
      case "une possibilit\xE9":
        return { isNullable: false, type: "string" };
      case "contexte":
      case "rule":
      case "arrondi":
        return inferNodeUnitAndCache(node.explanation.valeur);
      case "unit\xE9":
      case "simplifier unit\xE9":
      case "variable manquante":
        return inferNodeUnitAndCache(node.explanation);
      case "condition":
        return {
          isNullable: [
            node.explanation.si,
            node.explanation.alors,
            node.explanation.sinon
          ].some((n) => inferNodeUnitAndCache(n).isNullable),
          type: inferNodeUnitAndCache(node.explanation.alors).type ?? inferNodeUnitAndCache(node.explanation.sinon).type
        };
      case "variations": {
        const consequencesTypes = node.explanation.map(
          ({ consequence }) => inferNodeUnitAndCache(consequence)
        );
        return {
          isNullable: consequencesTypes.some(
            (consequence) => consequence.isNullable
          ),
          type: consequencesTypes.map((c) => c.type).find((type) => type !== void 0)
        };
      }
      case "reference":
        return inferNodeUnitAndCache(parsedRules[node.dottedName]);
    }
  }
  newRulesNames.forEach((name) => {
    const rule = parsedRules[name];
    inferNodeUnitAndCache(rule);
    rule.explanation.parents.forEach(inferNodeUnitAndCache);
  });
  return nodesTypes;
}

// src/evaluationUtils.ts
var collectNodeMissing = (node) => "missingVariables" in node ? node.missingVariables : {};
var bonus = (missings = {}) => Object.fromEntries(
  Object.entries(missings).map(([key, value]) => [key, value + 1])
);
var mergeMissing = (left = {}, right = {}) => Object.fromEntries(
  [...Object.keys(left), ...Object.keys(right)].map((key) => [
    key,
    (left[key] ?? 0) + (right[key] ?? 0)
  ])
);
var mergeAllMissing = (missings) => missings.map(collectNodeMissing).reduce(mergeMissing, {});
var defaultNode = (nodeValue) => ({
  nodeValue,
  type: typeof nodeValue,
  isDefault: true,
  nodeKind: "constant"
});
var notApplicableNode = {
  nodeKind: "constant",
  nodeValue: null,
  missingVariables: {},
  type: void 0,
  isNullable: true
};
var undefinedNode = {
  nodeKind: "constant",
  nodeValue: void 0,
  missingVariables: {},
  type: void 0,
  isNullable: false
};
var undefinedNumberNode = {
  ...undefinedNode,
  type: "number"
};

// src/mecanisms/inlineMecanism.ts
function createParseInlinedMecanism(name, args, body) {
  let parsedBody;
  let parsedDefaultArgs;
  function parseInlineMecanism(providedArgs, context) {
    parsedBody ??= parse(body, createContext({ dottedName: "INLINE_MECANISM" }));
    parsedDefaultArgs ??= {};
    for (const name2 in args) {
      if ("par d\xE9faut" in args[name2]) {
        parsedDefaultArgs[name2] = parse(
          args[name2]["par d\xE9faut"],
          createContext({})
        );
      }
    }
    if (Object.keys(args).length === 1 && "valeur" in args) {
      providedArgs = {
        valeur: providedArgs
      };
    }
    const parsedProvidedArgs = {};
    for (const name2 in providedArgs) {
      parsedProvidedArgs[name2] = parse(providedArgs[name2], context);
    }
    const parsedInlineMecanism = makeASTTransformer((node) => {
      if (node.nodeKind !== "reference" || !(node.name in args)) {
        return;
      }
      const argName = node.name;
      if (argName in parsedProvidedArgs) {
        return parsedProvidedArgs[argName];
      }
      if (argName in parsedDefaultArgs) {
        return parsedDefaultArgs[argName];
      }
      throw new PublicodesError(
        "SyntaxError",
        `Il manque la cl\xE9 '${argName} dans le m\xE9canisme ${name}`,
        { dottedName: argName }
      );
    })(parsedBody);
    parsedInlineMecanism.sourceMap = {
      mecanismName: name,
      args: parsedProvidedArgs
    };
    return parsedInlineMecanism;
  }
  parseInlineMecanism.nom = name;
  return Object.assign(parseInlineMecanism, "name", {
    value: `parse${toCamelCase(name)}Inline`
  });
}
function createParseInlinedMecanismWithArray(name, args, body) {
  function parseInlineMecanism(providedArgs, context) {
    if (Object.keys(args).length === 1 && "valeur" in args) {
      providedArgs = {
        valeur: providedArgs
      };
    }
    const parsedProvidedArgs = {};
    for (const name2 in providedArgs) {
      const value = providedArgs[name2];
      parsedProvidedArgs[name2] = Array.isArray(value) ? value.map((v) => parse(v, context)) : parse(value, context);
    }
    const parsedInlineMecanism = parse(body(parsedProvidedArgs), context);
    parsedInlineMecanism.sourceMap = {
      mecanismName: name,
      args: parsedProvidedArgs
    };
    return parsedInlineMecanism;
  }
  parseInlineMecanism.nom = name;
  return Object.assign(parseInlineMecanism, "name", {
    value: `parse${toCamelCase(name)}Inline`
  });
}
function toCamelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr) => ltr.toUpperCase()).replace(/\s+/g, "");
}

// src/mecanisms/abattement.ts
var abattement_default = createParseInlinedMecanism(
  "abattement",
  {
    abattement: {},
    valeur: {}
  },
  {
    "-": ["valeur", "abattement"],
    plancher: 0
  }
);

// src/mecanisms/applicable.ts
var applicable_default = createParseInlinedMecanism(
  "applicable si",
  {
    "applicable si": {},
    valeur: {}
  },
  {
    condition: {
      si: "applicable si != non",
      alors: "valeur",
      sinon: notApplicableNode
    }
  }
);

// src/units.ts
var parseUnit = (string2, getUnitKey = (x) => x) => {
  if (string2.includes(" /") || string2.includes("/ ")) {
    throw new Error(
      `L'unit\xE9 "${string2}" ne doit pas contenir d'espace avant et apr\xE8s "/"`
    );
  }
  const [a, ...b] = string2.split("/");
  const splitUnit = (string3) => decomposePower(
    string3.split(".").filter(Boolean).map((unit) => getUnitKey(unit))
  );
  const result = {
    numerators: splitUnit(a),
    denominators: b.flatMap((u) => splitUnit(u))
  };
  return result;
};
var lastNumberFromString = /(\d+)(?!.*[A-Za-z])/g;
function getUnitCounts(baseUnits) {
  const countUnits = {};
  baseUnits.forEach((e) => {
    const powerMatch = e.match(lastNumberFromString);
    if (powerMatch != null) {
      const power = powerMatch[0];
      const primaryUnit = e.split(power)[0];
      countUnits[primaryUnit] = (countUnits[primaryUnit] ?? 0) + +power;
    } else {
      countUnits[e] = (countUnits[e] ?? 0) + 1;
    }
  });
  return countUnits;
}
function decomposePower(baseUnits) {
  const unitCounts = getUnitCounts(baseUnits);
  return Object.entries(unitCounts).flatMap(
    ([primaryUnit, power]) => Array(power).fill(primaryUnit)
  );
}
function combinePower(baseUnit) {
  const unitCounts = getUnitCounts(baseUnit);
  return Object.entries(unitCounts).map(
    ([primaryUnit, power]) => power > 1 ? `${primaryUnit}${power}` : primaryUnit
  );
}
var printUnits = (units, count, formatUnit2 = (x) => x) => {
  return combinePower(units.map((unit) => formatUnit2(unit, count))).join(".");
};
var plural = 2;
function serializeUnit(rawUnit, count = plural, formatUnit2 = (x) => x) {
  if (rawUnit === null || typeof rawUnit !== "object") {
    return typeof rawUnit === "string" ? formatUnit2(rawUnit, count) : rawUnit;
  }
  const unit = simplify(rawUnit);
  const { numerators = [], denominators = [] } = unit;
  const n = numerators.length > 0;
  const d = denominators.length > 0;
  const string2 = !n && !d ? "" : n && !d ? printUnits(numerators, count, formatUnit2) : !n && d ? `/${printUnits(denominators, 1, formatUnit2)}` : `${printUnits(numerators, plural, formatUnit2)}/${printUnits(
    denominators,
    1,
    formatUnit2
  )}`;
  return string2;
}
var noUnit = { numerators: [], denominators: [] };
var inferUnit = (operator, rawUnits) => {
  if (operator === "/") {
    if (rawUnits.length !== 2) {
      throw new PublicodesError(
        "InternalError",
        "Infer units of a division with units.length !== 2)",
        {}
      );
    }
    return inferUnit("*", [
      rawUnits[0] || noUnit,
      {
        numerators: (rawUnits[1] || noUnit).denominators,
        denominators: (rawUnits[1] || noUnit).numerators
      }
    ]);
  }
  const units = rawUnits.filter(Boolean);
  if (units.length <= 1) {
    return units[0];
  }
  if (operator === "*")
    return simplify({
      numerators: units.flatMap((u) => u?.numerators ?? []),
      denominators: units.flatMap((u) => u?.denominators ?? [])
    });
  if (operator === "-" || operator === "+") {
    return rawUnits.find((u) => u);
  }
  return void 0;
};
var equals = (a, b) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((_, i) => a[i] === b[i]);
  } else {
    return a === b;
  }
};
var removeOnce = (element, eqFn = equals) => (list) => {
  const index = list.findIndex((e) => eqFn(e, element));
  return list.filter((_, i) => i !== index);
};
var simplify = (unit, eqFn = equals) => {
  const simplifiedUnit = [...unit.numerators, ...unit.denominators].reduce(
    ({ numerators, denominators }, next) => numerators.find((u) => eqFn(next, u)) && denominators.find((u) => eqFn(next, u)) ? {
      numerators: removeOnce(next, eqFn)(numerators),
      denominators: removeOnce(next, eqFn)(denominators)
    } : { numerators, denominators },
    unit
  );
  return simplifiedUnit;
};
var convertTable = {
  "mois/an": 12,
  "jour/an": 365,
  "jour/mois": 365 / 12,
  "trimestre/an": 4,
  "mois/trimestre": 3,
  "jour/trimestre": 365 / 12 * 3,
  "\u20AC/k\u20AC": 10 ** 3,
  "g/kg": 10 ** 3,
  "mg/g": 10 ** 3,
  "mg/kg": 10 ** 6,
  "m/km": 10 ** 3,
  "cm/m": 10 ** 2,
  "mm/cm": 10 ** 1,
  "mm/m": 10 ** 3,
  "cm/km": 10 ** 5,
  "mm/km": 10 ** 6
};
function singleUnitConversionFactor(from, to) {
  return convertTable[`${to}/${from}`] || convertTable[`${from}/${to}`] && 1 / convertTable[`${from}/${to}`];
}
function unitsConversionFactor(from, to) {
  let factor = 100 ** // Factor is mutliplied or divided 100 for each '%' in units
  (to.filter((unit) => unit === "%").length - from.filter((unit) => unit === "%").length);
  [factor] = from.reduce(
    ([value, toUnits], fromUnit) => {
      const index = toUnits.findIndex(
        (toUnit) => !!singleUnitConversionFactor(fromUnit, toUnit)
      );
      const factor2 = singleUnitConversionFactor(fromUnit, toUnits[index]) || 1;
      return [
        value * factor2,
        [...toUnits.slice(0, index + 1), ...toUnits.slice(index + 1)]
      ];
    },
    [factor, to]
  );
  return factor;
}
var equivalentTable = {
  "kW.h": "kWh",
  "mn/h": "noeud"
};
function areEquivalentSerializedUnit(serializedFrom, serializedTo) {
  if (!serializedFrom || !serializedTo)
    return false;
  return serializedFrom === serializedTo || serializedFrom === equivalentTable[serializedTo] || serializedTo === equivalentTable[serializedFrom];
}
function convertUnit(from, to, value) {
  const serializedFrom = serializeUnit(from);
  const serializedTo = serializeUnit(to);
  if (!areEquivalentSerializedUnit(serializedFrom, serializedTo) && !areUnitConvertible(from, to)) {
    throw new PublicodesError(
      "EngineError",
      `Impossible de convertir l'unit\xE9 '${serializedFrom}' en '${serializedTo}'`,
      {}
    );
  }
  if (!value) {
    return value;
  }
  if (from === void 0) {
    return value;
  }
  const [fromSimplified, factorTo] = simplifyUnitWithValue(from || noUnit);
  const [toSimplified, factorFrom] = simplifyUnitWithValue(to || noUnit);
  return round(
    value * factorTo / factorFrom * unitsConversionFactor(
      fromSimplified.numerators,
      toSimplified.numerators
    ) * unitsConversionFactor(
      toSimplified.denominators,
      fromSimplified.denominators
    )
  );
}
var convertibleUnitClasses = unitClasses(convertTable);
function unitClasses(convertTable2) {
  return Object.keys(convertTable2).reduce(
    (classes, ratio) => {
      const [a, b] = ratio.split("/");
      const ia = classes.findIndex((units) => units.has(a));
      const ib = classes.findIndex((units) => units.has(b));
      if (ia > -1 && ib > -1 && ia !== ib) {
        throw new PublicodesError("EngineError", `Invalid ratio ${ratio}`, {});
      } else if (ia === -1 && ib === -1) {
        classes.push(/* @__PURE__ */ new Set([a, b]));
      } else if (ia > -1) {
        classes[ia].add(b);
      } else if (ib > -1) {
        classes[ib].add(a);
      }
      return classes;
    },
    []
  );
}
function areSameClass(a, b) {
  return a === b || convertibleUnitClasses.some(
    (unitsClass) => unitsClass.has(a) && unitsClass.has(b)
  );
}
function round(value) {
  return +value.toFixed(16);
}
function simplifyUnit(unit) {
  const { numerators, denominators } = simplify(unit, areSameClass);
  if (numerators.length && numerators.every((symb) => symb === "%")) {
    return { numerators: ["%"], denominators };
  }
  return removePercentages({ numerators, denominators });
}
function simplifyUnitWithValue(unit, value = 1) {
  const factor = unitsConversionFactor(unit.numerators, unit.denominators);
  return [
    simplify(removePercentages(unit), areSameClass),
    value ? round(value * factor) : value
  ];
}
var removePercentages = (unit) => ({
  numerators: unit.numerators.filter((e) => e !== "%"),
  denominators: unit.denominators.filter((e) => e !== "%")
});
function areUnitConvertible(a, b) {
  if (a == null || b == null) {
    return true;
  }
  const countByUnitClass = (units) => units.reduce((counters, unit) => {
    const classIndex = convertibleUnitClasses.findIndex(
      (unitClass) => unitClass.has(unit)
    );
    const key = classIndex === -1 ? unit : "" + classIndex;
    return { ...counters, [key]: 1 + (counters[key] ?? 0) };
  }, {});
  const [numA, denomA, numB, denomB] = [
    a.numerators,
    a.denominators,
    b.numerators,
    b.denominators
  ].map(countByUnitClass);
  const uniq = (arr) => [...new Set(arr)];
  const unitClasses2 = [numA, denomA, numB, denomB].map(Object.keys).flat();
  return uniq(unitClasses2).every(
    (unitClass) => (numA[unitClass] || 0) - (denomA[unitClass] || 0) === (numB[unitClass] || 0) - (denomB[unitClass] || 0) || unitClass === "%"
  );
}

// src/mecanisms/arrondi.ts
function roundWithPrecision(n, fractionDigits) {
  return +n.toFixed(fractionDigits);
}
var evaluate = function(node) {
  const valeur = simplifyNodeUnit(this.evaluateNode(node.explanation.valeur));
  const nodeValue = valeur.nodeValue;
  let arrondi = node.explanation.arrondi;
  if (nodeValue !== false) {
    arrondi = this.evaluateNode(arrondi);
    if (typeof arrondi.nodeValue === "number" && !serializeUnit(arrondi.unit)?.match(/décimales?/)) {
      throw new PublicodesError(
        "EvaluationError",
        `L'unit\xE9 ${serializeUnit(
          arrondi.unit
        )} de l'arrondi est inconnu. Vous devez utiliser l'unit\xE9 \u201Cd\xE9cimales\u201D`,
        { dottedName: this.cache._meta.evaluationRuleStack[0] }
      );
    }
  }
  return {
    ...node,
    nodeValue: typeof valeur.nodeValue !== "number" || !("nodeValue" in arrondi) ? valeur.nodeValue : typeof arrondi.nodeValue === "number" ? roundWithPrecision(valeur.nodeValue, arrondi.nodeValue) : arrondi.nodeValue === true ? roundWithPrecision(valeur.nodeValue, 0) : arrondi.nodeValue === void 0 ? void 0 : valeur.nodeValue,
    explanation: { valeur, arrondi },
    missingVariables: mergeAllMissing([valeur, arrondi]),
    unit: valeur.unit
  };
};
function parseArrondi(v, context) {
  const explanation = {
    valeur: parse(v.valeur, context),
    arrondi: parse(v.arrondi, context)
  };
  return {
    explanation,
    nodeKind: parseArrondi.nom
  };
}
parseArrondi.nom = "arrondi";
registerEvaluationFunction(parseArrondi.nom, evaluate);

// src/nodeUnits.ts
function simplifyNodeUnit(node) {
  if (!node.unit) {
    return node;
  }
  const unit = simplifyUnit(node.unit);
  return convertNodeToUnit(unit, node);
}
function convertNodeToUnit(to, node) {
  return {
    ...node,
    nodeValue: node.unit && typeof node.nodeValue === "number" ? convertUnit(node.unit, to, node.nodeValue) : node.nodeValue,
    unit: to
  };
}

// src/format.ts
var numberFormatter = ({
  style,
  maximumFractionDigits = 2,
  minimumFractionDigits = 0,
  language
}) => (value) => {
  const adaptedMinimumFractionDigits = style === "currency" && maximumFractionDigits >= 2 && minimumFractionDigits === 0 && !Number.isInteger(value) ? 2 : minimumFractionDigits;
  return Intl.NumberFormat(language, {
    style,
    currency: "EUR",
    maximumFractionDigits,
    minimumFractionDigits: adaptedMinimumFractionDigits
  }).format(value);
};
function formatNumber({
  maximumFractionDigits,
  minimumFractionDigits,
  language,
  formatUnit: formatUnit2,
  unit,
  nodeValue
}) {
  if (typeof nodeValue !== "number") {
    return nodeValue;
  }
  const serializedUnit = unit ? serializeUnit(unit, nodeValue, formatUnit2) : void 0;
  switch (serializedUnit) {
    case "\u20AC":
      return numberFormatter({
        style: "currency",
        maximumFractionDigits,
        minimumFractionDigits,
        language
      })(nodeValue);
    case "%":
      return numberFormatter({
        style: "percent",
        maximumFractionDigits,
        language
      })(nodeValue / 100);
    default:
      return numberFormatter({
        style: "decimal",
        minimumFractionDigits,
        maximumFractionDigits,
        language
      })(nodeValue) + (typeof serializedUnit === "string" ? `\xA0${serializedUnit}` : "");
  }
}
function capitalise0(name) {
  return name && name[0].toUpperCase() + name.slice(1);
}
var booleanTranslations = {
  fr: { true: "oui", false: "non" },
  en: { true: "yes", false: "no" }
};
function formatValue(value, { language = "fr", displayedUnit, formatUnit: formatUnit2, precision = 2 } = {}) {
  let nodeValue = typeof value === "number" || typeof value === "undefined" || value === null ? value : value.nodeValue;
  if (typeof nodeValue === "number" && Number.isNaN(nodeValue)) {
    return "Erreur dans le calcul du nombre";
  }
  if (nodeValue === void 0) {
    return "Pas encore d\xE9fini";
  }
  if (nodeValue === null) {
    return "Non applicable";
  }
  if (typeof nodeValue === "string") {
    return nodeValue.replace("\\n", "\n");
  }
  if (typeof nodeValue === "boolean")
    return booleanTranslations[language][nodeValue];
  if (typeof nodeValue === "number") {
    let unit = typeof value === "number" || typeof value === "undefined" || !("unit" in value) ? void 0 : value.unit;
    if (unit) {
      const simplifiedNode = simplifyNodeUnit({
        unit,
        nodeValue
      });
      unit = simplifiedNode.unit;
      nodeValue = simplifiedNode.nodeValue;
    }
    return formatNumber({
      minimumFractionDigits: 0,
      maximumFractionDigits: precision,
      language,
      formatUnit: formatUnit2,
      nodeValue,
      unit: displayedUnit ?? unit
    }).trim();
  }
  return void 0;
}

// src/ruleUtils.ts
var ruleUtils_exports = {};
__export(ruleUtils_exports, {
  contextNameToDottedName: () => contextNameToDottedName,
  cyclicDependencies: () => cyclicDependencies,
  decodeRuleName: () => decodeRuleName,
  disambiguateReference: () => disambiguateReference,
  disambiguateReferenceNode: () => disambiguateReferenceNode,
  encodeRuleName: () => encodeRuleName,
  findCommonAncestor: () => findCommonAncestor,
  getChildrenRules: () => getChildrenRules,
  isAccessible: () => isAccessible,
  isExperimental: () => isExperimental,
  nameLeaf: () => nameLeaf,
  ruleParent: () => ruleParent,
  ruleParents: () => ruleParents,
  ruleWithDedicatedDocumentationPage: () => ruleWithDedicatedDocumentationPage,
  updateReferencesMapsFromReferenceNode: () => updateReferencesMapsFromReferenceNode
});

// src/AST/findCycles.ts
function has(obj, key) {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}
function constant(value) {
  return function() {
    return value;
  };
}
var DEFAULT_EDGE_NAME = "\0";
var EDGE_KEY_DELIM = "";
var incrementOrInitEntry = (map, k) => {
  if (map[k]) {
    map[k]++;
  } else {
    map[k] = 1;
  }
};
var decrementOrRemoveEntry = (map, k) => {
  if (!--map[k]) {
    delete map[k];
  }
};
var edgeArgsToId = (isDirected, v_, w_, name) => {
  let v = "" + v_;
  let w = "" + w_;
  if (!isDirected && v > w) {
    const tmp = v;
    v = w;
    w = tmp;
  }
  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM + (name === void 0 ? DEFAULT_EDGE_NAME : name);
};
var edgeArgsToObj = (isDirected, v_, w_, name) => {
  let v = "" + v_;
  let w = "" + w_;
  if (!isDirected && v > w) {
    const tmp = v;
    v = w;
    w = tmp;
  }
  const edgeObj = { v, w };
  if (name) {
    edgeObj.name = name;
  }
  return edgeObj;
};
var edgeObjToId = (isDirected, edgeObj) => {
  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
};
var Graph = class {
  _nodeCount = 0;
  _edgeCount = 0;
  _isDirected;
  _label;
  _defaultNodeLabelFn;
  _defaultEdgeLabelFn;
  _nodes;
  _in;
  _preds;
  _out;
  _sucs;
  _edgeObjs;
  _edgeLabels;
  constructor(opts = {}) {
    this._isDirected = has(opts, "directed") ? opts.directed : true;
    this._label = void 0;
    this._defaultNodeLabelFn = constant(void 0);
    this._defaultEdgeLabelFn = constant(void 0);
    this._nodes = {};
    this._in = {};
    this._preds = {};
    this._out = {};
    this._sucs = {};
    this._edgeObjs = {};
    this._edgeLabels = {};
  }
  /* === Graph functions ========= */
  isDirected() {
    return this._isDirected;
  }
  setGraph(label) {
    this._label = label;
    return this;
  }
  graph() {
    return this._label;
  }
  /* === Node functions ========== */
  nodeCount() {
    return this._nodeCount;
  }
  nodes() {
    return Object.keys(this._nodes);
  }
  setNode(v, value = void 0) {
    if (has(this._nodes, v)) {
      if (arguments.length > 1) {
        this._nodes[v] = value;
      }
      return this;
    }
    this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
    this._in[v] = {};
    this._preds[v] = {};
    this._out[v] = {};
    this._sucs[v] = {};
    ++this._nodeCount;
    return this;
  }
  setNodes(vs, value) {
    vs.forEach((v) => {
      if (value !== void 0) {
        this.setNode(v, value);
      } else {
        this.setNode(v);
      }
    });
    return this;
  }
  node(v) {
    return this._nodes[v];
  }
  hasNode(v) {
    return has(this._nodes, v);
  }
  successors(v) {
    const sucsV = this._sucs[v];
    if (sucsV) {
      return Object.keys(sucsV);
    }
  }
  /* === Edge functions ========== */
  edgeCount() {
    return this._edgeCount;
  }
  edges() {
    return Object.values(this._edgeObjs);
  }
  setEdge(v, w, value = void 0, name = void 0) {
    v = "" + v;
    w = "" + w;
    const e = edgeArgsToId(this._isDirected, v, w, name);
    if (has(this._edgeLabels, e)) {
      if (value !== void 0) {
        this._edgeLabels[e] = value;
      }
      return this;
    }
    this.setNode(v);
    this.setNode(w);
    this._edgeLabels[e] = value !== void 0 ? value : this._defaultEdgeLabelFn(v, w, name);
    const edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
    v = edgeObj.v;
    w = edgeObj.w;
    Object.freeze(edgeObj);
    this._edgeObjs[e] = edgeObj;
    incrementOrInitEntry(this._preds[w], v);
    incrementOrInitEntry(this._sucs[v], w);
    this._in[w][e] = edgeObj;
    this._out[v][e] = edgeObj;
    this._edgeCount++;
    return this;
  }
  edge(v, w, name) {
    const e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
    return this._edgeLabels[e];
  }
  hasEdge(v, w, name) {
    const e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
    return has(this._edgeLabels, e);
  }
  removeEdge(v, w, name) {
    const e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
    const edge = this._edgeObjs[e];
    if (edge) {
      v = edge.v;
      w = edge.w;
      delete this._edgeLabels[e];
      delete this._edgeObjs[e];
      decrementOrRemoveEntry(this._preds[w], v);
      decrementOrRemoveEntry(this._sucs[v], w);
      delete this._in[w][e];
      delete this._out[v][e];
      this._edgeCount--;
    }
    return this;
  }
  outEdges(v, w = void 0) {
    const outV = this._out[v];
    if (outV) {
      const edges = Object.values(outV);
      if (w === void 0) {
        return edges;
      }
      return edges.filter(function(edge) {
        return edge.w === w;
      });
    }
  }
};
function tarjan(graph) {
  let index = 0;
  const stack = [];
  const visited = {};
  const results = [];
  function dfs(v) {
    const entry = visited[v] = {
      onStack: true,
      lowlink: index,
      index: index++
    };
    stack.push(v);
    graph.successors(v).forEach(function(w) {
      if (!Object.prototype.hasOwnProperty.call(visited, w)) {
        dfs(w);
        entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink);
      } else if (visited[w].onStack) {
        entry.lowlink = Math.min(entry.lowlink, visited[w].index);
      }
    });
    if (entry.lowlink === entry.index) {
      const cmpt = [];
      let w;
      do {
        w = stack.pop();
        visited[w].onStack = false;
        cmpt.push(w);
      } while (v !== w);
      results.push(cmpt);
    }
  }
  graph.nodes().forEach(function(v) {
    if (!Object.prototype.hasOwnProperty.call(visited, v)) {
      dfs(v);
    }
  });
  return results;
}
function findCycles(graph) {
  return tarjan(graph).filter(function(cmpt) {
    return cmpt.length > 1 || cmpt.length === 1 && graph.hasEdge(cmpt[0], cmpt[0]);
  });
}

// src/AST/graph.ts
function buildDependenciesGraph(rulesDeps) {
  const g = new Graph();
  [...rulesDeps.entries()].forEach(([ruleDottedName, dependencies]) => {
    dependencies.forEach((depDottedName) => {
      g.setEdge(ruleDottedName, depDottedName);
    });
  });
  return g;
}
function squashCycle(rulesDependenciesObject, cycle) {
  function* loopFrom(i) {
    let j = i;
    while (true) {
      yield cycle[j++ % cycle.length];
    }
  }
  const smallCycleStartingAt = [];
  for (let i = 0; i < cycle.length; i++) {
    const smallCycle = [];
    let previousVertex = void 0;
    for (const vertex of loopFrom(i)) {
      if (previousVertex === void 0) {
        smallCycle.push(vertex);
        previousVertex = vertex;
      } else if (rulesDependenciesObject.get(previousVertex)?.has(vertex)) {
        if (smallCycle.includes(vertex)) {
          smallCycle.splice(0, smallCycle.lastIndexOf(vertex));
          break;
        }
        smallCycle.push(vertex);
        previousVertex = vertex;
      }
    }
    smallCycleStartingAt.push(smallCycle);
  }
  const smallest = smallCycleStartingAt.reduce(
    (minCycle, someCycle) => someCycle.length > minCycle.length ? minCycle : someCycle
  );
  return smallest;
}
function cyclicDependencies(rawRules) {
  const { referencesMaps } = parsePublicodes(rawRules);
  const dependenciesGraph = buildDependenciesGraph(referencesMaps.referencesIn);
  const cycles = findCycles(dependenciesGraph);
  const reversedCycles = cycles.map((c) => c.reverse());
  const smallCycles = reversedCycles.map(
    (cycle) => squashCycle(referencesMaps.referencesIn, cycle)
  );
  const printableStronglyConnectedComponents = reversedCycles.map(
    (c, i) => printInDotFormat(dependenciesGraph, c, smallCycles[i])
  );
  return [smallCycles, printableStronglyConnectedComponents];
}
var edgeIsInCycle = (cycle, v, w) => {
  for (let i = 0; i < cycle.length + 1; i++) {
    if (v === cycle[i] && w === cycle[(i + 1) % cycle.length])
      return true;
  }
  return false;
};
function printInDotFormat(dependenciesGraph, cycle, subCycleToHighlight) {
  const edgesSet = /* @__PURE__ */ new Set();
  cycle.forEach((vertex) => {
    dependenciesGraph.outEdges(vertex).filter(({ w }) => cycle.includes(w)).forEach(({ v, w }) => {
      edgesSet.add(
        `"${v}" -> "${w}"` + (edgeIsInCycle(subCycleToHighlight, v, w) ? " [color=red]" : "")
      );
    });
  });
  return `digraph Cycle {
	${[...edgesSet].join(";\n	")};
}`;
}

// src/ruleUtils.ts
var splitName = (str) => str.split(" . ");
var joinName = (strs) => strs.join(" . ");
var nameLeaf = (dottedName) => splitName(dottedName).slice(-1)?.[0];
var encodeRuleName = (dottedName) => dottedName?.replace(/\s\.\s/g, "/").replace(/-/g, "\u2011").replace(/\s/g, "-");
var decodeRuleName = (dottedName) => dottedName.replace(/\//g, " . ").replace(/-/g, " ").replace(/\u2011/g, "-");
var contextNameToDottedName = (contextName) => contextName.endsWith("$SITUATION") ? ruleParent(contextName) : contextName;
var ruleParent = (dottedName) => joinName(splitName(dottedName).slice(0, -1));
function ruleParents(dottedName) {
  return splitName(dottedName).slice(0, -1).map((_, i, arr) => joinName(arr.slice(0, i + 1))).reverse();
}
var getChildrenRules = (parsedRules, dottedName) => {
  const childrenRules = Object.keys(parsedRules).filter(
    (ruleDottedName) => ruleDottedName.startsWith(dottedName) && splitName(ruleDottedName).length === splitName(dottedName).length + 1
  );
  return childrenRules;
};
function findCommonAncestor(dottedName1, dottedName2) {
  const splitDottedName1 = splitName(dottedName1);
  const splitDottedName2 = splitName(dottedName2);
  const index = splitDottedName1.findIndex(
    (value, i) => splitDottedName2[i] !== value
  );
  return index === -1 ? dottedName1 : joinName(splitDottedName1.slice(0, index));
}
function isAccessible(rules, contextName, name) {
  if (!(name in rules)) {
    throw new PublicodesError(
      "InternalError",
      `La r\xE8gle "${name}" n'existe pas`,
      { dottedName: name }
    );
  }
  const commonAncestor = findCommonAncestor(contextName, name);
  const parents = [name, ...ruleParents(name), ""];
  const rulesToCheckForPrivacy = parents.slice(
    0,
    Math.max(parents.indexOf(commonAncestor) - 1, 0)
  );
  return rulesToCheckForPrivacy.every(
    (dottedName) => !(dottedName in rules) || rules[dottedName].private === false
  );
}
function isExperimental(rules, name) {
  if (!(name in rules)) {
    throw new PublicodesError(
      "InternalError",
      `La r\xE8gle "${name}" n'existe pas`,
      { dottedName: name }
    );
  }
  const parents = [name, ...ruleParents(name)];
  return parents.some(
    (dottedName) => dottedName in rules && rules[dottedName].rawNode?.experimental === "oui"
  );
}
function dottedNameFromContext(context, partialName) {
  return context ? context + " . " + partialName : partialName;
}
function disambiguateReference(rules, referencedFrom = "", partialName) {
  const possibleContexts = ruleParents(referencedFrom);
  possibleContexts.push(referencedFrom);
  if (partialName.startsWith("^ . ")) {
    const numberParent = partialName.match(/^(\^ \. )+/)[0].length / 4;
    partialName = partialName.replace(/^(\^ \. )+/, "");
    possibleContexts.splice(-numberParent);
  }
  const rootContext = possibleContexts.pop();
  possibleContexts.unshift(rootContext);
  possibleContexts.push("");
  const context = possibleContexts.find((context2) => {
    const dottedName = dottedNameFromContext(context2, partialName);
    if (!(dottedName in rules)) {
      return false;
    }
    if (dottedName === referencedFrom) {
      return false;
    }
    return isAccessible(rules, referencedFrom, dottedName);
  });
  if (context !== void 0) {
    return dottedNameFromContext(context, partialName);
  }
  if (referencedFrom.endsWith(partialName)) {
    return referencedFrom;
  }
  const possibleDottedName = possibleContexts.map(
    (c) => dottedNameFromContext(c, partialName)
  );
  if (possibleDottedName.every((dottedName) => !(dottedName in rules))) {
    throw new PublicodesError(
      "SyntaxError",
      `La r\xE9f\xE9rence "${partialName}" est introuvable.
V\xE9rifiez que l'orthographe et l'espace de nom sont corrects`,
      { dottedName: contextNameToDottedName(referencedFrom) }
    );
  }
  throw new PublicodesError(
    "SyntaxError",
    `La r\xE8gle "${possibleDottedName.find(
      (dottedName) => dottedName in rules
    )}" n'est pas accessible depuis "${referencedFrom}".
	Cela vient du fait qu'elle est priv\xE9e ou qu'un de ses parent est priv\xE9`,
    { dottedName: contextNameToDottedName(referencedFrom) }
  );
}
function ruleWithDedicatedDocumentationPage(rule) {
  return rule.virtualRule !== true && rule.type !== "groupe" && rule.type !== "texte" && rule.type !== "paragraphe" && rule.type !== "notification";
}
function updateReferencesMapsFromReferenceNode(node, referencesMaps, ruleDottedName) {
  if (node.nodeKind === "reference") {
    addToMapSet(
      referencesMaps.referencesIn,
      ruleDottedName ?? node.contextDottedName,
      node.dottedName
    );
    addToMapSet(
      referencesMaps.rulesThatUse,
      node.dottedName,
      ruleDottedName ?? node.contextDottedName
    );
  }
}
function disambiguateReferenceNode(node, parsedRules) {
  if (node.nodeKind !== "reference") {
    return;
  }
  if (node.dottedName) {
    return node;
  }
  node.dottedName = disambiguateReference(
    parsedRules,
    node.contextDottedName,
    node.name
  );
  node.title = parsedRules[node.dottedName].title;
  node.acronym = parsedRules[node.dottedName].rawNode.acronyme;
  return node;
}

// src/rule.ts
function parseRule(nom, rawRule, context) {
  const privateRule = rawRule.priv\u00E9 === "oui" || nom.startsWith("[priv\xE9] ");
  nom = nom.replace(/^\[privé\] /, "");
  const dottedName = [context.dottedName, nom].filter(Boolean).join(" . ");
  const name = nameLeaf(dottedName);
  const title = capitalise0(rawRule["titre"] ?? name);
  if (context.parsedRules[dottedName]) {
    throw new PublicodesError(
      "EvaluationError",
      `La r\xE9f\xE9rence '${dottedName}' a d\xE9j\xE0 \xE9t\xE9 d\xE9finie`,
      { dottedName }
    );
  }
  const ruleValue = {};
  for (const key in rawRule) {
    if (mecanismKeys.includes(key)) {
      ruleValue[key] = rawRule[key];
    }
  }
  if ("formule" in rawRule) {
    ruleValue.valeur = rawRule.formule;
  }
  if (!privateRule && !dottedName.endsWith("$SITUATION")) {
    ruleValue["dans la situation"] = `${dottedName} . $SITUATION`;
    ruleValue["avec"] = weakCopyObj(ruleValue["avec"]) ?? {};
    const situationValue = weakCopyObj(undefinedNode);
    situationValue.isNullable = rawRule["possiblement non applicable"] === "oui";
    ruleValue["avec"]["[priv\xE9] $SITUATION"] = {
      valeur: situationValue
    };
    if (ruleValue["par d\xE9faut"] != null) {
      ruleValue["par d\xE9faut"] = {
        valeur: ruleValue["par d\xE9faut"],
        "variable manquante": dottedName
      };
    }
  }
  const currentDottedNameContext = context.dottedName;
  context.dottedName = dottedName;
  context.parsedRules[dottedName] = void 0;
  const explanation = {
    valeur: parse(ruleValue, context),
    // We include a list of references to the parents to implement the branch
    // desactivation feature. When evaluating a rule we only need to know the
    // first nullable parent, but this is something that we can't determine at
    // this stage :
    // - we need to run remplacements (which works on references in the ASTs
    //   which is why we insert these “virtual” references)
    // - we need to infer unit of the rules
    //
    // An alternative implementation would be possible that would colocate the
    // code related to branch desactivation (ie find the first nullable parent
    // statically after rules parsing)
    parents: ruleParents(dottedName).map(
      (parent) => ({
        dottedName: parent,
        nodeKind: "reference",
        contextDottedName: context.dottedName
      })
    )
  };
  const suggestions = {};
  if (rawRule.suggestions) {
    for (const name2 in rawRule.suggestions) {
      suggestions[name2] = parse(rawRule.suggestions[name2], context);
    }
  }
  context.parsedRules[dottedName] = {
    dottedName,
    replacements: [
      ...parseRendNonApplicable(rawRule["rend non applicable"], context),
      ...parseReplacements(rawRule.remplace, context)
    ],
    title,
    private: privateRule,
    suggestions,
    nodeKind: "rule",
    explanation,
    rawNode: rawRule,
    virtualRule: privateRule
  };
  context.dottedName = currentDottedNameContext;
  return context.parsedRules[dottedName];
}
function parseRules(rules, context) {
  for (const dottedName in rules) {
    let rule = rules[dottedName];
    if (typeof rule === "string" || typeof rule === "number") {
      rule = { valeur: `${rule}` };
    }
    if (typeof rule !== "object") {
      throw new PublicodesError(
        "SyntaxError",
        `Rule ${dottedName} is incorrectly written. Please give it a proper value.`,
        { dottedName }
      );
    }
    const copy = rule === null ? {} : weakCopyObj(rule);
    parseRule(dottedName, copy, context);
  }
}
registerEvaluationFunction("rule", function evaluate2(node) {
  const { ruleDisabledByItsParent, nullableParent, parentMissingVariables } = evaluateDisablingParent(this, node);
  let valeurEvaluation = {
    ...node.explanation.valeur,
    nodeValue: null,
    missingVariables: {}
  };
  if (!ruleDisabledByItsParent) {
    if (this.cache._meta.evaluationRuleStack.filter(
      (dottedName) => dottedName === node.dottedName
    ).length > 1) {
      valeurEvaluation = {
        nodeValue: void 0
      };
    } else {
      this.cache._meta.evaluationRuleStack.unshift(node.dottedName);
      valeurEvaluation = this.evaluateNode(node.explanation.valeur);
      this.cache._meta.evaluationRuleStack.shift();
    }
  }
  valeurEvaluation.missingVariables ??= {};
  updateRuleMissingVariables(this, node, valeurEvaluation);
  const evaluation = {
    ...valeurEvaluation,
    missingVariables: mergeMissing(
      valeurEvaluation.missingVariables,
      parentMissingVariables
    ),
    ...node,
    explanation: {
      parents: node.explanation.parents,
      valeur: valeurEvaluation,
      nullableParent,
      ruleDisabledByItsParent
    }
  };
  return evaluation;
});
function updateRuleMissingVariables(engine, node, valeurEvaluation) {
  if (node.private === true || !isAccessible(engine.context.parsedRules, "", node.dottedName)) {
    return;
  }
  if (valeurEvaluation.nodeValue === void 0 && !Object.keys(valeurEvaluation.missingVariables).length) {
    valeurEvaluation.missingVariables[node.dottedName] = 1;
  }
  return;
}
function evaluateDisablingParent(engine, node) {
  if (node.private) {
    return { ruleDisabledByItsParent: false, parentMissingVariables: {} };
  }
  const nodesTypes = engine.context.nodesTypes;
  const nullableParent = node.explanation.parents.find(
    (ref) => nodesTypes.get(ref)?.isNullable || nodesTypes.get(ref)?.type === "boolean"
  );
  if (!nullableParent) {
    return { ruleDisabledByItsParent: false, parentMissingVariables: {} };
  }
  if (
    // TODO: remove this condition and the associated "parentRuleStack", cycles
    // should be detected and avoided at parse time.
    !engine.cache._meta.parentRuleStack.includes(node.dottedName)
  ) {
    engine.cache._meta.parentRuleStack.unshift(node.dottedName);
    let parentIsNotApplicable = defaultNode(false);
    if (nodesTypes.get(nullableParent)?.isNullable) {
      parentIsNotApplicable = engine.evaluateNode({
        nodeKind: "est non applicable",
        explanation: nullableParent
      });
    }
    if (parentIsNotApplicable.nodeValue !== true && nodesTypes.get(nullableParent)?.type === "boolean") {
      parentIsNotApplicable = engine.evaluateNode({
        nodeKind: "operation",
        operator: "=",
        operationKind: "=",
        explanation: [nullableParent, defaultNode(false)]
      });
    }
    engine.cache._meta.parentRuleStack.shift();
    if (parentIsNotApplicable.nodeValue === true) {
      return {
        ruleDisabledByItsParent: true,
        parentMissingVariables: parentIsNotApplicable.missingVariables ?? {},
        nullableParent
      };
    }
  }
  let parentMissingVariables = {};
  if (nodesTypes.get(nullableParent)?.type === "boolean") {
    const parentEvaluation = engine.evaluateNode(nullableParent);
    parentMissingVariables = parentEvaluation.missingVariables ?? {};
    return {
      ruleDisabledByItsParent: parentEvaluation.nodeValue === false,
      parentMissingVariables,
      nullableParent
    };
  }
  return {
    ruleDisabledByItsParent: false,
    parentMissingVariables,
    nullableParent
  };
}

// src/mecanisms/avec.ts
function parseAvec(v, context) {
  parseRules(v.avec, context);
  const valeur = parse(v.valeur, context);
  return valeur;
}
parseAvec.nom = "avec";

// src/mecanisms/trancheUtils.ts
var parseTranches = (tranches, context) => {
  return tranches.map((node, i) => {
    if (!node.plafond && i > tranches.length) {
      throw new PublicodesError(
        "SyntaxError",
        `La tranche n\xB0${i} du bar\xE8me n'a pas de plafond pr\xE9cis\xE9. Seule la derni\xE8re tranche peut ne pas \xEAtre plafonn\xE9e`,
        { dottedName: "" }
      );
    }
    return {
      ...node,
      ...node.taux !== void 0 ? { taux: parse(node.taux, context) } : {},
      ...node.montant !== void 0 ? { montant: parse(node.montant, context) } : {},
      plafond: "plafond" in node ? parse(node.plafond, context) : {
        nodeValue: Infinity,
        nodeKind: "constant",
        type: "number",
        isNullable: false
      }
    };
  });
};
function evaluatePlafondUntilActiveTranche({ multiplicateur, assiette, parsedTranches }) {
  return parsedTranches.reduce(
    ([tranches, activeTrancheFound], parsedTranche, i) => {
      if (activeTrancheFound) {
        return [
          [...tranches, { ...parsedTranche, isAfterActive: true }],
          activeTrancheFound
        ];
      }
      const plafond = this.evaluateNode(parsedTranche.plafond);
      const plancher = tranches[i - 1] ? tranches[i - 1].plafond : { nodeValue: 0 };
      let plafondValue = plafond.nodeValue === void 0 || multiplicateur.nodeValue === void 0 ? void 0 : plafond.nodeValue * multiplicateur.nodeValue;
      try {
        plafondValue = plafondValue === Infinity || plafondValue === 0 ? plafondValue : convertUnit(
          inferUnit("*", [plafond.unit, multiplicateur.unit]),
          assiette.unit,
          plafondValue
        );
      } catch (e) {
        warning(
          this.context.logger,
          `L'unit\xE9 du plafond de la tranche n\xB0${i + 1}  n'est pas compatible avec celle l'assiette`,
          { dottedName: this.cache._meta.evaluationRuleStack[0] },
          e
        );
      }
      const plancherValue = tranches[i - 1] ? tranches[i - 1].plafondValue : 0;
      const isAfterActive = plancherValue === void 0 || assiette.nodeValue === void 0 ? void 0 : plancherValue > assiette.nodeValue;
      const calculationValues = [plafond, assiette, multiplicateur, plancher];
      if (calculationValues.some((node) => node.nodeValue === void 0)) {
        return [
          [
            ...tranches,
            {
              ...parsedTranche,
              plafond,
              plafondValue,
              plancherValue,
              nodeValue: void 0,
              isActive: void 0,
              isAfterActive,
              missingVariables: mergeAllMissing(calculationValues)
            }
          ],
          false
        ];
      }
      if (!!tranches[i - 1] && !!plancherValue && plafondValue <= plancherValue) {
        throw new PublicodesError(
          "EvaluationError",
          `Le plafond de la tranche n\xB0${i + 1} a une valeur inf\xE9rieure \xE0 celui de la tranche pr\xE9c\xE9dente`,
          { dottedName: this.cache._meta.evaluationRuleStack[0] }
        );
      }
      const tranche = {
        ...parsedTranche,
        plafond,
        plancherValue,
        plafondValue,
        isAfterActive,
        isActive: assiette.nodeValue >= plancherValue && assiette.nodeValue < plafondValue
      };
      return [[...tranches, tranche], tranche.isActive];
    },
    [[], false]
  )[0];
}

// src/mecanisms/barème.ts
function parseBar\u00E8me(v, context) {
  const explanation = {
    assiette: parse(v.assiette, context),
    multiplicateur: v.multiplicateur ? parse(v.multiplicateur, context) : defaultNode(1),
    tranches: parseTranches(v.tranches, context)
  };
  return {
    explanation,
    nodeKind: "bar\xE8me"
  };
}
function evaluateBar\u00E8me(tranches, assiette, evaluate15) {
  return tranches.map((tranche) => {
    if (tranche.isAfterActive) {
      return { ...tranche, nodeValue: 0 };
    }
    const taux = evaluate15(tranche.taux);
    const missingVariables = mergeAllMissing([taux, tranche]);
    if ([
      assiette.nodeValue,
      taux.nodeValue,
      tranche.plafondValue,
      tranche.plancherValue
    ].some((value) => value === void 0)) {
      return {
        ...tranche,
        taux,
        nodeValue: void 0,
        missingVariables
      };
    }
    return {
      ...tranche,
      taux,
      ..."unit" in assiette && { unit: assiette.unit },
      nodeValue: (Math.min(assiette.nodeValue, tranche.plafondValue) - tranche.plancherValue) * convertUnit(taux.unit, parseUnit(""), taux.nodeValue),
      missingVariables
    };
  });
}
var evaluate3 = function(node) {
  const evaluate15 = this.evaluateNode.bind(this);
  const assiette = this.evaluateNode(
    node.explanation.assiette
  );
  const multiplicateur = this.evaluateNode(node.explanation.multiplicateur);
  if (multiplicateur.nodeValue === 0) {
    throw new PublicodesError(
      "EvaluationError",
      `Le multiplicateur ne peut pas \xEAtre nul`,
      { dottedName: this.cache._meta.evaluationRuleStack[0] }
    );
  }
  let tranches = node.explanation.tranches;
  let nodeValue = assiette.nodeValue;
  if (![0, void 0, null].includes(assiette.nodeValue)) {
    tranches = evaluateBar\u00E8me(
      evaluatePlafondUntilActiveTranche.call(this, {
        parsedTranches: node.explanation.tranches,
        assiette,
        multiplicateur
      }),
      assiette,
      evaluate15
    );
    nodeValue = tranches.reduce(
      (value, { nodeValue: nodeValue2 }) => nodeValue2 == void 0 ? void 0 : value + nodeValue2,
      0
    );
  }
  return {
    ...node,
    nodeValue,
    missingVariables: mergeAllMissing([assiette, multiplicateur, ...tranches]),
    explanation: {
      assiette,
      multiplicateur,
      tranches
    },
    unit: assiette.unit
  };
};
registerEvaluationFunction("bar\xE8me", evaluate3);

// src/mecanisms/condition.ts
var evaluate4 = function(node) {
  let evaluation;
  const condition = this.evaluateNode(node.explanation.si);
  let alors = node.explanation.alors;
  let sinon = node.explanation.sinon;
  if ("unit" in condition) {
    throw new PublicodesError(
      "EvaluationError",
      "La condition doit \xEAtre de type bool\xE9en",
      { dottedName: this.cache._meta.evaluationRuleStack[0] }
    );
  }
  if (condition.nodeValue === true) {
    alors = this.evaluateNode(node.explanation.alors);
    alors.isActive = true;
    evaluation = alors;
  } else if (condition.nodeValue === false) {
    sinon = this.evaluateNode(node.explanation.sinon);
    evaluation = sinon;
  } else if (condition.nodeValue === null) {
    evaluation = condition;
  } else if (condition.nodeValue === void 0) {
    sinon = this.evaluateNode(node.explanation.sinon);
    alors = this.evaluateNode(node.explanation.alors);
    evaluation = {
      ...condition,
      missingVariables: mergeAllMissing([sinon, alors])
    };
  } else {
    throw new PublicodesError(
      "EvaluationError",
      "La condition doit \xEAtre de type bool\xE9en",
      { dottedName: this.cache._meta.evaluationRuleStack[0] }
    );
  }
  const unit = evaluation.unit ?? alors.unit;
  return {
    nodeValue: evaluation.nodeValue,
    missingVariables: mergeMissing(
      bonus(condition.missingVariables),
      evaluation.missingVariables
    ),
    ...unit != void 0 ? { unit } : {},
    ...node,
    explanation: { si: condition, alors, sinon }
  };
};
function parseCondition(v, context) {
  const explanation = {
    si: parse(v.si, context),
    alors: parse(v.alors, context),
    sinon: parse(v.sinon, context)
  };
  return {
    explanation,
    nodeKind: "condition"
  };
}
parseCondition.nom = "condition";
registerEvaluationFunction("condition", evaluate4);

// src/mecanisms/contexte.ts
function parseMecanismContexte(v, context) {
  const contexte = Object.keys(v.contexte).map((dottedName) => [
    parse(dottedName, context),
    parse(v.contexte[dottedName], context)
  ]);
  const node = parse(v.valeur, context);
  return {
    explanation: {
      valeur: node,
      contexte,
      subEngineId: context.subEngineIncrementingNumber++
    },
    nodeKind: parseMecanismContexte.nom
  };
}
parseMecanismContexte.nom = "contexte";
var evaluateContexte = function(node) {
  const amendedSituation = Object.fromEntries(
    node.explanation.contexte.filter(([originRule, replacement]) => {
      const originRuleEvaluation = this.evaluateNode(originRule);
      const replacementEvaluation = this.evaluateNode(replacement);
      return originRuleEvaluation.nodeValue !== replacementEvaluation.nodeValue || serializeUnit(originRuleEvaluation.unit) !== serializeUnit(replacementEvaluation.unit);
    }).map(
      ([originRule, replacement]) => [originRule.dottedName, replacement]
    )
  );
  if (this.cache._meta.currentContexteSituation === JSON.stringify(amendedSituation)) {
    return {
      ...notApplicableNode,
      ...node
    };
  }
  const engine = this.shallowCopy();
  engine.subEngineId = node.explanation.subEngineId;
  this.subEngines[node.explanation.subEngineId] = engine;
  if (Object.keys(amendedSituation).length) {
    engine.setSituation(amendedSituation, {
      keepPreviousSituation: true
    });
    Object.entries(amendedSituation).forEach(([originDottedName, value]) => {
      const evaluation = this.cache.nodes.get(value);
      if (!evaluation) {
        throw new PublicodesError(
          "InternalError",
          "The situation should have already been evaluated",
          {
            dottedName: this.context.dottedName
          }
        );
      }
      const originRule = engine.context.parsedRules[originDottedName + " . $SITUATION"];
      if (!originRule?.explanation.valeur) {
        throw new PublicodesError(
          "InternalError",
          "The origin rule should be defined",
          {
            dottedName: this.context.dottedName
          }
        );
      }
      engine.cache.nodes.set(originRule.explanation.valeur, evaluation);
    });
  }
  engine.cache._meta.currentContexteSituation = JSON.stringify(amendedSituation);
  const evaluatedNode = engine.evaluateNode(node.explanation.valeur);
  return {
    ...node,
    nodeValue: evaluatedNode.nodeValue,
    explanation: {
      ...node.explanation,
      valeur: evaluatedNode
    },
    missingVariables: evaluatedNode.missingVariables,
    ..."unit" in evaluatedNode && { unit: evaluatedNode.unit }
  };
};
registerEvaluationFunction("contexte", evaluateContexte);

// src/date.ts
function normalizeDateString(dateString) {
  let [day, month, year] = dateString.split("/");
  if (!year) {
    ;
    [day, month, year] = ["01", day, month];
  }
  return normalizeDate(+year, +month, +day);
}
var pad = (n) => +n < 10 ? `0${n}` : "" + n;
function normalizeDate(year, month, day) {
  const date2 = new Date(+year, +month - 1, +day);
  if (!+date2 || date2.getDate() !== +day) {
    throw new PublicodesError(
      "SyntaxError",
      `La date ${day}/${month}/${year} n'est pas valide`,
      { dottedName: "" }
    );
  }
  return `${pad(day)}/${pad(month)}/${pad(year)}`;
}
function convertToDate(value) {
  const [day, month, year] = normalizeDateString(value).split("/");
  const result = new Date(+year, +month - 1, +day);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}
function convertToString(date2) {
  return normalizeDate(date2.getFullYear(), date2.getMonth() + 1, date2.getDate());
}
function getYear(date2) {
  return +date2.slice(-4);
}
function getTrimestreCivil(date2) {
  const [, month, year] = date2.split("/");
  const trimester = Math.floor((Number.parseInt(month, 10) - 1) / 3);
  const startingMonth = 3 * trimester + 1;
  return `01/${startingMonth.toString().padStart(2, "0")}/${year}`;
}
function getDifferenceInDays(from, to) {
  const millisecondsPerDay = 1e3 * 60 * 60 * 24;
  return (convertToDate(to).getTime() - convertToDate(from).getTime()) / millisecondsPerDay;
}
function getDifferenceInMonths(from, to) {
  const [dayFrom, monthFrom, yearFrom] = from.split("/").map((x) => +x);
  const [dayTo, monthTo, yearTo] = to.split("/").map((x) => +x);
  const numberOfFullMonth = monthTo - monthFrom + 12 * (yearTo - yearFrom);
  const numDayMonthFrom = new Date(yearFrom, monthFrom, 0).getDate();
  const numDayMonthTo = new Date(yearTo, monthTo, 0).getDate();
  const prorataMonthFrom = (dayFrom - 1) / numDayMonthFrom;
  const prorataMonthTo = dayTo / numDayMonthTo;
  return numberOfFullMonth - prorataMonthFrom + prorataMonthTo;
}
function getDifferenceInYears(from, to) {
  const differenceInDays = getDifferenceInDays(from, to);
  const isLeapYear = (year) => year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  const after1stMarch = (date2) => date2 >= new Date(date2.getFullYear(), 2, 1);
  const fromDate = convertToDate(from);
  const toDate = convertToDate(to);
  const fromYear = fromDate.getFullYear() + (after1stMarch(fromDate) ? 1 : 0);
  const toYear = toDate.getFullYear() + (after1stMarch(fromDate) ? 0 : -1);
  const leapYearsCount = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  ).filter(isLeapYear).length;
  return (differenceInDays - leapYearsCount) / 365;
}
function getDifferenceInTrimestreCivils(from, to) {
  return Math.floor(
    getDifferenceInMonths(getTrimestreCivil(from), getTrimestreCivil(to)) / 3
  ) + 1;
}
function getDifferenceInYearsCivil(from, to) {
  const fromYear = "01/" + getYear(from);
  const toYear = "01/" + getYear(to);
  return Math.floor(getDifferenceInYears(fromYear, toYear)) + 1;
}

// src/mecanisms/durée.ts
var evaluate5 = function(node) {
  const fromNode = this.evaluateNode(node.explanation.depuis);
  const toNode = this.evaluateNode(node.explanation["jusqu'\xE0"]);
  const from = fromNode.nodeValue;
  const to = toNode.nodeValue;
  let nodeValue;
  if (from === null || to === null) {
    nodeValue = null;
  } else if (from === void 0 || to === void 0) {
    nodeValue = void 0;
  } else {
    switch (node.unit.numerators[0]) {
      case "jour":
        nodeValue = getDifferenceInDays(from, to);
        break;
      case "mois":
        nodeValue = getDifferenceInMonths(from, to);
        break;
      case "an":
        nodeValue = getDifferenceInYears(from, to);
        break;
      case "trimestre":
        nodeValue = getDifferenceInMonths(from, to) / 3;
        break;
      case "trimestre civil":
        nodeValue = getDifferenceInTrimestreCivils(from, to);
        break;
      case "ann\xE9e civile":
        nodeValue = getDifferenceInYearsCivil(from, to);
        break;
    }
  }
  if (typeof nodeValue === "number") {
    nodeValue = Math.max(0, nodeValue);
  }
  return {
    ...node,
    missingVariables: mergeAllMissing([fromNode, toNode]),
    nodeValue,
    explanation: {
      depuis: fromNode,
      "jusqu'\xE0": toNode
    }
  };
};
var today = defaultNode(convertToString(/* @__PURE__ */ new Date()));
var dur_e_default = (v, context) => {
  const explanation = {
    depuis: parse(v.depuis ?? today, context),
    "jusqu'\xE0": parse(v["jusqu'\xE0"] ?? today, context)
  };
  const unit = v.unit\u00E9 ? parseUnit(v.unit\u00E9) : parseUnit("jour");
  if (unit.denominators.length > 0 || unit.numerators.length > 1 || !possibleUnit.includes(unit.numerators[0])) {
    throw new PublicodesError(
      "SyntaxError",
      `Seules les unit\xE9s suivantes sont accept\xE9es pour une dur\xE9e : ${possibleUnit.join(
        ", "
      )}.
	L'unit\xE9 fournie est: ${unit.numerators[0]}`,
      {
        dottedName: context.dottedName
      }
    );
  }
  return {
    explanation,
    unit,
    nodeKind: "dur\xE9e"
  };
};
registerEvaluationFunction("dur\xE9e", evaluate5);
var possibleUnit = [
  "mois",
  "jour",
  "an",
  "trimestre",
  "trimestre civil",
  "ann\xE9e civile"
];

// src/mecanisms/est.ts
function parseEstNonD\u00E9fini(v, context) {
  const explanation = parse(v, context);
  return {
    explanation,
    nodeKind: "est non d\xE9fini"
  };
}
parseEstNonD\u00E9fini.nom = "est non d\xE9fini";
var parseEstD\u00E9fini = createParseInlinedMecanism(
  "est d\xE9fini",
  {
    valeur: {}
  },
  {
    "=": [{ "est non d\xE9fini": "valeur" }, "non"]
  }
);
var parseEstApplicable = createParseInlinedMecanism(
  "est applicable",
  {
    valeur: {}
  },
  {
    "=": [{ "est non applicable": "valeur" }, "non"]
  }
);
var evaluate6 = function(node) {
  const valeur = this.evaluateNode(node.explanation);
  let nodeValue = false;
  if (valeur.nodeValue === void 0) {
    nodeValue = true;
  }
  return {
    ...node,
    nodeValue,
    missingVariables: valeur.missingVariables,
    explanation: valeur
  };
};
registerEvaluationFunction("est non d\xE9fini", evaluate6);

// src/mecanisms/est-non-applicable.ts
function parseEstNonApplicable(v, context) {
  const explanation = parse(v, context);
  return {
    explanation,
    nodeKind: "est non applicable"
  };
}
parseEstNonApplicable.nom = "est non applicable";
var isNotApplicable = (node) => {
  return {
    nodeKind: "est non applicable",
    explanation: node
  };
};
var evaluateIsNotApplicable = function(node) {
  const valeur = node.explanation;
  if (this.context.nodesTypes.get(valeur)?.isNullable === false && valeur.nodeKind !== "rule" && valeur.nodeKind !== "reference") {
    return { ...node, nodeValue: false, missingVariables: {} };
  }
  if (this.cache.nodes.has(valeur) && this.cache.nodes.get(valeur) !== void 0) {
    return {
      ...node,
      nodeValue: this.cache.nodes.get(valeur)?.nodeValue === null,
      missingVariables: this.cache.nodes.get(valeur)?.missingVariables ?? {}
    };
  }
  switch (valeur.nodeKind) {
    case "rule": {
      const { ruleDisabledByItsParent, parentMissingVariables } = evaluateDisablingParent(this, valeur);
      if (ruleDisabledByItsParent) {
        return {
          ...node,
          nodeValue: true,
          missingVariables: parentMissingVariables
        };
      }
      const isNotApplicableEvaluation = this.evaluateNode(
        isNotApplicable(valeur.explanation.valeur)
      );
      const missingVariables = mergeMissing(
        parentMissingVariables,
        isNotApplicableEvaluation.missingVariables
      );
      if (isNotApplicableEvaluation.nodeValue === false && this.context.nodesTypes.get(
        this.context.parsedRules[`${valeur.dottedName} . $SITUATION`]
      )?.isNullable && !Object.keys(isNotApplicableEvaluation.missingVariables).length) {
        missingVariables[valeur.dottedName] = 1;
      }
      return {
        ...node,
        nodeValue: isNotApplicableEvaluation.nodeValue,
        missingVariables
      };
    }
    case "reference":
      return {
        ...this.evaluateNode(
          isNotApplicable(this.context.parsedRules[valeur.dottedName])
        ),
        ...node
      };
    case "condition":
      return {
        ...this.evaluateNode({
          ...valeur,
          explanation: {
            si: valeur.explanation.si,
            alors: isNotApplicable(valeur.explanation.alors),
            sinon: isNotApplicable(valeur.explanation.sinon)
          }
        }),
        ...node
      };
  }
  const evaluatedValeur = this.evaluateNode(valeur);
  return {
    ...node,
    nodeValue: evaluatedValeur.nodeValue === void 0 ? void 0 : evaluatedValeur.nodeValue === null,
    missingVariables: evaluatedValeur.missingVariables
  };
};
registerEvaluationFunction("est non applicable", evaluateIsNotApplicable);

// src/mecanisms/grille.ts
function parseGrille(v, context) {
  const explanation = {
    assiette: parse(v.assiette, context),
    multiplicateur: v.multiplicateur ? parse(v.multiplicateur, context) : defaultNode(1),
    tranches: parseTranches(v.tranches, context)
  };
  return {
    explanation,
    nodeKind: "grille"
  };
}
var evaluate7 = function(node) {
  const evaluate15 = this.evaluateNode.bind(this);
  const assiette = this.evaluateNode(node.explanation.assiette);
  const multiplicateur = this.evaluateNode(node.explanation.multiplicateur);
  if (multiplicateur.nodeValue === 0) {
    throw new PublicodesError(
      "EvaluationError",
      `Le multiplicateur ne peut pas \xEAtre nul`,
      {
        dottedName: this.cache._meta.evaluationRuleStack[0]
      }
    );
  }
  const tranches = evaluatePlafondUntilActiveTranche.call(this, {
    parsedTranches: node.explanation.tranches,
    assiette,
    multiplicateur
  }).map((tranche) => {
    if (tranche.isActive === false) {
      return tranche;
    }
    const montant = evaluate15(tranche.montant);
    return {
      ...tranche,
      montant,
      nodeValue: montant.nodeValue,
      unit: montant.unit,
      missingVariables: mergeAllMissing([montant, tranche])
    };
  });
  let activeTranches;
  const activeTranche = tranches.find((tranche) => tranche.isActive);
  if (activeTranche) {
    activeTranches = [activeTranche];
  } else if (tranches[tranches.length - 1].isAfterActive === false) {
    activeTranches = [{ nodeValue: false }];
  } else {
    activeTranches = tranches.filter(
      (tranche) => tranche.isActive === void 0
    );
  }
  const nodeValue = !activeTranches[0] ? false : activeTranches[0].isActive === void 0 ? void 0 : activeTranches[0].nodeValue;
  return {
    ...node,
    nodeValue,
    missingVariables: mergeAllMissing([
      assiette,
      multiplicateur,
      ...activeTranches
    ]),
    explanation: {
      ...node.explanation,
      assiette,
      multiplicateur,
      tranches
    },
    unit: activeTranches[0]?.unit ?? void 0
  };
};
registerEvaluationFunction("grille", evaluate7);

// src/uniroot.ts
function uniroot(func, lowerLimit, upperLimit, errorTol = 0, maxIter = 100, acceptableErrorTol = 0) {
  let a = lowerLimit, b = upperLimit, c = a, fa = func(a), fb = func(b), fc = fa, actualTolerance, newStep, prevStep, p, q, fallback = void 0;
  while (maxIter-- > 0) {
    prevStep = b - a;
    if (Math.abs(fc) < Math.abs(fb)) {
      ;
      a = b, b = c, c = a;
      fa = fb, fb = fc, fc = fa;
    }
    actualTolerance = 1e-15 * Math.abs(b) + errorTol / 2;
    newStep = (c - b) / 2;
    if (Math.abs(newStep) <= actualTolerance || fb === 0) {
      return b;
    }
    if (Math.abs(prevStep) >= actualTolerance && Math.abs(fa) > Math.abs(fb)) {
      let t1, t2;
      const cb = c - b;
      if (a === c) {
        t1 = fb / fa;
        p = cb * t1;
        q = 1 - t1;
      } else {
        ;
        q = fa / fc, t1 = fb / fc, t2 = fb / fa;
        p = t2 * (cb * q * (q - t1) - (b - a) * (t1 - 1));
        q = (q - 1) * (t1 - 1) * (t2 - 1);
      }
      if (p > 0) {
        q = -q;
      } else {
        p = -p;
      }
      if (p < 0.75 * cb * q - Math.abs(actualTolerance * q) / 2 && p < Math.abs(prevStep * q / 2)) {
        newStep = p / q;
      }
    }
    if (Math.abs(newStep) < actualTolerance) {
      newStep = newStep > 0 ? actualTolerance : -actualTolerance;
    }
    ;
    a = b, fa = fb;
    b += newStep, fb = func(b);
    if (fb > 0 && fc > 0 || fb < 0 && fc < 0) {
      ;
      c = a, fc = fa;
    }
    if (Math.abs(fb) < errorTol) {
      return b;
    }
    if (Math.abs(fb) < acceptableErrorTol) {
      fallback = b;
    }
  }
  return fallback;
}

// src/mecanisms/inversion.ts
var evaluateInversion = function(node) {
  const inversionEngine = this.shallowCopy();
  if (this.cache._meta.evaluationRuleStack.slice(1).includes(node.explanation.ruleToInverse)) {
    return {
      ...undefinedNumberNode,
      ...node
    };
  }
  inversionEngine.cache._meta.parentRuleStack = [
    ...this.cache._meta.parentRuleStack
  ];
  inversionEngine.cache._meta.evaluationRuleStack = [
    ...this.cache._meta.evaluationRuleStack
  ];
  const inversionGoal = node.explanation.inversionCandidates.find(
    (candidate) => {
      if (this.cache._meta.evaluationRuleStack.includes(candidate.dottedName)) {
        return false;
      }
      const evaluation = inversionEngine.evaluateNode(
        inversionEngine.context.parsedRules[`${candidate.dottedName} . $SITUATION`]
      );
      return typeof evaluation.nodeValue === "number" && !(candidate.dottedName in evaluation.missingVariables);
    }
  );
  if (inversionGoal === void 0) {
    return {
      ...node,
      nodeValue: void 0,
      missingVariables: {
        ...Object.fromEntries(
          node.explanation.inversionCandidates.map((candidate) => [
            candidate.dottedName,
            1
          ])
        ),
        [node.explanation.ruleToInverse]: 1
      }
    };
  }
  const evaluatedInversionGoal = inversionEngine.evaluateNode(inversionGoal);
  let numberOfIteration = 0;
  inversionEngine.setSituation(
    {
      [inversionGoal.dottedName]: undefinedNumberNode
    },
    { keepPreviousSituation: true }
  );
  inversionEngine.cache.traversedVariablesStack = this.cache.traversedVariablesStack ? [] : void 0;
  let lastEvaluation;
  const evaluateWithValue = (n) => {
    numberOfIteration++;
    inversionEngine.setSituation(
      {
        [node.explanation.ruleToInverse]: {
          nodeValue: n,
          nodeKind: "constant",
          type: "number",
          unit: evaluatedInversionGoal.unit
        }
      },
      { keepPreviousSituation: true }
    );
    inversionEngine.cache.traversedVariablesStack = this.cache.traversedVariablesStack ? [] : void 0;
    lastEvaluation = inversionEngine.evaluateNode(inversionGoal);
    return lastEvaluation;
  };
  const goal = evaluatedInversionGoal.nodeValue;
  let nodeValue = void 0;
  const x1 = goal;
  const y1Node = evaluateWithValue(x1);
  const y1 = y1Node.nodeValue;
  const coeff = y1 > goal ? 0.9 : 1.2;
  const x2 = y1 !== void 0 ? x1 * goal * coeff / y1 : 2e3;
  const y2Node = evaluateWithValue(x2);
  const y2 = y2Node.nodeValue;
  const maxIterations = this.context.inversionMaxIterations ?? 10;
  if (y1 !== void 0 || y2 !== void 0) {
    const test = (x) => {
      const y = x === x1 ? y1 : x === x2 ? y2 : evaluateWithValue(x).nodeValue;
      return y - goal;
    };
    const defaultMin = -1e6;
    const defaultMax = 1e8;
    const nearestBelowGoal = y2 !== void 0 && y2 < goal && (y2 > y1 || y1 > goal) ? x2 : y1 !== void 0 && y1 < goal && (y1 > y2 || y2 > goal) ? x1 : defaultMin;
    const nearestAboveGoal = y2 !== void 0 && y2 > goal && (y2 < y1 || y1 < goal) ? x2 : y1 !== void 0 && y1 > goal && (y1 < y2 || y2 < goal) ? x1 : defaultMax;
    nodeValue = uniroot(
      test,
      nearestBelowGoal,
      nearestAboveGoal,
      0.1,
      maxIterations,
      1
    );
  }
  if (nodeValue == void 0) {
    this.cache.inversionFail = true;
  }
  if (this.cache.traversedVariablesStack) {
    const traversedVariablesStack = this.cache.traversedVariablesStack[0];
    if (traversedVariablesStack) {
      ;
      (lastEvaluation.traversedVariables ?? []).forEach(
        (v) => traversedVariablesStack.add(v)
      );
    }
  }
  return {
    ...node,
    nodeValue,
    unit: evaluatedInversionGoal.unit,
    explanation: {
      ...node.explanation,
      inversionGoal,
      numberOfIteration,
      inversionFail: this.cache.inversionFail
    },
    missingVariables: lastEvaluation.missingVariables
  };
};
var mecanismInversion = (v, context) => {
  let avec = typeof v === "object" && "avec" in v ? v.avec : v;
  if (v === null) {
    throw new PublicodesError(
      "SyntaxError",
      "Il manque les r\xE8gles avec laquelle effectuer le calcul d'inversion dans le m\xE9canisme `inversion num\xE9rique`",
      { dottedName: context.dottedName }
    );
  }
  if (!Array.isArray(avec)) {
    avec = [avec];
  }
  return {
    explanation: {
      ruleToInverse: context.dottedName,
      inversionCandidates: avec.map((node) => ({
        ...parse(node, context)
      }))
    },
    nodeKind: "inversion"
  };
};
registerEvaluationFunction("inversion", evaluateInversion);

// src/mecanisms/max-min.ts
var parseMaximumDe = createParseInlinedMecanismWithArray(
  "le maximum de",
  {
    valeur: { type: "liste" }
  },
  ({ valeur }) => valeur.reduce(
    (acc, value) => ({
      condition: {
        si: {
          "est non applicable": "$INTERNAL valeur"
        },
        alors: "$INTERNAL acc",
        sinon: {
          condition: {
            si: {
              ou: [
                { "est non applicable": "$INTERNAL acc" },
                { ">": ["$INTERNAL valeur", "$INTERNAL acc"] }
              ]
            },
            alors: "$INTERNAL valeur",
            sinon: "$INTERNAL acc"
          }
        }
      },
      avec: {
        "[priv\xE9] $INTERNAL valeur": { valeur: value },
        "[priv\xE9] $INTERNAL acc": { valeur: acc }
      }
    }),
    notApplicableNode
  )
);
var parseMinimumDe = createParseInlinedMecanismWithArray(
  "le minimum de",
  {
    valeur: { type: "liste" }
  },
  ({ valeur }) => valeur.reduce(
    (acc, value) => ({
      condition: {
        si: {
          "est non applicable": "$INTERNAL valeur"
        },
        alors: "$INTERNAL acc",
        sinon: {
          condition: {
            si: {
              ou: [
                { "est non applicable": "$INTERNAL acc" },
                { "<": ["$INTERNAL valeur", "$INTERNAL acc"] }
              ]
            },
            alors: "$INTERNAL valeur",
            sinon: "$INTERNAL acc"
          }
        }
      },
      avec: {
        "[priv\xE9] $INTERNAL valeur": { valeur: value },
        "[priv\xE9] $INTERNAL acc": { valeur: acc }
      }
    }),
    notApplicableNode
  )
);

// src/mecanisms/somme.tsx
function reduceToSumNodes(valeurs) {
  return valeurs.reverse().reduce((acc, value) => ({ "+": [value, acc] }), notApplicableNode);
}
var somme_default = createParseInlinedMecanismWithArray(
  "somme",
  {
    valeur: { type: "liste" }
  },
  ({ valeur }) => reduceToSumNodes([...valeur])
);

// src/mecanisms/moyenne.ts
var moyenne_default = createParseInlinedMecanismWithArray(
  "moyenne",
  {
    valeur: { type: "liste" }
  },
  ({ valeur }) => {
    const valeurs = [...valeur];
    return {
      "/": [
        reduceToSumNodes(valeurs),
        reduceToSumNodes(valeurs.map(oneIfApplicable))
      ]
    };
  }
);
function oneIfApplicable(exp) {
  return {
    "applicable si": { "est applicable": exp },
    valeur: 1
  };
}

// src/mecanisms/non-applicable.ts
var non_applicable_default = createParseInlinedMecanism(
  "non applicable si",
  {
    "non applicable si": {},
    valeur: {}
  },
  {
    condition: {
      si: "non applicable si = non",
      alors: "valeur",
      sinon: notApplicableNode
    }
  }
);

// src/mecanisms/one-possibility.ts
var mecanismOnePossibility = (v, context) => {
  if (Array.isArray(v)) {
    v = {
      possibilit\u00E9s: v
    };
  }
  return {
    ...v,
    explanation: v.possibilit\u00E9s.map((p) => parse(p, context)),
    context: context.dottedName,
    nodeKind: "une possibilit\xE9"
  };
};
registerEvaluationFunction("une possibilit\xE9", (node) => ({
  ...node,
  missingVariables: { [node.context]: 1 },
  nodeValue: void 0
}));

// src/mecanisms/operation.ts
var knownOperations = {
  "*": [(a, b) => a * b, "\xD7"],
  "/": [(a, b) => a / b, "\u2215"],
  "+": [(a, b) => a + b],
  "-": [(a, b) => a - b, "\u2212"],
  "<": [(a, b) => a < b],
  "<=": [(a, b) => a <= b, "\u2264"],
  ">": [(a, b) => a > b],
  ">=": [(a, b) => a >= b, "\u2265"],
  "=": [(a, b) => (a ?? false) === (b ?? false)],
  "!=": [(a, b) => (a ?? false) !== (b ?? false), "\u2260"],
  et: [(a, b) => (a ?? false) && (b ?? false)],
  ou: [(a, b) => (a ?? false) || (b ?? false)]
};
var parseOperation = (k, symbol) => (v, context) => {
  const explanation = v.map((node) => parse(node, context));
  return {
    ...v,
    nodeKind: "operation",
    operationKind: k,
    operator: symbol || k,
    explanation
  };
};
var evaluate8 = function(node) {
  let node1 = this.evaluateNode(node.explanation[0]);
  let evaluatedNode = {
    ...node,
    missingVariables: {}
  };
  if (node1.nodeValue === null && ["<", ">", "<=", ">=", "/", "*", "-", "et"].includes(
    node.operationKind
  ) || node1.nodeValue === 0 && ["/", "*"].includes(node.operationKind) || node1.nodeValue === false && node.operationKind === "et" || node1.nodeValue === true && node.operationKind === "ou") {
    return {
      ...evaluatedNode,
      nodeValue: node.operationKind === "et" ? false : node1.nodeValue,
      missingVariables: node1.missingVariables
    };
  }
  let node2 = this.evaluateNode(node.explanation[1]);
  evaluatedNode.explanation = [node1, node2];
  if (node.operationKind === "/" && node2.nodeValue === 0) {
    throw new PublicodesError("EvaluationError", `Division by zero`, {
      dottedName: this.cache._meta.evaluationRuleStack[0]
    });
  }
  if (node2.nodeValue === null && ["<", ">", "<=", ">=", "/", "*", "et"].includes(node.operationKind) || node2.nodeValue === 0 && ["*"].includes(node.operationKind) || node2.nodeValue === false && node.operationKind === "et" || node2.nodeValue === true && node.operationKind === "ou") {
    return {
      ...evaluatedNode,
      nodeValue: node.operationKind === "et" ? false : node2.nodeValue,
      missingVariables: node2.missingVariables
    };
  }
  evaluatedNode.missingVariables = mergeAllMissing([node1, node2]);
  if (node1.nodeValue === void 0 || node2.nodeValue === void 0) {
    evaluatedNode = {
      ...evaluatedNode,
      nodeValue: void 0
    };
  }
  const isAdditionOrSubstractionWithPercentage = ["+", "-"].includes(node.operationKind) && serializeUnit(node2.unit) === "%" && serializeUnit(node1.unit) !== "%";
  if (!("nodeValue" in evaluatedNode) && !["/", "*"].includes(node.operationKind) && !isAdditionOrSubstractionWithPercentage) {
    try {
      if (node1.unit && "unit" in node2) {
        node2 = convertNodeToUnit(node1.unit, node2);
      } else if (node2.unit) {
        node1 = convertNodeToUnit(node2.unit, node1);
      }
    } catch (e) {
      warning(
        this.context.logger,
        `Dans l'expression '${node.operationKind}', la partie gauche (unit\xE9: ${serializeUnit(
          node1.unit
        )}) n'est pas compatible avec la partie droite (unit\xE9: ${serializeUnit(
          node2.unit
        )})`,
        { dottedName: this.cache._meta.evaluationRuleStack[0] },
        e
      );
    }
  }
  const operatorFunction = knownOperations[node.operationKind][0];
  const a = node1.nodeValue;
  const b = node2.nodeValue;
  evaluatedNode.nodeValue = "nodeValue" in evaluatedNode ? evaluatedNode.nodeValue : ["<", ">", "<=", ">=", "*", "/"].includes(node.operationKind) && node2.nodeValue === null ? null : [a, b].every(
    (value) => typeof value === "string" && value.match?.(/^[\d]{2}\/[\d]{2}\/[\d]{4}$/)
  ) ? (
    // We convert the date objects to timestamps to support comparison with the "===" operator:
    // new Date('2020-01-01') !== new Date('2020-01-01')
    operatorFunction(
      convertToDate(a).getTime(),
      convertToDate(b).getTime()
    )
  ) : operatorFunction(a, b);
  if (node.operationKind === "*" && inferUnit("*", [node1.unit, node2.unit])?.numerators.includes("%")) {
    const unit = inferUnit("*", [node1.unit, node2.unit]);
    const nodeValue = evaluatedNode.nodeValue;
    return {
      ...evaluatedNode,
      nodeValue: typeof nodeValue === "number" ? nodeValue / 100 : nodeValue,
      unit: inferUnit("*", [unit, { numerators: [], denominators: ["%"] }])
    };
  }
  if (isAdditionOrSubstractionWithPercentage) {
    const unit = inferUnit("*", [node1.unit, node2.unit]);
    return {
      ...evaluatedNode,
      nodeValue: typeof node1.nodeValue === "number" && typeof node2.nodeValue === "number" ? node1.nodeValue * (1 + node2.nodeValue / 100 * (node.operationKind === "-" ? -1 : 1)) : evaluatedNode.nodeValue,
      unit: inferUnit("*", [unit, { numerators: [], denominators: ["%"] }])
    };
  }
  if (node.operationKind === "*" || node.operationKind === "/" || node.operationKind === "-" || node.operationKind === "+") {
    return {
      ...evaluatedNode,
      unit: inferUnit(node.operationKind, [node1.unit, node2.unit])
    };
  }
  return evaluatedNode;
};
registerEvaluationFunction("operation", evaluate8);
var operationDispatch = Object.fromEntries(
  Object.entries(knownOperations).map(([k, [, symbol]]) => [
    k,
    parseOperation(k, symbol)
  ])
);
var operation_default = operationDispatch;

// src/mecanisms/parDéfaut.ts
var parD_faut_default = createParseInlinedMecanism(
  "par d\xE9faut",
  {
    "par d\xE9faut": {},
    valeur: {}
  },
  {
    condition: {
      si: { "est non d\xE9fini": "valeur" },
      alors: "par d\xE9faut",
      sinon: "valeur"
    }
  }
);

// src/mecanisms/plafond.ts
var plafond_default = createParseInlinedMecanism(
  "plafond",
  {
    plafond: {},
    valeur: {}
  },
  {
    condition: {
      si: { et: ["plafond != non", "valeur > plafond"] },
      alors: "plafond",
      sinon: "valeur"
    }
  }
);

// src/mecanisms/plancher.ts
var plancher_default = createParseInlinedMecanism(
  "plancher",
  {
    plancher: {},
    valeur: {}
  },
  {
    condition: {
      si: { et: ["plancher != non", "valeur < plancher"] },
      alors: "plancher",
      sinon: "valeur"
    }
  }
);

// src/mecanisms/product.ts
function reduceToProduitNodes(valeurs) {
  return valeurs.reduce((acc, value) => ({ "*": [value, acc] }), defaultNode(1));
}
var product_default = createParseInlinedMecanismWithArray(
  "produit",
  {
    valeur: { type: "liste" }
  },
  ({ valeur }) => ({
    valeur: reduceToProduitNodes([...valeur]),
    "simplifier l'unit\xE9": "oui"
  })
);

// src/mecanisms/résoudre-référence-circulaire.ts
var evaluateR\u00E9soudreR\u00E9f\u00E9renceCirculaire = function(node) {
  if (this.cache._meta.evaluationRuleStack.slice(1).includes(node.explanation.ruleToSolve)) {
    return {
      ...undefinedNumberNode,
      ...node
    };
  }
  let numberOfIterations = 0;
  const calculationEngine = this.shallowCopy();
  calculationEngine.cache._meta.parentRuleStack = [
    ...this.cache._meta.parentRuleStack
  ];
  calculationEngine.cache._meta.evaluationRuleStack = [
    ...this.cache._meta.evaluationRuleStack
  ];
  const maxIterations = this.context.inversionMaxIterations ?? 25;
  const evaluateWithValue = (n) => {
    numberOfIterations++;
    calculationEngine.setSituation(
      {
        [node.explanation.ruleToSolve]: {
          ...undefinedNumberNode,
          nodeValue: n
        }
      },
      { keepPreviousSituation: true }
    );
    return calculationEngine.evaluateNode(node.explanation.valeur);
  };
  const inversionFailed = Symbol("inversion failed");
  let nodeValue = inversionFailed;
  const x0 = 1;
  let valeur = evaluateWithValue(x0);
  const y0 = valeur.nodeValue;
  const unit = valeur.unit;
  if (y0 !== void 0) {
    const test = (x) => {
      if (x === x0) {
        return y0 - x0;
      }
      valeur = evaluateWithValue(x);
      const y = valeur.nodeValue;
      return y - x;
    };
    const defaultMin = -1e6;
    const defaultMax = 1e8;
    nodeValue = uniroot(test, defaultMin, defaultMax, 0.5, maxIterations, 2);
  }
  if (nodeValue === inversionFailed) {
    nodeValue = void 0;
    this.cache.inversionFail = true;
  }
  if (nodeValue !== void 0) {
    valeur = evaluateWithValue(nodeValue);
  }
  return {
    ...node,
    unit,
    nodeValue,
    explanation: {
      ...node.explanation,
      valeur,
      numberOfIterations
    },
    missingVariables: valeur.missingVariables
  };
};
function parseR\u00E9soudreR\u00E9f\u00E9renceCirculaire(v, context) {
  return {
    explanation: {
      ruleToSolve: context.dottedName,
      valeur: parse(v.valeur, context)
    },
    nodeKind: "r\xE9soudre r\xE9f\xE9rence circulaire"
  };
}
parseR\u00E9soudreR\u00E9f\u00E9renceCirculaire.nom = "r\xE9soudre la r\xE9f\xE9rence circulaire";
registerEvaluationFunction(
  "r\xE9soudre r\xE9f\xE9rence circulaire",
  evaluateR\u00E9soudreR\u00E9f\u00E9renceCirculaire
);

// src/mecanisms/simplifier-unité.ts
function parseSimplifierUnit\u00E9(v, context) {
  const explanation = parse(v.valeur, context);
  return {
    explanation,
    nodeKind: "simplifier unit\xE9"
  };
}
parseSimplifierUnit\u00E9.nom = "simplifier l'unit\xE9";
registerEvaluationFunction("simplifier unit\xE9", function evaluate9(node) {
  const valeur = this.evaluateNode(node.explanation);
  const nodeValue = valeur.nodeValue;
  const defaultReturn = {
    ...valeur,
    ...node,
    explanation: valeur
  };
  if (nodeValue == null) {
    return defaultReturn;
  }
  if (!valeur.unit) {
    return {
      ...defaultReturn,
      unit: valeur.unit
    };
  }
  const unit = simplifyUnit(valeur.unit);
  return {
    ...defaultReturn,
    nodeValue: typeof nodeValue === "number" ? convertUnit(valeur.unit, unit, nodeValue) : nodeValue,
    unit
  };
});

// src/mecanisms/situation.ts
var situation_default = createParseInlinedMecanism(
  "dans la situation",
  {
    valeur: {},
    "dans la situation": {}
  },
  {
    condition: {
      si: { "est non d\xE9fini": "dans la situation" },
      alors: "valeur",
      sinon: "dans la situation"
    }
  }
);

// src/mecanisms/tauxProgressif.ts
function parseTauxProgressif(v, context) {
  const explanation = {
    assiette: parse(v.assiette, context),
    multiplicateur: v.multiplicateur ? parse(v.multiplicateur, context) : defaultNode(1),
    tranches: parseTranches(v.tranches, context)
  };
  return {
    explanation,
    nodeKind: "taux progressif"
  };
}
var evaluate10 = function(node) {
  const evaluate15 = this.evaluateNode.bind(this);
  const assiette = this.evaluateNode(node.explanation.assiette);
  const multiplicateur = this.evaluateNode(node.explanation.multiplicateur);
  if (multiplicateur.nodeValue === 0) {
    throw new PublicodesError("EvaluationError", `Division by zero`, {
      dottedName: ""
    });
  }
  const tranches = evaluatePlafondUntilActiveTranche.call(this, {
    parsedTranches: node.explanation.tranches,
    assiette,
    multiplicateur
  });
  const evaluatedNode = {
    ...node,
    explanation: {
      tranches,
      assiette,
      multiplicateur
    },
    unit: parseUnit("%")
  };
  const lastTranche = tranches[tranches.length - 1];
  if (tranches.every(({ isActive }) => isActive === false) || lastTranche.isActive && lastTranche.plafond.nodeValue === Infinity) {
    const taux = convertNodeToUnit(parseUnit("%"), evaluate15(lastTranche.taux));
    const { nodeValue: nodeValue2, missingVariables } = taux;
    lastTranche.taux = taux;
    lastTranche.nodeValue = nodeValue2;
    lastTranche.missingVariables = missingVariables;
    return {
      ...evaluatedNode,
      nodeValue: nodeValue2,
      missingVariables
    };
  }
  if (tranches.every(({ isActive }) => isActive !== true) || typeof assiette.nodeValue !== "number") {
    return {
      ...evaluatedNode,
      nodeValue: void 0,
      missingVariables: mergeAllMissing(tranches)
    };
  }
  const activeTrancheIndex = tranches.findIndex(
    ({ isActive }) => isActive === true
  );
  const activeTranche = tranches[activeTrancheIndex];
  activeTranche.taux = convertNodeToUnit(
    parseUnit("%"),
    evaluate15(activeTranche.taux)
  );
  const previousTranche = tranches[activeTrancheIndex - 1];
  if (previousTranche) {
    previousTranche.taux = convertNodeToUnit(
      parseUnit("%"),
      evaluate15(previousTranche.taux)
    );
    previousTranche.isActive = true;
  }
  const previousTaux = previousTranche ? previousTranche.taux : activeTranche.taux;
  const calculationValues = [previousTaux, activeTranche.taux];
  if (calculationValues.some((n) => n.nodeValue === void 0)) {
    activeTranche.nodeValue = void 0;
    return {
      ...evaluatedNode,
      nodeValue: void 0,
      missingVariables: mergeAllMissing(calculationValues)
    };
  }
  const lowerTaux = previousTaux.nodeValue;
  const upperTaux = activeTranche.taux.nodeValue;
  const plancher = activeTranche.plancherValue;
  const plafond = activeTranche.plafondValue;
  const coeff = (upperTaux - lowerTaux) / (plafond - plancher);
  const nodeValue = lowerTaux + (assiette.nodeValue - plancher) * coeff;
  activeTranche.nodeValue = nodeValue;
  return {
    ...evaluatedNode,
    nodeValue,
    missingVariables: {}
  };
};
registerEvaluationFunction("taux progressif", evaluate10);

// src/mecanisms/texte.ts
var NAME = "texte";
function parseTexte(texte, context) {
  const explanation = [];
  let lastIndex = 0;
  for (const { 0: expression, index } of texte.matchAll(/{{(.|\n)*?}}/g)) {
    const publicodeExpression = expression.slice(2, -2).trim();
    const parsedNode = parse(publicodeExpression, context);
    explanation.push(texte.substring(lastIndex, index), parsedNode);
    lastIndex = (index ?? 0) + expression.length;
  }
  explanation.push(texte.slice(lastIndex));
  return {
    nodeKind: NAME,
    explanation
  };
}
parseTexte.nom = NAME;
registerEvaluationFunction(NAME, function evaluate11(node) {
  const explanation = node.explanation.map(
    (element) => typeof element === "string" ? element : this.evaluateNode(element)
  );
  return {
    ...node,
    explanation,
    missingVariables: mergeAllMissing(
      node.explanation.filter(
        (element) => typeof element !== "string"
      )
    ),
    nodeValue: explanation.map(
      (element) => typeof element === "string" ? element : formatValue(element)
    ).join("")
  };
});

// src/mecanisms/toutes-ces-conditions.ts
var toutes_ces_conditions_default = createParseInlinedMecanismWithArray(
  "toutes ces conditions",
  {
    valeur: { type: "liste" }
  },
  ({ valeur }) => valeur.reduce(
    (acc, value) => ({ et: [acc, value] }),
    "oui"
  )
);

// src/mecanisms/une-de-ces-conditions.ts
var une_de_ces_conditions_default = createParseInlinedMecanismWithArray(
  "une de ces conditions",
  {
    valeur: { type: "liste" }
  },
  ({ valeur }) => valeur.reduce(
    (acc, value) => ({ ou: [acc, value] }),
    "non"
  )
);

// src/mecanisms/unité.ts
function parseUnit\u00E9(v, context) {
  const explanation = parse(v.valeur, context);
  const unit = parseUnit(v.unit\u00E9, context.getUnitKey);
  return {
    explanation,
    unit,
    nodeKind: parseUnit\u00E9.nom
  };
}
parseUnit\u00E9.nom = "unit\xE9";
registerEvaluationFunction(parseUnit\u00E9.nom, function evaluate12(node) {
  const valeur = this.evaluateNode(node.explanation);
  let nodeValue = valeur.nodeValue;
  if (nodeValue !== null && "unit" in node) {
    try {
      nodeValue = convertUnit(
        valeur.unit,
        node.unit,
        valeur.nodeValue
      );
    } catch (e) {
      warning(
        this.context.logger,
        "Erreur lors de la conversion d'unit\xE9 explicite",
        { dottedName: this.cache._meta.evaluationRuleStack[0] },
        e
      );
    }
  }
  return {
    ...node,
    nodeValue,
    explanation: valeur,
    missingVariables: valeur.missingVariables
  };
});

// src/mecanisms/variablesManquantes.ts
function parseVariableManquante(v, context) {
  return {
    missingVariable: v["variable manquante"],
    nodeKind: parseVariableManquante.nom,
    explanation: parse(v.valeur, context)
  };
}
parseVariableManquante.nom = "variable manquante";
registerEvaluationFunction(parseVariableManquante.nom, function evaluate13(node) {
  const valeur = this.evaluateNode(node.explanation);
  const maxMissingScore = Object.values(valeur.missingVariables).reduce(
    (a, b) => a > b ? a : b,
    0
  );
  return {
    ...node,
    nodeValue: valeur.nodeValue,
    unit: valeur.unit,
    explanation: valeur,
    missingVariables: mergeMissing(valeur.missingVariables, {
      [node.missingVariable]: maxMissingScore + 1
    })
  };
});

// src/mecanisms/variations.ts
function parseVariations(v, context) {
  const explanation = v.map(
    ({ si, alors, sinon }) => sinon !== void 0 ? { consequence: parse(sinon, context), condition: defaultNode(true) } : { consequence: parse(alors, context), condition: parse(si, context) }
  );
  return {
    explanation,
    nodeKind: "variations"
  };
}
var evaluate14 = function(node) {
  const [nodeValue, explanation, unit] = node.explanation.reduce(
    ([evaluation, explanations, unit2, previousConditions], { condition, consequence }, i) => {
      if (previousConditions === true) {
        return [
          evaluation,
          [...explanations, { condition, consequence }],
          unit2,
          previousConditions
        ];
      }
      const evaluatedCondition = this.evaluateNode(condition);
      const currentCondition = previousConditions === void 0 ? previousConditions : !previousConditions && (evaluatedCondition.nodeValue === void 0 ? void 0 : evaluatedCondition.nodeValue !== false && evaluatedCondition.nodeValue !== null);
      if (currentCondition === false || currentCondition === null) {
        return [
          evaluation,
          [...explanations, { condition: evaluatedCondition, consequence }],
          unit2,
          previousConditions
        ];
      }
      let evaluatedConsequence = void 0;
      if (evaluatedCondition.nodeValue !== false && evaluatedCondition.nodeValue !== null) {
        evaluatedConsequence = this.evaluateNode(consequence);
        if (unit2) {
          try {
            evaluatedConsequence = convertNodeToUnit(
              unit2,
              evaluatedConsequence
            );
          } catch (e) {
            warning(
              this.context.logger,
              `L'unit\xE9 de la branche n\xB0 ${i + 1} du m\xE9canisme 'variations' n'est pas compatible avec celle d'une branche pr\xE9c\xE9dente`,
              { dottedName: this.cache._meta.evaluationRuleStack[0] },
              e
            );
          }
        }
      }
      return [
        currentCondition && evaluatedConsequence?.nodeValue,
        [
          ...explanations,
          {
            condition: evaluatedCondition,
            consequence: evaluatedConsequence ?? consequence
          }
        ],
        unit2 || evaluatedConsequence?.unit,
        previousConditions || currentCondition
      ];
    },
    [null, [], void 0, false]
  );
  return {
    ...node,
    nodeValue,
    ...unit !== void 0 && { unit },
    explanation,
    missingVariables: explanation.reduce(
      (values, { condition, consequence }) => mergeMissing(
        values,
        mergeMissing(
          bonus(condition.missingVariables),
          "nodeValue" in condition && condition.nodeValue !== false && condition.nodeValue !== null ? consequence.missingVariables : {}
        )
      ),
      {}
    )
  };
};
registerEvaluationFunction("variations", evaluate14);

// src/parseExpression.ts
var import_nearley = __toESM(require_nearley(), 1);

// src/grammarFunctions.js
var binaryOperation = ([A, , operator, , B]) => ({
  [operator.value.toLowerCase()]: [A, B]
});
var unaryOperation = ([operator, , A]) => ({
  [operator]: [number([{ value: "0" }]), A]
});
var variable = (arg) => {
  return {
    variable: arg.value
  };
};
var JSONObject = ([{ value }]) => {
  value;
};
var number = ([{ value }]) => ({
  constant: {
    type: "number",
    nodeValue: parseFloat(value)
  }
});
var numberWithUnit = (value) => ({
  ...number(value),
  unit\u00E9: value[2].value
});
var date = ([{ value }]) => {
  return {
    constant: {
      type: "date",
      nodeValue: normalizeDateString(value)
    }
  };
};
var boolean = ([{ value }]) => ({
  constant: {
    type: "boolean",
    nodeValue: value === "oui"
  }
});
var string = ([{ value }]) => ({
  constant: {
    type: "string",
    nodeValue: value.slice(1, -1)
  }
});

// src/grammar.codegen.js
var import_moo = __toESM(require_moo(), 1);
function id(x) {
  return x[0];
}
var dateRegexp = `(?:(?:0?[1-9]|[12][0-9]|3[01])\\/)?(?:0?[1-9]|1[012])\\/\\d{4}`;
var letter = "[a-zA-Z\xC0-\u017F\u20AC$%\xB0]";
var letterOrNumber = "[a-zA-Z\xC0-\u017F0-9',]";
var word = `${letter}(?:[-']?${letterOrNumber}+)*`;
var numberRegExp = "-?(?:[1-9][0-9]+|[0-9])(?:\\.[0-9]+)?";
var lexer = import_moo.default.compile({
  "(": "(",
  ")": ")",
  "[": "[",
  "]": "]",
  comparison: [">", "<", ">=", "<=", "=", "!="],
  date: new RegExp(dateRegexp),
  boolean: ["oui", "non"],
  number: new RegExp(numberRegExp),
  word: new RegExp(word),
  string: [/'.*'/, /".*"/],
  parentSelector: "^",
  JSONObject: /{.*}/,
  additionSubstraction: /[\+-]/,
  multiplicationDivision: ["*", "/"],
  dot: " . ",
  ".": ".",
  space: { match: /[\s]+/, lineBreaks: true }
});
var join = (args) => ({ value: args.map((x) => x && x.value).join("") });
var flattenJoin = (args) => join(args.flat());
var Lexer = lexer;
var ParserRules = [
  { "name": "main", "symbols": ["Comparison"], "postprocess": id },
  { "name": "main", "symbols": ["NumericValue"], "postprocess": id },
  { "name": "main", "symbols": ["Date"], "postprocess": id },
  { "name": "main", "symbols": ["NonNumericTerminal"], "postprocess": id },
  { "name": "main", "symbols": ["JSONObject"], "postprocess": id },
  { "name": "NumericValue", "symbols": ["AdditionSubstraction"], "postprocess": id },
  { "name": "NumericValue", "symbols": ["Negation"], "postprocess": id },
  { "name": "NumericTerminal", "symbols": ["Variable"], "postprocess": id },
  { "name": "NumericTerminal", "symbols": ["number"], "postprocess": id },
  { "name": "Negation", "symbols": [{ "literal": "-" }, lexer.has("space") ? { type: "space" } : space, "Parentheses"], "postprocess": unaryOperation },
  { "name": "Parentheses", "symbols": [{ "literal": "(" }, lexer.has("space") ? { type: "space" } : space, "NumericValue", lexer.has("space") ? { type: "space" } : space, { "literal": ")" }], "postprocess": ([, , e]) => e },
  { "name": "Parentheses", "symbols": [{ "literal": "(" }, "NumericValue", { "literal": ")" }], "postprocess": ([, e]) => e },
  { "name": "Parentheses", "symbols": ["NumericTerminal"], "postprocess": id },
  { "name": "Date", "symbols": ["Variable"], "postprocess": id },
  { "name": "Date", "symbols": [lexer.has("date") ? { type: "date" } : date], "postprocess": date },
  { "name": "Comparison", "symbols": ["Comparable", lexer.has("space") ? { type: "space" } : space, lexer.has("comparison") ? { type: "comparison" } : comparison, lexer.has("space") ? { type: "space" } : space, "Comparable"], "postprocess": binaryOperation },
  { "name": "Comparison", "symbols": ["Date", lexer.has("space") ? { type: "space" } : space, lexer.has("comparison") ? { type: "comparison" } : comparison, lexer.has("space") ? { type: "space" } : space, "Date"], "postprocess": binaryOperation },
  { "name": "Comparable$subexpression$1", "symbols": ["AdditionSubstraction"] },
  { "name": "Comparable$subexpression$1", "symbols": ["NonNumericTerminal"] },
  { "name": "Comparable", "symbols": ["Comparable$subexpression$1"], "postprocess": ([[e]]) => e },
  { "name": "NonNumericTerminal", "symbols": [lexer.has("boolean") ? { type: "boolean" } : boolean], "postprocess": boolean },
  { "name": "NonNumericTerminal", "symbols": [lexer.has("string") ? { type: "string" } : string], "postprocess": string },
  { "name": "Variable", "symbols": ["VariableWithoutParentSelector"], "postprocess": ([x]) => variable(x) },
  { "name": "Variable$ebnf$1", "symbols": [] },
  { "name": "Variable$ebnf$1$subexpression$1", "symbols": [lexer.has("parentSelector") ? { type: "parentSelector" } : parentSelector, lexer.has("dot") ? { type: "dot" } : dot], "postprocess": join },
  { "name": "Variable$ebnf$1", "symbols": ["Variable$ebnf$1", "Variable$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {
    return d[0].concat([d[1]]);
  } },
  { "name": "Variable", "symbols": ["Variable$ebnf$1", "VariableWithoutParentSelector"], "postprocess": (x) => variable(flattenJoin(x)) },
  { "name": "VariableWithoutParentSelector$ebnf$1", "symbols": [] },
  { "name": "VariableWithoutParentSelector$ebnf$1$subexpression$1", "symbols": [lexer.has("dot") ? { type: "dot" } : dot, "Words"], "postprocess": join },
  { "name": "VariableWithoutParentSelector$ebnf$1", "symbols": ["VariableWithoutParentSelector$ebnf$1", "VariableWithoutParentSelector$ebnf$1$subexpression$1"], "postprocess": function arrpush2(d) {
    return d[0].concat([d[1]]);
  } },
  { "name": "VariableWithoutParentSelector", "symbols": ["Words", "VariableWithoutParentSelector$ebnf$1"], "postprocess": (x) => flattenJoin(x) },
  { "name": "Words$ebnf$1$subexpression$1$ebnf$1", "symbols": [lexer.has("space") ? { type: "space" } : space], "postprocess": id },
  { "name": "Words$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {
    return null;
  } },
  { "name": "Words$ebnf$1$subexpression$1", "symbols": ["Words$ebnf$1$subexpression$1$ebnf$1", "WordOrNumber"], "postprocess": join },
  { "name": "Words$ebnf$1", "symbols": ["Words$ebnf$1$subexpression$1"] },
  { "name": "Words$ebnf$1$subexpression$2$ebnf$1", "symbols": [lexer.has("space") ? { type: "space" } : space], "postprocess": id },
  { "name": "Words$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": function(d) {
    return null;
  } },
  { "name": "Words$ebnf$1$subexpression$2", "symbols": ["Words$ebnf$1$subexpression$2$ebnf$1", "WordOrNumber"], "postprocess": join },
  { "name": "Words$ebnf$1", "symbols": ["Words$ebnf$1", "Words$ebnf$1$subexpression$2"], "postprocess": function arrpush3(d) {
    return d[0].concat([d[1]]);
  } },
  { "name": "Words", "symbols": ["WordOrKeyword", "Words$ebnf$1"], "postprocess": flattenJoin },
  { "name": "Words", "symbols": [lexer.has("word") ? { type: "word" } : word], "postprocess": id },
  { "name": "WordOrKeyword", "symbols": [lexer.has("word") ? { type: "word" } : word], "postprocess": id },
  { "name": "WordOrKeyword", "symbols": [lexer.has("boolean") ? { type: "boolean" } : boolean], "postprocess": id },
  { "name": "WordOrNumber", "symbols": ["WordOrKeyword"], "postprocess": id },
  { "name": "WordOrNumber", "symbols": [lexer.has("number") ? { type: "number" } : number], "postprocess": id },
  { "name": "Unit$ebnf$1", "symbols": [] },
  { "name": "Unit$ebnf$1", "symbols": ["Unit$ebnf$1", "UnitNumerator"], "postprocess": function arrpush4(d) {
    return d[0].concat([d[1]]);
  } },
  { "name": "Unit$ebnf$2", "symbols": [] },
  { "name": "Unit$ebnf$2", "symbols": ["Unit$ebnf$2", "UnitDenominator"], "postprocess": function arrpush5(d) {
    return d[0].concat([d[1]]);
  } },
  { "name": "Unit", "symbols": ["Unit$ebnf$1", "Unit$ebnf$2"], "postprocess": flattenJoin },
  { "name": "UnitNumerator", "symbols": ["Words"], "postprocess": id },
  { "name": "UnitNumerator", "symbols": [{ "literal": "." }, "UnitNumerator"], "postprocess": join },
  { "name": "UnitDenominator$ebnf$1", "symbols": [] },
  { "name": "UnitDenominator$ebnf$1$subexpression$1", "symbols": [lexer.has("space") ? { type: "space" } : space] },
  { "name": "UnitDenominator$ebnf$1", "symbols": ["UnitDenominator$ebnf$1", "UnitDenominator$ebnf$1$subexpression$1"], "postprocess": function arrpush6(d) {
    return d[0].concat([d[1]]);
  } },
  { "name": "UnitDenominator$ebnf$2", "symbols": ["UnitNumerator"] },
  { "name": "UnitDenominator$ebnf$2", "symbols": ["UnitDenominator$ebnf$2", "UnitNumerator"], "postprocess": function arrpush7(d) {
    return d[0].concat([d[1]]);
  } },
  { "name": "UnitDenominator", "symbols": ["UnitDenominator$ebnf$1", { "literal": "/" }, "UnitDenominator$ebnf$2"], "postprocess": flattenJoin },
  { "name": "AdditionSubstraction", "symbols": ["AdditionSubstraction", lexer.has("space") ? { type: "space" } : space, lexer.has("additionSubstraction") ? { type: "additionSubstraction" } : additionSubstraction, lexer.has("space") ? { type: "space" } : space, "MultiplicationDivision"], "postprocess": binaryOperation },
  { "name": "AdditionSubstraction", "symbols": ["MultiplicationDivision"], "postprocess": id },
  { "name": "MultiplicationDivision", "symbols": ["MultiplicationDivision", lexer.has("space") ? { type: "space" } : space, lexer.has("multiplicationDivision") ? { type: "multiplicationDivision" } : multiplicationDivision, lexer.has("space") ? { type: "space" } : space, "Parentheses"], "postprocess": binaryOperation },
  { "name": "MultiplicationDivision", "symbols": ["Parentheses"], "postprocess": id },
  { "name": "number", "symbols": [lexer.has("number") ? { type: "number" } : number], "postprocess": number },
  { "name": "number$ebnf$1$subexpression$1", "symbols": [lexer.has("space") ? { type: "space" } : space] },
  { "name": "number$ebnf$1", "symbols": ["number$ebnf$1$subexpression$1"], "postprocess": id },
  { "name": "number$ebnf$1", "symbols": [], "postprocess": function(d) {
    return null;
  } },
  { "name": "number", "symbols": [lexer.has("number") ? { type: "number" } : number, "number$ebnf$1", "Unit"], "postprocess": numberWithUnit },
  { "name": "JSONObject", "symbols": [lexer.has("JSONObject") ? { type: "JSONObject" } : JSONObject], "postprocess": JSONObject }
];
var ParserStart = "main";
var grammar_codegen_default = { Lexer, ParserRules, ParserStart };

// src/parseExpression.ts
var { Grammar, Parser } = import_nearley.default;
var compiledGrammar = Grammar.fromCompiled(grammar_codegen_default);
var parser = new Parser(compiledGrammar);
var initialState = parser.save();
function parseExpression(rawNode, dottedName) {
  const singleLineExpression = (rawNode + "").replace(/\s*\n\s*/g, " ").trim();
  try {
    parser.restore(initialState);
    const [parseResult] = parser.feed(singleLineExpression).results;
    if (parseResult == null) {
      throw new PublicodesError(
        "InternalError",
        `
Un probl\xE8me est survenu lors du parsing de l'expression \`${singleLineExpression}\` :

	le parseur Nearley n'a pas r\xE9ussi \xE0 parser l'expression.
`,
        { dottedName }
      );
    }
    return parseResult;
  } catch (e) {
    if (e instanceof PublicodesError) {
      throw e;
    }
    throw new PublicodesError(
      "SyntaxError",
      `\`${singleLineExpression}\` n'est pas une expression valide`,
      { dottedName },
      e
    );
  }
}

// src/reference.ts
function parseReference(v, context) {
  if (!context.dottedName) {
    throw new PublicodesError(
      "InternalError",
      "Une r\xE9f\xE9rence ne peut pas exister en dehors d'une r\xE8gle (`context.dottedName` est vide)",
      {
        dottedName: v
      }
    );
  }
  if (!v) {
    throw new PublicodesError(
      "SyntaxError",
      "Une r\xE9f\xE9rence ne peut pas \xEAtre vide",
      {
        dottedName: context.dottedName
      }
    );
  }
  return {
    nodeKind: "reference",
    name: v,
    contextDottedName: context.dottedName
  };
}
registerEvaluationFunction("reference", function evaluateReference(node) {
  if (!node.dottedName) {
    throw new PublicodesInternalError(node);
  }
  const explanation = this.evaluateNode(
    this.context.parsedRules[node.dottedName]
  );
  delete explanation.sourceMap;
  return {
    ...explanation,
    ...node
  };
});

// src/parse.ts
function parse(rawNode, context) {
  if (rawNode == void 0) {
    throw new PublicodesError(
      "SyntaxError",
      `
	Une des valeurs de la formule est vide.
	V\xE9rifiez que tous les champs \xE0 droite des deux points sont remplis`,
      { dottedName: context.dottedName }
    );
  }
  if (typeof rawNode === "boolean") {
    throw new PublicodesError(
      "SyntaxError",
      `
Les valeurs bool\xE9ennes true / false ne sont accept\xE9es.
Utilisez leur contrepartie fran\xE7aise : 'oui' / 'non'`,
      { dottedName: context.dottedName }
    );
  }
  const node = typeof rawNode === "object" ? rawNode : parseExpression(rawNode, context.dottedName);
  if ("nodeKind" in node) {
    return node;
  }
  return {
    ...parseChainedMecanisms(node, context),
    rawNode
  };
}
function parseMecanism(rawNode, context) {
  if (Array.isArray(rawNode)) {
    throw new PublicodesError(
      "SyntaxError",
      `
Il manque le nom du m\xE9canisme pour le tableau : [${rawNode.map((x) => `'${x}'`).join(", ")}]
Les m\xE9canisme possibles sont : 'somme', 'le maximum de', 'le minimum de', 'toutes ces conditions', 'une de ces conditions'.
		`,
      { dottedName: context.dottedName }
    );
  }
  const keys = Object.keys(rawNode);
  if (keys.length > 1) {
    throw new PublicodesError(
      "SyntaxError",
      `
Les m\xE9canismes suivants se situent au m\xEAme niveau : ${keys.map((x) => `'${x}'`).join(", ")}
Cela vient probablement d'une erreur dans l'indentation
	`,
      { dottedName: context.dottedName }
    );
  }
  if (keys.length === 0) {
    return { nodeKind: "constant", nodeValue: void 0 };
  }
  const mecanismName = keys[0];
  const values = rawNode[mecanismName];
  const parseFn = parseFunctions[mecanismName];
  if (!parseFn) {
    throw new PublicodesError(
      "SyntaxError",
      `Le m\xE9canisme "${mecanismName}" est inconnu.

V\xE9rifiez qu'il n'y ait pas d'erreur dans l'orthographe du nom.`,
      { dottedName: context.dottedName }
    );
  }
  try {
    return parseFn(values, context);
  } catch (e) {
    if (e instanceof PublicodesError) {
      throw e;
    }
    throw new PublicodesError(
      "SyntaxError",
      mecanismName ? `\u27A1\uFE0F Dans le m\xE9canisme ${mecanismName}
${e.message}` : e.message,
      { dottedName: context.dottedName }
    );
  }
}
var chainableMecanisms = [
  parseMecanismContexte,
  parseVariableManquante,
  parseAvec,
  applicable_default,
  non_applicable_default,
  parseArrondi,
  parseUnit\u00E9,
  parseSimplifierUnit\u00E9,
  plancher_default,
  plafond_default,
  parD_faut_default,
  situation_default,
  parseR\u00E9soudreR\u00E9f\u00E9renceCirculaire,
  abattement_default
];
function parseChainedMecanisms(rawNode, context) {
  const parseFn = chainableMecanisms.find((fn) => fn.nom in rawNode);
  if (!parseFn) {
    return parseMecanism(rawNode, context);
  }
  const { [parseFn.nom]: param, ...valeur } = rawNode;
  return parseMecanism(
    {
      [parseFn.nom]: {
        valeur,
        [parseFn.nom]: param
      }
    },
    context
  );
}
var parseFunctions = {
  ...operation_default,
  ...chainableMecanisms.reduce((acc, fn) => ({ [fn.nom]: fn, ...acc }), {}),
  "inversion num\xE9rique": mecanismInversion,
  "le maximum de": parseMaximumDe,
  "le minimum de": parseMinimumDe,
  "taux progressif": parseTauxProgressif,
  "toutes ces conditions": toutes_ces_conditions_default,
  "est non d\xE9fini": parseEstNonD\u00E9fini,
  "est non applicable": parseEstNonApplicable,
  "est applicable": parseEstApplicable,
  "est d\xE9fini": parseEstD\u00E9fini,
  "une de ces conditions": une_de_ces_conditions_default,
  "une possibilit\xE9": mecanismOnePossibility,
  condition: parseCondition,
  bar\u00E8me: parseBar\u00E8me,
  dur\u00E9e: dur_e_default,
  grille: parseGrille,
  multiplication: product_default,
  produit: product_default,
  somme: somme_default,
  moyenne: moyenne_default,
  [parseTexte.nom]: parseTexte,
  valeur: parse,
  variable: parseReference,
  variations: parseVariations,
  constant: (v) => ({
    type: v.type,
    // In the documentation we want to display constants defined in the source
    // with their full precision. This is especially useful for percentages like
    // APEC 0,036 %.
    fullPrecision: true,
    isNullable: v.nodeValue == null,
    missingVariables: {},
    nodeValue: v.nodeValue,
    nodeKind: "constant"
  })
};
var mecanismKeys = Object.keys(parseFunctions);

// src/replacement.ts
var remplacementRuleId = 0;
var cache = {};
function parseReplacements(replacements, context) {
  if (!replacements) {
    return [];
  }
  return (Array.isArray(replacements) ? replacements : [replacements]).map(
    (replacement) => {
      if (typeof replacement === "string") {
        replacement = { "r\xE9f\xE9rences \xE0": replacement };
      }
      const replacedReference = parse(replacement["r\xE9f\xE9rences \xE0"], context);
      const [whiteListedNames, blackListedNames] = [
        replacement.dans ?? [],
        replacement["sauf dans"] ?? []
      ].map(
        (dottedName) => Array.isArray(dottedName) ? dottedName : [dottedName]
      ).map((refs) => refs.map((ref) => parse(ref, context)));
      if (replacement.priorit\u00E9 != null && (typeof replacement.priorit\u00E9 !== "number" || replacement.priorit\u00E9 < 0)) {
        throw new PublicodesError(
          "SyntaxError",
          "La priorit\xE9 du remplacement doit \xEAtre un nombre positif",
          context
        );
      }
      return {
        nodeKind: "replacementRule",
        rawNode: replacement,
        priority: replacement.priorit\u00E9,
        definitionRule: parse(context.dottedName, context),
        replacedReference,
        replaceByNonApplicable: false,
        whiteListedNames,
        blackListedNames,
        remplacementRuleId: remplacementRuleId++
      };
    }
  );
}
function parseRendNonApplicable(rules, context) {
  const rendNonApplicableReplacements = parseReplacements(rules, context);
  rendNonApplicableReplacements.forEach(
    (r) => r.replaceByNonApplicable = true
  );
  return rendNonApplicableReplacements;
}
function getReplacements(parsedRules) {
  const ret = {};
  for (const dottedName in parsedRules) {
    const rule = parsedRules[dottedName];
    for (const replacement of rule.replacements) {
      if (!replacement.replacedReference.dottedName) {
        throw new PublicodesInternalError(replacement);
      }
      const key = replacement.replacedReference.dottedName;
      ret[key] = [...ret[key] ?? [], replacement];
    }
  }
  return ret;
}
function inlineReplacements({
  newRules,
  previousReplacements,
  parsedRules,
  referencesMaps
}) {
  const newReplacements = getReplacements(newRules);
  const ruleNamesWithNewReplacements = /* @__PURE__ */ new Set([]);
  for (const replacedReference in newReplacements) {
    const rulesThatUse = referencesMaps.rulesThatUse.get(replacedReference) ?? [];
    for (const value of rulesThatUse) {
      ruleNamesWithNewReplacements.add(value);
    }
  }
  const newRuleNamesWithPreviousReplacements = new Set(
    Object.keys(newRules).filter(
      (ruleName) => [...referencesMaps.referencesIn.get(ruleName) ?? /* @__PURE__ */ new Set()].some(
        (reference) => (previousReplacements[reference] ?? []).length
      )
    )
  );
  const replacements = mergeWithArray(previousReplacements, newReplacements);
  if (!newRuleNamesWithPreviousReplacements.size && !ruleNamesWithNewReplacements.size) {
    return [parsedRules, replacements];
  }
  const inlinePreviousReplacement = makeReplacementInliner(
    previousReplacements,
    referencesMaps
  );
  const inlineNewReplacement = makeReplacementInliner(
    newReplacements,
    referencesMaps
  );
  newRuleNamesWithPreviousReplacements.forEach((name) => {
    parsedRules[name] = inlinePreviousReplacement(
      parsedRules[name]
    );
  });
  ruleNamesWithNewReplacements.forEach((name) => {
    parsedRules[name] = inlineNewReplacement(
      parsedRules[name]
    );
  });
  return [parsedRules, replacements];
}
function makeReplacementInliner(replacements, referencesMaps) {
  return makeASTTransformer((node, transform) => {
    if (node.nodeKind === "replacementRule" || node.nodeKind === "inversion" || node.nodeKind === "une possibilit\xE9") {
      return false;
    }
    if (node.nodeKind === "contexte") {
      return {
        ...node,
        explanation: {
          ...node.explanation,
          valeur: transform(node.explanation.valeur),
          contexte: node.explanation.contexte.map(([name, value]) => [
            name,
            transform(value)
          ])
        }
      };
    }
    if (node.nodeKind === "reference") {
      if (!node.dottedName) {
        throw new PublicodesInternalError(node);
      }
      const replacedReferenceNode = replace(
        node,
        replacements[node.dottedName] ?? []
      );
      makeASTVisitor((n) => {
        updateReferencesMapsFromReferenceNode(
          n,
          referencesMaps,
          node.contextDottedName
        );
        return "continue";
      })(replacedReferenceNode);
      return replacedReferenceNode;
    }
  });
}
function replace(node, replacements) {
  const applicableReplacements = replacements.filter(
    ({ definitionRule }) => definitionRule.dottedName !== node.contextDottedName
  ).filter(
    ({ whiteListedNames }) => !whiteListedNames.length || whiteListedNames.some(
      (name) => node.contextDottedName.startsWith(name.dottedName)
    )
  ).filter(
    ({ blackListedNames }) => !blackListedNames.length || blackListedNames.every(
      (name) => !node.contextDottedName.startsWith(name.dottedName)
    )
  ).reverse().sort((a, b) => {
    const result = (b.priority ?? 0) - (a.priority ?? 0);
    if (result !== 0) {
      return result;
    }
    return b.definitionRule.dottedName.localeCompare(
      a.definitionRule.dottedName
    );
  });
  if (!applicableReplacements.length) {
    return node;
  }
  const applicableReplacementsCacheKey = applicableReplacements.map((n) => n.remplacementRuleId).join("-");
  if (cache[applicableReplacementsCacheKey]) {
    return cache[applicableReplacementsCacheKey];
  }
  const replacementNode = {
    nodeKind: "variations",
    explanation: [
      ...applicableReplacements.map(
        ({ definitionRule, replaceByNonApplicable }) => replaceByNonApplicable ? {
          condition: definitionRule,
          consequence: notApplicableNode
        } : {
          condition: estApplicable(definitionRule),
          consequence: definitionRule
        }
      ),
      { condition: oui, consequence: node }
    ]
  };
  replacementNode.sourceMap = {
    mecanismName: "replacement",
    args: {
      applicableReplacements,
      originalNode: node
    }
  };
  cache[applicableReplacementsCacheKey] = replacementNode;
  return cache[applicableReplacementsCacheKey];
}
function estApplicable(node) {
  return {
    nodeKind: "condition",
    explanation: {
      si: { nodeKind: "est non applicable", explanation: node },
      alors: non,
      sinon: oui
    }
  };
}
var oui = defaultNode(true);
var non = defaultNode(false);

// src/parsePublicodes.ts
function createContext(partialContext) {
  return {
    dottedName: "",
    logger: console,
    getUnitKey: (x) => x,
    parsedRules: {},
    referencesMaps: { referencesIn: /* @__PURE__ */ new Map(), rulesThatUse: /* @__PURE__ */ new Map() },
    nodesTypes: /* @__PURE__ */ new WeakMap(),
    rulesReplacements: {},
    allowOrphanRules: false,
    subEngineIncrementingNumber: 1,
    ...partialContext
  };
}
function copyContext(context) {
  return {
    ...context,
    parsedRules: { ...context.parsedRules },
    referencesMaps: {
      referencesIn: new Map(context.referencesMaps.referencesIn),
      rulesThatUse: new Map(context.referencesMaps.rulesThatUse)
    }
  };
}
function parsePublicodes(rawRules, partialContext = createContext({})) {
  if (typeof rawRules === "string")
    throw new PublicodesError(
      "EngineError",
      "Publicodes does not parse yaml rule sets itself anymore. Please provide a parsed js object. E.g. the `eemeli/yaml` package.",
      {}
    );
  const rules = weakCopyObj(rawRules);
  const context = createContext(partialContext);
  const previousParsedRules = context.parsedRules;
  context.parsedRules = {};
  parseRules(rules, context);
  let parsedRules = {};
  for (const dottedName in previousParsedRules) {
    parsedRules[dottedName] = previousParsedRules[dottedName];
  }
  for (const dottedName in context.parsedRules) {
    parsedRules[dottedName] = context.parsedRules[dottedName];
  }
  const [newRules, referencesMaps] = disambiguateReferencesAndCollectDependencies(
    parsedRules,
    context.parsedRules,
    context.referencesMaps,
    context.allowOrphanRules
  );
  let rulesReplacements;
  [parsedRules, rulesReplacements] = inlineReplacements({
    parsedRules,
    newRules,
    referencesMaps,
    previousReplacements: context.rulesReplacements
  });
  const nodesTypes = inferNodesTypes(
    Object.keys(newRules),
    parsedRules,
    context.nodesTypes
  );
  return {
    parsedRules,
    nodesTypes,
    referencesMaps,
    rulesReplacements
  };
}
function disambiguateReferencesAndCollectDependencies(parsedRules, newRules, referencesMaps, allowOrphanRules) {
  const disambiguateReference2 = makeASTTransformer(
    (node) => disambiguateReferenceNode(node, parsedRules)
  );
  const disambiguateReferencesAndCollectDependencies2 = makeASTTransformer(
    (node) => {
      const n = disambiguateReferenceNode(node, parsedRules);
      if (n) {
        updateReferencesMapsFromReferenceNode(n, referencesMaps);
      }
      return n;
    }
  );
  const disambiguatedRules = traverseParsedRules((node) => {
    if (node.nodeKind === "replacementRule") {
      return disambiguateReference2(node);
    }
    if (node.nodeKind === "rule") {
      const parentUndefined = node.explanation.parents.find(
        (n) => !(n.dottedName in parsedRules)
      );
      if (!allowOrphanRules && parentUndefined) {
        throw new PublicodesError(
          "SyntaxError",
          `La r\xE8gle parente "${parentUndefined.dottedName}" n'existe pas`,
          {
            dottedName: node.dottedName
          }
        );
      }
    }
    return disambiguateReferencesAndCollectDependencies2(node);
  }, newRules);
  return [
    disambiguatedRules,
    referencesMaps
  ];
}

// src/traversedVariables.ts
function computeTraversedVariableBeforeEval(traversedVariablesStack, parsedNode, cachedNode, publicParsedRules, isTraversedVariablesBoundary2) {
  if (traversedVariablesStack === void 0) {
    return;
  }
  if (cachedNode !== void 0) {
    cachedNode.traversedVariables?.forEach(
      (name) => traversedVariablesStack[0]?.add(name)
    );
    return;
  }
  if (isTraversedVariablesBoundary2) {
    traversedVariablesStack.unshift(/* @__PURE__ */ new Set());
  }
  if (parsedNode.nodeKind === "reference" && parsedNode.dottedName && parsedNode.dottedName in publicParsedRules) {
    traversedVariablesStack[0].add(parsedNode.dottedName);
  }
}
function isTraversedVariablesBoundary(traversedVariablesStack, parsedNode) {
  return !!traversedVariablesStack && (traversedVariablesStack.length === 0 || parsedNode.nodeKind === "rule");
}
function computeTraversedVariableAfterEval(traversedVariablesStack, evaluatedNode, isTraversedVariablesBoundary2) {
  if (traversedVariablesStack === void 0) {
    return;
  }
  if (isTraversedVariablesBoundary2) {
    evaluatedNode.traversedVariables = Array.from(
      traversedVariablesStack.shift() ?? []
    );
    if (traversedVariablesStack.length > 0) {
      evaluatedNode.traversedVariables.forEach((name) => {
        traversedVariablesStack[0].add(name);
      });
    }
  }
}

// src/serializeEvaluation.ts
function serializeEvaluation(node) {
  if (typeof node.nodeValue === "number") {
    const serializedUnit = serializeUnit(node.unit);
    return "" + node.nodeValue + (serializedUnit ? serializedUnit.replace(/\s/g, "") : "");
  } else if (typeof node.nodeValue === "boolean") {
    return node.nodeValue ? "oui" : "non";
  } else if (typeof node.nodeValue === "string") {
    return `'${node.nodeValue}'`;
  }
}

// src/index.ts
var emptyCache = () => ({
  _meta: {
    evaluationRuleStack: [],
    parentRuleStack: []
  },
  traversedVariablesStack: void 0,
  nodes: /* @__PURE__ */ new Map()
});
var Engine = class _Engine {
  baseContext;
  context;
  publicParsedRules;
  cache = emptyCache();
  // The subEngines attribute is used to get an outside reference to the
  // `contexte` intermediate calculations. The `contexte` mechanism uses
  // `shallowCopy` to instanciate a new engine, and we want to keep a reference
  // to it for the documentation.
  //
  // TODO: A better implementation would to remove the "runtime" concept of
  // "subEngines" and instead duplicate all rules names in the scope of the
  // `contexte` as described in
  // https://github.com/publicodes/publicodes/discussions/92
  subEngines = [];
  subEngineId;
  constructor(rules = {}, options = {}) {
    const initialContext = {
      dottedName: "",
      ...options
    };
    this.baseContext = createContext({
      ...initialContext,
      ...parsePublicodes(rules, initialContext)
    });
    this.context = this.baseContext;
    this.publicParsedRules = {};
    for (const name in this.baseContext.parsedRules) {
      const rule = this.baseContext.parsedRules[name];
      if (!rule.private && isAccessible(this.baseContext.parsedRules, "", name)) {
        this.publicParsedRules[name] = rule;
      }
    }
  }
  resetCache() {
    this.cache = emptyCache();
  }
  setSituation(situation = {}, options = {}) {
    this.resetCache();
    const keepPreviousSituation = options.keepPreviousSituation ?? false;
    Object.keys(situation).forEach((name) => {
      if (!(name in this.baseContext.parsedRules)) {
        throw new PublicodesError(
          "EvaluationError",
          `Erreur lors de la mise \xE0 jour de la situation : ${name} n'existe pas dans la base de r\xE8gle.`,
          { dottedName: name }
        );
      }
      if (this.baseContext.parsedRules[name].private) {
        throw new PublicodesError(
          "EvaluationError",
          `Erreur lors de la mise \xE0 jour de la situation : ${name} est une r\xE8gle priv\xE9e (il n'est pas possible de modifier une r\xE8gle priv\xE9e).`,
          { dottedName: name }
        );
      }
    });
    const situationToParse = Object.fromEntries(
      Object.entries(situation).map(([nom, value]) => [
        `[priv\xE9] ${nom} . $SITUATION`,
        value && typeof value === "object" && "nodeKind" in value ? { valeur: value } : value
      ])
    );
    const savedBaseContext = copyContext(this.baseContext);
    try {
      this.context = {
        ...this.baseContext,
        ...parsePublicodes(
          situationToParse,
          keepPreviousSituation ? this.context : this.baseContext
        )
      };
    } catch (error) {
      this.baseContext = savedBaseContext;
      throw error;
    }
    this.baseContext = savedBaseContext;
    Object.keys(situation).forEach((nom) => {
      if (isExperimental(this.context.parsedRules, nom)) {
        experimentalRuleWarning(this.baseContext.logger, nom);
      }
      this.checkExperimentalRule(
        this.context.parsedRules[`${nom} . $SITUATION`]
      );
    });
    return this;
  }
  inversionFail() {
    return !!this.cache.inversionFail;
  }
  getRule(dottedName) {
    if (!(dottedName in this.baseContext.parsedRules)) {
      throw new PublicodesError(
        "UnknownRule",
        `La r\xE8gle '${dottedName}' n'existe pas`,
        { dottedName }
      );
    }
    if (!(dottedName in this.publicParsedRules)) {
      throw new PublicodesError(
        "PrivateRule",
        `La r\xE8gle ${dottedName} est une r\xE8gle priv\xE9e.`,
        { dottedName }
      );
    }
    return this.publicParsedRules[dottedName];
  }
  getParsedRules() {
    return this.publicParsedRules;
  }
  evaluate(value) {
    const cachedNode = this.cache.nodes.get(value);
    if (cachedNode) {
      return cachedNode;
    }
    this.context = Object.assign(
      this.context,
      parsePublicodes(
        {
          "[priv\xE9] $EVALUATION": value && typeof value === "object" && "nodeKind" in value ? { valeur: value } : value
        },
        this.context
      )
    );
    this.checkExperimentalRule(this.context.parsedRules["$EVALUATION"]);
    this.cache._meta = emptyCache()._meta;
    const evaluation = this.evaluateNode(
      this.context.parsedRules["$EVALUATION"].explanation.valeur
    );
    this.cache.nodes.set(value, evaluation);
    return evaluation;
  }
  evaluateNode(parsedNode) {
    const cachedNode = this.cache.nodes.get(parsedNode);
    let traversedVariableBoundary = false;
    if (this.cache.traversedVariablesStack) {
      traversedVariableBoundary = isTraversedVariablesBoundary(
        this.cache.traversedVariablesStack,
        parsedNode
      );
      computeTraversedVariableBeforeEval(
        this.cache.traversedVariablesStack,
        parsedNode,
        cachedNode,
        this.publicParsedRules,
        traversedVariableBoundary
      );
    }
    if (cachedNode !== void 0) {
      return cachedNode;
    }
    if (!evaluationFunctions[parsedNode.nodeKind]) {
      throw new PublicodesError(
        "EvaluationError",
        `Unknown "nodeKind": ${parsedNode.nodeKind}`,
        { dottedName: "" }
      );
    }
    const evaluatedNode = evaluationFunctions[parsedNode.nodeKind].call(
      this,
      parsedNode
    );
    if (this.cache.traversedVariablesStack) {
      computeTraversedVariableAfterEval(
        this.cache.traversedVariablesStack,
        evaluatedNode,
        traversedVariableBoundary
      );
    }
    this.cache.nodes.set(parsedNode, evaluatedNode);
    return evaluatedNode;
  }
  /**
   * Shallow Engine instance copy. Keeps references to the original Engine instance attributes.
   */
  shallowCopy() {
    const newEngine = new _Engine();
    newEngine.baseContext = copyContext(this.baseContext);
    newEngine.context = copyContext(this.context);
    newEngine.publicParsedRules = this.publicParsedRules;
    newEngine.cache = {
      ...emptyCache(),
      nodes: new Map(this.cache.nodes)
    };
    return newEngine;
  }
  checkExperimentalRule = makeASTVisitor((node) => {
    if (node.nodeKind === "reference" && isExperimental(this.context.parsedRules, node.dottedName)) {
      experimentalRuleWarning(
        this.baseContext.logger,
        node.dottedName
      );
    }
    return "continue";
  });
};
export {
  PublicodesError,
  capitalise0,
  Engine as default,
  formatValue,
  isPublicodesError,
  parseExpression,
  parsePublicodes,
  parseUnit,
  reduceAST,
  serializeEvaluation,
  serializeUnit,
  simplifyNodeUnit,
  makeASTTransformer as transformAST,
  traverseASTNode,
  ruleUtils_exports as utils
};
//# sourceMappingURL=index.js.map