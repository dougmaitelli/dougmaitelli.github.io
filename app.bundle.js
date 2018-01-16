/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(23);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(14);

__webpack_require__(16);

__webpack_require__(24);

var _digitalmatrix = __webpack_require__(26);

var _digitalmatrix2 = _interopRequireDefault(_digitalmatrix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener("DOMContentLoaded", function () {
  var matrix = new _digitalmatrix2.default("matrix");

  window.onresize = function () {
    document.getElementById("matrix").innerHTML = "";
    matrix.regenerateNumbers();
  };

  matrix.startPulsate();
});

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../css-loader/index.js!./devicon.min.css", function() {
			var newContent = require("!!../css-loader/index.js!./devicon.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(15);
exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "@font-face{font-family:devicon;src:url(" + escape(__webpack_require__(18)) + ");src:url(" + escape(__webpack_require__(19)) + "?#iefix-hdf3wh)format('embedded-opentype'),url(" + escape(__webpack_require__(20)) + ")format('woff'),url(" + escape(__webpack_require__(21)) + ")format('truetype'),url(" + escape(__webpack_require__(22)) + "#devicon)format('svg');font-weight:400;font-style:normal}[class*=\" devicon-\"],[class^=devicon-]{font-family:devicon;speak:none;font-style:normal;font-weight:400;font-variant:normal;text-transform:none;line-height:1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.devicon-safari-line-wordmark:before{content:\"\\E632\"}.devicon-safari-line:before{content:\"\\E63A\"}.devicon-safari-plain-wordmark:before{content:\"\\E63B\"}.devicon-safari-plain:before{content:\"\\E63C\"}.devicon-jetbrains-line-wordmark:before,.devicon-jetbrains-line:before,.devicon-jetbrains-plain-wordmark:before,.devicon-jetbrains-plain:before{content:\"\\E63D\"}.devicon-django-line-wordmark:before,.devicon-django-line:before{content:\"\\E63E\"}.devicon-django-plain-wordmark:before,.devicon-django-plain:before{content:\"\\E63F\"}.devicon-gimp-plain:before{content:\"\\E633\"}.devicon-redhat-plain-wordmark:before{content:\"\\E62A\"}.devicon-redhat-plain:before{content:\"\\E62B\"}.devicon-cplusplus-line-wordmark:before,.devicon-cplusplus-line:before{content:\"\\E634\"}.devicon-cplusplus-plain-wordmark:before,.devicon-cplusplus-plain:before{content:\"\\E635\"}.devicon-csharp-line-wordmark:before,.devicon-csharp-line:before{content:\"\\E636\"}.devicon-csharp-plain-wordmark:before,.devicon-csharp-plain:before{content:\"\\E637\"}.devicon-c-line-wordmark:before,.devicon-c-line:before{content:\"\\E638\"}.devicon-c-plain-wordmark:before,.devicon-c-plain:before{content:\"\\E639\"}.devicon-nodewebkit-line-wordmark:before{content:\"\\E611\"}.devicon-nodewebkit-line:before{content:\"\\E612\"}.devicon-nodewebkit-plain-wordmark:before{content:\"\\E613\"}.devicon-nodewebkit-plain:before{content:\"\\E614\"}.devicon-nginx-original-wordmark:before,.devicon-nginx-original:before,.devicon-nginx-plain-wordmark:before,.devicon-nginx-plain:before{content:\"\\E615\"}.devicon-erlang-plain-wordmark:before{content:\"\\E616\"}.devicon-erlang-plain:before{content:\"\\E617\"}.devicon-doctrine-line-wordmark:before{content:\"\\E618\"}.devicon-doctrine-line:before{content:\"\\E619\"}.devicon-doctrine-plain-wordmark:before{content:\"\\E61A\"}.devicon-doctrine-plain:before{content:\"\\E625\"}.devicon-apache-line-wordmark:before{content:\"\\E626\"}.devicon-apache-line:before{content:\"\\E627\"}.devicon-apache-plain-wordmark:before{content:\"\\E628\"}.devicon-apache-plain:before{content:\"\\E629\"}.devicon-go-line:before{content:\"\\E610\"}.devicon-redis-plain-wordmark:before{content:\"\\E606\"}.devicon-redis-plain:before{content:\"\\E607\"}.devicon-meteor-plain-wordmark:before{content:\"\\E608\"}.devicon-meteor-plain:before{content:\"\\E609\"}.devicon-heroku-line-wordmark:before,.devicon-heroku-original-wordmark:before{content:\"\\E60A\"}.devicon-heroku-line:before,.devicon-heroku-original:before{content:\"\\E60B\"}.devicon-heroku-plain-wordmark:before{content:\"\\E60C\"}.devicon-heroku-plain:before{content:\"\\E60F\"}.devicon-go-plain:before{content:\"\\E61B\"}.devicon-docker-plain-wordmark:before{content:\"\\E61E\"}.devicon-docker-plain:before{content:\"\\E61F\"}.devicon-amazonwebservices-original:before,.devicon-amazonwebservices-plain:before{content:\"\\E603\"}.devicon-amazonwebservices-plain-wordmark:before{content:\"\\E604\"}.devicon-android-plain-wordmark:before{content:\"\\E60D\"}.devicon-android-plain:before{content:\"\\E60E\"}.devicon-angularjs-plain-wordmark:before{content:\"\\E61C\"}.devicon-angularjs-plain:before{content:\"\\E61D\"}.devicon-appcelerator-original:before,.devicon-appcelerator-plain:before{content:\"\\E620\"}.devicon-appcelerator-plain-wordmark:before{content:\"\\E621\"}.devicon-apple-original:before,.devicon-apple-plain:before{content:\"\\E622\"}.devicon-atom-original-wordmark:before,.devicon-atom-plain-wordmark:before{content:\"\\E623\"}.devicon-atom-original:before,.devicon-atom-plain:before{content:\"\\E624\"}.devicon-backbonejs-plain-wordmark:before{content:\"\\E62C\"}.devicon-backbonejs-plain:before{content:\"\\E62D\"}.devicon-bootstrap-plain-wordmark:before{content:\"\\E62E\"}.devicon-bootstrap-plain:before{content:\"\\E62F\"}.devicon-bower-line-wordmark:before{content:\"\\E630\"}.devicon-bower-line:before{content:\"\\E631\"}.devicon-bower-plain-wordmark:before{content:\"\\E64E\"}.devicon-bower-plain:before{content:\"\\E64F\"}.devicon-chrome-plain-wordmark:before{content:\"\\E665\"}.devicon-chrome-plain:before{content:\"\\E666\"}.devicon-codeigniter-plain-wordmark:before{content:\"\\E667\"}.devicon-codeigniter-plain:before{content:\"\\E668\"}.devicon-coffeescript-original-wordmark:before,.devicon-coffeescript-plain-wordmark:before{content:\"\\E669\"}.devicon-coffeescript-original:before,.devicon-coffeescript-plain:before{content:\"\\E66A\"}.devicon-css3-plain-wordmark:before{content:\"\\E678\"}.devicon-css3-plain:before{content:\"\\E679\"}.devicon-debian-plain-wordmark:before{content:\"\\E67E\"}.devicon-debian-plain:before{content:\"\\E67F\"}.devicon-dot-net-plain-wordmark:before{content:\"\\E6D3\"}.devicon-dot-net-plain:before{content:\"\\E6D4\"}.devicon-drupal-plain-wordmark:before{content:\"\\E6E2\"}.devicon-drupal-plain:before{content:\"\\E6E3\"}.devicon-firefox-plain-wordmark:before{content:\"\\E75D\"}.devicon-firefox-plain:before{content:\"\\E75E\"}.devicon-foundation-plain-wordmark:before{content:\"\\E7A2\"}.devicon-foundation-plain:before{content:\"\\E7A3\"}.devicon-git-plain-wordmark:before{content:\"\\E7A7\"}.devicon-git-plain:before{content:\"\\E7A8\"}.devicon-grunt-line-wordmark:before{content:\"\\E7A9\"}.devicon-grunt-line:before{content:\"\\E7AA\"}.devicon-grunt-plain-wordmark:before{content:\"\\E7EA\"}.devicon-grunt-plain:before{content:\"\\E7EB\"}.devicon-gulp-plain:before{content:\"\\E7EC\"}.devicon-html5-plain-wordmark:before{content:\"\\E7F6\"}.devicon-html5-plain:before{content:\"\\E7F7\"}.devicon-ie10-original:before,.devicon-ie10-plain:before{content:\"\\E7F8\"}.devicon-illustrator-line:before{content:\"\\E7F9\"}.devicon-illustrator-plain:before{content:\"\\E7FA\"}.devicon-inkscape-plain-wordmark:before{content:\"\\E834\"}.devicon-inkscape-plain:before{content:\"\\E835\"}.devicon-java-plain-wordmark:before{content:\"\\E841\"}.devicon-java-plain:before{content:\"\\E842\"}.devicon-javascript-plain:before{content:\"\\E845\"}.devicon-jquery-plain-wordmark:before{content:\"\\E849\"}.devicon-jquery-plain:before{content:\"\\E84A\"}.devicon-krakenjs-plain-wordmark:before{content:\"\\E84F\"}.devicon-krakenjs-plain:before{content:\"\\E850\"}.devicon-laravel-plain-wordmark:before{content:\"\\E851\"}.devicon-laravel-plain:before{content:\"\\E852\"}.devicon-less-plain-wordmark:before{content:\"\\E853\"}.devicon-linux-plain:before{content:\"\\EB1C\"}.devicon-mongodb-plain-wordmark:before{content:\"\\EB43\"}.devicon-mongodb-plain:before{content:\"\\EB44\"}.devicon-moodle-plain-wordmark:before{content:\"\\EB5A\"}.devicon-moodle-plain:before{content:\"\\EB5B\"}.devicon-mysql-plain-wordmark:before{content:\"\\EB60\"}.devicon-mysql-plain:before{content:\"\\EB61\"}.devicon-nodejs-plain-wordmark:before{content:\"\\EB69\"}.devicon-nodejs-plain:before{content:\"\\EB6A\"}.devicon-oracle-original:before,.devicon-oracle-plain:before{content:\"\\EB6B\"}.devicon-photoshop-line:before{content:\"\\EB6C\"}.devicon-photoshop-plain:before{content:\"\\EB6D\"}.devicon-php-plain:before{content:\"\\EB71\"}.devicon-postgresql-plain-wordmark:before{content:\"\\EB7C\"}.devicon-postgresql-plain:before{content:\"\\EB7D\"}.devicon-python-plain-wordmark:before{content:\"\\EB88\"}.devicon-python-plain:before{content:\"\\EB89\"}.devicon-rails-plain-wordmark:before{content:\"\\EBA2\"}.devicon-rails-plain:before{content:\"\\EBA3\"}.devicon-react-original-wordmark:before,.devicon-react-plain-wordmark:before{content:\"\\E600\"}.devicon-react-original:before,.devicon-react-plain:before{content:\"\\E601\"}.devicon-ruby-plain-wordmark:before{content:\"\\EBC9\"}.devicon-ruby-plain:before{content:\"\\EBCA\"}.devicon-sass-original:before,.devicon-sass-plain:before{content:\"\\EBCB\"}.devicon-symfony-original-wordmark:before,.devicon-symfony-plain-wordmark:before{content:\"\\E602\"}.devicon-symfony-original:before,.devicon-symfony-plain:before{content:\"\\E605\"}.devicon-travis-plain-wordmark:before{content:\"\\EBCC\"}.devicon-travis-plain:before{content:\"\\EBCD\"}.devicon-trello-plain-wordmark:before{content:\"\\EBCE\"}.devicon-trello-plain:before{content:\"\\EBCF\"}.devicon-ubuntu-plain-wordmark:before{content:\"\\EBD0\"}.devicon-ubuntu-plain:before{content:\"\\EBD1\"}.devicon-vim-plain:before{content:\"\\EBF3\"}.devicon-windows8-original-wordmark:before,.devicon-windows8-plain-wordmark:before{content:\"\\EBF4\"}.devicon-windows8-original:before,.devicon-windows8-plain:before{content:\"\\EBF5\"}.devicon-wordpress-plain-wordmark:before{content:\"\\EBFD\"}.devicon-wordpress-plain:before{content:\"\\EBFE\"}.devicon-yii-plain-wordmark:before{content:\"\\EC01\"}.devicon-yii-plain:before{content:\"\\EC02\"}.devicon-zend-plain-wordmark:before{content:\"\\EC03\"}.devicon-zend-plain:before{content:\"\\EC04\"}.devicon-amazonwebservices-original.colored,.devicon-amazonwebservices-plain-wordmark.colored,.devicon-amazonwebservices-plain.colored{color:#F7A80D}.devicon-android-plain-wordmark.colored,.devicon-android-plain.colored{color:#A4C439}.devicon-angularjs-plain-wordmark.colored,.devicon-angularjs-plain.colored{color:#c4473a}.devicon-apache-line-wordmark.colored,.devicon-apache-line.colored,.devicon-apache-plain-wordmark.colored,.devicon-apache-plain.colored{color:#303284}.devicon-appcelerator-original.colored,.devicon-appcelerator-plain-wordmark.colored,.devicon-appcelerator-plain.colored{color:#ac162c}.devicon-apple-original.colored,.devicon-apple-plain.colored{color:#000}.devicon-atom-original-wordmark.colored,.devicon-atom-original.colored,.devicon-atom-plain-wordmark.colored,.devicon-atom-plain.colored{color:#67595D}.devicon-backbonejs-plain-wordmark.colored,.devicon-backbonejs-plain.colored{color:#002A41}.devicon-bootstrap-plain-wordmark.colored,.devicon-bootstrap-plain.colored{color:#59407f}.devicon-bower-line-wordmark.colored,.devicon-bower-line.colored,.devicon-bower-plain-wordmark.colored,.devicon-bower-plain.colored{color:#ef5734}.devicon-c-line-wordmark.colored,.devicon-c-line.colored,.devicon-c-plain-wordmark.colored,.devicon-c-plain.colored{color:#03599c}.devicon-chrome-plain-wordmark.colored,.devicon-chrome-plain.colored{color:#ce4e4e}.devicon-codeigniter-plain-wordmark.colored,.devicon-codeigniter-plain.colored{color:#ee4323}.devicon-coffeescript-original-wordmark.colored,.devicon-coffeescript-original.colored,.devicon-coffeescript-plain-wordmark.colored,.devicon-coffeescript-plain.colored{color:#28334c}.devicon-cplusplus-line-wordmark.colored,.devicon-cplusplus-line.colored,.devicon-cplusplus-plain-wordmark.colored,.devicon-cplusplus-plain.colored{color:#9c033a}.devicon-csharp-line-wordmark.colored,.devicon-csharp-line.colored,.devicon-csharp-plain-wordmark.colored,.devicon-csharp-plain.colored{color:#68217a}.devicon-css3-plain-wordmark.colored,.devicon-css3-plain.colored{color:#3d8fc6}.devicon-debian-plain-wordmark.colored,.devicon-debian-plain.colored{color:#A80030}.devicon-django-line-wordmark.colored,.devicon-django-line.colored,.devicon-django-plain-wordmark.colored,.devicon-django-plain.colored{color:#003A2B}.devicon-docker-plain-wordmark.colored,.devicon-docker-plain.colored{color:#019bc6}.devicon-doctrine-line-wordmark.colored,.devicon-doctrine-line.colored,.devicon-doctrine-plain-wordmark.colored,.devicon-doctrine-plain.colored{color:#f56d39}.devicon-dot-net-plain-wordmark.colored,.devicon-dot-net-plain.colored{color:#1384c8}.devicon-drupal-plain-wordmark.colored,.devicon-drupal-plain.colored{color:#0073BA}.devicon-erlang-plain-wordmark.colored,.devicon-erlang-plain.colored{color:#a90533}.devicon-firefox-plain-wordmark.colored,.devicon-firefox-plain.colored{color:#DD732A}.devicon-foundation-plain-wordmark.colored,.devicon-foundation-plain.colored{color:#008cba}.devicon-gimp-plain-wordmark.colored,.devicon-gimp-plain.colored{color:#716955}.devicon-git-plain-wordmark.colored,.devicon-git-plain.colored{color:#f34f29}.devicon-go-line.colored,.devicon-go-plain.colored{color:#000}.devicon-grunt-line-wordmark.colored,.devicon-grunt-line.colored,.devicon-grunt-plain-wordmark.colored,.devicon-grunt-plain.colored{color:#fcaa1a}.devicon-gulp-plain.colored{color:#eb4a4b}.devicon-heroku-line-wordmark.colored,.devicon-heroku-line.colored,.devicon-heroku-original-wordmark.colored,.devicon-heroku-original.colored,.devicon-heroku-plain-wordmark.colored,.devicon-heroku-plain.colored{color:#6762a6}.devicon-html5-plain-wordmark.colored,.devicon-html5-plain.colored{color:#e54d26}.devicon-ie10-original.colored,.devicon-ie10-plain.colored{color:#1EBBEE}.devicon-illustrator-line.colored,.devicon-illustrator-plain.colored{color:#faa625}.devicon-inkscape-plain-wordmark.colored,.devicon-inkscape-plain.colored{color:#000}.devicon-java-plain-wordmark.colored,.devicon-java-plain.colored{color:#EA2D2E}.devicon-javascript-plain.colored{color:#f0db4f}.devicon-jetbrains-line-wordmark.colored,.devicon-jetbrains-line.colored,.devicon-jetbrains-plain-wordmark.colored,.devicon-jetbrains-plain.colored{color:#F68B1F}.devicon-jquery-plain-wordmark.colored,.devicon-jquery-plain.colored{color:#0769ad}.devicon-krakenjs-plain-wordmark.colored,.devicon-krakenjs-plain.colored{color:#0081C2}.devicon-laravel-plain-wordmark.colored,.devicon-laravel-plain.colored{color:#fd4f31}.devicon-less-plain-wordmark.colored{color:#2a4d80}.devicon-linux-plain.colored{color:#000}.devicon-meteor-plain-wordmark.colored,.devicon-meteor-plain.colored{color:#df5052}.devicon-mongodb-plain-wordmark.colored,.devicon-mongodb-plain.colored{color:#4FAA41}.devicon-moodle-plain-wordmark.colored,.devicon-moodle-plain.colored{color:#F7931E}.devicon-mysql-plain-wordmark.colored,.devicon-mysql-plain.colored{color:#00618a}.devicon-nginx-original-wordmark.colored,.devicon-nginx-original.colored,.devicon-nginx-plain-wordmark.colored,.devicon-nginx-plain.colored{color:#090}.devicon-nodejs-plain-wordmark.colored,.devicon-nodejs-plain.colored{color:#83CD29}.devicon-nodewebkit-line-wordmark.colored,.devicon-nodewebkit-line.colored,.devicon-nodewebkit-plain-wordmark.colored,.devicon-nodewebkit-plain.colored{color:#3d3b47}.devicon-oracle-original.colored,.devicon-oracle-plain-wordmark.colored,.devicon-oracle-plain.colored{color:#EA1B22}.devicon-photoshop-line.colored,.devicon-photoshop-plain.colored{color:#80b5e2}.devicon-php-plain.colored{color:#6181b6}.devicon-postgresql-plain-wordmark.colored,.devicon-postgresql-plain.colored{color:#336791}.devicon-python-plain-wordmark.colored,.devicon-python-plain.colored{color:#ffd845}.devicon-rails-plain-wordmark.colored,.devicon-rails-plain.colored{color:#a62c46}.devicon-ruby-plain-wordmark.colored,.devicon-ruby-plain.colored{color:#d91404}.devicon-safari-line-wordmark.colored,.devicon-safari-line.colored,.devicon-safari-plain-wordmark.colored,.devicon-safari-plain.colored{color:#1B88CA}.devicon-react-original-wordmark.colored,.devicon-react-original.colored,.devicon-react-plain-wordmark.colored,.devicon-react-plain.colored{color:#61dafb}.devicon-redhat-original-wordmark.colored,.devicon-redhat-original.colored,.devicon-redhat-plain-wordmark.colored,.devicon-redhat-plain.colored{color:#e93442}.devicon-redis-plain-wordmark.colored,.devicon-redis-plain.colored{color:#d82c20}.devicon-sass-original.colored,.devicon-sass-plain-wordmark.colored,.devicon-sass-plain.colored{color:#c69}.devicon-symfony-original-wordmark.colored,.devicon-symfony-original.colored,.devicon-symfony-plain-wordmark.colored,.devicon-symfony-plain.colored{color:#1A171B}.devicon-travis-plain-wordmark.colored,.devicon-travis-plain.colored{color:#bb2031}.devicon-trello-plain-wordmark.colored,.devicon-trello-plain.colored{color:#23719f}.devicon-ubuntu-plain-wordmark.colored,.devicon-ubuntu-plain.colored{color:#dd4814}.devicon-vim-plain.colored{color:#179a33}.devicon-windows8-original-wordmark.colored,.devicon-windows8-original.colored,.devicon-windows8-plain-wordmark.colored,.devicon-windows8-plain.colored{color:#00adef}.devicon-wordpress-plain-wordmark.colored,.devicon-wordpress-plain.colored{color:#494949}.devicon-yii-plain-wordmark.colored,.devicon-yii-plain.colored{color:#0073bb}.devicon-zend-plain-wordmark.colored,.devicon-zend-plain.colored{color:#68b604}", ""]);

// exports


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "devicon.eot?478292ee89c6ed097c8d79908ae5b1dd";

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "devicon.eot?478292ee89c6ed097c8d79908ae5b1dd";

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fd2d16f23d2fb36bf259b93ae75e0d42.woff";

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "devicon.ttf?b6ba8105eea98fe99e74c8b8c844f266";

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "devicon.svg?279702e05976a44fbbafe245f4085c31";

/***/ }),
/* 23 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./style.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "#matrix {\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.mainContainer {\r\n  margin-top: 100px;\r\n  margin-bottom: 100px;\r\n}\r\n\r\n.tecnologies {\r\n  font-size: 5rem;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("digitalmatrix", [], factory);
	else if(typeof exports === 'object')
		exports["digitalmatrix"] = factory();
	else
		root["digitalmatrix"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(1);

var _rainbowvis = __webpack_require__(6);

var _rainbowvis2 = _interopRequireDefault(_rainbowvis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DigitalMatrix = function () {
  function DigitalMatrix(elementId) {
    _classCallCheck(this, DigitalMatrix);

    this.matrixElement = document.getElementById(elementId);
    this.matrixElement.className = "matrix";

    this.regenerateNumbers();
  }

  _createClass(DigitalMatrix, [{
    key: "_getRandomInt",
    value: function _getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }, {
    key: "_shuffle",
    value: function _shuffle(array) {
      var m = array.length,
          t,
          i;

      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return array;
    }
  }, {
    key: "_pulsate",
    value: function _pulsate() {
      var numbers = Array.prototype.slice.call(this.matrixElement.getElementsByClassName("number"), 0);

      var selectedNumbers = this._shuffle(numbers).slice(0, numbers.length / 20);

      selectedNumbers.forEach(function (nElement) {
        nElement.className = nElement.className == "number" ? "number glow" : "number";
      });
    }
  }, {
    key: "regenerateNumbers",
    value: function regenerateNumbers() {
      var docWidth = this.matrixElement.offsetWidth;
      var docHeight = this.matrixElement.offsetHeight;

      var nWidth = 25;
      var nHeight = 20;

      var xSteps = Math.floor(docWidth / nWidth);
      var ySteps = Math.floor(docHeight / nHeight);

      nWidth += docWidth % nWidth / xSteps;
      nHeight += docHeight % nHeight / ySteps;

      var rainbow = new _rainbowvis2.default();
      rainbow.setNumberRange(0, xSteps);
      rainbow.setSpectrum("#42f445", "#8341f4");

      var x = 0;
      do {
        var y = 0;
        do {
          var opacity = Math.random();

          if (Math.random() < 0.7 && opacity > 0.1) {
            var nElement = document.createElement("div");
            nElement.appendChild(document.createTextNode(("00" + this._getRandomInt(0, 255).toString(16)).toUpperCase().slice(-2)));

            nElement.className = "number";

            nElement.style.left = x * nWidth + "px";
            nElement.style.top = y * nHeight + "px";
            nElement.style.color = "#" + rainbow.colourAt(x);
            nElement.style.opacity = opacity;

            this.matrixElement.appendChild(nElement);
          }

          y++;
        } while (y < ySteps);

        x++;
      } while (x < xSteps);
    }
  }, {
    key: "startPulsate",
    value: function startPulsate() {
      setInterval(this._pulsate.bind(this), 1000);
    }
  }]);

  return DigitalMatrix;
}();

exports.default = DigitalMatrix;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./lib.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./lib.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, ".matrix {\r\n  padding: 0;\r\n  margin: 0;\r\n  background: #000;\r\n  font-family: \"Consolas\";\r\n}\r\n\r\n.matrix .number {\r\n  position: absolute;\r\n  -webkit-touch-callout: none;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n  font-weight: bold;\r\n}\r\n\r\n.matrix .number.glow {\r\n  -webkit-animation: glow 1s alternate;\r\n  -moz-animation: glow 1s alternate;\r\n  animation: glow 1s alternate;\r\n  -webkit-animation-iteration-count: 2;\r\n  -moz-animation-iteration-count: 2;\r\n  animation-iteration-count: 2;\r\n}\r\n\r\n@-webkit-keyframes glow {\r\n  to {\r\n    opacity: 1;\r\n  }\r\n}\r\n", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
RainbowVis-JS 
Released under Eclipse Public License - v 1.0
*/

function Rainbow()
{
	"use strict";
	var gradients = null;
	var minNum = 0;
	var maxNum = 100;
	var colours = ['ff0000', 'ffff00', '00ff00', '0000ff']; 
	setColours(colours);
	
	function setColours (spectrum) 
	{
		if (spectrum.length < 2) {
			throw new Error('Rainbow must have two or more colours.');
		} else {
			var increment = (maxNum - minNum)/(spectrum.length - 1);
			var firstGradient = new ColourGradient();
			firstGradient.setGradient(spectrum[0], spectrum[1]);
			firstGradient.setNumberRange(minNum, minNum + increment);
			gradients = [ firstGradient ];
			
			for (var i = 1; i < spectrum.length - 1; i++) {
				var colourGradient = new ColourGradient();
				colourGradient.setGradient(spectrum[i], spectrum[i + 1]);
				colourGradient.setNumberRange(minNum + increment * i, minNum + increment * (i + 1)); 
				gradients[i] = colourGradient; 
			}

			colours = spectrum;
		}
	}

	this.setSpectrum = function () 
	{
		setColours(arguments);
		return this;
	}

	this.setSpectrumByArray = function (array)
	{
		setColours(array);
		return this;
	}

	this.colourAt = function (number)
	{
		if (isNaN(number)) {
			throw new TypeError(number + ' is not a number');
		} else if (gradients.length === 1) {
			return gradients[0].colourAt(number);
		} else {
			var segment = (maxNum - minNum)/(gradients.length);
			var index = Math.min(Math.floor((Math.max(number, minNum) - minNum)/segment), gradients.length - 1);
			return gradients[index].colourAt(number);
		}
	}

	this.colorAt = this.colourAt;

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
			setColours(colours);
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
		return this;
	}
}

function ColourGradient() 
{
	"use strict";
	var startColour = 'ff0000';
	var endColour = '0000ff';
	var minNum = 0;
	var maxNum = 100;

	this.setGradient = function (colourStart, colourEnd)
	{
		startColour = getHexColour(colourStart);
		endColour = getHexColour(colourEnd);
	}

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
	}

	this.colourAt = function (number)
	{
		return calcHex(number, startColour.substring(0,2), endColour.substring(0,2)) 
			+ calcHex(number, startColour.substring(2,4), endColour.substring(2,4)) 
			+ calcHex(number, startColour.substring(4,6), endColour.substring(4,6));
	}
	
	function calcHex(number, channelStart_Base16, channelEnd_Base16)
	{
		var num = number;
		if (num < minNum) {
			num = minNum;
		}
		if (num > maxNum) {
			num = maxNum;
		} 
		var numRange = maxNum - minNum;
		var cStart_Base10 = parseInt(channelStart_Base16, 16);
		var cEnd_Base10 = parseInt(channelEnd_Base16, 16); 
		var cPerUnit = (cEnd_Base10 - cStart_Base10)/numRange;
		var c_Base10 = Math.round(cPerUnit * (num - minNum) + cStart_Base10);
		return formatHex(c_Base10.toString(16));
	}

	function formatHex(hex) 
	{
		if (hex.length === 1) {
			return '0' + hex;
		} else {
			return hex;
		}
	} 
	
	function isHexColour(string)
	{
		var regex = /^#?[0-9a-fA-F]{6}$/i;
		return regex.test(string);
	}

	function getHexColour(string)
	{
		if (isHexColour(string)) {
			return string.substring(string.length - 6, string.length);
		} else {
			var name = string.toLowerCase();
			if (colourNames.hasOwnProperty(name)) {
				return colourNames[name];
			}
			throw new Error(string + ' is not a valid colour.');
		}
	}
	
	// Extended list of CSS colornames s taken from
	// http://www.w3.org/TR/css3-color/#svg-color
	var colourNames = {
		aliceblue: "F0F8FF",
		antiquewhite: "FAEBD7",
		aqua: "00FFFF",
		aquamarine: "7FFFD4",
		azure: "F0FFFF",
		beige: "F5F5DC",
		bisque: "FFE4C4",
		black: "000000",
		blanchedalmond: "FFEBCD",
		blue: "0000FF",
		blueviolet: "8A2BE2",
		brown: "A52A2A",
		burlywood: "DEB887",
		cadetblue: "5F9EA0",
		chartreuse: "7FFF00",
		chocolate: "D2691E",
		coral: "FF7F50",
		cornflowerblue: "6495ED",
		cornsilk: "FFF8DC",
		crimson: "DC143C",
		cyan: "00FFFF",
		darkblue: "00008B",
		darkcyan: "008B8B",
		darkgoldenrod: "B8860B",
		darkgray: "A9A9A9",
		darkgreen: "006400",
		darkgrey: "A9A9A9",
		darkkhaki: "BDB76B",
		darkmagenta: "8B008B",
		darkolivegreen: "556B2F",
		darkorange: "FF8C00",
		darkorchid: "9932CC",
		darkred: "8B0000",
		darksalmon: "E9967A",
		darkseagreen: "8FBC8F",
		darkslateblue: "483D8B",
		darkslategray: "2F4F4F",
		darkslategrey: "2F4F4F",
		darkturquoise: "00CED1",
		darkviolet: "9400D3",
		deeppink: "FF1493",
		deepskyblue: "00BFFF",
		dimgray: "696969",
		dimgrey: "696969",
		dodgerblue: "1E90FF",
		firebrick: "B22222",
		floralwhite: "FFFAF0",
		forestgreen: "228B22",
		fuchsia: "FF00FF",
		gainsboro: "DCDCDC",
		ghostwhite: "F8F8FF",
		gold: "FFD700",
		goldenrod: "DAA520",
		gray: "808080",
		green: "008000",
		greenyellow: "ADFF2F",
		grey: "808080",
		honeydew: "F0FFF0",
		hotpink: "FF69B4",
		indianred: "CD5C5C",
		indigo: "4B0082",
		ivory: "FFFFF0",
		khaki: "F0E68C",
		lavender: "E6E6FA",
		lavenderblush: "FFF0F5",
		lawngreen: "7CFC00",
		lemonchiffon: "FFFACD",
		lightblue: "ADD8E6",
		lightcoral: "F08080",
		lightcyan: "E0FFFF",
		lightgoldenrodyellow: "FAFAD2",
		lightgray: "D3D3D3",
		lightgreen: "90EE90",
		lightgrey: "D3D3D3",
		lightpink: "FFB6C1",
		lightsalmon: "FFA07A",
		lightseagreen: "20B2AA",
		lightskyblue: "87CEFA",
		lightslategray: "778899",
		lightslategrey: "778899",
		lightsteelblue: "B0C4DE",
		lightyellow: "FFFFE0",
		lime: "00FF00",
		limegreen: "32CD32",
		linen: "FAF0E6",
		magenta: "FF00FF",
		maroon: "800000",
		mediumaquamarine: "66CDAA",
		mediumblue: "0000CD",
		mediumorchid: "BA55D3",
		mediumpurple: "9370DB",
		mediumseagreen: "3CB371",
		mediumslateblue: "7B68EE",
		mediumspringgreen: "00FA9A",
		mediumturquoise: "48D1CC",
		mediumvioletred: "C71585",
		midnightblue: "191970",
		mintcream: "F5FFFA",
		mistyrose: "FFE4E1",
		moccasin: "FFE4B5",
		navajowhite: "FFDEAD",
		navy: "000080",
		oldlace: "FDF5E6",
		olive: "808000",
		olivedrab: "6B8E23",
		orange: "FFA500",
		orangered: "FF4500",
		orchid: "DA70D6",
		palegoldenrod: "EEE8AA",
		palegreen: "98FB98",
		paleturquoise: "AFEEEE",
		palevioletred: "DB7093",
		papayawhip: "FFEFD5",
		peachpuff: "FFDAB9",
		peru: "CD853F",
		pink: "FFC0CB",
		plum: "DDA0DD",
		powderblue: "B0E0E6",
		purple: "800080",
		red: "FF0000",
		rosybrown: "BC8F8F",
		royalblue: "4169E1",
		saddlebrown: "8B4513",
		salmon: "FA8072",
		sandybrown: "F4A460",
		seagreen: "2E8B57",
		seashell: "FFF5EE",
		sienna: "A0522D",
		silver: "C0C0C0",
		skyblue: "87CEEB",
		slateblue: "6A5ACD",
		slategray: "708090",
		slategrey: "708090",
		snow: "FFFAFA",
		springgreen: "00FF7F",
		steelblue: "4682B4",
		tan: "D2B48C",
		teal: "008080",
		thistle: "D8BFD8",
		tomato: "FF6347",
		turquoise: "40E0D0",
		violet: "EE82EE",
		wheat: "F5DEB3",
		white: "FFFFFF",
		whitesmoke: "F5F5F5",
		yellow: "FFFF00",
		yellowgreen: "9ACD32"
	}
}

if (true) {
  module.exports = Rainbow;
}


/***/ })
/******/ ]);
});
//# sourceMappingURL=digitalmatrix.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=app.bundle.js.map