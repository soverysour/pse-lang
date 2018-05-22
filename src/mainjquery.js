const Pse = require('./pse.js');

var p = undefined;
$(document).ready(function(){
  $("#btn_load").click(loadFunc);
  $("#btn_step").click(stepFunc);
  $("#btn_complete").click(completeFunc);
  $("#btn_state").click(stateFunc);
});

function loadFunc(){
  p = undefined;

  let program = $("#program_data").val();
  let input = $("#program_input").val();
  let temp = new Pse(program, input);

  $("#program_log").val('');
  $("#program_info").text('');
  
  let errors = temp.getErrors();
  if ( errors )
  {
    $("#program_log").val(errors.join('\n'));
    $("#program_info").text('The program couldn\'t be loaded.!');
    return;
  }

  $("#program_log").val('Beginning of execution.');
  $("#program_info").text('The program was loaded successfully!');

  p = temp;
}
function stepFunc(){
  if ( p === undefined )
  {
    $("#program_info").text("Cannot run an inexistent program!");
    return;
  }

  if ( p.isDone() )
  {
    $("#program_info").text("Cannot step in a finished algorithm!");
    return;
  }

  let output = p.step();
  if ( output )
  {
    $("#program_log").val($("#program_log").val() + '\n' + output.msg);
    
    if ( output.err )
      $("#program_info").text("Died at line " + p.line() + ".");
    else if ( !p.isDone() )
      $("#program_info").text("Currently at line " + p.line() + ".");
    else
      $("#program_info").text("The program has finished executing.");
  }
}
function completeFunc(){
  if ( p === undefined )
  {
    $("#program_info").text("Cannot complete an inexistent algorithm!");
    return;
  }

  while ( !p.isDone() )
    stepFunc();
}
function stateFunc(){
  if ( p === undefined )
  {
    $("#program_info").text("Cannot get the state of an inexistent algorithm!");
    return;
  }

  $("#program_log").val($("#program_log").val() + '\n' + JSON.stringify(p.getState(), null, 2));
}
