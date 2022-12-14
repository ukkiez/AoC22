const InputParser = require( "../InputParser.js" );

const main = async () => {
  const parser = await InputParser.init( __dirname, "./input.txt", false, true );

  let pairsInRightOrder = [];
  let index = 1;

  const compare = ( l, r ) => {
    if ( r === undefined ) {
      return -1;
    }
    else if ( r && l === undefined ) {
      return 1;
    }

    if ( Array.isArray( l ) && Array.isArray( r ) ) {
      let outcome = 0;
      for ( let j = 0; j < l.length; j++ ) {
        // both values arrays
        outcome = compare( l[ j ], r[ j ] );
        if ( outcome !== 0 ) {
          return outcome;
        }
      }
      if ( l.length < r.length ) {
        return 1;
      }
      else if ( r.length < l.length ) {
        return -1;
      }
      return outcome;
    }
    else if ( !Array.isArray( l ) && !Array.isArray( r ) ) {
      // both values integers
      if ( l > r ) {
        return -1;
      }
      else if ( l < r ) {
        return 1;
      }
      else {
        return 0;
      }
    }
    else {
      // one value is integer, other is array
      if ( !Array.isArray( l ) ) {
        l = [ l ];
      }
      else {
        r = [ r ];
      }
      return compare( l, r );
    }
  }

  parser.iterateGroups( ( group ) => {
    let [ left, right ] = group;
    left = JSON.parse( left );
    right = JSON.parse( right );
    let outcome = 0;
    for ( let i = 0; i < left.length; i++ ) {
      const el = left[ i ];
      const er = right[ i ];
      outcome = compare( el, er );
      if ( outcome === 1 || outcome === -1 ) {
        break;
      }
    }
    if ( outcome === 0 ) {
      if ( right.length ) {
        outcome = 1;
      }
    }

    if ( outcome === 1 ) {
      pairsInRightOrder.push( index );
    }

    index++;
  } );

  return { answer1: pairsInRightOrder.reduce( ( a, b ) => a+b ) };
}

console.time( "t" );
main().then( result => {
  console.timeEnd( "t" );
  console.log( result );
} );
