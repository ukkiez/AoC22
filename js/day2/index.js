const InputParser = require( "../InputParser.js" );

const main = async () => {
  let answer1;
  let answer2;

  const parser = await InputParser.init( __dirname, "./input.txt" );

  const choiceScores = {
    X: 1,
    Y: 2,
    Z: 3
  }

  const scoresByResponse = {
    X: { A: 3, B: 0, C: 6 },
    Y: { A: 6, B: 3, C: 0 },
    Z: { A: 0, B: 6, C: 3 },
  }

  const requiredResponses = {
    A: [ "C", "A", "B" ],
    B: [ "A", "B", "C" ],
    C: [ "B", "C", "A" ]
  }

  let score = 0;
  let score2 = 0;
  parser.iterateLines( function( line ) {
    if ( !line ) {
      return;
    }

    const [ opponent, response ] = line.split( /\s/ );
    score += ( choiceScores[ response ] + scoresByResponse[ response ][ opponent ] );

    let outcomeIndex = choiceScores[ response ]-1;
    let requiredResponse = requiredResponses[ opponent ][ outcomeIndex ];
    if ( requiredResponse === "A" ) {
      score2 += 1;
    }
    else if ( requiredResponse === "B" ) {
      score2 += 2;
    }
    else if ( requiredResponse === "C" ) {
      score2 += 3;
    }

    score2 += ( outcomeIndex * 3 );
  } );

  answer1 = score;
  answer2 = score2;

  return { answer1, answer2 };
}

main().then( result => {
  console.log( result );
} );
