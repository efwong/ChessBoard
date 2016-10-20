
// Player enum to determine white or black player
var PlayerType = {white: 0, black: 1};
var ChessPieceType = {king: "K", queen: "Q", knight: "N", bishop: "B", rook: "R", pawn: "P"};
//var DirectionType = {N: 0, NE: 1, E: 2, SE: 3, S: 4, SW: 5, W: 6, NW 7};

var ChessHelper = (function(){
    function isCoordinateWithinBoundaries(coordinate) {
        return coordinate.row < 8 && coordinate.row >= 0 && coordinate.col < 8 && coordinate.col >= 0;
    }
    function movePieceInOneDirection(chessPiece, board, toBoundaries, rowIncrement, colIncrement) {
        var availableMoves = [];
        var newCoordinate = new Coordinate(chessPiece.coordinate.row + rowIncrement, chessPiece.coordinate.col+colIncrement);
        var destinationPiece = null; // piece at (row,col) in board
        var newMove = null; // stores new Move based on the newCoordinate
        while(isCoordinateWithinBoundaries(newCoordinate)){ // check within boundaries
            destinationPiece = board[newCoordinate.row][newCoordinate.col];
            newMove = new Move(chessPiece.chessPieceType, chessPiece.playerType, chessPiece.coordinate, newCoordinate);
            if (destinationPiece != null) {
                // encountered a chess piece, check if it's white or black
                if (chessPiece.isWhite() != destinationPiece.isWhite()) {
                    // white capture black or vice versa, move stops
                    // valid move
                    availableMoves.push(newMove);
                }
                break;
            } else {
                // encountered empty square, keep going
                availableMoves.push(newMove);
            }

            if(!toBoundaries){
                // if not to boundaries, run once only
                break;
            }
            newCoordinate.row += rowIncrement; // increment rows to move North/South
            newCoordinate.col += colIncrement; // increment rows to move West/East
        }
        return availableMoves;
    }
    return{
        isCoordinateWithinBoundaries: function(coordinate) {
            return isCoordinateWithinBoundaries(coordinate);
        },
        // Convert a coordinate(row,col) to an algebraic notation as a string
        // (eg.) (1,0) becomes "a1"
        formatCoordinateToAlgebraicNotation: function(coordinate) {
            var coordinateRank = coordinate.row+1; // rows
            var coordinateFile = String.fromCharCode(97 + coordinate.col); // letters a -> h denoting the column
            return coordinateFile + coordinateRank;
        },

        // return a list of coordinates
        // input:
        //      chessPiece: chess piece containing coordinate information
        //      board: 2d grid containing ChessPieces
        //      toBoundaries: true -> propagate until boundaries or obstacle, false-> (king) propagate a length of 1 away from the chessPiece
        //      hasN: true->propagate North
        //      hasNE: true-> propagate North East
        //      hasE: true-> propagate East
        //      hasSE: true-> propagate South East
        //      hasS: true-> propagate South
        //      hasSW: true-> propagate South West
        //      hasW: true-> propagate West
        //      hasNW: true-> propagate North West
        movePieceInMultiDirections: function(chessPiece, board, toBoundaries, hasN, hasNE, hasE, hasSE, hasS, hasSW, hasW, hasNW) {
            var availableMoves = [];
            if (hasN) { // move north
                var moves = movePieceInOneDirection(chessPiece, board, toBoundaries, -1, 0);
                availableMoves = availableMoves.concat(moves);
            }
            if (hasNE) {// move North East
                availableMoves = availableMoves.concat(movePieceInOneDirection(chessPiece, board, toBoundaries, -1, 1));
            }
            if (hasE) {// move East
                availableMoves = availableMoves.concat(movePieceInOneDirection(chessPiece, board, toBoundaries, 0, 1));
            }
            if (hasSE) {// move South East
                availableMoves = availableMoves.concat(movePieceInOneDirection(chessPiece, board, toBoundaries, 1, 1));
            }
            if (hasS) {// move South
                availableMoves = availableMoves.concat(movePieceInOneDirection(chessPiece, board, toBoundaries, 1, 0));
            }
            if (hasSW) {// move South West
                availableMoves = availableMoves.concat(movePieceInOneDirection(chessPiece, board, toBoundaries, 1, -1));
            }
            if (hasW) {// move West
                availableMoves = availableMoves.concat(movePieceInOneDirection(chessPiece, board, toBoundaries, 0, -1));
            }
            if (hasNW) {// move North West
                availableMoves = availableMoves.concat(movePieceInOneDirection(chessPiece, board, toBoundaries, -1, -1));
            }
            return availableMoves;
        }
    }
})();

// row col Coordinate
function Coordinate(row, col){
    this.row = row; // row coordinate
    this.col = col; // column coordinate
}

// Base ChessPiece Class
function ChessPiece(chessPieceType, playerType, row , col){
    this.playerType = playerType;
    this.coordinate = new Coordinate(row,col);
    this.chessPieceType = chessPieceType;
}
// check if piece is white or black
// true-> white, flase -> black
ChessPiece.prototype.isWhite = function(){
    return this.playerType == PlayerType.white;
};
ChessPiece.prototype.getAvailableMoves = function(board){
};

// King Piece
function King(playerType, row, col){
    ChessPiece.call(this, ChessPieceType.king, playerType, row, col);
}
King.prototype = Object.create(ChessPiece.prototype);
King.prototype.constructor = ChessPiece;

// get all available moves for a King
// Rules:
//      1) The King can move one square across any direction (horizontally, vertically, and diagonally) (N, NE, E, SE, S, SW, W, NW)
King.prototype.getAvailableMoves = function(board){
    // Move King N, NE, E, SE, S, SW, W, NW
    return ChessHelper.movePieceInMultiDirections(this, board, false, true, true, true, true, true, true, true, true);
};

// Queen Piece
function Queen(playerType, row, col){
    ChessPiece.call(this, ChessPieceType.queen, playerType, row, col);
}
Queen.prototype = Object.create(ChessPiece.prototype);
Queen.prototype.constructor = ChessPiece;

// get all available moves for a Queen
// Rules:
//      1) The Queen can move across any direction (horizontally, vertically, and diagonally) (N, NE, E, SE, S, SW, W, NW)
//      2) The Queen cannot jump over pieces
Queen.prototype.getAvailableMoves = function(board){
    // Move Queen N, NE, E, SE, S, SW, W, NW
    return ChessHelper.movePieceInMultiDirections(this, board, true, true, true, true, true, true, true, true, true);
};

// Bishop Piece
function Bishop(playerType, row, col){
    ChessPiece.call(this, ChessPieceType.bishop, playerType, row, col);
}
Bishop.prototype = Object.create(ChessPiece.prototype);
Bishop.prototype.constructor = ChessPiece;

// get all available moves for a bishop
// Rules:
//      1) Bishops can move diagonally in any direction (NE, SE, SW, NW)
//      2) Bishops cannot jump over pieces
Bishop.prototype.getAvailableMoves = function(board){
    // Move Rook North, East, South, West
    //hasN, hasNE, hasE, hasSE, hasS, hasSW, hasW, hasNW
    return ChessHelper.movePieceInMultiDirections(this, board, true, false, true, false, true, false, true, false, true);
};

// Rook Piece
function Rook(playerType, row, col){
    ChessPiece.call(this, ChessPieceType.rook, playerType, row, col);
}
Rook.prototype = Object.create(ChessPiece.prototype);
Rook.prototype.constructor = ChessPiece;

// get all available moves for a rook
// Rules:
//      1) Rooks can move any direction horizontally or vertically through any unoccupied squares
//      2) Rooks cannot jump over pieces
Rook.prototype.getAvailableMoves = function(board){
    // Move Rook North, East, South, West
    return ChessHelper.movePieceInMultiDirections(this, board, true, true, false, true, false, true, false, true, false);
};

// Knight Piece
function Knight(playerType, row, col){
    ChessPiece.call(this, ChessPieceType.knight, playerType, row, col);
}
Knight.prototype = Object.create(ChessPiece.prototype);
Knight.prototype.constructor = ChessPiece;
// get all available moves for a knight
// Rules:
//      1) Knights can move 2 squares diagonally and one square vertically
//      2) Knights can jump over other pieces
Knight.prototype.getAvailableMoves = function(board){
    var availableMoves = [];
    var possibleCoordinates = [new Coordinate(this.coordinate.row - 2, this.coordinate.col + 1), // North 2, right 1
                                new Coordinate(this.coordinate.row - 1, this.coordinate.col + 2), // East 2, North 1
                                new Coordinate(this.coordinate.row + 1, this.coordinate.col + 2), // East 2, South 1
                                new Coordinate(this.coordinate.row + 2, this.coordinate.col + 1), // South 2, East 1
                                new Coordinate(this.coordinate.row + 2, this.coordinate.col - 1), // South 2, West 1
                                new Coordinate(this.coordinate.row + 1, this.coordinate.col - 2), // West 2, South 1
                                new Coordinate(this.coordinate.row - 1, this.coordinate.col - 2), // West 2, North 1
                                new Coordinate(this.coordinate.row - 2, this.coordinate.col - 1)]; // North 2, West 1

    possibleCoordinates.forEach(function(newCoordinate){
        // check boundaries
        if (ChessHelper.isCoordinateWithinBoundaries(newCoordinate)) {
            var chessPiece = board[newCoordinate.row][newCoordinate.col];
            var newMove = new Move(this.chessPieceType, this.playerType, this.coordinate, newCoordinate);
            if (chessPiece == null ||
                (this.isWhite() != chessPiece.isWhite())) { // black can capture white or vice versa
                // empty space -> knight can jump here
                availableMoves.push(newMove);
            }
        }
    }.bind(this));
    return availableMoves;
};

// Pawn Piece
function Pawn(playerType, row, col){
    ChessPiece.call(this, ChessPieceType.pawn, playerType, row, col);
}
Pawn.prototype = Object.create(ChessPiece.prototype);
Pawn.prototype.constructor = ChessPiece;

// get all available moves for the pawn
// Rules:
//      1) pawns can move forward at most 2 squares
//          a) any piece in directly in front will block movement for the pawn
//          b) for its initial move, the pawn can move forward 2 squares, otherwise it can only move forward one
//      2) pawns can capture diagonally one square in front (only if there is an enemy piece)
//      3) pawns can only move forward
Pawn.prototype.getAvailableMoves = function(board){

    var availableMoves = [];
    // get available moves forward for pawn (1 or 2 if it hasn't moved yet)
    var availableMoveCount = 1;
    if(this.isWhite()){
        if(this.coordinate.row == 1){
            availableMoveCount = 2; // has not moved yet, can move twice
        }else{
            availableMoveCount = 1;
        }
    }else{
        if(this.coordinate.row == 6){
            availableMoveCount = 2; // has not moved yet, can move twice
        }else{
            availableMoveCount = 1;
        }
    }

    // check pawn moving forward 1 to 2 spaces
    var count = 1;
    while(count <= availableMoveCount){
        var newRow = this.coordinate.row+count;
        if(!this.isWhite()){
            newRow = this.coordinate.row-count;
        }
        var newCoordinate = new Coordinate(newRow, this.coordinate.col);
        if(ChessHelper.isCoordinateWithinBoundaries(newCoordinate) && board[newCoordinate.row][newCoordinate.col] == null){
            // pawn can move count number of spaces in front
            var newMove = new Move(this.chessPieceType, this.playerType, this.coordinate, newCoordinate);
            availableMoves.push(newMove);
        }else{
            // stop when pawn can't move foward anymore
            break;
        }
        count++;
    }
    // check if pawn can move up or down depending on playerType
    var newRow = this.coordinate.row + 1;
    if(!this.isWhite()){
        newRow = this.coordinate.row - 1;
    }
    // check up or down depending on playerType
    [-1, 1].forEach(function(leftOrRightIndex){
        var newDiagCoordinate = new Coordinate(newRow, this.coordinate.col + leftOrRightIndex);
        // check +1 row or -1 row for white or black
        if (ChessHelper.isCoordinateWithinBoundaries(newDiagCoordinate)){
            if(this.isWhite()){
                var currentPiece = board[newDiagCoordinate.row][newDiagCoordinate.col];
                if(currentPiece != null && currentPiece.playerType == PlayerType.black){
                    // current piece is white and is checking that the destination coordinate contains a black piece
                    var newMove = new Move(this.chessPieceType, this.playerType, this.coordinate, newDiagCoordinate);
                    availableMoves.push(newMove);
                }
            }else{
                var currentPiece = board[newDiagCoordinate.row][newDiagCoordinate.col];
                if(currentPiece != null && currentPiece.playerType == PlayerType.white){
                    // current piece is black and is checking that the destination coordinate contains a white piece
                    var newMove = new Move(this.chessPieceType, this.playerType, this.coordinate, newDiagCoordinate);
                    availableMoves.push(newMove);
                }
            }
        }
    }.bind(this));

    return availableMoves;
};

// ChessBoard
// config = chess board configuration as 8x8 array of strings
function ChessBoard(chessBoardConfig){
    this.playerWhite = new Player(PlayerType.white);
    this.playerBlack = new Player(PlayerType.black);
    this.numRows = 8;
    this.numCols = 8;

    // rows x cols board of ChessPieces
    // for a (x,y) coordinate system
    // they will later be translated to rows={1,2,3,4,5,6,7,8} and cols={a,b,c,d,e,f,g,h}
    this.board = [];

    // parse configuration grid to 2d array of ChessPiece objects
    var parseConfiguration = function(){
        for(var i = 0; i < this.numRows; i++){
            for(var j = 0; j< this.numCols; j++){
                if(chessBoardConfig[i][j] != null){
                    var chessPiece = chessPieceStringToObject(chessBoardConfig[i][j], i ,j);
                    this.board[i][j] = chessPiece;
                    if(chessPiece.playerType == PlayerType.white){
                        this.playerWhite.chessPieces.push(chessPiece);
                    }else{
                        this.playerBlack.chessPieces.push(chessPiece);
                    }
                }else{
                    this.board[i][j] = null;
                }
            }
        }
    }.bind(this);

    // convert string to object to better track the chess piece
    var chessPieceStringToObject = function(code, row, col){
        if (code.length < 2){
            return null;
        }

        var playerType = PlayerType.white;
        if(code[0] == "B"){
            playerType = PlayerType.black;
        }

        switch(code[1]){
            case "R":
                return new Rook(playerType, row, col);
                break;
            case "N":
                return new Knight(playerType, row, col);
                break;
            case "B":
                return new Bishop(playerType, row, col);
                break;
            case "Q":
                return new Queen(playerType, row, col);
                break;
            case "K":
                return new King(playerType, row, col);
                break;
            case "P":
                return new Pawn(playerType, row, col);
                break;
            default:
                return null; // no chess piece at row,col
                break;
        }

    }.bind(this);

    // PRIVATE METHODS


    // Initialize Chessboard
    var init = function(){
        // initialize rows
        this.board = [];
        for(var i = 0; i < this.numRows; i++){
            // initialize cols
            var innerRow = [];
            for(var j = 0; j< this.numCols; j++){
                innerRow.push(null);
            }
            this.board.push(innerRow);
        }

        parseConfiguration();
    }.bind(this);

    init();
}

// Player
function Player(playerType){
    this.playerType =  playerType;
    this.chessPieces = []
}

// A move consists of a chessPiece and a destination coordinate
// chessPieceType: Symbol denoting chess piece {king: "K", queen: "Q", knight: "N", bishop: "B", rook: "R", pawn: "P"}
// playerType : 0 = white, 1 = black
// sourceCoordinate: source Coordinate as (row,y) (starting position of the chess piece)
// destinationCoordinate: destination Coordinate as (row,y) (destination of the chess piece)
function Move(chessPieceType, playerType, sourceCoordinate, destinationCoordinate){
    this.chessPieceType = chessPieceType;
    this.playerType = playerType;
    this.source = "";
    this.destination = "";

    var init= function(){
        // convert source coordinate to algebraic notation
        this.source = ChessHelper.formatCoordinateToAlgebraicNotation(sourceCoordinate);
        this.destination = ChessHelper.formatCoordinateToAlgebraicNotation(destinationCoordinate);
    }.bind(this);

    init();
}

// Draw current sate of chessboard
function PrintChessBoard(chessBoard){
    var board = chessBoard.board;
    for(var i = 0; i < chessBoard.rows; i++){
        var runningChessRow = "";
        for(var j = 0; j < chessBoard.cols; j++){
            if(board[i][j] == null){
                runningChessRow += "X";
            }else{
                runningChessRow += board[i][j].chessPieceType;
            }

            if (j != chessBoard.cols-1){
                runningChessRow += " | ";
            }
        }
        console.log(runningChessRow);
    }
}


// Let the chessboard configuration input be defined as:
// 1) A 8x8 array
// 2) Each element in the array is a code consisting of 2 characters
//  a) char 0: defines chess pieces ownership (which player owns this piece)
//             "W" -> White,  "B" -> Black
//  b) char 1: defines the chess piece
//             "K" -> King, "Q" -> Queen, "R" -> Rook, "N" -> Knight, "B" -> Bishop, "P" -> Pawn
// let coordinates from (0,0) to (1,7) be the initial white chess pieces
// let coordinates from (6,0) to (7,7) be the initial black chess pieces
// var initialChessBoardConfiguration = [["WR","WN","WB","WQ","WK","WB","WN","WR"],
//                                       ["WP","WP","WP","WP","WP","WP","WP","WP"],
//                                       [null,null,null,null,null,null,null,null],
//                                       [null,null,null,null,null,null,null,null],
//                                       [null,null,null,null,null,null,null,null],
//                                       [null,null,null,null,null,null,null,null],
//                                       ["BP","BP","BP","BP","BP","BP","BP","BP"],
//                                       ["BR","BN","BB","BQ","BK","BB","BN","BR"]];


function GetListOfLegalChessMovesByPlayer(chessBoardConfiguration, playerType){
    var chessBoard = new ChessBoard(chessBoardConfiguration);
    //PrintChessBoard(chessBoard);

    var allMoves = [];
    var chessPieces = chessBoard.playerWhite.chessPieces;
    if(playerType == PlayerType.black){
        chessPieces = chessBoard.playerBlack.chessPieces
    }

    // get possible moves
    for(var i = 0; i < chessPieces.length; i++){
        var piece = chessPieces[i];
        // console.log(piece.chessPieceType + " row:" + piece.coordinate.row  + " col:" + piece.coordinate.col);
        var moves = piece.getAvailableMoves(chessBoard.board)
        if (moves != null && moves.length > 0) {
            allMoves = allMoves.concat(moves);
        }
        //console.log(moves);
    }

    console.log(allMoves);
    return allMoves;
}