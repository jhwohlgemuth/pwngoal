"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.includes"),require("core-js/modules/es.array.iterator"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_os=require("os"),_execa=_interopRequireDefault(require("execa")),_conf=_interopRequireDefault(require("conf")),_commandExists=_interopRequireDefault(require("command-exists")),_utils=require("../utils");const store=new _conf.default({projectName:"pwngoal"}),PRIMARY_SCANNER="masscan",SECONDARY_SCANNER="nmap";var _default={port:[{text:"Scan TCP ports with nmap",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){});return function task(){return a.apply(this,arguments)}}(),condition:()=>!0,optional:()=>_commandExists.default.sync("nmap")},{text:"You need to install nmap to scan a port...",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){});return function task(){return a.apply(this,arguments)}}(),condition:()=>!1,optional:()=>!_commandExists.default.sync("nmap")}],ports:[{text:"Clear saved data",task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a}){store.delete(a)});return function task(){return a.apply(this,arguments)}}(),condition:()=>!0},{text:`Find open ports with ${PRIMARY_SCANNER}`,task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a}){const b=yield(0,_utils.getOpenPortsWithMasscan)(a);store.set("tcp.ports",b),yield(0,_utils.debug)(`Ports from ${PRIMARY_SCANNER}:`),yield(0,_utils.debug)({ports:b})});return function task(){return a.apply(this,arguments)}}(),condition:()=>_commandExists.default.sync(PRIMARY_SCANNER),optional:()=>_commandExists.default.sync(PRIMARY_SCANNER)},{text:`Find open ports with ${SECONDARY_SCANNER}`,task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a}){const b=yield(0,_utils.getOpenPortsWithNmap)(a);store.set("tcp.ports",b),yield(0,_utils.debug)(`Ports from ${SECONDARY_SCANNER}:`),yield(0,_utils.debug)({ports:b})});return function task(){return a.apply(this,arguments)}}(),condition:()=>_commandExists.default.sync(SECONDARY_SCANNER)&&!_commandExists.default.sync(PRIMARY_SCANNER),optional:()=>_commandExists.default.sync(SECONDARY_SCANNER)&&!_commandExists.default.sync(PRIMARY_SCANNER)},{text:"Enumerate services with nmap",task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a}){const b=[],c=store.get("tcp.ports")||[];yield(0,_utils.debug)({ports:c});for(const d of c){const{stdout:c}=yield(0,_execa.default)("nmap",[a,"-p",d,"-sV"]);c.split(_os.EOL).filter(a=>a.includes("/tcp")).map(a=>a.split(" ").filter(Boolean)).forEach(([,,a,...c])=>{const e=c.join(" ").substring(0,57).concat("...");b.push({port:d,service:a,version:e})})}store.set(a,b),yield(0,_utils.debug)({data:b})});return function task(){return a.apply(this,arguments)}}(),condition:()=>_commandExists.default.sync("nmap"),optional:()=>_commandExists.default.sync("nmap")},{text:"You need to install masscan or nmap to run a scan...",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){});return function task(){return a.apply(this,arguments)}}(),condition:()=>!1,optional:()=>!(_commandExists.default.sync(PRIMARY_SCANNER)||_commandExists.default.sync(SECONDARY_SCANNER))}]};exports.default=_default;