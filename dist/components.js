"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard");require("core-js/modules/es.array.iterator"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.ShowCommand=void 0;var _react=_interopRequireWildcard(require("react")),_propTypes=_interopRequireDefault(require("prop-types")),_ink=require("ink"),_inkBox=_interopRequireDefault(require("ink-box")),_inkTable=_interopRequireDefault(require("ink-table"));const ShowCommand=({options:a,store:b,terms:c})=>{const{ip:d}=a,[e]=c,f=e||d,g=(a,b)=>{const{length:c}=a;return 60>c?a:a.substring(0,b).concat("...")},h=(b.get(f)||[]).map(a=>{const{version:b}=a;return Object.assign(a,{version:g(b,57)})}),i=({ip:a})=>{const b=a=>"string"==typeof a&&0<a.length;return _react.default.createElement(_ink.Box,{flexDirection:"column"},_react.default.createElement(_ink.Box,null,_react.default.createElement(_ink.Text,null,"No results for "),_react.default.createElement(_ink.Color,{bold:!0,red:!0},b(a)?a:"nothing")),b(a)?_react.default.createElement(_react.Fragment,null):_react.default.createElement(_ink.Box,{marginLeft:1},"\u21B3  ",_react.default.createElement(_ink.Color,{dim:!0},"Did you mean to use \u201Cpwngoal --help\u201D?")))};return i.propTypes={ip:_propTypes.default.string},0===h.length?_react.default.createElement(i,{ip:f}):_react.default.createElement(_react.Fragment,null,_react.default.createElement(_inkBox.default,{padding:{left:1,right:1},borderColor:"cyan"},_react.default.createElement(_ink.Color,{bold:!0,cyan:!0},f)),_react.default.createElement(_inkTable.default,{data:h}),_react.default.createElement(_ink.Box,{marginBottom:2,marginLeft:1},"\u21B3  ",_react.default.createElement(_ink.Color,{dim:!0},"Try \u201Cpwngoal suggest\u201D to get some suggestions on what to do next")))};exports.ShowCommand=ShowCommand,ShowCommand.propTypes={done:_propTypes.default.func,options:_propTypes.default.object,store:_propTypes.default.object,terms:_propTypes.default.array};