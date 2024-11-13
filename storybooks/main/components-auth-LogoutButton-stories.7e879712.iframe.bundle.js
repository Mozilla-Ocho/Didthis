"use strict";(self.webpackChunkappserver=self.webpackChunkappserver||[]).push([[324],{"./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_x,_r,_arr=[],_n=!0,_d=!1;try{if(_x=(_i=_i.call(arr)).next,0===i){if(Object(_i)!==_i)return;_n=!1}else for(;!(_n=(_s=_x.call(_i)).done)&&(_arr.push(_s.value),_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{if(!_n&&null!=_i.return&&(_r=_i.return(),Object(_r)!==_r))return}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(o){if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(o):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(o,minLen):void 0}}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}__webpack_require__.d(__webpack_exports__,{Z:()=>_slicedToArray})},"./src/components/auth/LogoutButton.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,TrialAccount:()=>TrialAccount,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _Default$parameters,_Default$parameters2,_TrialAccount$paramet,_TrialAccount$paramet2,_home_runner_work_Didthis_Didthis_appserver_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/defineProperty.js"),react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_mocks_store_storybook__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/mocks/store/storybook.tsx"),_mocks_apiUser__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/mocks/apiUser.ts"),_LogoutButton__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/components/auth/LogoutButton.tsx"),__jsx=(__webpack_require__("./src/styles/globals.css"),react__WEBPACK_IMPORTED_MODULE_0__.createElement);function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){(0,_home_runner_work_Didthis_Didthis_appserver_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_1__.Z)(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}const __WEBPACK_DEFAULT_EXPORT__={title:"components/auth/LogoutButton",component:_LogoutButton__WEBPACK_IMPORTED_MODULE_4__.s,parameters:{layout:"centered"},argTypes:{}};var Default={args:{},render:function render(args){return __jsx(_mocks_store_storybook__WEBPACK_IMPORTED_MODULE_2__.G,{authUser:_mocks_apiUser__WEBPACK_IMPORTED_MODULE_3__.ZP},__jsx(_LogoutButton__WEBPACK_IMPORTED_MODULE_4__.s,args))}},TrialAccount={args:{},render:function render(args){return __jsx(_mocks_store_storybook__WEBPACK_IMPORTED_MODULE_2__.G,{authUser:_objectSpread(_objectSpread({},_mocks_apiUser__WEBPACK_IMPORTED_MODULE_3__.ZP),{},{isTrial:!0})},__jsx(_LogoutButton__WEBPACK_IMPORTED_MODULE_4__.s,args))}};Default.parameters=_objectSpread(_objectSpread({},Default.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_Default$parameters=Default.parameters)||void 0===_Default$parameters?void 0:_Default$parameters.docs),{},{source:_objectSpread({originalSource:"{\n  args: {},\n  render: args => <MockStoreWrapper authUser={authUser}>\n      <LogoutButton {...args} />\n    </MockStoreWrapper>\n}"},null===(_Default$parameters2=Default.parameters)||void 0===_Default$parameters2||null===(_Default$parameters2=_Default$parameters2.docs)||void 0===_Default$parameters2?void 0:_Default$parameters2.source)})}),TrialAccount.parameters=_objectSpread(_objectSpread({},TrialAccount.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_TrialAccount$paramet=TrialAccount.parameters)||void 0===_TrialAccount$paramet?void 0:_TrialAccount$paramet.docs),{},{source:_objectSpread({originalSource:"{\n  args: {},\n  render: args => <MockStoreWrapper authUser={{\n    ...authUser,\n    isTrial: true\n  }}>\n      <LogoutButton {...args} />\n    </MockStoreWrapper>\n}"},null===(_TrialAccount$paramet2=TrialAccount.parameters)||void 0===_TrialAccount$paramet2||null===(_TrialAccount$paramet2=_TrialAccount$paramet2.docs)||void 0===_TrialAccount$paramet2?void 0:_TrialAccount$paramet2.source)})})},"./src/components/auth/LogoutButton.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{s:()=>LogoutButton});var _home_runner_work_Didthis_Didthis_appserver_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js"),react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_home_runner_work_Didthis_Didthis_appserver_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@babel/runtime/regenerator/index.js"),_home_runner_work_Didthis_Didthis_appserver_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_home_runner_work_Didthis_Didthis_appserver_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1__),_components_uiLib__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/uiLib/index.tsx"),mobx_react_lite__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/mobx-react-lite/es/index.js"),_lib_store__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/lib/store/index.tsx"),_lib_trackingEvents__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/lib/trackingEvents.ts"),_auth_ClaimTrialAccountButton__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/components/auth/ClaimTrialAccountButton.tsx"),_lib_branding__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/lib/branding.tsx"),_lib_appShellContent__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./src/lib/appShellContent/index.ts"),__jsx=react__WEBPACK_IMPORTED_MODULE_0__.createElement,LogoutButton=(0,mobx_react_lite__WEBPACK_IMPORTED_MODULE_3__.Pi)((function(_ref){var intent=_ref.intent,text=_ref.text,onLogout=_ref.onLogout,dataTestid=_ref["data-testid"],_useState=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),modalOpen=_useState[0],setModalOpen=_useState[1],store=(0,_lib_store__WEBPACK_IMPORTED_MODULE_4__.oR)(),user=((0,_lib_appShellContent__WEBPACK_IMPORTED_MODULE_8__.ZP)(),store.user);if(!user)return __jsx(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null);var handleLogoutCancel=function handleLogoutCancel(){setModalOpen(!1)},completeLogout=function(){var _ref2=(0,_home_runner_work_Didthis_Didthis_appserver_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_9__.Z)(_home_runner_work_Didthis_Didthis_appserver_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1___default().mark((function _callee(){return _home_runner_work_Didthis_Didthis_appserver_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1___default().wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:return setModalOpen(!1),store.trackEvent(_lib_trackingEvents__WEBPACK_IMPORTED_MODULE_5__.M.bcLogout,{loseTrialWork:store.inTrialWithContent()?"y":"n"}),_context.next=4,store.logOut();case 4:onLogout&&onLogout();case 5:case"end":return _context.stop()}}),_callee)})));return function completeLogout(){return _ref2.apply(this,arguments)}}();return __jsx(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,__jsx(_components_uiLib__WEBPACK_IMPORTED_MODULE_2__.zx,{onClick:function handleClick(){user.isTrial?setModalOpen(!0):completeLogout()},intent,"data-testid":dataTestid||"loginButton"},text||"Sign out"),__jsx(_components_uiLib__WEBPACK_IMPORTED_MODULE_2__.cV,{isOpen:modalOpen,title:"Lose unsaved updates and projects?",yesText:"Yes",noText:"No",onYes:completeLogout,onNo:handleLogoutCancel,onClose:handleLogoutCancel},__jsx("p",null,"Because you haven’t"," ",__jsx(_auth_ClaimTrialAccountButton__WEBPACK_IMPORTED_MODULE_6__.T,{text:"signed up",intent:"link",className:"text-base"})," ","for ",_lib_branding__WEBPACK_IMPORTED_MODULE_7__.Z.productName,", any projects and updates you’ve created are not saved and will be lost."),__jsx("p",{className:"mt-6 mb-6"},"Are you sure you want to sign out and lose your work?")))}));try{LogoutButton.displayName="LogoutButton",LogoutButton.__docgenInfo={description:"",displayName:"LogoutButton",props:{intent:{defaultValue:null,description:"",name:"intent",required:!1,type:{name:'"link" | "primary" | "secondary" | "list" | "headerNav" | "inputTrigger" | null'}},text:{defaultValue:null,description:"",name:"text",required:!1,type:{name:"string"}},onLogout:{defaultValue:null,description:"",name:"onLogout",required:!1,type:{name:"(() => void)"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/auth/LogoutButton.tsx#LogoutButton"]={docgenInfo:LogoutButton.__docgenInfo,name:"LogoutButton",path:"src/components/auth/LogoutButton.tsx#LogoutButton"})}catch(__react_docgen_typescript_loader_error){}},"./src/lib/appShellContent/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{ZP:()=>useAppShell,nH:()=>useAppShellListener,xd:()=>useAppShellTopBar});var react=__webpack_require__("./node_modules/react/index.js"),slicedToArray=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),defineProperty=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/defineProperty.js"),asyncToGenerator=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js"),classCallCheck=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/classCallCheck.js"),createClass=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/createClass.js"),regenerator=__webpack_require__("./node_modules/@babel/runtime/regenerator/index.js"),regenerator_default=__webpack_require__.n(regenerator),console=__webpack_require__("./node_modules/console-browserify/index.js");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){(0,defineProperty.Z)(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}var MESSAGE_EVENT="AppShellMessage",MessageHandler=function(){function MessageHandler(){(0,classCallCheck.Z)(this,MessageHandler),(0,defineProperty.Z)(this,"pendingRequests",void 0),(0,defineProperty.Z)(this,"listener",void 0),(0,defineProperty.Z)(this,"lastId",void 0),this.pendingRequests={},this.listener=void 0,this.lastId=0}var _request;return(0,createClass.Z)(MessageHandler,[{key:"generateRequestId",value:function generateRequestId(){return this.lastId++,"request-".concat(this.lastId)}},{key:"getWebView",value:function getWebView(){if("undefined"!=typeof window&&void 0!==window.ReactNativeWebView&&void 0!==window.ReactNativeWebView.postMessage)return window.ReactNativeWebView}},{key:"request",value:(_request=(0,asyncToGenerator.Z)(regenerator_default().mark((function _callee(method,payload){var request,_this=this;return regenerator_default().wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:return request={type:"request",id:this.generateRequestId(),method,payload},_context.abrupt("return",new Promise((function(resolve,reject){var webview=_this.getWebView();if(!webview)return reject(new Error("not in app shell"));_this.pendingRequests[request.id]=_objectSpread(_objectSpread({},request),{},{resolve,reject}),webview.postMessage(JSON.stringify(request))})));case 2:case"end":return _context.stop()}}),_callee,this)}))),function request(_x,_x2){return _request.apply(this,arguments)})},{key:"listen",value:function listen(){this.listener&&this.unlisten(),this.listener=this.handleMessage.bind(this),window.addEventListener("message",this.listener),document.addEventListener("message",this.listener)}},{key:"unlisten",value:function unlisten(){this.listener&&(window.removeEventListener("message",this.listener),document.removeEventListener("message",this.listener))}},{key:"handleMessage",value:function handleMessage(event){try{if(void 0===event.data)return;var dataEvent=event,_JSON$parse=JSON.parse(dataEvent.data),type=_JSON$parse.type,_id=_JSON$parse.id,_payload=_JSON$parse.payload;if(document.dispatchEvent(new CustomEvent(MESSAGE_EVENT,{detail:{type,id:_id,payload:_payload}})),"response"===type){var pending=this.pendingRequests[_id];pending&&"object"==typeof _payload&&(delete this.pendingRequests[_id],"failure"in _payload?pending.reject(_payload):pending.resolve(_payload))}}catch(e){console.error("Failed to handle message",e)}}}]),MessageHandler}();function useAppShellListener(expectedType,handler){var listener=(0,react.useRef)();(0,react.useEffect)((function(){if(handler)return"undefined"!=typeof document&&(listener.current=function(ev){var detail=ev.detail,type=detail.type,payload=detail.payload,id=detail.id;expectedType===type&&handler(payload,id)},document.addEventListener(MESSAGE_EVENT,listener.current)),function(){listener.current&&document.removeEventListener(MESSAGE_EVENT,listener.current)}}),[expectedType,handler,listener])}const api=function(){function AppShellAPI(){(0,classCallCheck.Z)(this,AppShellAPI),(0,defineProperty.Z)(this,"messaging",void 0),this.messaging=new MessageHandler}var _request;return(0,createClass.Z)(AppShellAPI,[{key:"isInWebView",value:function isInWebView(){return!!this.messaging.getWebView()}},{key:"init",value:function init(){this.messaging.listen()}},{key:"deinit",value:function deinit(){this.messaging.unlisten()}},{key:"request",value:(_request=(0,asyncToGenerator.Z)(regenerator_default().mark((function _callee(method,payload){return regenerator_default().wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:if(!this.isInWebView()){_context.next=2;break}return _context.abrupt("return",this.messaging.request(method,payload));case 2:case"end":return _context.stop()}}),_callee,this)}))),function request(_x,_x2){return _request.apply(this,arguments)})}]),AppShellAPI}();function state_ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function state_objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?state_ownKeys(Object(source),!0).forEach((function(key){(0,defineProperty.Z)(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):state_ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function createInitialState(){return{inAppWebView:!1,appReady:!1,appVersionInfo:{},api:new api}}function reducer(state,action){return"update"===action.type?state_objectSpread(state_objectSpread({},state),{},(0,defineProperty.Z)({},action.key,action.value)):state}var config=__webpack_require__("./node_modules/next/config.js"),config_default=__webpack_require__.n(config),next_router=__webpack_require__("./node_modules/next/router.js"),lib_store=__webpack_require__("./src/lib/store/index.tsx"),pathBuilder=__webpack_require__("./src/lib/pathBuilder.ts"),trackingEvents=__webpack_require__("./src/lib/trackingEvents.ts"),__jsx=react.createElement,publicRuntimeConfig=config_default()().publicRuntimeConfig,SERVER_VERSION=null==publicRuntimeConfig?void 0:publicRuntimeConfig.version,SERVER_BUILD=null==publicRuntimeConfig?void 0:publicRuntimeConfig.build,SERVER_TAG=null==publicRuntimeConfig?void 0:publicRuntimeConfig.tag,AppShellContext=(0,react.createContext)(createInitialState());function AppShellContextProvider(_ref){var children=_ref.children,_useAppShellState=function useAppShellState(){var _useReducer=(0,react.useReducer)(reducer,null,createInitialState);return[_useReducer[0],_useReducer[1]]}(),_useAppShellState2=(0,slicedToArray.Z)(_useAppShellState,2),state=_useAppShellState2[0],dispatch=_useAppShellState2[1],router=(0,next_router.useRouter)(),store=(0,lib_store.oR)(),inAppWebView=state.inAppWebView,api=state.api,isInWebView=api.isInWebView();return isInWebView&&(store.appShellApiRef=api),(0,react.useEffect)((function(){dispatch({type:"update",key:"inAppWebView",value:!!isInWebView})}),[isInWebView,dispatch]),(0,react.useEffect)((function(){if(inAppWebView)return api.init(),api.request("ping",{version:SERVER_VERSION,build:SERVER_BUILD,tag:SERVER_TAG}).then((function(){dispatch({type:"update",key:"appVersionInfo",value:arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}}),dispatch({type:"update",key:"appReady",value:!0})})),function(){return api.deinit()}}),[inAppWebView,api,dispatch]),(0,react.useEffect)((function(){var handleRouteChangeStart=function handleRouteChangeStart(url){api.request("webviewRouterEvent",{event:"routeChangeStart",url})},handleRouteChangeComplete=function handleRouteChangeComplete(url){api.request("webviewRouterEvent",{event:"routeChangeComplete",url}),api.request("updateTopNav",{show:!1})};router.events.on("routeChangeStart",handleRouteChangeStart),router.events.on("routeChangeComplete",handleRouteChangeComplete);var deregUserListen=store.registerUserListener((function(theUser){theUser&&api.request("updateAppConfig",{user:theUser,links:{user:pathBuilder.Z.user(theUser.systemSlug),userEdit:pathBuilder.Z.userEdit(theUser.systemSlug),newPost:pathBuilder.Z.newPost(theUser.systemSlug)}})}));return function(){deregUserListen(),router.events.off("routeChangeStart",handleRouteChangeStart),router.events.off("routeChangeComplete",handleRouteChangeComplete)}}),[api,router,store,state.appReady]),useAppShellListener("trackNativeEvent",(function(_ref2){var event=_ref2.event;"bcNativeDrawerOpen"===event&&store.trackEvent(trackingEvents.M.bcNativeDrawerOpen),"bcNativeDrawerCreateProject"===event&&store.trackEvent(trackingEvents.M.bcNativeDrawerCreateProject),"bcNativeDrawerProject"===event&&store.trackEvent(trackingEvents.M.bcNativeDrawerProject)})),useAppShellListener("navigateToPath",(function(_ref3){var path=_ref3.path;return router.push(path)})),__jsx(AppShellContext.Provider,{value:state},children)}AppShellContextProvider.displayName="AppShellContextProvider",AppShellContextProvider.__docgenInfo={description:"",methods:[],displayName:"AppShellContextProvider",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};try{context.displayName="context",context.__docgenInfo={description:"",displayName:"context",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/lib/appShellContent/context.tsx#context"]={docgenInfo:context.__docgenInfo,name:"context",path:"src/lib/appShellContent/context.tsx#context"})}catch(__react_docgen_typescript_loader_error){}var objectWithoutProperties=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),_excluded=["onLeftPress","onRightPress","onSharePress","onEditPress"],noop=function noop(){};function useAppShellTopBar(params){var _params$onLeftPress=params.onLeftPress,onLeftPress=void 0===_params$onLeftPress?noop:_params$onLeftPress,_params$onRightPress=params.onRightPress,onRightPress=void 0===_params$onRightPress?noop:_params$onRightPress,_params$onSharePress=params.onSharePress,onSharePress=void 0===_params$onSharePress?noop:_params$onSharePress,_params$onEditPress=params.onEditPress,onEditPress=void 0===_params$onEditPress?noop:_params$onEditPress,state=(0,objectWithoutProperties.Z)(params,_excluded),appShell=useAppShell();useAppShellListener("topNavLeftPress",onLeftPress),useAppShellListener("topNavRightPress",onRightPress),useAppShellListener("topNavSharePress",onSharePress),useAppShellListener("topNavEditPress",onEditPress),(0,react.useEffect)((function(){appShell.api.request("updateTopNav",state)}),[state,appShell.api])}try{useAppShellTopBar.displayName="useAppShellTopBar",useAppShellTopBar.__docgenInfo={description:"",displayName:"useAppShellTopBar",props:{show:{defaultValue:null,description:"",name:"show",required:!1,type:{name:"boolean"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}},leftIsBack:{defaultValue:null,description:"",name:"leftIsBack",required:!1,type:{name:"boolean"}},leftLabel:{defaultValue:null,description:"",name:"leftLabel",required:!1,type:{name:"string"}},leftIsDisabled:{defaultValue:null,description:"",name:"leftIsDisabled",required:!1,type:{name:"boolean"}},rightLabel:{defaultValue:null,description:"",name:"rightLabel",required:!1,type:{name:"string"}},rightIsDisabled:{defaultValue:null,description:"",name:"rightIsDisabled",required:!1,type:{name:"boolean"}},showShare:{defaultValue:null,description:"",name:"showShare",required:!1,type:{name:"boolean"}},shareIsDisabled:{defaultValue:null,description:"",name:"shareIsDisabled",required:!1,type:{name:"boolean"}},showEdit:{defaultValue:null,description:"",name:"showEdit",required:!1,type:{name:"boolean"}},editIsDisabled:{defaultValue:null,description:"",name:"editIsDisabled",required:!1,type:{name:"boolean"}},onLeftPress:{defaultValue:null,description:"",name:"onLeftPress",required:!1,type:{name:"(() => void)"}},onRightPress:{defaultValue:null,description:"",name:"onRightPress",required:!1,type:{name:"(() => void)"}},onSharePress:{defaultValue:null,description:"",name:"onSharePress",required:!1,type:{name:"(() => void)"}},onEditPress:{defaultValue:null,description:"",name:"onEditPress",required:!1,type:{name:"(() => void)"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/lib/appShellContent/ui.tsx#useAppShellTopBar"]={docgenInfo:useAppShellTopBar.__docgenInfo,name:"useAppShellTopBar",path:"src/lib/appShellContent/ui.tsx#useAppShellTopBar"})}catch(__react_docgen_typescript_loader_error){}function useAppShell(){return(0,react.useContext)(AppShellContext)}},"./src/mocks/apiProject.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={id:"project-8675309",createdAt:0,updatedAt:0,title:"Sample Project",description:"This is an example description",scope:"private",currentStatus:"active",posts:{}}},"./src/mocks/apiUser.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{OC:()=>apiUserBlankSlate,SX:()=>apiUserWithProject,ZP:()=>__WEBPACK_DEFAULT_EXPORT__,gh:()=>apiUser});var _home_runner_work_Didthis_Didthis_appserver_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/defineProperty.js"),_apiProject__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/mocks/apiProject.ts");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){(0,_home_runner_work_Didthis_Didthis_appserver_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__.Z)(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}var apiUserBlankSlate={id:"8675309",systemSlug:"8675309",publicPageSlug:"jrandom",userSlug:void 0,isTrial:!1,profile:{name:void 0,bio:void 0,socialUrls:void 0,imageAssetId:void 0,imageMeta:void 0,updatedAt:0,projects:{}},createdAt:0},apiUser={id:"8675309",systemSlug:"8675309",publicPageSlug:"jrandom",userSlug:"jrandom",isTrial:!1,profile:{name:"J Random Hacker",bio:void 0,socialUrls:void 0,imageAssetId:void 0,imageMeta:void 0,updatedAt:0,projects:{}},createdAt:0},apiUserWithProject=_objectSpread(_objectSpread({},apiUser),{},{profile:_objectSpread(_objectSpread({},apiUser.profile),{},{projects:(0,_home_runner_work_Didthis_Didthis_appserver_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__.Z)({},_apiProject__WEBPACK_IMPORTED_MODULE_1__.Z.id,_apiProject__WEBPACK_IMPORTED_MODULE_1__.Z)})});const __WEBPACK_DEFAULT_EXPORT__=apiUser}}]);