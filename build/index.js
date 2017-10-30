"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function getBehaviorBar(e,t){if(t)switch(e){case"pulldown":return 1==t?bars.pulldown:t;case"loading":return 1==t?bars.loading:t;case"over":return 1==t?bars.over:t;case"trigger":return 1==t?bars.trigger:t}}function _getGroups(e,t){var r=[];return filter(e,function(e,r){if(e.parent==t)return indexcode.push(r),e.parent==t}).forEach(function(t,n){t.idf&&-1==idrecode.indexOf(t.idf)?(idrecode.push(t.idf),r=r.concat(t).concat(_getGroups(e,t.idf))):r=r.concat(t)}),r}function findParents(e,t){var r=void 0,n=find(e,function(e,r){return e.idf==t});if(n&&n.parent){var a=find(e,function(e,t){return r=t,e.idf==n.parent});a&&(myParents.push({index:r,content:a}),findParents(e,n.parent))}}function App(e){var t=Aotoo(Tree,Actions,e);return t.extend({getGroups:function(e,t,r){e=e||this.data||[],idrecode=[],indexcode=[];var n=findIndex(e,function(e){return e.idf==t});indexcode.push(n);_getGroups(e||[],t);if(r){var a=[];return indexcode.forEach(function(t){var r=e[t];r.__index=t,a.push(r)}),a}return indexcode},getParents:function(e,t){return e=e||this.data||[],myParents=[],findParents(e,t),myParents},findAndUpdate:function(e,t){var r=this.data||[];if(e){var n=findIndex(r,e);n&&this.dispach("UPDATE",{index:n,data:t})}}}),t}function tree(e){var t={props:{data:[],loading:!1,header:"",footer:"",itemClass:"",listClass:"",itemMethod:""},theme:"",autoinject:!0,rendered:""};return t=merge(t,e),App(t)}function pure(e){return tree(e)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}();exports.default=tree,exports.pure=pure;var _Aotoo=Aotoo,list=_Aotoo.list,transTree=_Aotoo.transTree,find=_Aotoo.find,findIndex=_Aotoo.findIndex,merge=_Aotoo.merge,isArray=_Aotoo.isArray,filter=_Aotoo.filter,bars={trigger:React.createElement("div",{className:"treex-bar"},React.createElement("div",{className:"treex-trigger-bar"},"加载更多内容")),pulldown:React.createElement("div",{className:"treex-bar"},React.createElement("div",{className:"treex-pull-bar"},"刷新页面")),loading:React.createElement("div",{className:"treex-bar"},React.createElement("div",{className:"treex-loading"},"Loading...")),over:React.createElement("div",{className:"treex-bar"},React.createElement("div",{className:"treex-over-bar"},"没有更多内容了"))},Tree=function(e){function t(e){_classCallCheck(this,t);var r=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.preRender=r.preRender.bind(r),r.state={data:r.props.data||[],pulldown:!1,loading:!1,trigger:!1,over:!1},r}return _inherits(t,e),_createClass(t,[{key:"preRender",value:function(){var e=this.props.header?this.props.header:"",t=this.props.footer?this.props.footer:"",r=list({data:transTree(this.state.data),listClass:this.props.listClass,itemClass:this.props.itemClass,itemMethod:this.props.itemMethod});return e||t||this.state.trigger||this.state.pulldown||this.state.loading||this.state.over?React.createElement("div",{className:"list-container"},getBehaviorBar("pulldown",this.state.pulldown),e,r,t,getBehaviorBar("trigger",this.state.trigger),getBehaviorBar("over",this.state.over),getBehaviorBar("loading",this.state.loading)):r}},{key:"render",value:function(){return this.preRender()}}]),t}(React.Component),Actions={UPDATE:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=this.curState,n=r.data,a=t.index;if(a||0==a){var i=n[a];return i=merge(i,t.data),r}if(isArray(t.data))return r.data=t.data,r},APPEND:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=this.curState,n=r.data;return isArray(t.data)?n=n.concat(t.data):n.push(t.data),r},PREPEND:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=this.curState,n=r.data;return isArray(t.data)?n=t.data.concat(n):n.unshift(t.data),r},DELETE:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=this.curState,n=r.data;if(t.index||0==t.index)n.splice(t.index,1);else if(t.query){var a=findIndex(n,t.query);a>-1&&n.splice(a,1)}return r},LOADING:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=this.curState;return r.over||(r.loading=t.loading||!0,r.pulldown=!1),r},LOADED:function(e){arguments.length>1&&void 0!==arguments[1]&&arguments[1];var t=this.curState;return t.over||(t.loading=!1,t.pulldown=!1),t},OVER:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=this.curState;return r.loading=!1,r.pulldown=!1,r.trigger=!1,r.over=t.over||!0,r},PULLDOWN:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=this.curState;return r.loading=!1,r.over=!1,r.pulldown=t.pulldown||!0,r},TRIGGER:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(this&&this.state){var r=this.curState;return r.loading=!1,r.pulldown=!1,r.over=!1,r.trigger=t.trigger||!0,r}}},idrecode=[],indexcode=[],myParentsIndex=[],myParents=[];
//# sourceMappingURL=maps/index.js.map
