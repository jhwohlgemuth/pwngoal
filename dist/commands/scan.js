"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.flat-map"),require("core-js/modules/es.array.includes"),require("core-js/modules/es.array.iterator"),require("core-js/modules/es.array.unscopables.flat-map"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_os=require("os"),_isElevated=_interopRequireDefault(require("is-elevated")),_execa=_interopRequireDefault(require("execa")),_conf=_interopRequireDefault(require("conf")),_commandExists=_interopRequireDefault(require("command-exists")),_utils=require("../utils"),_cli=require("../cli");const store=new _conf.default({projectName:_cli.projectName}),PRIMARY_SCANNER="masscan",SECONDARY_SCANNER="nmap",makeKey=a=>a.split(".").join("_"),shouldPerformEnumeration=()=>{const a=store.get("tcp.ports")||[],b=store.get("udp.ports")||[];return 0<[...a,...b].length};var _default={port:[{text:"Scan TCP ports with nmap",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){});return function task(){return a.apply(this,arguments)}}(),condition:()=>!0,optional:()=>_commandExists.default.sync("nmap")},{text:"You need to install nmap to scan a port...",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){});return function task(){return a.apply(this,arguments)}}(),condition:()=>!1,optional:()=>!_commandExists.default.sync("nmap")}],ports:[{text:"Clear saved data",task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a}){store.delete(makeKey(a)),store.delete("tcp.ports"),store.delete("udp.ports")});return function task(){return a.apply(this,arguments)}}(),condition:()=>!0},{text:`Find open TCP ports with ${PRIMARY_SCANNER}`,task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a}){const b=yield(0,_utils.getOpenPortsWithMasscan)(a);yield(0,_utils.debug)({ports:b},`TCP ports from ${PRIMARY_SCANNER}`),store.set("tcp.ports",b)});return function task(){return a.apply(this,arguments)}}(),condition:({nmapOnly:a,udpOnly:b})=>!a&&!b&&_commandExists.default.sync(PRIMARY_SCANNER),optional:({nmapOnly:a})=>!a&&_commandExists.default.sync(PRIMARY_SCANNER)},{text:`Find open TCP ports with ${SECONDARY_SCANNER}`,task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a}){const b=yield(0,_utils.getOpenPortsWithNmap)(a);yield(0,_utils.debug)({ports:b},`TCP ports from ${SECONDARY_SCANNER}`),store.set("tcp.ports",b)});return function task(){return a.apply(this,arguments)}}(),condition:({udpOnly:a})=>!a&&_commandExists.default.sync(SECONDARY_SCANNER)&&!_commandExists.default.sync(PRIMARY_SCANNER),optional:()=>_commandExists.default.sync(SECONDARY_SCANNER)&&!_commandExists.default.sync(PRIMARY_SCANNER)},{text:`Find open UDP ports with nmap`,task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a}){const b=yield(0,_utils.getOpenUdpPortsWithNmap)(a);yield(0,_utils.debug)({ports:b},`UDP ports from nmap`),store.set("udp.ports",b)});return function task(){return a.apply(this,arguments)}}(),condition:({udp:a,udpOnly:b})=>(a||b)&&_commandExists.default.sync("nmap")&&(0,_isElevated.default)(),optional:({udp:a,udpOnly:b})=>(a||b)&&_commandExists.default.sync("nmap")},{text:"Enumerate services with nmap and amap",task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a,udp:b,udpOnly:c}){let d=[];if(!c){const b=store.get(`tcp.ports`)||[];yield(0,_utils.debug)({ports:b},"TCP ports passed to enumeration");const c=yield(0,_utils.enumerate)(a,b);d=[...d,...c]}if((b||c)&&(yield(0,_isElevated.default)())){const b=store.get("udp.ports")||[];yield(0,_utils.debug)({ports:b},"UDP ports passed to enumeration");const c=yield(0,_utils.enumerate)(a,b,"udp");d=[...d,...c]}if(yield(0,_commandExists.default)("amap"))for(const{port:b,protocol:c}of d.filter(_utils.shouldScanWithAmap)){const{stdout:e}=yield(0,_execa.default)("amap",["-q",a,b]);yield(0,_utils.debug)({port:b,protocol:c},"Port to scan with amap"),yield(0,_utils.debug)(e,`amap -q ${a} ${b}`);const f=d.findIndex(a=>a.port===b&&a.protocol===c),g=e.split(_os.EOL).filter(a=>a.includes("matches")).map(a=>a.split(" ").filter(Boolean)).flatMap(([,,,,a])=>a).join(" | ");d[f].version=g||"???"}const e=makeKey(a);yield(0,_utils.debug)({data:d},`Results of enumeration for ${e}`),store.set(e,d)});return function task(){return a.apply(this,arguments)}}(),condition:()=>_commandExists.default.sync("nmap")&&shouldPerformEnumeration(),optional:()=>_commandExists.default.sync("nmap")},{text:"You need to install masscan or nmap to run a scan...",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){});return function task(){return a.apply(this,arguments)}}(),condition:()=>!1,optional:()=>!(_commandExists.default.sync(PRIMARY_SCANNER)||_commandExists.default.sync(SECONDARY_SCANNER))}]};exports.default=_default;