#!/usr/bin/env node
"use strict";var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard"),_interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_react=_interopRequireWildcard(require("react")),_conf=_interopRequireDefault(require("conf")),_meow=_interopRequireDefault(require("meow")),_getStdin=_interopRequireDefault(require("get-stdin")),_ink=require("ink"),_tomoCli=require("tomo-cli"),_main=_interopRequireDefault(require("./main")),_commands=_interopRequireDefault(require("./commands")),_cli=require("./cli"),_ShowCommand=_interopRequireDefault(require("./components/ShowCommand")),_SuggestCommand=_interopRequireDefault(require("./components/SuggestCommand"));// import updateNotifier from 'update-notifier';
// Notify updater
// const pkg = require(`../package.json`);
// updateNotifier({pkg}).notify();
const customCommands={show:_ShowCommand.default,suggest:_SuggestCommand.default,wat:_SuggestCommand.default},{input,flags}=(0,_meow.default)(_cli.options);("version"===input[0]||flags.version)&&(0,_tomoCli.showVersion)(),(0,_asyncToGenerator2.default)(function*(){const a=()=>"function"==typeof global._pwngoal_callback&&global._pwngoal_callback(),b=yield(0,_getStdin.default)(),c=new _conf.default({projectName:_cli.projectName});(0,_ink.render)(_react.default.createElement(()=>_react.default.createElement(_react.Fragment,null,_react.default.createElement(_main.default,{commands:_commands.default,descriptions:_cli.descriptions,done:a,flags:flags,input:input,stdin:b,store:c,customCommands:customCommands})),null),{exitOnCtrlC:!0})})();