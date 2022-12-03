const InputParser = require( "../InputParser.js" );

const main = async () => {
  let answer1 = 0;
  let answer2 = 0;

  const parser = await InputParser.init( __dirname, "./input.txt" );

  const getScore = function( char ) {
    let codeOffset = -96;
    let priorityOffset = 0;
    if ( /[A-Z]/.test( char ) ) {
      codeOffset = -64;
      priorityOffset = 26;
    }

    return char.charCodeAt( 0 ) + codeOffset + priorityOffset;
  }

  let index = 0;
  let group = [];
  parser.iterateLines( function( line ) {
    if ( line ) {
      // part 1
      const firstHalf = new Set( line.substring( 0, line.length / 2 ) );
      const secondHalf = new Set( line.substring( line.length / 2, line.length ) );
      for ( const char of firstHalf ) {
        if ( secondHalf.has( char ) ) {
          answer1 += getScore( char );
          break;
        }
      }
    }

    // part 2
    if ( index > 2 ) {
      let sharedChar = "";
      const set = group[ 0 ];
      for ( const char of set ) {
        if ( group[ 1 ].has( char ) && group[ 2 ].has( char ) ) {
          sharedChar = char;
        }
      }

      answer2 += ( getScore( sharedChar ) );
      group = [];
      index = 0;
    }

    group.push( new Set( line ) );
    index++;
  } );

  return { answer1, answer2 };
}

main().then( result => {
  console.log( result );
} );
