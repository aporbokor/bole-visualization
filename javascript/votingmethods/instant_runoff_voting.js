class InstantRunOffVoter extends RunoffLike{

  constructor(candidates){
    super(candidates);
    this.explaining_text = 'Now we are going to run the election counting the best-ranked not-elliminated candidates of each voters preference-list.';
  }

  elliminate_canidates(sub_votes, elliminated){
    console.log(sub_votes);
    let mins = sub_votes.mins();
    return mins;
  }

  get_reasoning_text(elliminated_candidates){
    let votes = Array.from(elliminated_candidates.entries())[0][1].sub_votes_for_visualization[0][0];
    return createP(`The elliminated candidates in this votecounting had the fewest votes. In the first place. They all had ${votes}`);
  }
}
