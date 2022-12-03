const InputParser = require( "../InputParser.js" );

const main = async () => {
  let answer1;
  let answer2;

  const parser = await InputParser.init( __dirname, "./input.txt" );

  return { answer1, answer2 };
}

main().then( result => {
  console.log( result );
} );
