const InputParser = require( "../InputParser.js" );

const main = async () => {
  const parser = await InputParser.init( __dirname, "./input.txt", false, true );

  const packets = [];
  parser.iterateLines( line => {
    if ( !line ) return;
    packets.push( eval( line ) );
  } );
  // add "divider packets"
  packets.push( [ [2] ] );
  packets.push( [ [6] ] );

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

  packets.sort( ( left, right ) => {
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

    return -outcome;
  } );

  const packet1Index = packets.findIndex( packet => {
    return packet.length === 1 && packet[ 0 ]?.[ 0 ] === 2;
  } ) + 1;
  const packet2Index = packets.findIndex( packet => {
    return packet.length === 1 && packet[ 0 ]?.[ 0 ] === 6;
  } ) + 1;

  return { answer2: packet1Index * packet2Index };
}

console.time( "t" );
main().then( result => {
  console.timeEnd( "t" );
  console.log( result );
} );
