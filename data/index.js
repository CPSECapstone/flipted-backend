const superagent = require("superagent");
const END_POINT = "http://localhost:3000/dev/graphql";

module.exports = function sendRequest(payload) {
   superagent
      .post(END_POINT)
      .send(payload)
      .set("accept", "json")
      .end((err, res) => {
         if (err) {
            console.log(err);
         } else {
            console.dir(res.body.data, { depth: null, colors: true });
         }
      });
};

// const missionPayloads = require("./missions");
// missionPayloads.forEach(sendRequest);

// const learningObjectivesPayloads = require("./learningObjectives");
// learningObjectivesPayloads.forEach(sendRequest);

// const subMissionPayloads = require("./subMissions");
// subMissionPayloads.forEach(sendRequest);

// const taskPayloads = require("./tasks");
// taskPayloads.forEach(sendRequest);

// const questionPayloads = require("./multipleChoiceQuestions");
// questionPayloads.forEach(sendRequest);

// const frQuestionPayloads = require("./freeResponseQuestions");
// frQuestionPayloads.forEach(sendRequest);
