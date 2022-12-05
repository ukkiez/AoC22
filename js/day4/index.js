const InputParser = require( "../InputParser.js" );

const main = async () => {
  let answer1 = 0;
  let answer2 = 0;

  const parser = await InputParser.init( __dirname, "./input.txt" );

  parser.iterateLines( function( line ) {
    if ( !line ) return;

    const [ a, b, c, d ] = line.match( /\d+/g ).map( Number );

    let boolA = false;
    let boolB = false;
    if ( a >= c ) {
      if ( b <= d ) {
        boolA = true;
        answer1++;
      }
      if ( a <= d ) {
        boolB = true;
        answer2++;
      }
    }

    if ( ( !boolA ) && c >= a ) {
      if ( d <= b ) {
        answer1++;
      }

      if ( !boolB && c <= b ) {
        answer2++;
      }
    }
  } );

  return { answer1, answer2 };
}

main().then( result => {
  console.log( result );
} );
