const InputParser = require( "../InputParser.js" );

const isPassable = ( curElevation, elevation ) => elevation && ( elevation - curElevation < 2 );

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

  const traverse = ( startingRow, startingColumn ) => {
    const getNeighbours = ( curElevation, row, col ) => {
      const _neighbours = [];
      for ( const [ y, x ] of [ [ -1, 0 ], [ 1, 0 ], [ 0, -1 ], [ 0, 1 ] ] ) {
        if ( isPassable( curElevation, grid[ row+y ]?.[ col+x ] ) ) {
          _neighbours.push( { elevation: grid[ row+y ][ col+x ], row: row+y, column: col+x } );
        }
      }
      return _neighbours;
    }

    let end;
    const visited = [];
    for ( let i = 0; i < grid.length; i++ ) {
      visited.push( [] );
    }
    const queue = [];
    // end position
    for ( let row = 0; row < grid.length; row++ ) {
      if ( grid[ row ].includes( 27 ) ) {
        end = { row, column: grid[ row ].findIndex( c => c === 27 ) };
      }
    }
    queue.push( { elevation: 1, steps: 0, row: startingRow, column: startingColumn } );

    while ( true ) { // eslint-disable-line no-constant-condition
      if ( !queue.length ) {
        break;
      }

      const { elevation, steps, row, column } = queue.shift();
      if ( visited[ row ][ column ] ) {
        continue;
      }
      visited[ row ][ column ] = true;

      if ( end.row === row && end.column === column ) {
        return steps;
      }

      const neighbours = getNeighbours( elevation, row, column );
      for ( const neighbour of neighbours ) {
        queue.push( { ...neighbour, steps: steps+1 } );
      }
    }
  }

  const startingPositions = [];
  for ( let row = 0; row < grid.length; row++ ) {
    for ( let col = 0; col < grid[ row ].length; col++ ) {
      if ( grid[ row ][ col ] === 1 ) {
        startingPositions.push( { row, col } );
      }
    }
  }

  const results = new Set();
  for ( const { row, col } of startingPositions ) {
    const steps = traverse( row, col );
    results.add( steps );
  }

  const answer2 = Array.from( results.values() ).reduce( ( previousValue, currentValue ) => {
    if ( currentValue > previousValue ) {
      return previousValue;
    }
    return currentValue;
  }, undefined );

  return { answer2 };
}

main().then( result => {
  console.log( result );
} );
