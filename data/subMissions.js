const superagent = require("superagent");
const data = require("./subMissions.json");

const END_POINT = "http://localhost:3000/dev/graphql";

function generatePayload(subMission) {
   let query = `
    mutation {
      addSubMission(
        subMission: {
          missionId: "${subMission.missionId}",
          objectiveId: "${subMission.objectiveId}",
          name: "${subMission.name}"
          description: "${subMission.description}"
        }
      )
    }
  `;

   const payload = {
      operationName: null,
      query,
      variables: {}
   };

   return payload;
}

module.exports = data.subMissions.map(generatePayload);
