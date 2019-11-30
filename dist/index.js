#!/usr/bin/env node
"use strict";var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard"),_interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_react=_interopRequireWildcard(require("react")),_chalk=require("chalk"),_conf=_interopRequireDefault(require("conf")),_meow=_interopRequireDefault(require("meow")),_readPkg=_interopRequireDefault(require("read-pkg")),_getStdin=_interopRequireDefault(require("get-stdin")),_ink=require("ink"),_tomoCli=require("tomo-cli"),_main=_interopRequireDefault(require("./main")),_commands=_interopRequireDefault(require("./commands")),_components=require("./components");// import updateNotifier from 'update-notifier';
// Notify updater
// const pkg = require(`../package.json`);
// updateNotifier({pkg}).notify();
const projectName="pwngoal",terminalCommands={show:_components.ShowCommand,suggest:_tomoCli.UnderConstruction},showVersion=()=>{const a=(0,_path.join)(__dirname,".."),{version:b}=_readPkg.default.sync({cwd:a});// eslint-disable-line no-console
console.log(b),process.exit()},help=`
    ${_chalk.dim.bold("Usage")}

        ${(0,_chalk.cyan)(">")} ${"pwngoal"} [commands] [terms] [options]
        
        ${(0,_chalk.cyan)(">")} ${"pwngoal"} version


    ${_chalk.dim.bold("Commands")}

        copy, scan, ...


    ${_chalk.dim.bold("Terms")}

        [???]
        ???, ...


    ${_chalk.dim.bold("Options")}

        --version, -v           Print version
        --ignore-warnings,      Ignore warning messages [Default: false]
        --debug                 Show debug data [Default: false]
        --ip,               -i  IP address [Default: 127.0.0.1]
        --port,             -p  Port [Default: 80]
`,options={help,flags:{version:{type:"boolean",default:!1,alias:"v"},help:{type:"boolean",default:!1,alias:"h"},ignoreWarnings:{type:"boolean",default:!1},debug:{type:"boolean",default:!1},ip:{type:"string",default:"",alias:"i"},port:{type:"number",default:80,alias:"p"}}},{input,flags}=(0,_meow.default)(options);("version"===input[0]||flags.version)&&showVersion(),(0,_asyncToGenerator2.default)(function*(){const a=()=>"function"==typeof global._pwngoal_callback&&global._pwngoal_callback(),b=yield(0,_getStdin.default)(),c=new _conf.default({projectName});(0,_ink.render)(_react.default.createElement(()=>_react.default.createElement(_react.Fragment,null,_react.default.createElement(_main.default,{commands:_commands.default,done:a,flags:flags,input:input,stdin:b,store:c,terminalCommands:terminalCommands})),null),{exitOnCtrlC:!0})})();