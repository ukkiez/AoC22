const InputParser = require( "../InputParser.js" );

const main = async () => {
  const parser = await InputParser.init( __dirname, "./input.txt" );

  const rows = [];
  parser.iterateLines( ( line ) => {
    if ( !line ) return;
    const numbers = line.match( /\d/g ).map( Number );
    rows.push( numbers );
  } );

  // part 1
  let visibleTrees = ( rows.length-2 ) * 2;
  visibleTrees += rows[ 0 ].length * 2;

  function checkRow( row, rowIndex ) {
    for ( let x = 1; x < row.length-1; x++ ) {
      let left = true;
      let right = true;
      let top = true;
      let bottom = true;

      const n = row[ x ];

      // check above/bottom of the tree
      for ( let y = 0; y < rows.length; y++ ) {
        if ( y === rowIndex ) {
          // skip the cell we're checking itself
          continue;
        }

        if ( rows[ y ][ x ] >= n ) {
          if ( y < rowIndex ) {
            top = false;
          }
          else {
            bottom = false;
          }

          if ( !top && !bottom ) {
            break;
          }
        }
      }

      if ( !top && !bottom ) {
        // check left/right of the tree
        for ( let _x = 0; _x < row.length; _x++ ) {
          if ( _x === x ) {
            // skip the cell we're checking itself
            continue;
          }

          if ( row[ _x ] >= n ) {
            if ( _x < x ) {
              left = false;
            }
            else {
              right = false;
            }

            if ( !left && !right ) {
              break;
            }
          }
        }
      }

      if ( left || right || top || bottom ) {
        visibleTrees++;
      }
    }
  }

  for ( let i = 1; i < rows.length-1; i++ ) {
    const row = rows[ i ];

    checkRow( row, i );
  }

  // part 2
  let bestScore = 0;
  function checkCell( n, row, column ) {
    let left = 0, right = 0, top = 0, bottom = 0;

    if ( row > 0 ) {
      // top
      for ( let y = row-1; y >= 0; y-- ) {
        top++;
        if ( rows[ y ][ column ] >= n ) {
          break;
        }
      }
    }
    if ( row < rows.length ) {
      // bottom
      for ( let y = row+1; y < rows.length; y++ ) {
        bottom++;
        if ( rows[ y ][ column ] >= n ) {
          break;
        }
      }
    }

    if ( column < rows[ 0 ].length ) {
      // right
      for ( let x = column+1; x < rows[ 0 ].length; x++ ) {
        right++;

        if ( rows[ row ][ x ] >= n ) {
          break;
        }
      }
    }
    if ( column > 0 ) {
      // left
      for ( let x = column-1; x >= 0; x-- ) {
        left++;

        if ( rows[ row ][ x ] >= n ) {
          break;
        }
      }
    }

    const score = left * right * top * bottom;
    bestScore = Math.max( bestScore, score );
  }

  for ( let rowIndex = 0; rowIndex < rows.length; rowIndex++ ) {
    const row = rows[ rowIndex ];
    for ( let column = 0; column < row.length; column++ ) {
      checkCell( row[ column ], rowIndex, column );
    }
  }

  return { answer1: visibleTrees, answer2: bestScore };
}

main().then( result => {
  console.log( result );
} );
