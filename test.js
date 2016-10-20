function assert(condition, message) {
    if (!condition) {
        throw message || "failed";
    }
}

// TEST PAWNS

//Test: move white pawn diagonally
var config = [[null,null,null,null,null,null,null,null],
              [null,"WP",null,null,null,null,null,null],
              ["BP","BP","BP",null,null,null,null,null],
              [null,null,null,null,null,null,null,null],
              [null,null,null,null,null,null,null,null],
              [null,null,null,null,null,null,null,null],
              [null,null,null,null,null,null,null,null],
              [null,null,null,null,null,null,null,null]];
var moves = GetListOfLegalChessMovesByPlayer(config, 0); // player white
assert(moves.length == 2);
assert(moves[0].chessPieceType == "P" && moves[0].playerType == 0 && moves[0].source == "b2" && moves[0].destination=="a3", "Failed: move white pawn from b2 to a3");
assert(moves[1].chessPieceType == "P" && moves[1].playerType == 0 && moves[1].source == "b2" && moves[1].destination=="c3", "Failed: move white pawn from b2 to c3");

//Test: move white pawn from b2 to b3 and b4
config = [[null,null,null,null,null,null,null,null],
          [null,"WP",null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null]];
moves = GetListOfLegalChessMovesByPlayer(config, 0);
assert(moves.length == 2);
assert(moves[0].chessPieceType == "P" && moves[0].playerType == 0 && moves[0].source == "b2" && moves[0].destination=="b3", "Failed: move white pawn from b2 to b3");
assert(moves[1].chessPieceType == "P" && moves[1].playerType == 0 && moves[1].source == "b2" && moves[1].destination=="b4", "Failed: move white pawn from b2 to b4");

//Test: pawn already moved
config = [[null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,"WP",null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null]];
moves = GetListOfLegalChessMovesByPlayer(config, 0);
assert(moves.length == 1);
assert(moves[0].chessPieceType == "P" && moves[0].playerType == 0 && moves[0].source == "b3" && moves[0].destination=="b4", "Failed: after initial move, pawn can only move forward a space of one");

// Test: White pawns should not capture White pieces
config = [[null,null,null,null,null,null,null,null],
          [null,"WP",null,null,null,null,null,null],
          ["WP","WP","WP",null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null]];
moves = GetListOfLegalChessMovesByPlayer(config, 0);
assert(moves.length == 3, "Failed: white pawn should not capture white pieces"); // should only be 3 possible moves, a3-> a4, b3->b4, or c3->c4
for(var i = 0; i < moves.length; i ++){
    if(moves[i].source=="b2"){ // b2 should not move
        assert(true, "Failed: white pawn should not capture white pieces");
    }
}
// Test: White boundary
config = [[null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          ["WP",null,null,null,null,null,null,null]];
moves = GetListOfLegalChessMovesByPlayer(config, 0);
assert(moves.length == 0, "Failed: white pawn should not be able to move"); // should only be 3 possible moves, a3-> a4, b3->b4, or c3->c4

// Test: Black Moves
config = [[null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,"WP",null,null,null,null,null,null],
          ["WP",null,"BP",null,null,null,null,null],
          [null,"BP",null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null]];
moves = GetListOfLegalChessMovesByPlayer(config, 1);
assert(moves.length == 4, "Failed: only 4 moves for black."); // should only be 3 possible moves, a3-> a4, b3->b4, or c3->c4
assert(moves[0].chessPieceType == "P" && moves[0].playerType == 1 && moves[0].source == "c6" && moves[0].destination=="c5", "Failed: black pawn c6 to c5");
assert(moves[1].chessPieceType == "P" && moves[1].playerType == 1 && moves[1].source == "c6" && moves[1].destination=="b5", "Failed: black pawn c6 to b5");
assert(moves[2].chessPieceType == "P" && moves[2].playerType == 1 && moves[2].source == "b7" && moves[2].destination=="b6", "Failed: black pawn b7 to b6");
assert(moves[3].chessPieceType == "P" && moves[3].playerType == 1 && moves[3].source == "b7" && moves[3].destination=="a6", "Failed: black pawn b7 to a6");


// Test Knights


// Test all movement positions for white knight clockwise from NE position
config = [[null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,"WN",null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null]];
moves = GetListOfLegalChessMovesByPlayer(config, 0);
assert(moves.length = 8);
assert(moves[0].chessPieceType == "N" && moves[0].playerType == 0 && moves[0].source == "d4" && moves[0].destination=="e2", "Failed: white knight d4 to e2");
assert(moves[1].chessPieceType == "N" && moves[1].playerType == 0 && moves[1].source == "d4" && moves[1].destination=="f3", "Failed: white knight d4 to f3");
assert(moves[2].chessPieceType == "N" && moves[2].playerType == 0 && moves[2].source == "d4" && moves[2].destination=="f5", "Failed: white knight d4 to f5");
assert(moves[3].chessPieceType == "N" && moves[3].playerType == 0 && moves[3].source == "d4" && moves[3].destination=="e6", "Failed: white knight d4 to e6");
assert(moves[4].chessPieceType == "N" && moves[4].playerType == 0 && moves[4].source == "d4" && moves[4].destination=="c6", "Failed: white knight d4 to c6");
assert(moves[5].chessPieceType == "N" && moves[5].playerType == 0 && moves[5].source == "d4" && moves[5].destination=="b5", "Failed: white knight d4 to b5");
assert(moves[6].chessPieceType == "N" && moves[6].playerType == 0 && moves[6].source == "d4" && moves[6].destination=="b3", "Failed: white knight d4 to b3");

// Test all movement positions for black clockwise from NE position
config = [[null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,"BN",null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null]];
moves = GetListOfLegalChessMovesByPlayer(config, 1);
assert(moves.length = 8);
assert(moves[0].chessPieceType == "N" && moves[0].playerType == 1 && moves[0].source == "d4" && moves[0].destination=="e2", "Failed: black knight d4 to e2");
assert(moves[1].chessPieceType == "N" && moves[1].playerType == 1 && moves[1].source == "d4" && moves[1].destination=="f3", "Failed: black knight d4 to f3");
assert(moves[2].chessPieceType == "N" && moves[2].playerType == 1 && moves[2].source == "d4" && moves[2].destination=="f5", "Failed: black knight d4 to f5");
assert(moves[3].chessPieceType == "N" && moves[3].playerType == 1 && moves[3].source == "d4" && moves[3].destination=="e6", "Failed: black knight d4 to e6");
assert(moves[4].chessPieceType == "N" && moves[4].playerType == 1 && moves[4].source == "d4" && moves[4].destination=="c6", "Failed: black knight d4 to c6");
assert(moves[5].chessPieceType == "N" && moves[5].playerType == 1 && moves[5].source == "d4" && moves[5].destination=="b5", "Failed: black knight d4 to b5");
assert(moves[6].chessPieceType == "N" && moves[6].playerType == 1 && moves[6].source == "d4" && moves[6].destination=="b3", "Failed: black knight d4 to b3");

// Test White Knight Starting position
config = [[null,"WN",null,null,null,null,"WN",null],
          ["WP","WP","WP","WP","WP","WP","WP","WP"],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null]];
moves = GetListOfLegalChessMovesByPlayer(config, 0);
assert(moves.length = 20, "Failed: white knight starting position");
for(var i = 0; i < moves.length; i++){
    if(moves[i].chessPieceType == "N"){
        assert(moves[i].destination == "a3" || moves[i].destination == "c3" || moves[i].destination == "f3" || moves[i].destination == "h3", "Failed: only a3, c3, f3, h3 are possible destinations for the white knights");
    }
}


// Test White Knight capture
config = [[null,null,null,null,null,null,null,null],
          [null,null,null,null,"BN",null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,"WN",null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null]];
moves = GetListOfLegalChessMovesByPlayer(config, 0);
assert(moves.length > 0);
assert(moves[0].chessPieceType == "N" && moves[0].playerType == 0 && moves[0].source == "d4" && moves[0].destination=="e2", "Failed: white knight d4 to e2");

// Test black Knight capture of white knight
moves = GetListOfLegalChessMovesByPlayer(config, 1);
assert(moves.length > 0);
assert(moves[3].chessPieceType == "N" && moves[3].playerType == 1 && moves[3].source == "e2" && moves[3].destination=="d4", "Failed: black knight e2 to d4");


// Test blocking white knight from moving
// Test White Knight capture
config = [[null,null,null,null,null,null,null,null],
          [null,null,"WP",null,"WP",null,null,null],
          [null,"WP",null,null,null,"WP",null,null],
          [null,null,null,"WN",null,null,null,null],
          [null,"WP",null,null,null,"WP",null,null],
          [null,null,"WP",null,"WP",null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null]];
moves = GetListOfLegalChessMovesByPlayer(config, 0);
assert(moves.length > 0);
for(var i = 0; i < moves.length; i++){
    assert(moves[i].chessPieceType != "N", "Failed: White Knight should have no possible moves.");
}

// Test White Knight boundaries
config = [["WN",null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null]];
moves = GetListOfLegalChessMovesByPlayer(config, 0);
assert(moves.length == 2, "Failed: White Knight should only have 2 possible moves.");