const InputParser = require( "../InputParser.js" );

const main = async () => {
  let answer1;
  let answer2;

  const parser = await InputParser.init( __dirname, "./input.txt", true, true );

  // part 1
  answer1 = 0;
  parser.iterateGroups( function( group ) {
    answer1 = Math.max(
      answer1,
      group.reduce( ( a, b ) => parseInt( a, 10 ) + parseInt( b, 10 ) )
    );
  } );

  // part 2
  const topSums = [];
  parser.iterateGroups( function( group ) {
    let sum = group.reduce( ( a, b ) => parseInt( a, 10 ) + parseInt( b, 10 ) );
    topSums.push( sum );

    if ( topSums.length >= 4 ) {
      topSums.sort().reverse().pop();
    }
  } );

  answer2 = topSums.reduce( ( a, b ) => a + b );

  return { answer1, answer2 };
}

main().then( result => {
  console.log( result );
} );
