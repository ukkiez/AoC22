const InputParser = require( "../InputParser.js" );

const main = async () => {
  const parser = await InputParser.init( __dirname, "./input.txt" );

  const startingSymbol = "+";
  const sandSymbol = "o";
  const rockSymbol = "#";
  const airSymbol = ".";

  const grid = new Map();
  let xMax = 0;
  let yMax = 0;
  parser.iterateLines( line => {
    if ( !line ) return;

    const split = line.split( " -> " );
    for ( const coords of split ) {
      const [ x, y ] = coords.split( "," ).map( Number );
      xMax = Math.max( xMax, x );
      yMax = Math.max( yMax, y );
    }
  } );

  // construct the grid, where we also add some extra columns just in case
  for ( let y = 0; y <= yMax; y++ ) {
    grid.set( y, new Map() );
    for ( let x = 0; x <= xMax + 100; x++ ) {
      grid.get( y ).set( x, airSymbol );
    }
  }

  // add two layers underneath, for part 2
  for ( let y = yMax; y <= yMax + 2; y++ ) {
    grid.set( y, new Map() );
    for ( let x = 0; x <= xMax + 100; x++ ) {
      if ( y >= yMax + 2 ) {
        grid.get( y ).set( x, rockSymbol );
      }
      else {
        grid.get( y ).set( x, airSymbol );
      }
    }
  }

  const startingX = 500;
  const startingY = 0;
  // add the starting position
  grid.get( startingY ).set( startingX, startingSymbol );

  parser.iterateLines( line => {
    if ( !line ) return;

    let prevX, prevY;
    let curX, curY;
    const split = line.split( " -> " );
    for ( const coords of split ) {
      const [ x, y ] = coords.split( "," ).map( Number );
      prevX = curX;
      prevY = curY;
      curX = x;
      curY = y;
      if ( !prevX ) {
        continue;
      }

      if ( prevX !== curX ) {
        for ( let i = Math.min( prevX, curX ); i <= Math.max( prevX, curX ); i++ ) {
          // store line X
          grid.get( curY ).set( i, rockSymbol );
        }
      }
      if ( prevY !== curY ) {
        for ( let i = Math.min( prevY, curY ); i <= Math.max( prevY, curY ); i++ ) {
          // store line Y
          grid.get( i ).set( curX, rockSymbol );
        }
      }
    }
  } );

  let done = false;
  let restedSandUnits = 0;
  const isBlocked = ( space ) => [ rockSymbol, sandSymbol ].includes( space );
  const dropSand = ( x, y ) => {
    const down = grid.get( y+1 );
    if ( !isBlocked( down.get( x ) ) ) {
      // down
      return dropSand( x, y+1 );
    }

    if ( !isBlocked( down.get( x-1 ) ) ) {
      // downleft
      return dropSand( x-1, y+1 );
    }

    if ( !isBlocked( down.get( x+1 ) ) ) {
      // downright
      return dropSand( x+1, y+1 );
    }

    grid.get( y ).set( x, sandSymbol );
    restedSandUnits++;
    if ( x === startingX && y === startingY  ) {
      done = true;
      return;
    }
  }

  while ( !done ) {
    dropSand( startingX, startingY );
  }

  const visualization = [];
  for ( let y = 0; y < grid.size; y++ ) {
    visualization.push( [] );
    for ( let x = 300; x < grid.get( y ).size; x++ ) {
      visualization[ y ].push( grid.get( y ).get( x ) );
    }
  }

  for ( const line of visualization ) {
    console.log( line.join( "" ) );
  }

  console.log( { restedSandUnits } );

  return {  };
}

console.time( "t" );
main().then( result => {
  console.log( "\n" );
  console.log( result );
  console.timeEnd( "t" );
} );
