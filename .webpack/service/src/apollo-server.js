/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/resolvers.ts":
/*!**************************!*\
  !*** ./src/resolvers.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolvers = void 0;
const users_resolver_1 = __webpack_require__(/*! ./users-resolver */ "./src/users-resolver.ts");
exports.resolvers = {
    Query: {
        users: () => users_resolver_1.getUsers()
    },
};


/***/ }),

/***/ "./src/type-defs.ts":
/*!**************************!*\
  !*** ./src/type-defs.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.typeDefs = void 0;
const apollo_server_lambda_1 = __webpack_require__(/*! apollo-server-lambda */ "apollo-server-lambda");
exports.typeDefs = apollo_server_lambda_1.gql `
  type Query {
    """
    List of users.
    """
    users: [User]
  }
  
  type User {
    """
    Flipted User Example
    """
    id: String!
    firstName: String!
    lastName: String!
  }
`;


/***/ }),

/***/ "./src/users-resolver.ts":
/*!*******************************!*\
  !*** ./src/users-resolver.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUsers = void 0;
const { unmarshall } = __webpack_require__(/*! @aws-sdk/util-dynamodb */ "@aws-sdk/util-dynamodb");
const { DynamoDBClient, ScanCommand } = __webpack_require__(/*! @aws-sdk/client-dynamodb */ "@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "us-east-1" });
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: "Users",
    };
    try {
        const results = yield client.send(new ScanCommand(params));
        const users = [];
        results.Items.forEach((item) => {
            users.push(unmarshall(item));
        });
        return users;
    }
    catch (err) {
        console.error(err);
        return err;
    }
});
exports.getUsers = getUsers;


/***/ }),

/***/ "@aws-sdk/client-dynamodb":
/*!*******************************************!*\
  !*** external "@aws-sdk/client-dynamodb" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/client-dynamodb");;

/***/ }),

/***/ "@aws-sdk/util-dynamodb":
/*!*****************************************!*\
  !*** external "@aws-sdk/util-dynamodb" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/util-dynamodb");;

/***/ }),

/***/ "apollo-server-lambda":
/*!***************************************!*\
  !*** external "apollo-server-lambda" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("apollo-server-lambda");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!******************************!*\
  !*** ./src/apollo-server.ts ***!
  \******************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const apollo_server_lambda_1 = __webpack_require__(/*! apollo-server-lambda */ "apollo-server-lambda");
const resolvers_1 = __webpack_require__(/*! ./resolvers */ "./src/resolvers.ts");
const type_defs_1 = __webpack_require__(/*! ./type-defs */ "./src/type-defs.ts");
const apolloServer = new apollo_server_lambda_1.ApolloServer({
    resolvers: resolvers_1.resolvers,
    typeDefs: type_defs_1.typeDefs,
    playground: { endpoint: "/dev/graphql" }
});
exports.graphqlHandler = apolloServer.createHandler({
    cors: {
        origin: true,
        credentials: true,
    },
});

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2Fwb2xsby1zZXJ2ZXIuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mbGlwdGVkLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly9mbGlwdGVkLy4vc3JjL3R5cGUtZGVmcy50cyIsIndlYnBhY2s6Ly9mbGlwdGVkLy4vc3JjL3VzZXJzLXJlc29sdmVyLnRzIiwid2VicGFjazovL2ZsaXB0ZWQvZXh0ZXJuYWwgXCJAYXdzLXNkay9jbGllbnQtZHluYW1vZGJcIiIsIndlYnBhY2s6Ly9mbGlwdGVkL2V4dGVybmFsIFwiQGF3cy1zZGsvdXRpbC1keW5hbW9kYlwiIiwid2VicGFjazovL2ZsaXB0ZWQvZXh0ZXJuYWwgXCJhcG9sbG8tc2VydmVyLWxhbWJkYVwiIiwid2VicGFjazovL2ZsaXB0ZWQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmxpcHRlZC8uL3NyYy9hcG9sbG8tc2VydmVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBnZXRVc2VycyB9IGZyb20gJy4vdXNlcnMtcmVzb2x2ZXInO1xuXG4vL1RPUCBMRVZFTCBGSUxFIEZPUiBBTEwgUVVFUlkgUkVTT0xWRVJTXG5cbi8vU0VFIFVTRVJTIFJFU09MVkVSIEZPUiBMT0dJQ1xuZXhwb3J0IGNvbnN0IHJlc29sdmVycyA9IHtcbiAgUXVlcnk6IHtcbiAgICB1c2VyczogKCkgPT4gZ2V0VXNlcnMoKVxuICB9LFxufTsiLCJpbXBvcnQgeyBncWwgfSBmcm9tICdhcG9sbG8tc2VydmVyLWxhbWJkYSc7XG5cbi8vVEhJUyBJUyBBTiBFWEFNUExFLiBSRU1PVkUvQUREIFRZUEVTIEFTIFlPVSBTRUUgRklUXG5leHBvcnQgY29uc3QgdHlwZURlZnMgPSBncWxgXG4gIHR5cGUgUXVlcnkge1xuICAgIFwiXCJcIlxuICAgIExpc3Qgb2YgdXNlcnMuXG4gICAgXCJcIlwiXG4gICAgdXNlcnM6IFtVc2VyXVxuICB9XG4gIFxuICB0eXBlIFVzZXIge1xuICAgIFwiXCJcIlxuICAgIEZsaXB0ZWQgVXNlciBFeGFtcGxlXG4gICAgXCJcIlwiXG4gICAgaWQ6IFN0cmluZyFcbiAgICBmaXJzdE5hbWU6IFN0cmluZyFcbiAgICBsYXN0TmFtZTogU3RyaW5nIVxuICB9XG5gXG4vL0VORCBPRiBFWEFNUExFLiIsImNvbnN0IHsgdW5tYXJzaGFsbCB9ID0gcmVxdWlyZShcIkBhd3Mtc2RrL3V0aWwtZHluYW1vZGJcIik7XG5jb25zdCB7IER5bmFtb0RCQ2xpZW50LCBTY2FuQ29tbWFuZCB9ID0gcmVxdWlyZShcIkBhd3Mtc2RrL2NsaWVudC1keW5hbW9kYlwiKTtcblxuY29uc3QgY2xpZW50ID0gbmV3IER5bmFtb0RCQ2xpZW50KHsgcmVnaW9uOiBcInVzLWVhc3QtMVwiIH0pO1xuXG4vL1RISVMgSVMgVEhFIFJFU09MVkVSIEZVTkNUSU9OIEZPUiBVU0VSU1xuLy9HQVRIRVJTIElURU1TIEZST00gVVNFUlMgVEFCTEUgSU4gRFlOQU1PREJcbmV4cG9ydCBjb25zdCBnZXRVc2VycyA9IGFzeW5jICgpID0+IHtcbiAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgVGFibGVOYW1lOiBcIlVzZXJzXCIsXG4gICB9O1xuIFxuICAgdHJ5IHtcbiAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IGNsaWVudC5zZW5kKG5ldyBTY2FuQ29tbWFuZChwYXJhbXMpKTtcbiAgICAgY29uc3QgdXNlcnMgOiBhbnlbXSA9IFtdO1xuICAgICByZXN1bHRzLkl0ZW1zLmZvckVhY2goKGl0ZW0gOiBhbnkpID0+IHtcbiAgICAgICB1c2Vycy5wdXNoKHVubWFyc2hhbGwoaXRlbSkpO1xuICAgICB9KTtcbiAgICAgcmV0dXJuIHVzZXJzO1xuICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgcmV0dXJuIGVycjtcbiAgIH1cbiB9O1xuIC8vRU5EIE9GIFVTRVIgUkVTT0xWRVIgRlVOQ1RJT04iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAYXdzLXNkay9jbGllbnQtZHluYW1vZGJcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBhd3Mtc2RrL3V0aWwtZHluYW1vZGJcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItbGFtYmRhXCIpOzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IEFwb2xsb1NlcnZlciB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItbGFtYmRhJztcblxuaW1wb3J0IHsgcmVzb2x2ZXJzIH0gZnJvbSAnLi9yZXNvbHZlcnMnO1xuaW1wb3J0IHsgdHlwZURlZnMgfSBmcm9tICcuL3R5cGUtZGVmcyc7XG5cbmNvbnN0IGFwb2xsb1NlcnZlciA9IG5ldyBBcG9sbG9TZXJ2ZXIoeyBcbiAgIHJlc29sdmVycywgXG4gICB0eXBlRGVmcywgXG4gICBwbGF5Z3JvdW5kOiB7ICAgIGVuZHBvaW50OiBcIi9kZXYvZ3JhcGhxbFwiICB9IFxufSk7XG5cbmV4cG9ydHMuZ3JhcGhxbEhhbmRsZXIgPSBhcG9sbG9TZXJ2ZXIuY3JlYXRlSGFuZGxlcih7XG4gICBjb3JzOiB7XG4gICAgIG9yaWdpbjogdHJ1ZSxcbiAgICAgY3JlZGVudGlhbHM6IHRydWUsXG4gICB9LFxuIH0pOyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QTs7Ozs7Ozs7Ozs7QUNaQTtBQUdBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBO0FBQ0E7QUFDQTtBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JCQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaEJBO0FBQ0E7QUFDQTtBOzs7Ozs7OztBQ1RBO0FBQ0E7QTs7Ozs7Ozs7QUNEQTtBQUNBO0E7Ozs7Ozs7O0FDREE7QUFDQTtBOzs7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN0QkE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QSIsInNvdXJjZVJvb3QiOiIifQ==