import fs from 'fs';

 const data = fs.readFileSync("./src/data/policy_first.policy", "utf-8");
 const policy : Record<string, number>= JSON.parse(data);

 export default policy;