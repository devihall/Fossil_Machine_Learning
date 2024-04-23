/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./styles.css":
/*!********************!*\
  !*** ./styles.css ***!
  \********************/
/***/ (() => {



/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AppProvider: () => (/* binding */ AppProvider),\n/* harmony export */   \"default\": () => (/* binding */ App),\n/* harmony export */   useAppContext: () => (/* binding */ useAppContext)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles.css */ \"./styles.css\");\n\n\n\n\n\n// Create a context\nconst AppContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\n// Create a provider component\nconst AppProvider = ({ children })=>{\n    const [state, setState] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n    });\n    // update state\n    const updateState = (newState)=>{\n        setState((prevState)=>({\n                ...prevState,\n                ...newState\n            }));\n    };\n    // Values and functions provided by the context\n    const value = {\n        state,\n        updateState\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AppContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/cristobal/Projects/Fossil_Machine_Learning/pages/_app.js\",\n        lineNumber: 27,\n        columnNumber: 9\n    }, undefined);\n};\n// Use this custom hook to use state and updater in any functional component\nconst useAppContext = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AppContext);\n// Component that uses the context\nfunction App({ Component, pageProps }) {\n    function urlBase64ToUint8Array(base64String) {\n        const padding = \"=\".repeat((4 - base64String.length % 4) % 4);\n        const base64 = (base64String + padding).replace(/-/g, \"+\").replace(/_/g, \"/\");\n        const rawData = window.atob(base64);\n        const outputArray = new Uint8Array(rawData.length);\n        for(let i = 0; i < rawData.length; ++i){\n            outputArray[i] = rawData.charCodeAt(i);\n        }\n        return outputArray;\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AppProvider, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_head__WEBPACK_IMPORTED_MODULE_2__, {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"viewport\",\n                        content: \"width=device-width, initial-scale=1\"\n                    }, void 0, false, {\n                        fileName: \"/Users/cristobal/Projects/Fossil_Machine_Learning/pages/_app.js\",\n                        lineNumber: 56,\n                        columnNumber: 17\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"theme-color\",\n                        content: \"#ffffff\"\n                    }, void 0, false, {\n                        fileName: \"/Users/cristobal/Projects/Fossil_Machine_Learning/pages/_app.js\",\n                        lineNumber: 57,\n                        columnNumber: 17\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"manifest\",\n                        href: \"/manifest.json\"\n                    }, void 0, false, {\n                        fileName: \"/Users/cristobal/Projects/Fossil_Machine_Learning/pages/_app.js\",\n                        lineNumber: 58,\n                        columnNumber: 17\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"apple-touch-icon\",\n                        sizes: \"180x180\",\n                        href: \"/icons/Icon-180.png\"\n                    }, void 0, false, {\n                        fileName: \"/Users/cristobal/Projects/Fossil_Machine_Learning/pages/_app.js\",\n                        lineNumber: 59,\n                        columnNumber: 17\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"icon\",\n                        type: \"image/png\",\n                        sizes: \"32x32\",\n                        href: \"/icons/Icon-32.png\"\n                    }, void 0, false, {\n                        fileName: \"/Users/cristobal/Projects/Fossil_Machine_Learning/pages/_app.js\",\n                        lineNumber: 60,\n                        columnNumber: 17\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"icon\",\n                        type: \"image/png\",\n                        sizes: \"16x16\",\n                        href: \"/icons/Icon-16.png\"\n                    }, void 0, false, {\n                        fileName: \"/Users/cristobal/Projects/Fossil_Machine_Learning/pages/_app.js\",\n                        lineNumber: 61,\n                        columnNumber: 17\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"mask-icon\",\n                        href: \"/icons/safari-pinned-tab.svg\",\n                        color: \"#5bbad5\"\n                    }, void 0, false, {\n                        fileName: \"/Users/cristobal/Projects/Fossil_Machine_Learning/pages/_app.js\",\n                        lineNumber: 62,\n                        columnNumber: 17\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n                        children: \"Fossil\"\n                    }, void 0, false, {\n                        fileName: \"/Users/cristobal/Projects/Fossil_Machine_Learning/pages/_app.js\",\n                        lineNumber: 63,\n                        columnNumber: 17\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/cristobal/Projects/Fossil_Machine_Learning/pages/_app.js\",\n                lineNumber: 55,\n                columnNumber: 13\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/Users/cristobal/Projects/Fossil_Machine_Learning/pages/_app.js\",\n                lineNumber: 65,\n                columnNumber: 13\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/cristobal/Projects/Fossil_Machine_Learning/pages/_app.js\",\n        lineNumber: 54,\n        columnNumber: 9\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQW1FO0FBQ2pDO0FBQ0w7QUFDTjtBQUV2QixtQkFBbUI7QUFDbkIsTUFBTU0sMkJBQWFMLG9EQUFhQTtBQUVoQyw4QkFBOEI7QUFDdkIsTUFBTU0sY0FBYyxDQUFDLEVBQUVDLFFBQVEsRUFBRTtJQUNwQyxNQUFNLENBQUNDLE9BQU9DLFNBQVMsR0FBR1AsK0NBQVFBLENBQUM7SUFFbkM7SUFFQSxlQUFlO0lBQ2YsTUFBTVEsY0FBYyxDQUFDQztRQUNqQkYsU0FBU0csQ0FBQUEsWUFBYztnQkFBRSxHQUFHQSxTQUFTO2dCQUFFLEdBQUdELFFBQVE7WUFBQztJQUN2RDtJQUVBLCtDQUErQztJQUMvQyxNQUFNRSxRQUFRO1FBQ1ZMO1FBQ0FFO0lBQ0o7SUFFQSxxQkFDSSw4REFBQ0wsV0FBV1MsUUFBUTtRQUFDRCxPQUFPQTtrQkFDdkJOOzs7Ozs7QUFHYixFQUFFO0FBRUYsNEVBQTRFO0FBQ3JFLE1BQU1RLGdCQUFnQixJQUFNZCxpREFBVUEsQ0FBQ0ksWUFBWTtBQUUxRCxrQ0FBa0M7QUFDbkIsU0FBU1csSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNoRCxTQUFTQyxzQkFBc0JDLFlBQVk7UUFDdkMsTUFBTUMsVUFBVSxJQUFJQyxNQUFNLENBQUMsQ0FBQyxJQUFLRixhQUFhRyxNQUFNLEdBQUcsQ0FBQyxJQUFLO1FBQzdELE1BQU1DLFNBQVMsQ0FBQ0osZUFBZUMsT0FBTSxFQUNoQ0ksT0FBTyxDQUFDLE1BQU0sS0FDZEEsT0FBTyxDQUFDLE1BQU07UUFFbkIsTUFBTUMsVUFBVUMsT0FBT0MsSUFBSSxDQUFDSjtRQUM1QixNQUFNSyxjQUFjLElBQUlDLFdBQVdKLFFBQVFILE1BQU07UUFFakQsSUFBSyxJQUFJUSxJQUFJLEdBQUdBLElBQUlMLFFBQVFILE1BQU0sRUFBRSxFQUFFUSxFQUFHO1lBQ3JDRixXQUFXLENBQUNFLEVBQUUsR0FBR0wsUUFBUU0sVUFBVSxDQUFDRDtRQUN4QztRQUNBLE9BQU9GO0lBQ1g7SUFFQSxxQkFDSSw4REFBQ3ZCOzswQkFDRyw4REFBQ0Ysc0NBQUlBOztrQ0FDRCw4REFBQzZCO3dCQUFLQyxNQUFLO3dCQUFXQyxTQUFROzs7Ozs7a0NBQzlCLDhEQUFDRjt3QkFBS0MsTUFBSzt3QkFBY0MsU0FBUTs7Ozs7O2tDQUNqQyw4REFBQ0M7d0JBQUtDLEtBQUk7d0JBQVdDLE1BQUs7Ozs7OztrQ0FDMUIsOERBQUNGO3dCQUFLQyxLQUFJO3dCQUFtQkUsT0FBTTt3QkFBVUQsTUFBSzs7Ozs7O2tDQUNsRCw4REFBQ0Y7d0JBQUtDLEtBQUk7d0JBQU9HLE1BQUs7d0JBQVlELE9BQU07d0JBQVFELE1BQUs7Ozs7OztrQ0FDckQsOERBQUNGO3dCQUFLQyxLQUFJO3dCQUFPRyxNQUFLO3dCQUFZRCxPQUFNO3dCQUFRRCxNQUFLOzs7Ozs7a0NBQ3JELDhEQUFDRjt3QkFBS0MsS0FBSTt3QkFBWUMsTUFBSzt3QkFBK0JHLE9BQU07Ozs7OztrQ0FDaEUsOERBQUNDO2tDQUFNOzs7Ozs7Ozs7Ozs7MEJBRVgsOERBQUN6QjtnQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7QUFHcEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mb3NzaWxfbWFjaGluZV9sZWFybmluZy8uL3BhZ2VzL19hcHAuanM/ZTBhZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xuaW1wb3J0IFwiLi4vc3R5bGVzLmNzc1wiO1xuXG4vLyBDcmVhdGUgYSBjb250ZXh0XG5jb25zdCBBcHBDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuXG4vLyBDcmVhdGUgYSBwcm92aWRlciBjb21wb25lbnRcbmV4cG9ydCBjb25zdCBBcHBQcm92aWRlciA9ICh7IGNoaWxkcmVuIH0pID0+IHtcbiAgICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKHtcbiAgICAgICAgLy8gaW5pdGlhbCBzdGF0ZSB2YWx1ZXMgaGVyZVxuICAgIH0pO1xuXG4gICAgLy8gdXBkYXRlIHN0YXRlXG4gICAgY29uc3QgdXBkYXRlU3RhdGUgPSAobmV3U3RhdGUpID0+IHtcbiAgICAgICAgc2V0U3RhdGUocHJldlN0YXRlID0+ICh7IC4uLnByZXZTdGF0ZSwgLi4ubmV3U3RhdGUgfSkpO1xuICAgIH07XG5cbiAgICAvLyBWYWx1ZXMgYW5kIGZ1bmN0aW9ucyBwcm92aWRlZCBieSB0aGUgY29udGV4dFxuICAgIGNvbnN0IHZhbHVlID0ge1xuICAgICAgICBzdGF0ZSxcbiAgICAgICAgdXBkYXRlU3RhdGVcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPEFwcENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfT5cbiAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgPC9BcHBDb250ZXh0LlByb3ZpZGVyPlxuICAgICk7XG59O1xuXG4vLyBVc2UgdGhpcyBjdXN0b20gaG9vayB0byB1c2Ugc3RhdGUgYW5kIHVwZGF0ZXIgaW4gYW55IGZ1bmN0aW9uYWwgY29tcG9uZW50XG5leHBvcnQgY29uc3QgdXNlQXBwQ29udGV4dCA9ICgpID0+IHVzZUNvbnRleHQoQXBwQ29udGV4dCk7XG5cbi8vIENvbXBvbmVudCB0aGF0IHVzZXMgdGhlIGNvbnRleHRcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgICBmdW5jdGlvbiB1cmxCYXNlNjRUb1VpbnQ4QXJyYXkoYmFzZTY0U3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHBhZGRpbmcgPSAnPScucmVwZWF0KCg0IC0gKGJhc2U2NFN0cmluZy5sZW5ndGggJSA0KSkgJSA0KTtcbiAgICAgICAgY29uc3QgYmFzZTY0ID0gKGJhc2U2NFN0cmluZyArIHBhZGRpbmcpXG4gICAgICAgICAgICAucmVwbGFjZSgvLS9nLCAnKycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXy9nLCAnLycpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcmF3RGF0YSA9IHdpbmRvdy5hdG9iKGJhc2U2NCk7XG4gICAgICAgIGNvbnN0IG91dHB1dEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkocmF3RGF0YS5sZW5ndGgpO1xuICAgICAgICBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYXdEYXRhLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBvdXRwdXRBcnJheVtpXSA9IHJhd0RhdGEuY2hhckNvZGVBdChpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0QXJyYXk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPEFwcFByb3ZpZGVyPlxuICAgICAgICAgICAgPEhlYWQ+XG4gICAgICAgICAgICAgICAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xXCIgLz5cbiAgICAgICAgICAgICAgICA8bWV0YSBuYW1lPVwidGhlbWUtY29sb3JcIiBjb250ZW50PVwiI2ZmZmZmZlwiIC8+XG4gICAgICAgICAgICAgICAgPGxpbmsgcmVsPVwibWFuaWZlc3RcIiBocmVmPVwiL21hbmlmZXN0Lmpzb25cIiAvPlxuICAgICAgICAgICAgICAgIDxsaW5rIHJlbD1cImFwcGxlLXRvdWNoLWljb25cIiBzaXplcz1cIjE4MHgxODBcIiBocmVmPVwiL2ljb25zL0ljb24tMTgwLnBuZ1wiIC8+XG4gICAgICAgICAgICAgICAgPGxpbmsgcmVsPVwiaWNvblwiIHR5cGU9XCJpbWFnZS9wbmdcIiBzaXplcz1cIjMyeDMyXCIgaHJlZj1cIi9pY29ucy9JY29uLTMyLnBuZ1wiIC8+XG4gICAgICAgICAgICAgICAgPGxpbmsgcmVsPVwiaWNvblwiIHR5cGU9XCJpbWFnZS9wbmdcIiBzaXplcz1cIjE2eDE2XCIgaHJlZj1cIi9pY29ucy9JY29uLTE2LnBuZ1wiIC8+XG4gICAgICAgICAgICAgICAgPGxpbmsgcmVsPVwibWFzay1pY29uXCIgaHJlZj1cIi9pY29ucy9zYWZhcmktcGlubmVkLXRhYi5zdmdcIiBjb2xvcj1cIiM1YmJhZDVcIiAvPlxuICAgICAgICAgICAgICAgIDx0aXRsZT5Gb3NzaWw8L3RpdGxlPlxuICAgICAgICAgICAgPC9IZWFkPlxuICAgICAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgICA8L0FwcFByb3ZpZGVyPlxuICAgICk7XG59XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiSGVhZCIsIkFwcENvbnRleHQiLCJBcHBQcm92aWRlciIsImNoaWxkcmVuIiwic3RhdGUiLCJzZXRTdGF0ZSIsInVwZGF0ZVN0YXRlIiwibmV3U3RhdGUiLCJwcmV2U3RhdGUiLCJ2YWx1ZSIsIlByb3ZpZGVyIiwidXNlQXBwQ29udGV4dCIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsInVybEJhc2U2NFRvVWludDhBcnJheSIsImJhc2U2NFN0cmluZyIsInBhZGRpbmciLCJyZXBlYXQiLCJsZW5ndGgiLCJiYXNlNjQiLCJyZXBsYWNlIiwicmF3RGF0YSIsIndpbmRvdyIsImF0b2IiLCJvdXRwdXRBcnJheSIsIlVpbnQ4QXJyYXkiLCJpIiwiY2hhckNvZGVBdCIsIm1ldGEiLCJuYW1lIiwiY29udGVudCIsImxpbmsiLCJyZWwiLCJocmVmIiwic2l6ZXMiLCJ0eXBlIiwiY29sb3IiLCJ0aXRsZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();