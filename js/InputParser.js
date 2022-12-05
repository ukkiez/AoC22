const fs = require( "fs" );
const path = require( "path" );

/*
  Usage:
    const parser = await InputParser.init( __dirname, "./input.txt", true );

    const { lines } = parser;
    for ( const line of lines ) { ...

    parser.iterateLines( function( line ) { (...) } );
    parser.iterateGroups( function( group ) { (...) } );
*/

class InputParser {
  lines = [];
  groups = new Map();
  data = "";
  _linesAsNumbers = false;
  _getGroups = false;

  constructor( data, lines, _linesAsNumbers = false, _getGroups = false ) {
    this.data = data;
    this.lines = lines;
    this._linesAsNumbers = _linesAsNumbers;
    this._getGroups = _getGroups;

    if ( _getGroups ) {
      let _groupIndex = 0;
      let _emptyLine = false;
      this.groups.set( _groupIndex, [] );
      for ( const line of lines ) {
        if ( !line ) {
          if ( _emptyLine ) {
            // bar against multiple empty lines in a row, in which case we
            // wouldn't want to create multiple empty groups
            continue;
          }

          _groupIndex++;
          this.groups.set( _groupIndex, [] );

          _emptyLine = true;
          continue;
        }

        if ( _emptyLine ) {
          _emptyLine = false;
        }

        this.groups.get( _groupIndex ).push( _linesAsNumbers ? parseInt( line, 10 ) : line );
      }

      if ( !this.groups.get( _groupIndex ).length ) {
        // possibly remove a last empty group
        this.groups.delete( _groupIndex );
      }
    }
  }

  static async init( directory, filePath, _linesAsNumbers = false, _getGroups = false ) {
    let lines;
    let data = "";
    await new Promise( ( resolve ) => {
      const readStream = fs.createReadStream( path.join( directory, filePath ), "utf8" );
      readStream.on( "data", function( chunk ) {
        data += chunk;
      } ).on( "end", function() {
        lines = data.split( "\n" );

        resolve();
      } );
    } );

    if ( _linesAsNumbers ) {
      lines = lines.map( line => line && parseInt( line, 10 ) );
    }

    return new InputParser( data, lines, _linesAsNumbers, _getGroups );
  }

  iterateLines( processor ) {
    for ( let i = 0; i < this.lines.length; i++ ) {
      processor( this.lines[ i ] );
    }
  }

  iterateGroups( processor ) {
    for ( let i = 0; i < this.groups.size; i++ ) {
      processor( this.groups.get( i ) );
    }
  }
}

module.exports = InputParser;
