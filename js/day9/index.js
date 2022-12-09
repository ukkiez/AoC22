const InputParser = require( "../InputParser.js" );

const main = async () => {
  let answer1 = 0;
  let answer2 = 0;

  const parser = await InputParser.init( __dirname, "./input.txt" );

  // part 1
  const uniqueTailCoords = new Set();
  uniqueTailCoords.add( "0,0" );

  let headPosX = 0;
  let headPosY = 0;
  let tailPosX = 0;
  let tailPosY = 0;
  const move = function( dir ) {
    switch ( dir ) {
      case "U":
        headPosY--;
        break;
      case "D":
        headPosY++;
        break;
      case "L":
        headPosX--;
        break;
      case "R":
        headPosX++;
        break;
    }

    if ( Math.abs( headPosX - tailPosX ) >= 2 ) {
      if ( dir === "R" ) {
        tailPosX++;
      }
      else {
        tailPosX--;
      }

      tailPosY += ( headPosY - tailPosY );
    }
    if ( Math.abs( headPosY - tailPosY ) >= 2 ) {
      if ( dir === "U" ) {
        tailPosY--;
      }
      else {
        tailPosY++;
      }

      tailPosX += ( headPosX - tailPosX );
    }

    const tailCoords = `${ tailPosX.toString() },${ tailPosY.toString() }`;
    uniqueTailCoords.add( tailCoords );
  }

  let direction = "";
  let n = 0;
  parser.iterateLines( function( line ) {
    if ( !line ) return;

    const split = line.split( /\s/ );
    direction = split[ 0 ];
    n = parseInt( split[ 1 ], 10 );

    for ( let step = n; step > 0; step-- ) {
      move( direction );
    }
  } );
  answer1 = uniqueTailCoords.size;

  // part 2
  uniqueTailCoords.clear();
  uniqueTailCoords.add( "0,0" );

  const knots = [];
  for ( let i = 0; i < 10; i++ ) {
    knots.push( [ 0, 0 ] );
  }
  direction = "";
  n = 0;
  const move2 = function( i ) {
    let attached = false;
    if ( Math.abs( knots[ i-1 ][ 0 ] - knots[ i ][ 0 ] ) < 2 && Math.abs( knots[ i-1 ][ 1 ] - knots[ i ][ 1 ] ) < 2 ) {
      attached = true;
    }

    if ( attached ) {
      return;
    }

    let sameColumn = false;
    let sameRow = false;
    if ( knots[ i-1 ][ 0 ] === knots[ i ][ 0 ] ) {
      sameColumn = true;
    }
    else if ( knots[ i-1 ][ 1 ] === knots[ i ][ 1 ] ) {
      sameRow = true;
    }

    if ( !sameColumn && !sameRow ) {
      let addRow = 1;
      let addColumn = 1;
      if ( knots[ i-1 ][ 0 ] < knots[ i ][ 0 ] ) {
        addColumn = -1;
      }
      if ( knots[ i-1 ][ 1 ] < knots[ i ][ 1 ] ) {
        addRow = -1;
      }

      // move diagonally to keep up
      knots[ i ][ 0 ] += addColumn;
      knots[ i ][ 1 ] += addRow;
    }
    else {
      let addRow = 1;
      let addColumn = 1;
      if ( knots[ i-1 ][ 0 ] < knots[ i ][ 0 ] ) {
        addColumn = -1;
      }
      if ( knots[ i-1 ][ 1 ] < knots[ i ][ 1 ] ) {
        addRow = -1;
      }

      // move towards the head
      if ( !sameColumn ) {
        knots[ i ][ 0 ] += addColumn;
      }
      else {
        knots[ i ][ 1 ] += addRow;
      }
    }
  }

  parser.iterateLines( function( line ) {
    if ( !line ) return;

    const split = line.split( /\s/ );
    direction = split[ 0 ];
    n = parseInt( split[ 1 ], 10 );

    for ( let step = n; step > 0; step-- ) {
      switch ( direction ) {
        case "U":
          knots[ 0 ][ 1 ]--;
          break;
        case "D":
          knots[ 0 ][ 1 ]++;
          break;
        case "L":
          knots[ 0 ][ 0 ]--;
          break;
        case "R":
          knots[ 0 ][ 0 ]++;
          break;
      }

      for ( let i = 1; i < knots.length; i++ ) {
        move2( i );
      }

      const tailCoords = `${ knots[ 9 ][ 0 ].toString() },${ knots[ 9 ][ 1 ].toString() }`;
      uniqueTailCoords.add( tailCoords );
    }
  } );
  answer2 = uniqueTailCoords.size;

  return { answer1, answer2 };
}

main().then( result => {
  console.log( result );
} );
