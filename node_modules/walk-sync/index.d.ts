/// <reference types="node" />
import fsNode = require('fs');
import { IMinimatch, IOptions as MinimatchOptions } from 'minimatch';
declare type Optionalize<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
declare function walkSync(baseDir: string, inputOptions?: Optionalize<walkSync.Options, 'fs'> | (string | IMinimatch)[]): string[];
export = walkSync;
declare namespace walkSync {
    function entries(baseDir: string, inputOptions?: Options | (string | IMinimatch)[]): Entry[];
    interface Options {
        includeBasePath?: boolean;
        globs?: (string | IMinimatch)[];
        ignore?: (string | IMinimatch)[];
        directories?: boolean;
        fs: typeof fsNode;
        globOptions?: MinimatchOptions;
    }
    class Entry {
        relativePath: string;
        basePath: string;
        mode: number;
        size: number;
        mtime: number;
        constructor(relativePath: string, basePath: string, mode: number, size: number, mtime: number);
        get fullPath(): string;
        isDirectory(): boolean;
    }
}
