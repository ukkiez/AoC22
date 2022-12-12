const InputParser = require( "../InputParser.js" );

const isPassable = ( curElevation, elevation ) => elevation && ( curElevation - elevation <= 1 );

const main = async () => {
  const parser = await InputParser.init( __dirname, "./input.txt" );

  const grid = [];
  parser.iterateLines( ( line ) => {
    if ( !line ) return;
    const arr = [ ...line ].map( char => {
      if ( char === "S" ) {
        return 1;
      }
      else if ( char === "E" ) {
        return 27;
      }
      else {
        return char.charCodeAt( 0 ) - 96;
      }
    } );
    grid.push( [ ...arr ] );
  } );

  const getNeighbours = ( curElevation, row, col ) => {
    const _neighbours = [];
    for ( const [ y, x ] of [ [ -1, 0 ], [ 1, 0 ], [ 0, -1 ], [ 0, 1 ] ] ) {
      if ( isPassable( curElevation, grid[ row+y ]?.[ col+x ] ) ) {
        _neighbours.push( { elevation: grid[ row+y ][ col+x ], row: row+y, column: col+x } );
      }
    }
    return _neighbours;
  }

  const visited = [];
  for ( let i = 0; i < grid.length; i++ ) {
    visited.push( [] );
  }
  const queue = [];
  // find the start and end positions
  for ( let row = 0; row < grid.length; row++ ) {
    if ( grid[ row ].includes( 27 ) ) {
      const column = grid[ row ].findIndex( c => c === 27 );
      queue.push( { elevation: 27, steps: 0, row, column } );
    }
  }

  let answer2 = 0;
  while ( true ) { // eslint-disable-line no-constant-condition
    if ( !queue.length ) {
      break;
    }

    const { elevation, steps, row, column } = queue.shift();
    if ( visited[ row ][ column ] ) {
      continue;
    }
    visited[ row ][ column ] = true;

    if ( grid[ row ][ column ] === 1 ) {
      answer2 = steps;
      break;
    }

    const neighbours = getNeighbours( elevation, row, column );
    for ( const neighbour of neighbours ) {
      queue.push( { ...neighbour, steps: steps+1 } );
    }
  }

  return { answer2 };
}

main().then( result => {
  console.log( result );
} );
