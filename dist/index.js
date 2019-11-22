#!/usr/bin/env node
"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_react=_interopRequireDefault(require("react")),_chalk=require("chalk"),_ink=require("ink"),_meow=_interopRequireDefault(require("meow")),_readPkg=_interopRequireDefault(require("read-pkg")),_getStdin=_interopRequireDefault(require("get-stdin")),_updateNotifier=_interopRequireDefault(require("update-notifier")),_main=_interopRequireDefault(require("./main"));// Notify updater
// const pkg = require(`../package.json`);
// updateNotifier({pkg}).notify();
const showVersion=()=>{const a=(0,_path.join)(__dirname,".."),{version:b}=_readPkg.default.sync({cwd:a});// eslint-disable-line no-console
console.log(b),process.exit()},help=`
    ${_chalk.dim.bold("Usage")}

        ${(0,_chalk.cyan)(">")} penny [commands] [terms] [options]
        
        ${(0,_chalk.cyan)(">")} penny version


    ${_chalk.dim.bold("Commands")}

        ???, ...


    ${_chalk.dim.bold("Terms")}

        [???]
        ???, ...


    ${_chalk.dim.bold("Options")}

        --version, -v           Print version
        --ignore-warnings, -i   Ignore warning messages [Default: false]
        --debug                 Show debug data [Default: false]	
`,options={help,flags:{version:{type:"boolean",default:!1,alias:"v"},help:{type:"boolean",default:!1,alias:"h"},ignoreWarnings:{type:"boolean",default:!1,alias:"i"},debug:{type:"boolean",default:!1}}},{input,flags}=(0,_meow.default)(options);("version"===input[0]||flags.version)&&showVersion(),(0,_asyncToGenerator2.default)(function*(){const a=yield(0,_getStdin.default)();(0,_ink.render)(_react.default.createElement(_main.default,{input:input,flags:flags,stdin:a}),{exitOnCtrlC:!0})})();