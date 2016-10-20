
// Player enum to determine white or black player
var PlayerType = {white: 0, black: 1};
var ChessPieceType = {king: "K", queen: "Q", knight: "N", bishop: "B", rook: "R", pawn: "P"};
//var direction = {N: 0, NE: 1, E: 2, SE: 3, S: 4, SW: 5, W: 6, NW 7};

var ChessHelper = (function(){
    return{
        isCoordinateWithinBoundaries: function(coordinate){
            return coordinate.x < 8 && coordinate.x >= 0 && coordinate.y < 8 && coordinate.y >= 0;
        },
        // Convert a coordinate(x,y) to an algebraic notation as a string
        // (eg.) (1,0) becomes "a1"
        formatCoordinateToAlgebraicNotation: function(coordinate){
            var coordinateRank = coordinate.x+1; // rows
            var coordinateFile = String.fromCharCode(97 + coordinate.y); // letters a -> h denoting the column
            return coordinateFile + coordinateRank;
        }
    }
})();

// X Y Coordinate
function Coordinate(x, y){
    this.x = x; // x is the row coordinate because it is easier to work with for the initial chess layout when all the pieces are in organized rows
    this.y = y; // column coordinate
}

// Base ChessPiece Class
function ChessPiece(chessPieceType, playerType, x , y){
    this.playerType = playerType;
    this.coordinate = new Coordinate(x,y);
    this.chessPieceType = chessPieceType;
}
// check if piece is white or black
// true-> white, flase -> black
ChessPiece.prototype.isWhite = function(){
    return this.playerType == PlayerType.white;
};
// only use bfsMove for Queen, King, Rook, bishop (pieces with directional moves that cannot leap over other pieces)
ChessPiece.prototype.bfsMove = function(board, untilBoundary){
};
ChessPiece.prototype.getAvailableMoves = function(board){
};

// King Piece
function King(playerType, x, y){
    ChessPiece.call(this, ChessPieceType.king, playerType, x, y);
}
King.prototype = Object.create(ChessPiece.prototype);
King.prototype.constructor = ChessPiece;

// Queen Piece
function Queen(playerType, x, y){
    ChessPiece.call(this, ChessPieceType.queen, playerType, x, y);
}
Queen.prototype = Object.create(ChessPiece.prototype);
Queen.prototype.constructor = ChessPiece;

// Bishop Piece
function Bishop(playerType, x, y){
    ChessPiece.call(this, ChessPieceType.bishop, playerType, x, y);
}
Bishop.prototype = Object.create(ChessPiece.prototype);
Bishop.prototype.constructor = ChessPiece;

// Rook Piece
function Rook(playerType, x, y){
    ChessPiece.call(this, ChessPieceType.rook, playerType, x, y);
}
Rook.prototype = Object.create(ChessPiece.prototype);
Rook.prototype.constructor = ChessPiece;

// Knight Piece
function Knight(playerType, x, y){
    ChessPiece.call(this, ChessPieceType.knight, playerType, x, y);
}
Knight.prototype = Object.create(ChessPiece.prototype);
Knight.prototype.constructor = ChessPiece;
// Knight.prototype.move = function(){
//     // ChessPiece.prototype.move.call(this);
//     // console.log("I move like lksdjflj");
// }

// Pawn Piece
function Pawn(playerType, x, y){
    ChessPiece.call(this, ChessPieceType.pawn, playerType, x, y);
    //this.blah = "gada";
    //var hasMoved = false;
    //var init = function(){
        //var test = this.isWhite();

  //  }.bind(this);
   // init();
}
Pawn.prototype = Object.create(ChessPiece.prototype);
Pawn.prototype.constructor = ChessPiece;
Pawn.prototype.getMovesGivenAMaxMoveCount = function(board, availableMoveCount){
    var availableMoves = [];
    // check pawn moving forward 1 to 2 spaces
    var count = 1;
    while(count <= availableMoveCount){
        var newX = this.coordinate.x+count;
        if(!this.isWhite()){
            newX = this.coordinate.x-count;
        }
        var newCoordinate = new Coordinate(newX, this.coordinate.y);
        if(ChessHelper.isCoordinateWithinBoundaries(newCoordinate) && board[newCoordinate.x][newCoordinate.y] == null){
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
    var newX = this.coordinate.x + 1;
    if(!this.isWhite()){
        newX = this.coordinate.x - 1;
    }
    // check up or down depending on playerType
    [-1, 1].forEach(function(leftOrRightIndex){
        var newDiagCoordinate = new Coordinate(newX, this.coordinate.y + leftOrRightIndex);
        // check +1 row or -1 row for white or black
        if (ChessHelper.isCoordinateWithinBoundaries(newDiagCoordinate)){
            if(this.isWhite()){
                var currentPiece = board[newDiagCoordinate.x][newDiagCoordinate.y];
                if(currentPiece != null && currentPiece.playerType == PlayerType.black){
                    // current piece is white and is checking that the destination coordinate contains a black piece
                    var newMove = new Move(this.chessPieceType, this.playerType, this.coordinate, newDiagCoordinate);
                    availableMoves.push(newMove);
                }
            }else{
                var currentPiece = board[newDiagCoordinate.x][newDiagCoordinate.y];
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

// get all available moves for the pawn
Pawn.prototype.getAvailableMoves = function(board){
    // get available moves forward for pawn (1 or 2 if it hasn't moved yet)
    var availableMoveCount = 1;
    if(this.isWhite()){
        if(this.coordinate.x == 1){
            availableMoveCount = 2; // has not moved yet, can move twice
        }else{
            availableMoveCount = 1;
        }
    }else{
        if(this.coordinate.x == 6){
            availableMoveCount = 2; // has not moved yet, can move twice
        }else{
            availableMoveCount = 1;
        }
    }
    return this.getMovesGivenAMaxMoveCount(board, availableMoveCount);
};

// ChessBoard
// config = chess board configuration as 8x8 array of strings
function ChessBoard(chessBoardConfig){
    this.playerWhite = new Player(PlayerType.white);
    this.playerBlack = new Player(PlayerType.black);
    this.rows = 8;
    this.cols = 8;

    // rows x cols board of ChessPieces
    // for a (x,y) coordinate system
    // they will later be translated to rows={1,2,3,4,5,6,7,8} and cols={a,b,c,d,e,f,g,h}
    this.board = [];

    // parse configuration grid to 2d array of ChessPiece objects
    var parseConfiguration = function(){
        for(var i = 0; i < this.rows; i++){
            for(var j = 0; j< this.cols; j++){
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
    var chessPieceStringToObject = function(code, x, y){
        if (code.length < 2){
            return null;
        }

        var playerType = PlayerType.white;
        if(code[0] == "B"){
            playerType = PlayerType.black;
        }

        switch(code[1]){
            case "R":
                return new Rook(playerType, x, y);
                break;
            case "N":
                return new Knight(playerType, x, y);
                break;
            case "B":
                return new Bishop(playerType, x, y);
                break;
            case "Q":
                return new Queen(playerType, x, y);
                break;
            case "K":
                return new King(playerType, x, y);
                break;
            case "P":
                return new Pawn(playerType, x, y);
                break;
            default:
                return null; // no chess piece at x,y
                break;
        }

    }.bind(this);

    // PRIVATE METHODS


    // Initialize Chessboard
    var init = function(){
        // initialize rows
        this.board = [];
        for(var i = 0; i < this.rows; i++){
            // initialize cols
            var innerRow = [];
            for(var j = 0; j< this.cols; j++){
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
// sourceCoordinate: source Coordinate as (x,y) (starting position of the chess piece)
// destinationCoordinate: destination Coordinate as (x,y) (destination of the chess piece)
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

var initialChessBoardConfiguration = [["WR","WN","WB","WQ","WK","WB","WN","WR"],
                                      [null,"WP",null,null,null,null,null,null],
                                      ["BP","BP",null,null,null,null,null,null],
                                      [null,null,null,null,null,null,null,null],
                                      [null,null,null,null,null,null,null,null],
                                      [null,null,null,null,null,null,null,null],
                                      [null,null,null,null,null,null,null,null],
                                      ["BR","BN","BB","BQ","BK","BB","BN","BR"]];

function GetListOfLegalChessMovesByPlayer(chessBoardConfiguration, playerType){
    var chessBoard = new ChessBoard(chessBoardConfiguration);
    //PrintChessBoard(chessBoard);

    var allMoves = [];
    // consider white pieces only
    if(playerType == PlayerType.white){
        var chessPieces = chessBoard.playerWhite.chessPieces;
        for(var i = 0; i < chessBoard.playerWhite.chessPieces.length; i++){
            var piece = chessPieces[i];
            // console.log(piece.chessPieceType + " x:" + piece.coordinate.x  + " y:" + piece.coordinate.y);
            var moves = piece.getAvailableMoves(chessBoard.board)
            if (moves != null && moves.length > 0) {
                allMoves = allMoves.concat(moves);
            }
            //console.log(moves);
        }
    }
    console.log(allMoves);
}