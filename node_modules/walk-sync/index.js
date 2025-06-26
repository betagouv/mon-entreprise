'use strict';
const fsNode = require("fs");
const MatcherCollection = require("matcher-collection");
const ensurePosix = require("ensure-posix-path");
const path = require("path");
const minimatch_1 = require("minimatch");
function walkSync(baseDir, inputOptions) {
    const options = handleOptions(inputOptions);
    let mapFunct;
    if (options.includeBasePath) {
        mapFunct = function (entry) {
            return entry.basePath.split(path.sep).join('/').replace(/\/+$/, '') + '/' + entry.relativePath;
        };
    }
    else {
        mapFunct = function (entry) {
            return entry.relativePath;
        };
    }
    return _walkSync(baseDir, options, null, []).map(mapFunct);
}
function getStat(path, fs) {
    try {
        return fs.statSync(path);
    }
    catch (error) {
        if (error !== null && typeof error === 'object' && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) {
            return;
        }
        throw error;
    }
}
(function (walkSync) {
    function entries(baseDir, inputOptions) {
        const options = handleOptions(inputOptions);
        return _walkSync(ensurePosix(baseDir), options, null, []);
    }
    walkSync.entries = entries;
    ;
    class Entry {
        constructor(relativePath, basePath, mode, size, mtime) {
            this.relativePath = relativePath;
            this.basePath = basePath;
            this.mode = mode;
            this.size = size;
            this.mtime = mtime;
        }
        get fullPath() {
            return `${this.basePath}/${this.relativePath}`;
        }
        isDirectory() {
            return (this.mode & 61440) === 16384;
        }
    }
    walkSync.Entry = Entry;
})(walkSync || (walkSync = {}));
function isDefined(val) {
    return typeof val !== 'undefined';
}
function handleOptions(_options) {
    let options = {};
    if (Array.isArray(_options)) {
        options.globs = _options;
    }
    else if (_options) {
        options = _options;
    }
    if (!options.fs)
        options.fs = fsNode;
    return options;
}
function applyGlobOptions(globs, options) {
    return globs === null || globs === void 0 ? void 0 : globs.map(glob => {
        if (typeof glob === 'string') {
            return new minimatch_1.Minimatch(glob, options);
        }
        return glob;
    });
}
function handleRelativePath(_relativePath) {
    if (_relativePath == null) {
        return '';
    }
    else if (_relativePath.slice(-1) !== '/') {
        return _relativePath + '/';
    }
    else {
        return _relativePath;
    }
}
function lexicographically(a, b) {
    const aPath = a.relativePath;
    const bPath = b.relativePath;
    if (aPath === bPath) {
        return 0;
    }
    else if (aPath < bPath) {
        return -1;
    }
    else {
        return 1;
    }
}
function _walkSync(baseDir, options, _relativePath, visited) {
    const { fs } = options;
    // Inside this function, prefer string concatenation to the slower path.join
    // https://github.com/joyent/node/pull/6929
    const relativePath = handleRelativePath(_relativePath);
    const realPath = fs.realpathSync(baseDir + '/' + relativePath);
    if (visited.indexOf(realPath) >= 0) {
        return [];
    }
    else {
        visited.push(realPath);
    }
    try {
        const globOptions = options.globOptions;
        const ignorePatterns = (isDefined(globOptions)) ? applyGlobOptions(options.ignore, globOptions) : options.ignore;
        const globs = (isDefined(globOptions)) ? applyGlobOptions(options.globs, globOptions) : options.globs;
        let globMatcher;
        let ignoreMatcher;
        let results = [];
        if (ignorePatterns) {
            ignoreMatcher = new MatcherCollection(ignorePatterns);
        }
        if (globs) {
            globMatcher = new MatcherCollection(globs);
        }
        if (globMatcher && !globMatcher.mayContain(relativePath)) {
            return results;
        }
        const names = fs.readdirSync(baseDir + '/' + relativePath);
        const entries = names.map(name => {
            let entryRelativePath = relativePath + name;
            if (ignoreMatcher && ignoreMatcher.match(entryRelativePath)) {
                return;
            }
            let fullPath = baseDir + '/' + entryRelativePath;
            let stats = getStat(fullPath, fs);
            if (stats && stats.isDirectory()) {
                return new walkSync.Entry(entryRelativePath + '/', baseDir, stats.mode, stats.size, stats.mtime.getTime());
            }
            else {
                return new walkSync.Entry(entryRelativePath, baseDir, stats && stats.mode || 0, stats && stats.size || 0, stats && stats.mtime.getTime() || 0);
            }
        }).filter(isDefined);
        const sortedEntries = entries.sort(lexicographically);
        for (let i = 0; i < sortedEntries.length; ++i) {
            let entry = sortedEntries[i];
            if (entry.isDirectory()) {
                if (options.directories !== false && (!globMatcher || globMatcher.match(entry.relativePath))) {
                    results.push(entry);
                }
                results = results.concat(_walkSync(baseDir, options, entry.relativePath, visited));
            }
            else {
                if (!globMatcher || globMatcher.match(entry.relativePath)) {
                    results.push(entry);
                }
            }
        }
        return results;
    }
    finally {
        visited.pop();
    }
}
module.exports = walkSync;
