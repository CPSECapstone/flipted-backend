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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2Fwb2xsby1zZXJ2ZXIuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mbGlwdGVkLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly9mbGlwdGVkLy4vc3JjL3R5cGUtZGVmcy50cyIsIndlYnBhY2s6Ly9mbGlwdGVkLy4vc3JjL3VzZXJzLXJlc29sdmVyLnRzIiwid2VicGFjazovL2ZsaXB0ZWQvZXh0ZXJuYWwgXCJAYXdzLXNkay9jbGllbnQtZHluYW1vZGJcIiIsIndlYnBhY2s6Ly9mbGlwdGVkL2V4dGVybmFsIFwiQGF3cy1zZGsvdXRpbC1keW5hbW9kYlwiIiwid2VicGFjazovL2ZsaXB0ZWQvZXh0ZXJuYWwgXCJhcG9sbG8tc2VydmVyLWxhbWJkYVwiIiwid2VicGFjazovL2ZsaXB0ZWQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmxpcHRlZC8uL3NyYy9hcG9sbG8tc2VydmVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBnZXRVc2VycyB9IGZyb20gJy4vdXNlcnMtcmVzb2x2ZXInO1xuXG4vL1RPUCBMRVZFTCBGSUxFIEZPUiBBTEwgUVVFUlkgUkVTT0xWRVJTXG5cbi8vU0VFIFVTRVJTIFJFU09MVkVSIEZPUiBMT0dJQ1xuZXhwb3J0IGNvbnN0IHJlc29sdmVycyA9IHtcbiAgUXVlcnk6IHtcbiAgICB1c2VyczogKCkgPT4gZ2V0VXNlcnMoKVxuICB9LFxufTsiLCJpbXBvcnQgeyBncWwgfSBmcm9tICdhcG9sbG8tc2VydmVyLWxhbWJkYSc7XG5cbi8vVEhJUyBJUyBBTiBFWEFNUExFLiBSRU1PVkUvQUREIFRZUEVTIEFTIFlPVSBTRUUgRklUXG5leHBvcnQgY29uc3QgdHlwZURlZnMgPSBncWxgXG4gIHR5cGUgUXVlcnkge1xuICAgIFwiXCJcIlxuICAgIExpc3Qgb2YgdXNlcnMuXG4gICAgXCJcIlwiXG4gICAgdXNlcnM6IFtVc2VyXVxuICB9XG4gIFxuICB0eXBlIFVzZXIge1xuICAgIFwiXCJcIlxuICAgIEZsaXB0ZWQgVXNlciBFeGFtcGxlXG4gICAgXCJcIlwiXG4gICAgaWQ6IFN0cmluZyFcbiAgICBmaXJzdE5hbWU6IFN0cmluZyFcbiAgICBsYXN0TmFtZTogU3RyaW5nIVxuICB9XG5gXG4vL0VORCBPRiBFWEFNUExFLiIsImNvbnN0IHsgdW5tYXJzaGFsbCB9ID0gcmVxdWlyZShcIkBhd3Mtc2RrL3V0aWwtZHluYW1vZGJcIik7XG5jb25zdCB7IER5bmFtb0RCQ2xpZW50LCBTY2FuQ29tbWFuZCB9ID0gcmVxdWlyZShcIkBhd3Mtc2RrL2NsaWVudC1keW5hbW9kYlwiKTtcblxuY29uc3QgY2xpZW50ID0gbmV3IER5bmFtb0RCQ2xpZW50KHsgcmVnaW9uOiBcInVzLWVhc3QtMVwiIH0pO1xuLy9USElTIElTIFRIRSBSRVNPTFZFUiBGVU5DVElPTiBGT1IgVVNFUlNcbi8vR0FUSEVSUyBJVEVNUyBGUk9NIFVTRVJTIFRBQkxFIElOIERZTkFNT0RCXG5leHBvcnQgY29uc3QgZ2V0VXNlcnMgPSBhc3luYyAoKSA9PiB7XG4gICBjb25zdCBwYXJhbXMgPSB7XG4gICAgIFRhYmxlTmFtZTogXCJVc2Vyc1wiLFxuICAgfTtcbiBcbiAgIHRyeSB7XG4gICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBjbGllbnQuc2VuZChuZXcgU2NhbkNvbW1hbmQocGFyYW1zKSk7XG4gICAgIGNvbnN0IHVzZXJzIDogYW55W10gPSBbXTtcbiAgICAgcmVzdWx0cy5JdGVtcy5mb3JFYWNoKChpdGVtIDogYW55KSA9PiB7XG4gICAgICAgdXNlcnMucHVzaCh1bm1hcnNoYWxsKGl0ZW0pKTtcbiAgICAgfSk7XG4gICAgIHJldHVybiB1c2VycztcbiAgIH0gY2F0Y2ggKGVycikge1xuICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgIHJldHVybiBlcnI7XG4gICB9XG4gfTtcbiAvL0VORCBPRiBVU0VSIFJFU09MVkVSIEZVTkNUSU9OIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGF3cy1zZGsvY2xpZW50LWR5bmFtb2RiXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAYXdzLXNkay91dGlsLWR5bmFtb2RiXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyLWxhbWJkYVwiKTs7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBBcG9sbG9TZXJ2ZXIgfSBmcm9tICdhcG9sbG8tc2VydmVyLWxhbWJkYSc7XG5cbmltcG9ydCB7IHJlc29sdmVycyB9IGZyb20gJy4vcmVzb2x2ZXJzJztcbmltcG9ydCB7IHR5cGVEZWZzIH0gZnJvbSAnLi90eXBlLWRlZnMnO1xuXG5jb25zdCBhcG9sbG9TZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHsgXG4gICByZXNvbHZlcnMsIFxuICAgdHlwZURlZnMsIFxuICAgcGxheWdyb3VuZDogeyAgICBlbmRwb2ludDogXCIvZGV2L2dyYXBocWxcIiAgfSBcbn0pO1xuXG5leHBvcnRzLmdyYXBocWxIYW5kbGVyID0gYXBvbGxvU2VydmVyLmNyZWF0ZUhhbmRsZXIoe1xuICAgY29yczoge1xuICAgICBvcmlnaW46IHRydWUsXG4gICAgIGNyZWRlbnRpYWxzOiB0cnVlLFxuICAgfSxcbiB9KTsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0E7Ozs7Ozs7Ozs7O0FDWkE7QUFHQTs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQTtBQUNBO0FBQ0E7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyQkE7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWhCQTtBQUNBO0FBQ0E7QTs7Ozs7Ozs7QUNSQTtBQUNBO0E7Ozs7Ozs7O0FDREE7QUFDQTtBOzs7Ozs7OztBQ0RBO0FBQ0E7QTs7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDdEJBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0EiLCJzb3VyY2VSb290IjoiIn0=