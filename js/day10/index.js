const InputParser = require( "../InputParser.js" );

const main = async () => {
  const parser = await InputParser.init( __dirname, "./input.txt" );

  const cycles = [ 20, 60, 100, 140, 180, 220 ];
  const signalsByCycle = {};

  const rowsByCycle = {};
  for ( let i = 1; i < 240; i+=40 ) {
    rowsByCycle[ i ] = "";
  }

  let cycle = 1;

  let currentCycle = 1;
  let row = "";
  function draw() {
    let pixel = ".";
    if ( x === currentCycle-2 || x === currentCycle-1 || x === currentCycle ) {
      pixel = "#";
    }
    row += pixel;

    if ( currentCycle === 40 ) {
      rowsByCycle[ cycle-39 ] = row;
      row = "";
      currentCycle = 0;
    }

    currentCycle++;
  }

  let x = 1;
  function tick( n, index = 0 ) {
    draw();

    if ( cycles.includes( cycle ) ) {
      signalsByCycle[ cycle ] = ( x * cycle );
    }
    cycle++;

    index++;
    if ( index < n ) {
      tick( n, index );
    }
  }

  parser.iterateLines( line => {
    if ( !line ) return;

    if ( line === "noop" ) {
      // no-op
      tick( 1 );
      return;
    }
    else {
      const [ , value ] = line.split( /\s/ );
      tick( 2 );
      x += parseInt( value, 10 );
    }
  } );

  let answer1 = Object.values( signalsByCycle ).reduce( ( a, b ) => a + b );
  let answer2 = "\n" + Object.values( rowsByCycle ).join( "\n" );

  return { answer1, answer2 };
}

main().then( result => {
  console.log( result );
} );
