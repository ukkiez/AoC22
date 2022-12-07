const InputParser = require( "../InputParser.js" );

const main = async () => {
  let answer1 = 0;
  let answer2 = 0;

  const parser = await InputParser.init( __dirname, "./input.txt" );

  const arr = [];
  const arr2 = [];
  parser.iterateLines( ( line ) => {
    if ( !line ) {
      return;
    }
    const chars = [ ...line ];
    for ( let i = 0; i < chars.length; i++ ) {
      arr.push( chars[ i ] );
      if ( arr.length > 4 ) {
        arr.splice( 0, 1 );
      }
      if ( arr.length === 4 && ( new Set( arr ).size === arr.length ) ) {
        answer1 = i+1;
        return;
      }
    }
  } );

  parser.iterateLines( ( line ) => {
    if ( !line ) {
      return;
    }
    const chars = [ ...line ];
    for ( let i = 0; i < chars.length; i++ ) {
      arr2.push( chars[ i ] );
      if ( arr2.length > 14 ) {
        arr2.splice( 0, 1 );
      }
      if ( arr2.length === 14 && ( new Set( arr2 ).size === arr2.length ) ) {
        answer2 = i+1;
        return;
      }
    }
  } );


  return { answer1, answer2 };
}

main().then( result => {
  console.log( result );
} );
