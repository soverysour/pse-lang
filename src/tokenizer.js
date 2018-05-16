let wordstart = /^[a-zA-Z]$/g;
let wordbody  = /^[a-zA-Z0-9]$/g;
let symbol    = /^[><)(!=,:*\/%+^-]$/g;
let digit     = /^[0-9]$/g;
let quotes    = /^("|')$/g;
let whitespace= /^\s$/g;

let keywords = ["algorithm", "for", "while", "do", "until", "if", "else", "done", "as", "integer", "boolean", "show", "read", "return", "program", "and", "or", "not", "xor"];
let booleans = ["true", "false"];
let duochars = ["<-", ">=", "<=", "!="];
let unochars = ["-", "+", "/", "%", "*", "<", ">", "=", "(", ")", ":", ","];

// Takes an array of strings and returns an array of arrays of tokens {type:x, value?:y}.
class Tokenizer {
  constructor(lines)
  {
    this.lines = [];
    this.errors = [];
    for ( var i = 0; i < lines.length; i++ )
      this.parseLine(lines[i], i);
  }

  parseLine(line, index)
  {
    var current = 0;
    var end = line.length;
    var tokens = [];

    while ( current < end )
    {
      // Parse keyword / variable
      if ( line.charAt(current).match(wordstart) )
      {
        let start = current;
        current++;

        while ( line.charAt(current).match(wordbody) )
          current++;
    
        let name = line.substr(start, current - start);

        if ( keywords.indexOf(name) !== -1 )
          tokens.push({type:'keyword', value:name});
        else if ( booleans.indexOf(name) !== -1 )
          tokens.push({type:'boolean', value:( name === 'true' )});
        else
          tokens.push({type:'variable', value:name});
      }
      // Parse grammar
      else if ( line.charAt(current).match(symbol) )
      {
        let uno = line.charAt(current);
        let duo = line.substr(current, 2);

        if ( duochars.indexOf(duo) !== -1 )
        {
          tokens.push({type:duo});
          current += 2;
        }
        else if ( unochars.indexOf(uno) !== -1 )
        {
          tokens.push({type:uno});
          current++;
        }
        else
        {
          this.errors.push("Couldn't parse symbol '" + line.charAt(current) + "' at position " + current + " in line " + index + ".");
          current++;
        }
      }
      // Parse integer literal
      else if ( line.charAt(current).match(digit) )
      {
        let start = current;
        current++;
        while ( line.charAt(current).match(digit) )
          current++;

        tokens.push({type:'integer', value:parseInt(line.substr(start, current - start))});
      }
      // Parse string literal
      else if ( line.charAt(current).match(quotes) )
      {
        let start = current;
        current++;
        while ( line.charAt(current) !== line.charAt(start) )
        {
          if ( current === end )
          {
            this.errors.push("Couldn't finish string literal started at line " + index + ' and position ' + current + '.');
            return;
          }
          current++;
        }

        tokens.push({type:'string', value:line.substr(start + 1, current - start - 1)});
        current++;
      }
      else if ( line.charAt(current).match(whitespace) )
        current++;
      else 
      {
        this.errors.push("Couldn't parse character '" + line.charAt(current) + "' at position " + current + " in line " + index + ".");
        return;
      }
    } // end while

    this.lines.push(tokens);
  } // end function
} // end class

module.exports = Tokenizer;
