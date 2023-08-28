const joshScore = [
  157,
  132,
  139,
  125,
  193,
  133,
  83,
  91,
  150,
  114,
  130,
  162,
  150,
  84,
  122,
  78,
  98,
  75,
];

const timScore = [
  155,
  139,
  88,
  154,
  191,
  139,
  135,
  145,
  148,
  139,
  114,
  155,
  111,
  157,
  148,
  163,
  84,
  92,
];

const matthewScore = [
  127,
  98,
  101,
  110,
  78,
  100,
  86,
  199,
  71,
  61,
  115,
  134,
  149,
  143,
  116,
  143,
  105,
  100  ,
];

const dadScore = [
  148,
  112,
  106,
  150,
  130,
  114,
  126,
  135,
  178,
  133,
  131,
  119,
  108,
  102,
  136,
  106,
  71,
  97,
];

enum Teams {
  Josh = 'Josh',
  Tim = 'Tim',
  Matthew = 'Matthew',
  Dad = 'Dad',
}

const scores = {
  [Teams.Josh]: joshScore,
  [Teams.Tim]: timScore,
  [Teams.Matthew]: matthewScore,
  [Teams.Dad]: dadScore,
};

const orders = [];

const genOrders = (curOrder: number[]) => {
  if (curOrder.length === 3) orders.push(curOrder);
  const teamSet = new Set([0,1,2]);
  curOrder.forEach(x => teamSet.delete(x));
  teamSet.forEach(team => {
    genOrders([...curOrder, team]);
  });
};

genOrders([]);

const matches = [
  [[Teams.Josh,Teams.Tim], [Teams.Matthew,Teams.Dad]],
  [[Teams.Josh,Teams.Matthew], [Teams.Tim,Teams.Dad]],
  [[Teams.Josh,Teams.Dad], [Teams.Tim,Teams.Matthew]],
];

const regularSeason = (order: number[]) => {
  const wins = {
    [Teams.Josh]: 0,
    [Teams.Tim]: 0,
    [Teams.Matthew]: 0,
    [Teams.Dad]: 0,
  };
  for (let week = 0; week < 14; week++) {
    const [match1, match2] = matches[order[week % 3]];
    const winningTeam1 = scores[match1[0]][week] > scores[match1[1]][week] ? match1[0] : match1[1];
    const winningTeam2 = scores[match2[0]][week] > scores[match2[1]][week] ? match2[0] : match2[1];
    wins[winningTeam1]++;
    wins[winningTeam2]++;
  }
  return wins;
};

const pointsFor = Object.entries(scores).reduce((agg, [team, score]) => {
  agg[team] = score.slice(0, 14).reduce((sum, s) => sum + s, 0);
  return agg;
}, {});

const playoffs = (regularSeasonWins: Record<Teams, number>) => {
  const rankings = Object.keys(Teams).sort((a, b) => {
    return regularSeasonWins[a] > regularSeasonWins[b] ? -1 : regularSeasonWins[a] < regularSeasonWins[b] ? 1 : pointsFor[a] > pointsFor[b] ? -1 : 1;
  });
  const round1Rankings1 = (scores[rankings[0]][14] + scores[rankings[0]][15]) > (scores[rankings[3]][14] + scores[rankings[3]][15]) ? [rankings[0], rankings[3]] : [rankings[3], rankings[0]];
  const round1Rankings2 = (scores[rankings[1]][14] + scores[rankings[1]][15]) > (scores[rankings[2]][14] + scores[rankings[2]][15]) ? [rankings[1], rankings[2]] : [rankings[2], rankings[1]];
  const round2Rankings1 = (scores[round1Rankings1[0]][16] + scores[round1Rankings1[0]][17]) > (scores[round1Rankings2[0]][16] + scores[round1Rankings2[0]][17]) ? [round1Rankings1[0], round1Rankings2[0]] : [round1Rankings2[0], round1Rankings1[0]];
  const round2Rankings2 = (scores[round1Rankings1[1]][16] + scores[round1Rankings1[1]][17]) > (scores[round1Rankings2[1]][16] + scores[round1Rankings2[1]][17]) ? [round1Rankings1[1], round1Rankings2[1]] : [round1Rankings2[1], round1Rankings1[1]];
  return [...round2Rankings1, ...round2Rankings2];
};

for (let i = 0; i < orders.length; i++) {
  const wins = regularSeason(orders[i]);
  const rankings = playoffs(wins);
  console.log(orders[i], wins, rankings);
}
