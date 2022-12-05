const InputParser = require( "../InputParser.js" );

const main = async () => {
  let answer1 = "";
  let answer2 = "";

  const { lines } = await InputParser.init( __dirname, "./input.txt" );

  // get the initial arrangement, from bottom to top (find the bottom by the
  // empty new line)
  const index = lines.findIndex( e => !e );
  const stacks = new Map();
  const stacksNumber = parseInt( lines[ index-1 ].match( /\d+$/ )[ 0 ], 10 )
  for ( let i = 0; i < stacksNumber; i++ ) {
    stacks.set( i, [] );
  }

  let i = index-2;
  while ( i >= 0 ) {
    const chars = [ ...lines[ i ] ];
    for ( let l = 0; l < chars.length; l++ ) {
      if ( chars[ l ] === " " ) {
        continue;
      }

      if ( chars[ l ] === "[" ) {
        const stackIndex = ( l / 4 );
        stacks.get( stackIndex ).push( chars[ l+1 ] );
        l++;
      }
    }

    i--;
  }

  // deep clone the existing map
  const stacks2 = new Map( JSON.parse(
    JSON.stringify( Array.from( stacks ) )
  ) );

  for ( let i = index+1; i < lines.length-1; i++ ) {
    const [ number, from, to ] = lines[ i ].match( /\d+/g ).map( Number );
    // part 1
    const crates1 = stacks.get( from-1 ).splice( -number, number );
    stacks.set( to-1, stacks.get( to-1 ).concat( crates1.reverse() ) );


    // part 2
    const crates2 = stacks2.get( from-1 ).splice( -number, number );
    stacks2.set( to-1, stacks2.get( to-1 ).concat( crates2 ) );
  }

  for ( const value of stacks.values() ) {
    answer1 += value[ value.length-1 ];
  }
  for ( const value of stacks2.values() ) {
    answer2 += value[ value.length-1 ];
  }

  return { answer1, answer2 };
}

main().then( result => {
  console.log( result );
} );
