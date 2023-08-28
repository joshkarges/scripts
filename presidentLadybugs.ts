type State = { votes: number, prob: number };

const winPres = (states: State[]) => {
  let totalVotes = 0;
  let probByVotes: Record<number, number> = { 0: 1.0 }; // Start with 100% chance to have 0 votes.
  for (const state of states) {
    totalVotes += state.votes;
    const newProbByVotes: Record<number, number> = {};
    for (const votes in probByVotes) {
      const losVotes = votes;
      const winVotes = +votes + state.votes;
      newProbByVotes[losVotes] = (newProbByVotes[losVotes] || 0) + (1 - state.prob) * probByVotes[votes]; // lose state
      newProbByVotes[winVotes] = (newProbByVotes[winVotes] || 0) + state.prob * probByVotes[votes]; // win state
      // {0: 0.8, 1: 0.2} - state(1, 0.2)
      // {0: 0.56, 1: 0.24 + 0.14, 2: 0.06} - state(1, 0.3)
      // {0: 0.28, 1: 0.19, 2: 0.28 + 0.03, 3: 0.19, 4: 0.03} - state(2, 0.5)
      // {0: 0.168, 1: 0.114, 2: 0.186, 3: 0.112 + 0.114, 4: 0.076 + 0.018, 5: 0.124, 6: 0.076, 7: 0.012} - state(3, 0.4)
    }
    console.log(newProbByVotes);
    probByVotes = newProbByVotes;
  }
  // Sum up probabilities with ≥270 votes.
  let probWin = 0;
  const majorityVoteThreshold = (Math.floor(totalVotes / 2) + 1);
  for (const votes in probByVotes) {
    if (+votes >= majorityVoteThreshold) {
      probWin += probByVotes[votes];
    }
  }
  return probWin;
};

console.log(winPres([{ votes: 1, prob: 0.3 }, { votes: 1, prob: 0.5 }, { votes: 1, prob: 0.4 }, { votes: 1, prob: 0.2 }]));