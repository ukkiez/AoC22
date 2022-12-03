const InputParser = require( "../InputParser.js" );

const main = async () => {
  const parser = await InputParser.init( __dirname, "./input.txt" );

  let answer = 0;
  let answer2 = 0;
  parser.iterateLines( function( line ) {
    if ( !line ) {
      return;
    }

    const indexes = { A: 0, B: 1, C: 2, X: 0, Y: 1, Z: 2 };

    // part 1
    function getScore( a, b ) {
      a = indexes[ a ];
      b = indexes[ b ];
      return ( b + 1 ) + 3 * ( ( ( b - a ) + 4 ) % 3 );
    }

    const [ a, b ] = line.split( /\s/ );
    answer += getScore( a, b );

    // part 2
    function getScore2( a, b ) {
      a = indexes[ a ];
      b = indexes[ b ];
      return ( b * 3 + ( a + b + 2 ) % 3 + 1 );
    }

    answer2 += getScore2( a, b );
  } );

  return {
    answer,
    answer2,
  }
}

main().then( result => {
  console.log( result );
} );
