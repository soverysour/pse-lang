const Pse = require('./pse.js');

var fs = require('fs');
fs.readFile('../test/test.pse', 'utf8', function(e, data){
  if ( e ) throw e;
  let p = new Pse(data, "3 12 16 45");

  let errors = p.getErrors();
  if ( errors )
  {
    for ( let i = 0; i < errors.length; i++ )
      console.log(errors[i]);
    return;
  }

  p.complete();

  //let line = p.line();
  //console.log(line);

  let state = p.getState();
  //console.log(state);

  let cpp = p.getCpp();
  //console.log(cpp);
});
