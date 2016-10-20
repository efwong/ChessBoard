
// Player enum to determine white or black player
var PlayerType = {white: 1, black: 2};
var ChessType = {king: "K", queen: "Q", knight: "N", bishop: "B", rook: "R", pawn: "P"};

// X Y Coordinate
function Coordinate(x, y){
	this.x = x;
	this.y = y;
}

// Base ChessPiece Class
function ChessPiece(chessType, playerType, x , y){
	this.playerType = playerType
	this.coordinate = new Coordinate(x,y);
	this.chessType = chessType;
}
ChessPiece.prototype.move = function(){
	console.log("I move like " + this.chessType);
}

// King Piece
function King(x, y){
	ChessPiece.call(this, ChessType.king, x, y);
}
King.prototype = Object.create(ChessPiece.prototype);
King.prototype.constructor = ChessPiece;

// Queen Piece
function Queen(x, y){
	ChessPiece.call(this, ChessType.queen, x, y);
}
Queen.prototype = Object.create(ChessPiece.prototype);
Queen.prototype.constructor = ChessPiece;

// Bishop Piece
function Bishop(x, y){
	ChessPiece.call(this, ChessType.bishop, x, y);
}
Bishop.prototype = Object.create(ChessPiece.prototype);
Bishop.prototype.constructor = ChessPiece;

// Rook Piece
function Rook(x, y){
	ChessPiece.call(this, ChessType.rook, x, y);
}
Rook.prototype = Object.create(ChessPiece.prototype);
Rook.prototype.constructor = ChessPiece;

// Knight Piece
function Knight(x, y){
	ChessPiece.call(this, ChessType.knight, x, y);
}
Knight.prototype = Object.create(ChessPiece.prototype);
Knight.prototype.constructor = ChessPiece;
Knight.prototype.move = function(){
	// ChessPiece.prototype.move.call(this);
	// console.log("I move like lksdjflj");
}

// Pawn Piece
function Pawn(x, y){
	ChessPiece.call(this, ChessType.pawn, x, y);
}
Pawn.prototype = Object.create(ChessPiece.prototype);
Pawn.prototype.constructor = ChessPiece;


// ChessBoard
function ChessBoard(){
	this.playerWhite = new Player(PlayerType.white);
	this.playerBlack = new Player(PlayerType.black);
	this.rows = 8;
	this.cols = 8;

	// rows x cols board of ChessPieces
	// for a (x,y) coordinate system
	// they will later be translated to rows={1,2,3,4,5,6,7,8} and cols={a,b,c,d,e,f,g,h}
	this.board = [];

	// PRIVATE METHODS

	// Initialize Method for initialize the chessboard
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

		// (0,0) to (1,7) are the initial coordinates for the white player
		// initialize white pawns
		initializePawns(1, PlayerType.white);
		// initialize white knights
		initializeKnights(0, PlayerType.white);
		// iniialize white king
		initializeKing(0, PlayerType.white);
		// initialize white queen
		initializeQueen(0, PlayerType.white);
		// initialize white bishop
		initializeBishops(0, PlayerType.white);
		// initialize white rook
		initializeRooks(0, PlayerType.white);

		// (6,0) to (7,7) are the initial coordinates for the black player
		// initialize black pawns
		initializePawns(6, PlayerType.black);
		// initialize black knights
		initializeKnights(7, PlayerType.black);
		// initialize black king
		initializeKing(7, PlayerType.black);
		// initialize black Queen
		initializeQueen(7, PlayerType.black);
		// initialize black bishop
		initializeBishops(7, PlayerType.black);
		// initialize black rook
		initializeRooks(7, PlayerType.black);
		
	}.bind(this);

	// Initialize Pawn to row 1 or 6 (white, black)
	var initializePawns = function(row, playerType){
		for(var i = 0; i < this.cols; i ++){
			this.board[row][i] = new Pawn(row,i);
		}
	}.bind(this);

	// Initialize Knight to column 1 or 6
	// row = {0,7} valid for white, black
	var initializeKnights = function(row, playerType){
		this.board[row][1] = new Knight(row,1);
		this.board[row][6] = new Knight(row,6);
	}.bind(this);

	// Initialize King to column 4
	// row = {0,7} valid for white, black
	var initializeKing = function(row, playerType){
		this.board[row][4] = new King(row,4);
	}.bind(this);

	// Initialize Queen to column 3
	// row = {0,7} valid for white, black
	var initializeQueen = function(row, playerType){
		this.board[row][3] = new Queen(row,3);
	}.bind(this);
	
	// Initialize Bishop to column 2 or 5
	// row = {0,7} valid for white, black
	var initializeBishops = function(row, playerType){
		this.board[row][2] = new Bishop(row,2);
		this.board[row][5] = new Bishop(row,5);
	}.bind(this);

	// Initialize Rook to column 0 or 7
	// row = {0,7} valid for white, black
	var initializeRooks = function(row, playerType){
		this.board[row][0] = new Rook(row,0);
		this.board[row][7] = new Rook(row,7);
	}.bind(this);
	
	// Initialize Chessboard
	init();
}

// Player
function Player(playerType){
	this.playerType =  playerType;
	this.chessPieces = []
}

// A move consists of a chessPiece and a destination coordinate
function Move(chessPiece, destinationCoordinate){
	this.chessPiece = chessPiece;
	this.coordinate = destinationCoordinate;
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
				runningChessRow += board[i][j].chessType;
			}

			if (j != chessBoard.cols-1){
				runningChessRow += " | ";
			}
		}
		console.log(runningChessRow);
	}
}