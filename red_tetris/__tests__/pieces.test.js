const {
	LPiece,
	JPiece,
	ZPiece,
	SPiece,
	OPiece,
	TPiece,
	IPiece,
  } = require("../src/server/classes/Piece");
  
  describe("Tetris Pieces", () => {
	describe("Initial States", () => {
	  test("LPiece should have correct initial state", () => {
		const piece = new LPiece();
		expect(piece.name).toBe(1);
		expect(piece.shape).toEqual([
		  [0, 0, 1],
		  [1, 1, 1],
		  [0, 0, 0],
		]);
	  });
  
	  test("JPiece should have correct initial state", () => {
		const piece = new JPiece();
		expect(piece.name).toBe(2);
		expect(piece.shape).toEqual([
		  [2, 0, 0],
		  [2, 2, 2],
		  [0, 0, 0],
		]);
	  });
  
	  test("ZPiece should have correct initial state", () => {
		const piece = new ZPiece();
		expect(piece.name).toBe(3);
		expect(piece.shape).toEqual([
		  [3, 3, 0],
		  [0, 3, 3],
		  [0, 0, 0],
		]);
	  });
  
	  test("SPiece should have correct initial state", () => {
		const piece = new SPiece();
		expect(piece.name).toBe(4);
		expect(piece.shape).toEqual([
		  [0, 4, 4],
		  [4, 4, 0],
		  [0, 0, 0],
		]);
	  });
  
	  test("OPiece should have correct initial state", () => {
		const piece = new OPiece();
		expect(piece.name).toBe(5);
		expect(piece.shape).toEqual([
		  [5, 5],
		  [5, 5],
		]);
	  });
  
	  test("TPiece should have correct initial state", () => {
		const piece = new TPiece();
		expect(piece.name).toBe(6);
		expect(piece.shape).toEqual([
		  [0, 6, 0],
		  [6, 6, 6],
		  [0, 0, 0],
		]);
	  });
  
	  test("IPiece should have correct initial state", () => {
		const piece = new IPiece();
		expect(piece.name).toBe(7);
		expect(piece.shape).toEqual([
		  [0, 0, 0, 0],
		  [7, 7, 7, 7],
		  [0, 0, 0, 0],
		  [0, 0, 0, 0],
		]);
	  });
	});
  
	describe("Rotation", () => {
	  const rotationTests = [
		{
		  PieceClass: LPiece,
		  initial: [
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0],
		  ],
		  rotated: [
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 1],
		  ],
		},
		{
		  PieceClass: JPiece,
		  initial: [
			[2, 0, 0],
			[2, 2, 2],
			[0, 0, 0],
		  ],
		  rotated: [
			[0, 2, 2],
			[0, 2, 0],
			[0, 2, 0],
		  ],
		},
		{
		  PieceClass: ZPiece,
		  initial: [
			[3, 3, 0],
			[0, 3, 3],
			[0, 0, 0],
		  ],
		  rotated: [
			[0, 0, 3],
			[0, 3, 3],
			[0, 3, 0],
		  ],
		},
		{
		  PieceClass: SPiece,
		  initial: [
			[0, 4, 4],
			[4, 4, 0],
			[0, 0, 0],
		  ],
		  rotated: [
			[0, 4, 0],
			[0, 4, 4],
			[0, 0, 4],
		  ],
		},
		{
		  PieceClass: TPiece,
		  initial: [
			[0, 6, 0],
			[6, 6, 6],
			[0, 0, 0],
		  ],
		  rotated: [
			[0, 6, 0],
			[0, 6, 6],
			[0, 6, 0],
		  ],
		},
		{
		  PieceClass: IPiece,
		  initial: [
			[0, 0, 0, 0],
			[7, 7, 7, 7],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		  ],
		  rotated: [
			[0, 0, 7, 0],
			[0, 0, 7, 0],
			[0, 0, 7, 0],
			[0, 0, 7, 0],
		  ],
		},
	  ];
  
	  rotationTests.forEach(({ PieceClass, initial, rotated }, index) => {
		test(`${PieceClass.name} rotation should update shape correctly`, () => {
		  const piece = new PieceClass();
		  piece.rotate();
		  expect(piece.shape).toEqual(rotated);
		});
	  });
  
	  test("OPiece rotation should not change shape", () => {
		const piece = new OPiece();
		const initialShape = JSON.parse(JSON.stringify(piece.shape));
		piece.rotate();
		expect(piece.shape).toEqual(initialShape);
	  });
	});
  
	describe("Reverse Rotation", () => {
	  const reverseRotationTests = [
		{
		  PieceClass: LPiece,
		  initial: [
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0],
		  ],
		},
		{
		  PieceClass: JPiece,
		  initial: [
			[2, 0, 0],
			[2, 2, 2],
			[0, 0, 0],
		  ],
		},
		{
		  PieceClass: ZPiece,
		  initial: [
			[3, 3, 0],
			[0, 3, 3],
			[0, 0, 0],
		  ],
		},
		{
		  PieceClass: SPiece,
		  initial: [
			[0, 4, 4],
			[4, 4, 0],
			[0, 0, 0],
		  ],
		},
		{
		  PieceClass: TPiece,
		  initial: [
			[0, 6, 0],
			[6, 6, 6],
			[0, 0, 0],
		  ],
		},
		{
		  PieceClass: IPiece,
		  initial: [
			[0, 0, 0, 0],
			[7, 7, 7, 7],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		  ],
		},
	  ];
  
	  reverseRotationTests.forEach(({ PieceClass, initial }) => {
		test(`${PieceClass.name} reverse rotation should revert to initial shape`, () => {
		  const piece = new PieceClass();
		  piece.rotate();
		  piece.reverseRotate();
		  expect(piece.shape).toEqual(initial);
		});
	  });
	});
  });