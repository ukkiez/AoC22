const InputParser = require( "../InputParser.js" );

const main = async () => {
  let answer1 = 0;
  let answer2 = 0;

  const parser = await InputParser.init( __dirname, "./input.txt" );

  const sizeByDirectory = new Map();
  sizeByDirectory.set( "/", 0 );

  let currentPath = "";
  parser.iterateLines( ( line ) => {
    if ( !line ) return;

    if ( line === "$ ls" ) {
      return;
    }

    const split = line.split( " " );
    if ( split[ 0 ] === "$" ) {
      switch ( split[ 2 ] ) {
        case "/":
          currentPath = "";
          break;

        case "..":
          currentPath = currentPath.substring( 0, currentPath.lastIndexOf( "/" ) );
          break;

        default:
          currentPath += `/${ split[ 2 ] }`;
          break;
      }
    }
    else if ( !isNaN( parseInt( split[ 0 ], 10 ) ) ) {
      const rootSize = sizeByDirectory.get( "/" );
      if ( !currentPath ) {
        sizeByDirectory.set( "/", rootSize + parseInt( split[ 0 ], 10 ) );
      }
      else {
        let dirPath = currentPath;
        while ( dirPath.lastIndexOf( "/" ) !== -1 ) {

          if ( !sizeByDirectory.has( dirPath ) ) {
            sizeByDirectory.set( dirPath, 0 );
          }

          let currentSize = sizeByDirectory.get( dirPath );
          sizeByDirectory.set( dirPath, currentSize + parseInt( split[ 0 ], 10 ) );

          if ( dirPath.lastIndexOf( "/" ) === 0 ) {
            // also add the size for directories one above the root
            sizeByDirectory.set( "/", rootSize + parseInt( split[ 0 ], 10 ) );
          }

          dirPath = dirPath.substring( 0, dirPath.lastIndexOf( "/" ) );
        }
      }
    }
  } );

  const availableDiskSpace = 70000000;
  const unusedDiskSpace = availableDiskSpace - sizeByDirectory.get( "/" );
  const requiredSpace = 30000000 - unusedDiskSpace;
  answer2 = Infinity;
  for ( const size of sizeByDirectory.values() ) {
    if ( size <= 100000 ) {
      answer1 += size;
    }

    if ( size >= requiredSpace ) {
      answer2 = Math.min( answer2, size );
    }
  }

  return { answer1, answer2 };
}

main().then( result => {
  console.log( result );
} );
