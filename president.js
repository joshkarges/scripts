const request = require('request');
const _ = require('lodash');

const pj = (obj) => console.log(JSON.stringify(obj, null, 2));

request('https://static01.nyt.com/elections-assets/2020/data/api/2020-11-03/votes-remaining-page/national/president.json', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    const data = JSON.parse(body);
    const allCounties = _.flatMap(data.data.races, (r) => r.counties.map(c => ({ ...c, state: r.state_id, diff: _.get(c.results, 'trumpd', 0) - _.get(c.results, 'bidenj', 0) })));
    const republicanCounties = _.filter(allCounties, { leader_party_id: 'republican' });
    // const sortedCounties = _.orderBy(republicanCounties, (c) => c.tot_exp_vote || c.votes || undefined, 'desc');
    const sortedCounties = _.orderBy(allCounties, 'diff', 'desc');
    pj(sortedCounties.slice(0, 20).map(({ name, tot_exp_vote, state, margin2020, diff }) => ({ name, tot_exp_vote, state, margin2020, diff })));
    pj(_.find(sortedCounties, { name: "Suffolk" }));
  }
  else {
    console.log("Error " + response.statusCode)
  }
})