const InputParser = require( "../InputParser.js" );

class Monkey {
  _id = 0;
  items = [];
  // * || +
  operation = "";
  // X || "old"
  operationNumber = "";
  // what the worry level needs to be divisible by to pass the Test
  testDivisionNum = 0;
  // target after test is true
  posTestMonkeyId = 0;
  // target after test is false
  negTestMonkeyId = 0;
  inspectCount = 0;

  constructor( monkeyAttributes ) {
    const [ id, items, operation, test, posOutcome, negOutcome ] = monkeyAttributes;
    this._id = parseInt( id.match( /\d+/g )[ 0 ], 10 );
    this.items = items.match( /\d+/g ).map( Number );
    const operationString = operation.match( /([*+]\s(?:\d|old)+)/g )[ 0 ];
    [ this.operation, this.operationNumber ] = operationString.split( " " );
    this.testDivisionNum = parseInt( test.match( /\d+/g )[ 0 ], 10 );
    this.posTestMonkeyId = parseInt( posOutcome.match( /\d+/g )[ 0 ], 10 );
    this.negTestMonkeyId = parseInt( negOutcome.match( /\d+/g )[ 0 ], 10 );
  }

  doTurn( monkeys, divideWorry = true, modulus ) {
    for ( const item of this.items ) {
      let worryLevel = item;
      let operationN;
      if ( this.operationNumber === "old" ) {
        operationN = item;
      }
      else {
        operationN = parseInt( this.operationNumber );
      }

      if ( this.operation === "*" ) {
        worryLevel *= operationN;
      }
      else {
        worryLevel += operationN;
      }

      if ( divideWorry ) {
        worryLevel = Math.floor( worryLevel / 3 );
      }
      else {
        worryLevel %= modulus;
      }

      let target = this.negTestMonkeyId;
      if ( worryLevel % this.testDivisionNum === 0 ) {
        target = this.posTestMonkeyId;
      }

      monkeys.get( target ).items.push( worryLevel );

      this.inspectCount++;
    }

    this.items = [];
  }
}

const main = async () => {
  const parser = await InputParser.init( __dirname, "./input.txt", false, true );

  const monkeys = new Map();
  parser.iterateGroups( ( group ) => {
    const monkey = new Monkey( group );
    monkeys.set( monkey._id, monkey );
  } );

  let modulus = 1;
  for ( const monkey of monkeys.values() ) {
    modulus *= monkey.testDivisionNum;
  }

  const runRound = ( n, divideWorry ) => {
    for ( let i = 0; i < n; i++ ) {
      monkeys.forEach( monkey => {
        monkey.doTurn( monkeys, divideWorry, modulus );
      } );
    }
  }

  // runRound( 20 );
  runRound( 10000, false );

  let inspectCounts = [];
  for ( const { inspectCount } of monkeys.values() ) {
    console.log( inspectCount );
    inspectCounts.push( inspectCount );
  }
  inspectCounts.sort( ( a, b ) => b - a );
  const answer = inspectCounts[ 0 ] * inspectCounts[ 1 ];


  return { answer };
}

main().then( result => {
  console.log( result );
} );
