"use strict";var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard"),_interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.includes"),require("core-js/modules/es.array.iterator"),require("core-js/modules/es.object.entries"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _is2=_interopRequireDefault(require("ramda/src/is")),_react=_interopRequireWildcard(require("react")),_propTypes=_interopRequireDefault(require("prop-types")),_figures=require("figures"),_ink=require("ink"),_tomoCli=require("tomo-cli");/**
 * Main tomo UI component
 * @param {Object} props Component props
 * @return {ReactComponent} Main tomo UI component
 */class UI extends _react.Component{constructor(a){super(a);const{commands:b,flags:c,input:d}=a,{ignoreWarnings:e}=c,[f,...g]=d,h=(0,_is2.default)(String)(f),i=h&&(a=>Object.entries(b).filter(([,a])=>"string"==typeof a).map(([a])=>a).includes(a))(f),j=0<g.length,{intendedCommand:k,intendedTerms:l}=h&&!i?(0,_tomoCli.getIntendedInput)(b,f,g):{intendedCommand:f,intendedTerms:g},m=(f!==k||j&&l.map((a,b)=>a!==g[b]).some(Boolean))&&!e;this.state={hasTerms:j,hasCommand:h,showWarning:m,intendedTerms:l,intendedCommand:k,isTerminalCommand:i},this.updateWarning=this.updateWarning.bind(this),this.updateTerms=this.updateTerms.bind(this)}render(){const{commands:a,descriptions:b,done:c,flags:d,store:e,customCommands:f}=this.props,{hasCommand:g,hasTerms:h,intendedCommand:i,intendedTerms:j,isTerminalCommand:k,showWarning:l}=this.state,m=()=>{const a=(0,_tomoCli.dict)(f||{}),g=a.has(i)?a.get(i):_tomoCli.UnderConstruction;return _react.default.createElement(g,{descriptions:b,done:c,options:d,store:e,terms:j})};return _react.default.createElement(_tomoCli.ErrorBoundary,null,l?_react.default.createElement(_tomoCli.Warning,{callback:this.updateWarning},_react.default.createElement(_ink.Text,null,"Did you mean ",_react.default.createElement(_ink.Color,{bold:!0,green:!0},i," ",j.join(" ")),"?")):g&&h?k?_react.default.createElement(m,null):_react.default.createElement(_react.Fragment,null,_react.default.createElement(()=>{const[a]=process.hrtime(),[b,c]=(0,_react.useState)(!1),[d,f]=(0,_react.useState)("00:00:00"),g=({complete:a,elapsed:b})=>{const c=()=>_react.default.createElement(_ink.Color,{cyan:!0},_figures.play),d=()=>_react.default.createElement(_ink.Color,{dim:!0},_figures.play),e=+b.split(":")[2]%3;return a?_react.default.createElement(_ink.Color,{dim:!0},"runtime"):_react.default.createElement(_ink.Box,null,0===e?_react.default.createElement(c,null):_react.default.createElement(d,null),1===e?_react.default.createElement(c,null):_react.default.createElement(d,null),2===e?_react.default.createElement(c,null):_react.default.createElement(d,null))};// eslint-disable-line react-hooks/exhaustive-deps
return g.propTypes={complete:_propTypes.default.bool,elapsed:_propTypes.default.string},(0,_react.useEffect)(()=>{const b=setInterval(()=>{f((0,_tomoCli.getElapsedTime)(a))},1e3);// eslint-disable-line no-magic-numbers
global._pwngoal_callback=()=>{// eslint-disable-line camelcase
const d=e.get("tcp.ports")||[],f=e.get("udp.ports")||[],g=(0,_tomoCli.getElapsedSeconds)((0,_tomoCli.getElapsedTime)(a));1<g&&((a,b,c)=>{const d=a.get(b);Array.isArray(d)||a.set(b,[]);const e=a.get(b);a.set(b,e.concat(c))})(e,"stats",{tcp:d,udp:f,runtime:g}),c(!0),clearInterval(b)}},[]),_react.default.createElement(_ink.Box,{marginTop:1,marginLeft:1},_react.default.createElement(g,{elapsed:d,complete:b}),_react.default.createElement(_ink.Text,null," ",d))},null),_react.default.createElement(_tomoCli.TaskList,{commands:a,command:i,terms:j,options:d,done:c})):g?k?_react.default.createElement(m,null):_react.default.createElement(_tomoCli.SubCommandSelect,{command:i,descriptions:b,items:Object.keys(a[i]).map(a=>({label:a,value:a})),onSelect:this.updateTerms}):_react.default.createElement(_tomoCli.UnderConstruction,null))}/**
     * Callback function for warning component
     * @param {string} data Character data from stdin
     * @return {undefined} Returns nothing
     */updateWarning(a){"\r"==a+""?this.setState({showWarning:!1}):process.exit(0)}/**
     * @param {Object} args Function options
     * @param {string} args.value Intended term
     * @return {undefined} Returns nothing
     */updateTerms({value:a}){this.setState({hasTerms:!0,intendedTerms:[a]})}}exports.default=UI,UI.propTypes={commands:_propTypes.default.object,descriptions:_propTypes.default.object,done:_propTypes.default.func,flags:_propTypes.default.object,input:_propTypes.default.array,stdin:_propTypes.default.string,store:_propTypes.default.oneOfType([_propTypes.default.array,_propTypes.default.object]),customCommands:_propTypes.default.object},UI.defaultProps={input:[],flags:{}};