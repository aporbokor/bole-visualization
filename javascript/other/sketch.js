const main_element = document.getElementsByTagName('main')[0];
let font;

let voters;
let to_remove_voters = [];
const min_voters = 1;
const max_voters = 1000;

let candidates;
let to_remove_candidates = [];
const min_candidates = 2;
const max_candidates = 7;

let arrows = [];

let votingmethod;
let voter_maschine;
let results;
let max_votes;

let frozen_sim = false;

let selected;
let last_selected;
let clicked_selected;
let selected_div;

let szim_gombok;
let new_envitoment_div;
let edit_enviroment_div;
let simulation_div;

let strategic_chance = 0.2;
let voter_population = 100;
let candidate_population = 3;

let vote_result_div;
let voting_results;

let strategic_chance_slider;
let voter_population_slider;
let reset_voter_color_buttton;
let candidate_population_slider;
let reset_button;
let simulate_button;

let add_voter_button;
let delete_voter_button;
let add_candidate_button;
let delete_candidate_button;

let voting_type_selector;

let tool_div;
let current_tool;
let tools = new Map([['select tool', SelectTool],
['delete tool', DeleteTool],
['voter painter', VoterPainter],
['honesty painter', HonestyPainter],
['strategy painter', StrategyPainter]]);
let tool_selector;
let tool_size;
let max_tool_size = 200;
let tool_color = 'green';
const activated_tool_stroke_weight = 5;
const inactive_tool_stroke_weight = 2;
const voter_per_pixel = 0.001;

let canvas;
WIDTH = 780;
HEIGHT = 660;

let approval_range;
const approval_range_size = 0.2;
let support_range;
const support_per_approval_range = 1;
let supporter_population;
let supporter_per_candidate;
let seems_win_percent = 1.1;
let seems_win_candidates;
let seems_lose_candidates;

const votingmethods = new Map([
  ['plurarity', PlurarityVoter],
  ['anti-plurarity', AntiPlurarityVoter],
  // ['theoretical perfect', PerfectVoter],
  ['approval voting', ApprovalVoter],
  ['borda counting', BordaCounting],
  ['supplementary vote', SupplementaryVoter],
  ['Sri Lankan Contingent vote', SriLankanContingentVoter],
  ['contingent vote', ContingentVoter],
  ['instant runof', InstantRunOffVoter],
  ['coombs', CoombsVoting],
  ['copleland', CopelandVoter],
  ['tideman', TideMan]]
);

let stepping_box;
let hide_stepping_box;
let results_and_selected_d;

const grow_speed = 1;
const selected_size_adder = 5;
const clicked_selected_size_adder = 15;
const clicked_selected_laser_color = 'rgb(0, 0, 0)'
const clicked_selected_stroke_weight = 4;

const default_stroke = 'rgb(0,0,0)'
const strategic_voter_color = 'rgb(0, 0, 0)';
const strategic_voter_stroeke_weight = 3;
const honest_voter_color = '#F18F01';
const voter_size = 15;
const voter_strokeWeight = 2;

const candidate_colors = ['#FEFCFB', '#ED3907', '#7247FF', '#162CD9', '#2BB7DE', '#BF1160', '#0FFA42'];
const candidate_size = 40;
const candidate_strokeWeight = 5;

const background_color = 0;

const selected_size = 5;

function random_voter(i) {
  return new Voter(round(random(width)), round(random(height)), random_bool(strategic_chance), honest_voter_color, 'voter#' + i);
}

function update_voter_population_slider() {
  voter_population_slider.setValue(voters.length);
}

function update_candidate_poupulation() {
  candidate_population_slider.setValue(candidates.length);
}

function add_voter() {
  if ((voters.length != max_voters) & (!(frozen_sim))) {
    voters.push(random_voter(voters.length));
    update_voter_population_slider();
  }
}

function add_voter_to_position(x, y) {
  if ((voters.length != max_voters) & (!(frozen_sim))) {
    let x_ = constrain(round(x), 0, width);
    let y_ = constrain(round(y), 0, height);

    voters.push(new Voter(x_, y_, random_bool(strategic_chance), honest_voter_color));
    update_voter_population_slider();
  }
}

function reset_voter_color() {
  for (let i = 0; i < voters.length; i++) {
    voters[i].color = honest_voter_color;
  }
}

function remove_voter() {
  if ((voters.length != min_voters) & (!(frozen_sim))) {
    delete voters[voters.length - 1].remove();
    update_voter_population_slider();
  }
}

function add_arrow(arrow) {
  arrows.push(arrow);
}

function remove_specific_voter(voter) {
  // voters = voters.filter(function(curval){return curval != voter})
  if ((voters.length - to_remove_voters.length != min_voters) & (!(frozen_sim))) {
    to_remove_voters.push(voter);
  }
}

function remove_specific_candidate(candidate) {
  // candidates = candidates.filter(function(curval){return curval != candidate})
  if ((candidates.length - to_remove_candidates != min_candidates) & (!(frozen_sim))) {
    to_remove_candidates.push(candidate);
  }
}

function random_candidate(i) {
  return new Candidate(round(random(width)), round(random(height)), rewrapp_index(candidate_colors, i), 'candidate#' + i);
}

function add_candidate() {
  if ((candidates.length != max_candidates) & (!(frozen_sim))) {
    candidates.push(random_candidate(candidates.length));
    update_candidate_poupulation();
  }
}

function remove_candidate() {
  if ((candidates.length != min_candidates) & (!(frozen_sim))) {
    candidates[candidates.length - 1].remove();
    update_candidate_poupulation();
  }
}

function remove_people() {
  if (((to_remove_candidates.length != 0) || (to_remove_voters.length != 0)) & (!(frozen_sim))) {
    candidates = inverse_filter_array_by_array(candidates, to_remove_candidates);
    voters = inverse_filter_array_by_array(voters, to_remove_voters);

    to_remove_candidates = [];
    to_remove_voters = [];

    update_voter_population_slider();
    update_candidate_poupulation();
  }
}

function delete_everything() {
  voters = [];
  candidates = [];
  arrows = [];
}

function make_voters(db) {
  // Add voters to the sim
  if (!(frozen_sim)) {
    voters = [];
    for (let i = 0; i < db; i++) {
      voters.push(random_voter(i));
    }
    update_voter_population_slider();
  }
}

function make_candidates(db) {
  // Add candidates to the sim
  if (!(frozen_sim)) {
    candidates = [];
    for (let i = 0; i < db; i++) {
      candidates.push(random_candidate(i));
    }
  }
}

function empty_function() {
  return undefined;
}

/* The extra function is a visualizatin function which runs in every frame
   By default it doesn't do anythong but this can de easily overwritten by votingmethods for example*/
let extra_function = empty_function;

let extra_varible;

function draw_everyone() {
  // Draws the voters and the candidates onto the canvas
  stroke(default_stroke);

  if (typeof selected != 'undefined') {
    selected.grow_by(selected_size_adder);
  }

  for (let i = 0; i < voters.length; i++) {
    voters[i].show();
  }

  for (i = 0; i < candidates.length; i++) {
    candidates[i].show();
  }

  for (i = 0; i < arrows.length; i++) {
    arrows[i].show();
  }

}

function draw_background() {
  // Function for drawing the background. Currently it's very simple
  background(background_color);
}

function load_clicked_selected() {
  if (typeof (clicked_selected) != 'undefined') {
    let ch = selected_div.child();
    if (ch.length != 0) {
      ch[0].remove();
    }
    selected_div.child(clicked_selected.get_div());
  }
}

function mousePressed() {
  if (is_point_inside_rect(0, 0, width, height, mouseX, mouseY)) {
    current_tool.on_click();
  }
}

function mouseDragged() {
  current_tool.on_drag();
}

function mouseReleased() {
  current_tool.on_relase();
}

function handle_elements() {
  // Update values based on inputs
  strategic_chance = strategic_chance_slider.value();
  voter_population = voter_population_slider.value();
  candidate_population = candidate_population_slider.value();
}

function reset_on_select() {
  for (let i = 0; i < voters.length; i++) {
    voters[i].on_select = empty_function;
  }

  for (let i = 0; i < candidates.length; i++) {
    candidates[i].on_select = empty_function;
  }
}

function reset_enviroment() {
  frozen_sim = false;
  delete_everything();
  reset_on_select();
  make_voters(voter_population);
  make_candidates(candidate_population);
  stepping_box.delete_content();
  stepping_box.hide_next();
}

function select_voting() {
  votingmethod = votingmethods.get(voting_type_selector.value());
  extra_function = empty_function
}

function select_tool() {
  let current_tool_class = tools.get(tool_selector.value());
  current_tool = new current_tool_class()
}

function get_results_elements(results, show_method = function (place) { return place.get_p() }) {
  // Returns the HTML element to be put into the results div

  let returned = document.createElement("ol");
  for (let i = 0; i < results.length; i++) {

    let subdiv = createDiv(int_to_serial_number(i + 1));
    subdiv.addClass('place_div')
    let places = results[i];

    for (let j = 0; j < places.length; j++) {
      subdiv.child(show_method(places[j]));
    }

    subdiv.parent(returned);
  }
  return returned;
}

function display_votes(voter_maschine) {
  // Updates the results div and resets the stepping_box content
  stepping_box.delete_content();

  vote_result_div.html('Voting results:');
  vote_result_div.child(get_results_elements(voting_results))

  voter_maschine.extra_visualize(voters);
}

function simulate_voting() {
  // Handles the voting process. Uses the selected voting_method

  reset_on_select();
  max_votes = voters.length;

  candidates.forEach((cand) => { cand.reset_text() })

  count_supporters();
  calculate_seems_win_candidates();

  voter_maschine = new votingmethod(candidates);

  voter_maschine.prepare_for_voting();

  for (let i = 0; i < voters.length; i++) {
    voter_maschine.registrate_vote(voters[i]);
  }

  voting_results = voter_maschine.count_votes()
  console.log('The voting machine:');
  console.log(voter_maschine);

  console.log('The results:');
  console.log(voting_results);

  console.log('The voters:');
  console.log(voters);

  display_votes(voter_maschine);
  voter_maschine.stepping_box_func(stepping_box);
  load_clicked_selected();
}

function preload() {
  font = loadFont("../fonts/Comfortaa-VariableFont_wght.ttf");
}

function setup() {

  canvas = createCanvas(constrain(WIDTH, 0, window.innerWidth), constrain(HEIGHT, 0, window.innerHeight), WEBGL);
  canvas.addClass('canvas');

  approval_range = Math.floor(dist(0, 0, WIDTH, HEIGHT) * approval_range_size);
  support_range = Math.floor(support_per_approval_range * approval_range);

  selected_div = select("#selected")

  stroke(default_stroke);

  szim_gombok = select('#sim_gombok');

  strategic_chance_slider = slider_with_name('strategic voter chance: ', 0, 1, strategic_chance, 0.01);
  voter_population_slider = slider_with_name('number of voters: ', min_voters, max_voters, voter_population, 1);
  candidate_population_slider = slider_with_name('number of candidates: ', min_candidates, max_candidates, candidate_population, 1);

  add_voter_button = createButton('add voter');
  add_voter_button.mousePressed(add_voter);

  reset_voter_color_buttton = createButton('reset voter colors');
  reset_voter_color_buttton.mousePressed(reset_voter_color)

  add_candidate_button = createButton('add candidate');
  add_candidate_button.mousePressed(add_candidate);

  delete_candidate_button = createButton('delete candidate');
  delete_candidate_button.mousePressed(remove_candidate);

  delete_voter_button = createButton('delete voter');
  delete_voter_button.mousePressed(remove_voter);

  reset_button = createButton('reset enviroment');
  reset_button.mousePressed(reset_enviroment);

  voting_type_selector = createSelect();

  for (const x of votingmethods.entries()) {
    voting_type_selector.option(x[0]);
  }

  voting_type_selector.changed(select_voting);
  select_voting();

  tool_selector = createSelect();
  for (const x of tools.entries()) {
    tool_selector.option(x[0]);
  }

  tool_selector.changed(select_tool);
  select_tool();

  tool_size = slider_with_name('tool size: ', 0, max_tool_size, 0, 1);

  simulate_button = createButton('simulate');
  simulate_button.mousePressed(simulate_voting);
  simulate_button.addClass('simulate_button');

  new_envitoment_div = select('#new_environment_div');

  edit_enviroment_div = select('#edit_enviroment_div');

  szimulation_div = select('#szimulation_div');

  tool_div = select('#tool_div');

  new_envitoment_div.child(strategic_chance_slider);
  new_envitoment_div.child(voter_population_slider);
  new_envitoment_div.child(candidate_population_slider);
  new_envitoment_div.child(reset_button);

  edit_enviroment_div.child(add_voter_button);
  edit_enviroment_div.child(reset_voter_color_buttton);
  edit_enviroment_div.child(add_candidate_button);
  edit_enviroment_div.child(delete_candidate_button);
  edit_enviroment_div.child(delete_voter_button);

  szimulation_div.child(document.createElement('br'))
  szimulation_div.child(voting_type_selector);
  szimulation_div.child(simulate_button);

  tool_div.child(document.createElement('br'))
  tool_div.child(tool_selector);
  tool_div.child(tool_size);

  szim_gombok.child(new_envitoment_div);
  szim_gombok.child(edit_enviroment_div);
  szim_gombok.child(szimulation_div);
  szim_gombok.child(tool_div);

  vote_result_div = select('#vote_results');

  results_and_selected_d = select('#results-and-selected-div');
  results_and_selected_d.child(selected_div);
  results_and_selected_d.child(vote_result_div);

  szim_gombok.parent(main_element);
  results_and_selected_d.parent(main_element);

  make_voters(voter_population);
  make_candidates(candidate_population);

  stepping_box = new SteppingBox();
}

function draw() {
  // Runs at every frame
  translate(-width / 2, -height / 2)

  // Order here is important
  remove_people();
  draw_background();
  extra_function();
  current_tool.draw();
  draw_everyone();


  handle_elements();
}
