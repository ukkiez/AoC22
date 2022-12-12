const InputParser = require( "../InputParser.js" );

const main = async () => {
  const parser = await InputParser.init( __dirname, "./input.txt" );

  return {  };
}

main().then( result => {
  console.log( result );
} );
