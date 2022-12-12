
const InputParser = require( "../InputParser.js" );

const isPassable = ( curElevation, elevation ) => ( elevation - curElevation < 2 );

const main = async () => {
  const parser = await InputParser.init( __dirname, "./input.txt" );

  const grid = [];
  parser.iterateLines( ( line ) => {
    if ( !line ) return;
    const arr = [ ...line ].map( char => {
      if ( char === "S" ) {
        return 0;
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
    let up = grid[ row-1 ]?.[ col ];
    let down = grid[ row+1 ]?.[ col ];
    let left = grid[ row ][ col-1 ];
    let right = grid[ row ][ col+1 ];
    const _neighbours = [];
    if ( isPassable( curElevation, up ) ) {
      _neighbours.push( { elevation: up, row: row-1, column: col } );
    }
    if ( isPassable( curElevation, down ) ) {
      _neighbours.push( { elevation: down, row: row+1, column: col } );
    }
    if ( isPassable( curElevation, left ) ) {
      _neighbours.push( { elevation: left, row: row, column: col-1 } );
    }
    if ( isPassable( curElevation, right ) ) {
      _neighbours.push( { elevation: right, row: row, column: col+1 } );
    }
    return _neighbours;
  }

  let end;
  const visited = [];
  for ( let i = 0; i < grid.length; i++ ) {
    visited.push( [] );
  }
  const queue = [];
  // find the start and end positions
  for ( let row = 0; row < grid.length; row++ ) {
    if ( grid[ row ].includes( 0 ) ) {
      const column = grid[ row ].findIndex( c => c === 0 );
      queue.push( { elevation: 0, steps: 0, row, column } );
    }
    if ( grid[ row ].includes( 27 ) ) {
      end = { row, column: grid[ row ].findIndex( c => c === 27 ) };
    }
  }

  let answer1 = 0;
  while ( true ) { // eslint-disable-line no-constant-condition
    if ( !queue.length ) {
      console.log( "--- EMPTY QUEUE ---" );
      break;
    }

    const { elevation, steps, row, column } = queue.shift();
    if ( visited[ row ][ column ] ) {
      continue;
    }
    visited[ row ][ column ] = true;

    if ( end.row === row && end.column === column ) {
      answer1 = steps;
      break;
    }

    const neighbours = getNeighbours( elevation, row, column );
    for ( const neighbour of neighbours ) {
      queue.push( { ...neighbour, steps: steps+1 } );
    }
  }

  return { answer1 };
}

main().then( result => {
  console.log( result );
} );