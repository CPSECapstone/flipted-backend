/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/course-resolver.ts":
/*!********************************!*\
  !*** ./src/course-resolver.ts ***!
  \********************************/
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
exports.CourseResolvers = void 0;
const { unmarshall } = __webpack_require__(/*! @aws-sdk/util-dynamodb */ "@aws-sdk/util-dynamodb");
const { DynamoDBClient, ScanCommand } = __webpack_require__(/*! @aws-sdk/client-dynamodb */ "@aws-sdk/client-dynamodb");
const { environment } = __webpack_require__(/*! ./environment */ "./src/environment.ts");
const client = new DynamoDBClient({ region: "us-east-1" });
class CourseResolvers {
    constructor() {
        this.getCourses = () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "Courses-" + environment.stage,
            };
            try {
                const results = yield client.send(new ScanCommand(params));
                const courses = [];
                results.Items.forEach((item) => {
                    courses.push(unmarshall(item));
                });
                return courses;
            }
            catch (err) {
                console.error(err);
                return err;
            }
        });
        this.addCourse = () => __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.CourseResolvers = CourseResolvers;


/***/ }),

/***/ "./src/environment.ts":
/*!****************************!*\
  !*** ./src/environment.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.environment = void 0;
exports.environment = {
    stage: process.env.STAGE,
};


/***/ }),

/***/ "./src/mission-resolver.ts":
/*!*********************************!*\
  !*** ./src/mission-resolver.ts ***!
  \*********************************/
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
exports.MissionResolvers = void 0;
const { unmarshall } = __webpack_require__(/*! @aws-sdk/util-dynamodb */ "@aws-sdk/util-dynamodb");
const { DynamoDBClient, ScanCommand } = __webpack_require__(/*! @aws-sdk/client-dynamodb */ "@aws-sdk/client-dynamodb");
const { environment } = __webpack_require__(/*! ./environment */ "./src/environment.ts");
const client = new DynamoDBClient({ region: "us-east-1" });
class MissionResolvers {
    constructor() {
        this.getMissions = () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "Missions-" + environment.stage,
            };
            try {
                const results = yield client.send(new ScanCommand(params));
                const missions = [];
                results.Items.forEach((item) => {
                    missions.push(unmarshall(item));
                });
                return missions;
            }
            catch (err) {
                console.error(err);
                return err;
            }
        });
        this.addMission = () => __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.MissionResolvers = MissionResolvers;


/***/ }),

/***/ "./src/resolvers.ts":
/*!**************************!*\
  !*** ./src/resolvers.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolvers = void 0;
const user_resolver_1 = __webpack_require__(/*! ./user-resolver */ "./src/user-resolver.ts");
const course_resolver_1 = __webpack_require__(/*! ./course-resolver */ "./src/course-resolver.ts");
const mission_resolver_1 = __webpack_require__(/*! ./mission-resolver */ "./src/mission-resolver.ts");
const task_resolver_1 = __webpack_require__(/*! ./task-resolver */ "./src/task-resolver.ts");
const userResolvers = new user_resolver_1.UserResolvers();
const courseResolvers = new course_resolver_1.CourseResolvers();
const missionResolvers = new mission_resolver_1.MissionResolvers();
const taskResolvers = new task_resolver_1.TaskResolvers();
exports.resolvers = {
    Query: {
        getUsers: () => userResolvers.getUsers(),
        getCourses: () => courseResolvers.getCourses(),
        getMissions: () => missionResolvers.getMissions(),
        getTasks: () => taskResolvers.getTasks()
    },
    Mutation: {
        addCourse: () => courseResolvers.addCourse(),
        addMission: () => missionResolvers.addMission(),
        addTask: (_, args) => taskResolvers.addTask(args),
    }
};


/***/ }),

/***/ "./src/task-resolver.ts":
/*!******************************!*\
  !*** ./src/task-resolver.ts ***!
  \******************************/
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
exports.TaskResolvers = void 0;
const { unmarshall } = __webpack_require__(/*! @aws-sdk/util-dynamodb */ "@aws-sdk/util-dynamodb");
const { DynamoDBClient, ScanCommand, PutItemCommand } = __webpack_require__(/*! @aws-sdk/client-dynamodb */ "@aws-sdk/client-dynamodb");
const { environment } = __webpack_require__(/*! ./environment */ "./src/environment.ts");
const client = new DynamoDBClient({ region: "us-east-1" });
const secure_1 = __webpack_require__(/*! uid/secure */ "uid/secure");
class TaskResolvers {
    constructor() {
        this.getTasks = () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "Tasks-" + environment.stage,
            };
            try {
                const results = yield client.send(new ScanCommand(params));
                const tasks = [];
                results.Items.forEach((item) => {
                    tasks.push(unmarshall(item));
                });
                return tasks;
            }
            catch (err) {
                console.error(err);
                return err;
            }
        });
        this.addTask = (args) => __awaiter(this, void 0, void 0, function* () {
            const task = args.task;
            const params = {
                TableName: "Tasks-" + environment.stage,
                Item: {
                    "id": {
                        S: secure_1.uid()
                    },
                    "name": {
                        S: task.name
                    },
                    "description": {
                        S: task.description
                    },
                    "link": {
                        S: task.link
                    }
                }
            };
            try {
                yield client.send(new PutItemCommand(params));
                return unmarshall(params.Item);
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
}
exports.TaskResolvers = TaskResolvers;


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
    getUsers: [User]
    getCourses: [Course]
    getMissions: [Mission]
    getTasks: [Task]
  }

  type User {
    """
    Flipted User Example
    """
    id: String!
    firstName: String!
    lastName: String!
  }

  type Course {
    """
    Course Definition
    """
    id: String!
    name: String!
    instructor: String!
    description: String!
    missions: [Mission]
  }

  type Mission {
    """
    Missions within a Course
    """
    id: String!
    name: String!
    description: String!
    tasks: [Task]
  }

  type Task {
    """
    Tasks within Missions
    """
    id: String!
    name: String!
    description: String!
    link: String
  }

  type Mutation {
    addCourse(course: CourseInput): Course 
    addMission(mission: MissionInput): Mission 
    addTask(task: TaskInput): Task
  }

  input CourseInput {
    name: String!
    instructor: String!
    description: String!
    missions: [MissionInput]
  }
  
  input MissionInput {
    name: String!
    description: String!
    tasks: [TaskInput]
  }
  
  input TaskInput {
    name: String!
    description: String!
    link: String
  }
`;


/***/ }),

/***/ "./src/user-resolver.ts":
/*!******************************!*\
  !*** ./src/user-resolver.ts ***!
  \******************************/
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
exports.UserResolvers = void 0;
const { unmarshall } = __webpack_require__(/*! @aws-sdk/util-dynamodb */ "@aws-sdk/util-dynamodb");
const { DynamoDBClient, ScanCommand } = __webpack_require__(/*! @aws-sdk/client-dynamodb */ "@aws-sdk/client-dynamodb");
const { environment } = __webpack_require__(/*! ./environment */ "./src/environment.ts");
const client = new DynamoDBClient({ region: "us-east-1" });
class UserResolvers {
    constructor() {
        this.getUsers = () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "Users-" + environment.stage,
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
    }
}
exports.UserResolvers = UserResolvers;


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

/***/ }),

/***/ "uid/secure":
/*!*****************************!*\
  !*** external "uid/secure" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("uid/secure");;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2Fwb2xsby1zZXJ2ZXIuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mbGlwdGVkLy4vc3JjL2NvdXJzZS1yZXNvbHZlci50cyIsIndlYnBhY2s6Ly9mbGlwdGVkLy4vc3JjL2Vudmlyb25tZW50LnRzIiwid2VicGFjazovL2ZsaXB0ZWQvLi9zcmMvbWlzc2lvbi1yZXNvbHZlci50cyIsIndlYnBhY2s6Ly9mbGlwdGVkLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly9mbGlwdGVkLy4vc3JjL3Rhc2stcmVzb2x2ZXIudHMiLCJ3ZWJwYWNrOi8vZmxpcHRlZC8uL3NyYy90eXBlLWRlZnMudHMiLCJ3ZWJwYWNrOi8vZmxpcHRlZC8uL3NyYy91c2VyLXJlc29sdmVyLnRzIiwid2VicGFjazovL2ZsaXB0ZWQvZXh0ZXJuYWwgXCJAYXdzLXNkay9jbGllbnQtZHluYW1vZGJcIiIsIndlYnBhY2s6Ly9mbGlwdGVkL2V4dGVybmFsIFwiQGF3cy1zZGsvdXRpbC1keW5hbW9kYlwiIiwid2VicGFjazovL2ZsaXB0ZWQvZXh0ZXJuYWwgXCJhcG9sbG8tc2VydmVyLWxhbWJkYVwiIiwid2VicGFjazovL2ZsaXB0ZWQvZXh0ZXJuYWwgXCJ1aWQvc2VjdXJlXCIiLCJ3ZWJwYWNrOi8vZmxpcHRlZC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mbGlwdGVkLy4vc3JjL2Fwb2xsby1zZXJ2ZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyB1bm1hcnNoYWxsIH0gPSByZXF1aXJlKFwiQGF3cy1zZGsvdXRpbC1keW5hbW9kYlwiKTtcbmNvbnN0IHsgRHluYW1vREJDbGllbnQsIFNjYW5Db21tYW5kIH0gPSByZXF1aXJlKFwiQGF3cy1zZGsvY2xpZW50LWR5bmFtb2RiXCIpO1xuY29uc3QgeyBlbnZpcm9ubWVudCB9ID0gcmVxdWlyZShcIi4vZW52aXJvbm1lbnRcIik7XG5jb25zdCBjbGllbnQgPSBuZXcgRHluYW1vREJDbGllbnQoeyByZWdpb246IFwidXMtZWFzdC0xXCIgfSk7XG5cbmV4cG9ydCBjbGFzcyBDb3Vyc2VSZXNvbHZlcnMge1xuICBnZXRDb3Vyc2VzID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIFRhYmxlTmFtZTogXCJDb3Vyc2VzLVwiICsgZW52aXJvbm1lbnQuc3RhZ2UsXG4gICAgfTtcbiAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBjbGllbnQuc2VuZChuZXcgU2NhbkNvbW1hbmQocGFyYW1zKSk7XG4gICAgICBjb25zdCBjb3Vyc2VzOiBhbnlbXSA9IFtdO1xuICAgICAgcmVzdWx0cy5JdGVtcy5mb3JFYWNoKChpdGVtIDogYW55KSA9PiB7XG4gICAgICAgIGNvdXJzZXMucHVzaCh1bm1hcnNoYWxsKGl0ZW0pKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNvdXJzZXM7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfTtcblxuICBhZGRDb3Vyc2UgPSBhc3luYyAoKSA9PiB7XG5cbiAgfVxufSIsIi8vRVhBTVBMRSBFTlZJUk9OTUVOVCBWQVJJQUJMRSBPQkpFQ1QgVVRJTElaSU5HIC5lbnYgRklMRVNcbnR5cGUgRW52aXJvbm1lbnQgPSB7XG4gICBzdGFnZTogc3RyaW5nO1xuIH07XG4gXG4gZXhwb3J0IGNvbnN0IGVudmlyb25tZW50OiBFbnZpcm9ubWVudCA9IHtcbiAgIHN0YWdlOiBwcm9jZXNzLmVudi5TVEFHRSBhcyBzdHJpbmcsXG4gfTsiLCJjb25zdCB7IHVubWFyc2hhbGwgfSA9IHJlcXVpcmUoXCJAYXdzLXNkay91dGlsLWR5bmFtb2RiXCIpO1xuY29uc3QgeyBEeW5hbW9EQkNsaWVudCwgU2NhbkNvbW1hbmQgfSA9IHJlcXVpcmUoXCJAYXdzLXNkay9jbGllbnQtZHluYW1vZGJcIik7XG5jb25zdCB7IGVudmlyb25tZW50IH0gPSByZXF1aXJlKFwiLi9lbnZpcm9ubWVudFwiKTtcbmNvbnN0IGNsaWVudCA9IG5ldyBEeW5hbW9EQkNsaWVudCh7IHJlZ2lvbjogXCJ1cy1lYXN0LTFcIiB9KTtcblxuZXhwb3J0IGNsYXNzIE1pc3Npb25SZXNvbHZlcnMge1xuICBnZXRNaXNzaW9ucyA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBUYWJsZU5hbWU6IFwiTWlzc2lvbnMtXCIgKyBlbnZpcm9ubWVudC5zdGFnZSxcbiAgICB9O1xuICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IGNsaWVudC5zZW5kKG5ldyBTY2FuQ29tbWFuZChwYXJhbXMpKTtcbiAgICAgIGNvbnN0IG1pc3Npb25zOiBhbnlbXSA9IFtdO1xuICAgICAgcmVzdWx0cy5JdGVtcy5mb3JFYWNoKChpdGVtIDogYW55KSA9PiB7XG4gICAgICAgIG1pc3Npb25zLnB1c2godW5tYXJzaGFsbChpdGVtKSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBtaXNzaW9ucztcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9O1xuXG4gIGFkZE1pc3Npb24gPSBhc3luYyAoKSA9PiB7XG5cbiAgfVxufSIsImltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBVc2VyUmVzb2x2ZXJzfSBmcm9tICcuL3VzZXItcmVzb2x2ZXInO1xuaW1wb3J0IHsgQ291cnNlUmVzb2x2ZXJzIH0gZnJvbSAnLi9jb3Vyc2UtcmVzb2x2ZXInO1xuaW1wb3J0IHsgTWlzc2lvblJlc29sdmVycyB9IGZyb20gJy4vbWlzc2lvbi1yZXNvbHZlcic7XG5pbXBvcnQgeyBUYXNrUmVzb2x2ZXJzIH0gZnJvbSAnLi90YXNrLXJlc29sdmVyJztcbmltcG9ydCB7IFRhc2tJbnB1dCB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbi8vVE9QIExFVkVMIEZJTEUgRk9SIEFMTCBRVUVSWSBSRVNPTFZFUlNcblxuLy9TRUUgVVNFUlMgUkVTT0xWRVIgRk9SIExPR0lDXG5jb25zdCB1c2VyUmVzb2x2ZXJzOiBVc2VyUmVzb2x2ZXJzID0gbmV3IFVzZXJSZXNvbHZlcnMoKTtcbmNvbnN0IGNvdXJzZVJlc29sdmVyczogQ291cnNlUmVzb2x2ZXJzID0gbmV3IENvdXJzZVJlc29sdmVycygpO1xuY29uc3QgbWlzc2lvblJlc29sdmVyczogTWlzc2lvblJlc29sdmVycyA9IG5ldyBNaXNzaW9uUmVzb2x2ZXJzKCk7XG5jb25zdCB0YXNrUmVzb2x2ZXJzOiBUYXNrUmVzb2x2ZXJzID0gbmV3IFRhc2tSZXNvbHZlcnMoKTtcblxuXG5leHBvcnQgY29uc3QgcmVzb2x2ZXJzID0ge1xuICBRdWVyeToge1xuICAgIGdldFVzZXJzOiAoKSA9PiB1c2VyUmVzb2x2ZXJzLmdldFVzZXJzKCksXG4gICAgZ2V0Q291cnNlczogKCkgPT4gY291cnNlUmVzb2x2ZXJzLmdldENvdXJzZXMoKSxcbiAgICBnZXRNaXNzaW9uczogKCkgPT4gbWlzc2lvblJlc29sdmVycy5nZXRNaXNzaW9ucygpLFxuICAgIGdldFRhc2tzOiAoKSA9PiB0YXNrUmVzb2x2ZXJzLmdldFRhc2tzKClcbiAgfSxcbiAgTXV0YXRpb246IHtcbiAgICBhZGRDb3Vyc2U6ICgpID0+IGNvdXJzZVJlc29sdmVycy5hZGRDb3Vyc2UoKSxcbiAgICBhZGRNaXNzaW9uOiAoKSA9PiBtaXNzaW9uUmVzb2x2ZXJzLmFkZE1pc3Npb24oKSxcbiAgICBhZGRUYXNrOiAoXzogYW55LCBhcmdzOiBhbnkpID0+IHRhc2tSZXNvbHZlcnMuYWRkVGFzayhhcmdzKSxcbiAgfVxufTsiLCJjb25zdCB7IHVubWFyc2hhbGwgfSA9IHJlcXVpcmUoXCJAYXdzLXNkay91dGlsLWR5bmFtb2RiXCIpO1xuY29uc3QgeyBEeW5hbW9EQkNsaWVudCwgU2NhbkNvbW1hbmQsIFB1dEl0ZW1Db21tYW5kIH0gPSByZXF1aXJlKFwiQGF3cy1zZGsvY2xpZW50LWR5bmFtb2RiXCIpO1xuY29uc3QgeyBlbnZpcm9ubWVudCB9ID0gcmVxdWlyZShcIi4vZW52aXJvbm1lbnRcIik7XG5jb25zdCBjbGllbnQgPSBuZXcgRHluYW1vREJDbGllbnQoeyByZWdpb246IFwidXMtZWFzdC0xXCIgfSk7XG5pbXBvcnQgeyBUYXNrSW5wdXQgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgdWlkIH0gZnJvbSAndWlkL3NlY3VyZSc7XG5cbmV4cG9ydCBjbGFzcyBUYXNrUmVzb2x2ZXJzIHtcbiAgZ2V0VGFza3MgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgVGFibGVOYW1lOiBcIlRhc2tzLVwiICsgZW52aXJvbm1lbnQuc3RhZ2UsXG4gICAgfTtcbiAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBjbGllbnQuc2VuZChuZXcgU2NhbkNvbW1hbmQocGFyYW1zKSk7XG4gICAgICBjb25zdCB0YXNrczogYW55W10gPSBbXTtcbiAgICAgIHJlc3VsdHMuSXRlbXMuZm9yRWFjaCgoaXRlbSA6IGFueSkgPT4ge1xuICAgICAgICB0YXNrcy5wdXNoKHVubWFyc2hhbGwoaXRlbSkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGFza3M7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfTtcblxuICBhZGRUYXNrID0gYXN5bmMgKGFyZ3M6IGFueSkgPT4ge1xuICAgY29uc3QgdGFzazogVGFza0lucHV0ID0gYXJncy50YXNrO1xuICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgVGFibGVOYW1lOiBcIlRhc2tzLVwiICsgZW52aXJvbm1lbnQuc3RhZ2UsXG4gICAgICBJdGVtOiB7XG4gICAgICAgICBcImlkXCI6IHtcbiAgICAgICAgICAgIFM6IHVpZCgpXG4gICAgICAgICB9LFxuICAgICAgICAgXCJuYW1lXCI6IHtcbiAgICAgICAgICAgIFM6IHRhc2submFtZVxuICAgICAgICAgfSxcbiAgICAgICAgIFwiZGVzY3JpcHRpb25cIjoge1xuICAgICAgICAgICAgUzogdGFzay5kZXNjcmlwdGlvblxuICAgICAgICAgfSxcbiAgICAgICAgIFwibGlua1wiOiB7XG4gICAgICAgICAgICBTOiB0YXNrLmxpbmtcbiAgICAgICAgIH1cbiAgICAgIH1cbiAgIH1cblxuICAgdHJ5IHtcbiAgICAgIGF3YWl0IGNsaWVudC5zZW5kKG5ldyBQdXRJdGVtQ29tbWFuZChwYXJhbXMpKTtcbiAgICAgIHJldHVybiB1bm1hcnNoYWxsKHBhcmFtcy5JdGVtKTtcbiAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIHJldHVybiBlcnI7XG4gICB9XG4gIH1cbn0iLCJpbXBvcnQgeyBncWwgfSBmcm9tICdhcG9sbG8tc2VydmVyLWxhbWJkYSc7XG5cbi8vVEhJUyBJUyBBTiBFWEFNUExFLiBSRU1PVkUvQUREIFRZUEVTIEFTIFlPVSBTRUUgRklUXG5leHBvcnQgY29uc3QgdHlwZURlZnMgPSBncWxgXG4gIHR5cGUgUXVlcnkge1xuICAgIGdldFVzZXJzOiBbVXNlcl1cbiAgICBnZXRDb3Vyc2VzOiBbQ291cnNlXVxuICAgIGdldE1pc3Npb25zOiBbTWlzc2lvbl1cbiAgICBnZXRUYXNrczogW1Rhc2tdXG4gIH1cblxuICB0eXBlIFVzZXIge1xuICAgIFwiXCJcIlxuICAgIEZsaXB0ZWQgVXNlciBFeGFtcGxlXG4gICAgXCJcIlwiXG4gICAgaWQ6IFN0cmluZyFcbiAgICBmaXJzdE5hbWU6IFN0cmluZyFcbiAgICBsYXN0TmFtZTogU3RyaW5nIVxuICB9XG5cbiAgdHlwZSBDb3Vyc2Uge1xuICAgIFwiXCJcIlxuICAgIENvdXJzZSBEZWZpbml0aW9uXG4gICAgXCJcIlwiXG4gICAgaWQ6IFN0cmluZyFcbiAgICBuYW1lOiBTdHJpbmchXG4gICAgaW5zdHJ1Y3RvcjogU3RyaW5nIVxuICAgIGRlc2NyaXB0aW9uOiBTdHJpbmchXG4gICAgbWlzc2lvbnM6IFtNaXNzaW9uXVxuICB9XG5cbiAgdHlwZSBNaXNzaW9uIHtcbiAgICBcIlwiXCJcbiAgICBNaXNzaW9ucyB3aXRoaW4gYSBDb3Vyc2VcbiAgICBcIlwiXCJcbiAgICBpZDogU3RyaW5nIVxuICAgIG5hbWU6IFN0cmluZyFcbiAgICBkZXNjcmlwdGlvbjogU3RyaW5nIVxuICAgIHRhc2tzOiBbVGFza11cbiAgfVxuXG4gIHR5cGUgVGFzayB7XG4gICAgXCJcIlwiXG4gICAgVGFza3Mgd2l0aGluIE1pc3Npb25zXG4gICAgXCJcIlwiXG4gICAgaWQ6IFN0cmluZyFcbiAgICBuYW1lOiBTdHJpbmchXG4gICAgZGVzY3JpcHRpb246IFN0cmluZyFcbiAgICBsaW5rOiBTdHJpbmdcbiAgfVxuXG4gIHR5cGUgTXV0YXRpb24ge1xuICAgIGFkZENvdXJzZShjb3Vyc2U6IENvdXJzZUlucHV0KTogQ291cnNlIFxuICAgIGFkZE1pc3Npb24obWlzc2lvbjogTWlzc2lvbklucHV0KTogTWlzc2lvbiBcbiAgICBhZGRUYXNrKHRhc2s6IFRhc2tJbnB1dCk6IFRhc2tcbiAgfVxuXG4gIGlucHV0IENvdXJzZUlucHV0IHtcbiAgICBuYW1lOiBTdHJpbmchXG4gICAgaW5zdHJ1Y3RvcjogU3RyaW5nIVxuICAgIGRlc2NyaXB0aW9uOiBTdHJpbmchXG4gICAgbWlzc2lvbnM6IFtNaXNzaW9uSW5wdXRdXG4gIH1cbiAgXG4gIGlucHV0IE1pc3Npb25JbnB1dCB7XG4gICAgbmFtZTogU3RyaW5nIVxuICAgIGRlc2NyaXB0aW9uOiBTdHJpbmchXG4gICAgdGFza3M6IFtUYXNrSW5wdXRdXG4gIH1cbiAgXG4gIGlucHV0IFRhc2tJbnB1dCB7XG4gICAgbmFtZTogU3RyaW5nIVxuICAgIGRlc2NyaXB0aW9uOiBTdHJpbmchXG4gICAgbGluazogU3RyaW5nXG4gIH1cbmBcbi8vRU5EIE9GIEVYQU1QTEUuIiwiY29uc3QgeyB1bm1hcnNoYWxsIH0gPSByZXF1aXJlKFwiQGF3cy1zZGsvdXRpbC1keW5hbW9kYlwiKTtcbmNvbnN0IHsgRHluYW1vREJDbGllbnQsIFNjYW5Db21tYW5kIH0gPSByZXF1aXJlKFwiQGF3cy1zZGsvY2xpZW50LWR5bmFtb2RiXCIpO1xuY29uc3QgeyBlbnZpcm9ubWVudCB9ID0gcmVxdWlyZShcIi4vZW52aXJvbm1lbnRcIik7XG5jb25zdCBjbGllbnQgPSBuZXcgRHluYW1vREJDbGllbnQoeyByZWdpb246IFwidXMtZWFzdC0xXCIgfSk7XG4vL1RISVMgSVMgVEhFIFJFU09MVkVSIEZVTkNUSU9OIEZPUiBVU0VSU1xuLy9HQVRIRVJTIElURU1TIEZST00gVVNFUlMgVEFCTEUgSU4gRFlOQU1PREJcbmV4cG9ydCBjbGFzcyBVc2VyUmVzb2x2ZXJzIHtcbiAgZ2V0VXNlcnMgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgVGFibGVOYW1lOiBcIlVzZXJzLVwiICsgZW52aXJvbm1lbnQuc3RhZ2UsXG4gICAgfTtcbiAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBjbGllbnQuc2VuZChuZXcgU2NhbkNvbW1hbmQocGFyYW1zKSk7XG4gICAgICBjb25zdCB1c2VycyA6IGFueVtdID0gW107XG4gICAgICByZXN1bHRzLkl0ZW1zLmZvckVhY2goKGl0ZW0gOiBhbnkpID0+IHtcbiAgICAgICAgdXNlcnMucHVzaCh1bm1hcnNoYWxsKGl0ZW0pKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHVzZXJzO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH07XG59XG4gLy9FTkQgT0YgVVNFUiBSRVNPTFZFUiBGVU5DVElPTiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBhd3Mtc2RrL2NsaWVudC1keW5hbW9kYlwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGF3cy1zZGsvdXRpbC1keW5hbW9kYlwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1sYW1iZGFcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVpZC9zZWN1cmVcIik7OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgQXBvbGxvU2VydmVyIH0gZnJvbSAnYXBvbGxvLXNlcnZlci1sYW1iZGEnO1xuXG5pbXBvcnQgeyByZXNvbHZlcnMgfSBmcm9tICcuL3Jlc29sdmVycyc7XG5pbXBvcnQgeyB0eXBlRGVmcyB9IGZyb20gJy4vdHlwZS1kZWZzJztcblxuY29uc3QgYXBvbGxvU2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7IFxuICAgcmVzb2x2ZXJzLCBcbiAgIHR5cGVEZWZzLCBcbiAgIHBsYXlncm91bmQ6IHsgICAgZW5kcG9pbnQ6IFwiL2Rldi9ncmFwaHFsXCIgIH0gXG59KTtcblxuZXhwb3J0cy5ncmFwaHFsSGFuZGxlciA9IGFwb2xsb1NlcnZlci5jcmVhdGVIYW5kbGVyKHtcbiAgIGNvcnM6IHtcbiAgICAgb3JpZ2luOiB0cnVlLFxuICAgICBjcmVkZW50aWFsczogdHJ1ZSxcbiAgIH0sXG4gfSk7Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUFBO0FBdEJBO0FBQ0E7QUFDQTtBOzs7Ozs7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQUE7QUF0QkE7QUFDQTtBQUNBO0E7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUEvQ0E7QUFDQTtBQUNBO0E7Ozs7Ozs7Ozs7O0FDVEE7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0VBO0FBQ0E7QUFDQTtBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQWxCQTtBQUNBO0FBQ0E7QTs7Ozs7Ozs7QUNSQTtBQUNBO0E7Ozs7Ozs7O0FDREE7QUFDQTtBOzs7Ozs7OztBQ0RBO0FBQ0E7QTs7Ozs7Ozs7QUNEQTtBQUNBO0E7Ozs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3RCQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBIiwic291cmNlUm9vdCI6IiJ9