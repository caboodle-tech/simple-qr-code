/*! @license
 * Simple QR Code v1.0.0 Copyright (c) 2026 Caboodle Tech Inc.
 * License and source code available at: https://github.com/caboodle-tech/simple-qr-code
 */
var QRCodeGenerator = class {
	#MODE = {
		MODE_NUMBER: 1,
		MODE_ALPHA_NUM: 2,
		MODE_8BIT_BYTE: 4,
		MODE_KANJI: 8
	};
	#ERROR_CORRECTION = {
		L: 1,
		M: 0,
		Q: 3,
		H: 2
	};
	#MASK_PATTERN = {
		PATTERN000: 0,
		PATTERN001: 1,
		PATTERN010: 2,
		PATTERN011: 3,
		PATTERN100: 4,
		PATTERN101: 5,
		PATTERN110: 6,
		PATTERN111: 7
	};

	#GF_EXP_TABLE = null;
	#GF_LOG_TABLE = null;

	#G15 = 1335;
	#G15_MASK = 21522;
	#G18 = 7973;

	#PAD0 = 236;
	#PAD1 = 17;

	#PATTERN_POSITION_TABLE = [
		[],
		[6, 18],
		[6, 22],
		[6, 26],
		[6, 30],
		[6, 34],
		[
			6,
			22,
			38
		],
		[
			6,
			24,
			42
		],
		[
			6,
			26,
			46
		],
		[
			6,
			28,
			50
		],
		[
			6,
			30,
			54
		],
		[
			6,
			32,
			58
		],
		[
			6,
			34,
			62
		],
		[
			6,
			26,
			46,
			66
		],
		[
			6,
			26,
			48,
			70
		],
		[
			6,
			26,
			50,
			74
		],
		[
			6,
			30,
			54,
			78
		],
		[
			6,
			30,
			56,
			82
		],
		[
			6,
			30,
			58,
			86
		],
		[
			6,
			34,
			62,
			90
		],
		[
			6,
			28,
			50,
			72,
			94
		],
		[
			6,
			26,
			50,
			74,
			98
		],
		[
			6,
			30,
			54,
			78,
			102
		],
		[
			6,
			28,
			54,
			80,
			106
		],
		[
			6,
			32,
			58,
			84,
			110
		],
		[
			6,
			30,
			58,
			86,
			114
		],
		[
			6,
			34,
			62,
			90,
			118
		],
		[
			6,
			26,
			50,
			74,
			98,
			122
		],
		[
			6,
			30,
			54,
			78,
			102,
			126
		],
		[
			6,
			26,
			52,
			78,
			104,
			130
		],
		[
			6,
			30,
			56,
			82,
			108,
			134
		],
		[
			6,
			34,
			60,
			86,
			112,
			138
		],
		[
			6,
			30,
			58,
			86,
			114,
			142
		],
		[
			6,
			34,
			62,
			90,
			118,
			146
		],
		[
			6,
			30,
			54,
			78,
			102,
			126,
			150
		],
		[
			6,
			24,
			50,
			76,
			102,
			128,
			154
		],
		[
			6,
			28,
			54,
			80,
			106,
			132,
			158
		],
		[
			6,
			32,
			58,
			84,
			110,
			136,
			162
		],
		[
			6,
			26,
			54,
			82,
			110,
			138,
			166
		],
		[
			6,
			30,
			58,
			86,
			114,
			142,
			170
		]
	];
	#RS_BLOCK_TABLE = [
		[
			1,
			26,
			19
		],
		[
			1,
			26,
			16
		],
		[
			1,
			26,
			13
		],
		[
			1,
			26,
			9
		],
		[
			1,
			44,
			34
		],
		[
			1,
			44,
			28
		],
		[
			1,
			44,
			22
		],
		[
			1,
			44,
			16
		],
		[
			1,
			70,
			55
		],
		[
			1,
			70,
			44
		],
		[
			2,
			35,
			17
		],
		[
			2,
			35,
			13
		],
		[
			1,
			100,
			80
		],
		[
			2,
			50,
			32
		],
		[
			2,
			50,
			24
		],
		[
			4,
			25,
			9
		],
		[
			1,
			134,
			108
		],
		[
			2,
			67,
			43
		],
		[
			2,
			33,
			15,
			2,
			34,
			16
		],
		[
			2,
			33,
			11,
			2,
			34,
			12
		],
		[
			2,
			86,
			68
		],
		[
			4,
			43,
			27
		],
		[
			4,
			43,
			19
		],
		[
			4,
			43,
			15
		],
		[
			2,
			98,
			78
		],
		[
			4,
			49,
			31
		],
		[
			2,
			32,
			14,
			4,
			33,
			15
		],
		[
			4,
			39,
			13,
			1,
			40,
			14
		],
		[
			2,
			121,
			97
		],
		[
			2,
			60,
			38,
			2,
			61,
			39
		],
		[
			4,
			40,
			18,
			2,
			41,
			19
		],
		[
			4,
			40,
			14,
			2,
			41,
			15
		],
		[
			2,
			146,
			116
		],
		[
			3,
			58,
			36,
			2,
			59,
			37
		],
		[
			4,
			36,
			16,
			4,
			37,
			17
		],
		[
			4,
			36,
			12,
			4,
			37,
			13
		],
		[
			2,
			86,
			68,
			2,
			87,
			69
		],
		[
			4,
			69,
			43,
			1,
			70,
			44
		],
		[
			6,
			43,
			19,
			2,
			44,
			20
		],
		[
			6,
			43,
			15,
			2,
			44,
			16
		],
		[
			4,
			101,
			81
		],
		[
			1,
			80,
			50,
			4,
			81,
			51
		],
		[
			4,
			50,
			22,
			4,
			51,
			23
		],
		[
			3,
			36,
			12,
			8,
			37,
			13
		],
		[
			2,
			116,
			92,
			2,
			117,
			93
		],
		[
			6,
			58,
			36,
			2,
			59,
			37
		],
		[
			4,
			46,
			20,
			6,
			47,
			21
		],
		[
			7,
			42,
			14,
			4,
			43,
			15
		],
		[
			4,
			133,
			107
		],
		[
			8,
			59,
			37,
			1,
			60,
			38
		],
		[
			8,
			44,
			20,
			4,
			45,
			21
		],
		[
			12,
			33,
			11,
			4,
			34,
			12
		],
		[
			3,
			145,
			115,
			1,
			146,
			116
		],
		[
			4,
			64,
			40,
			5,
			65,
			41
		],
		[
			11,
			36,
			16,
			5,
			37,
			17
		],
		[
			11,
			36,
			12,
			5,
			37,
			13
		],
		[
			5,
			109,
			87,
			1,
			110,
			88
		],
		[
			5,
			65,
			41,
			5,
			66,
			42
		],
		[
			5,
			54,
			24,
			7,
			55,
			25
		],
		[
			11,
			36,
			12,
			7,
			37,
			13
		],
		[
			5,
			122,
			98,
			1,
			123,
			99
		],
		[
			7,
			73,
			45,
			3,
			74,
			46
		],
		[
			15,
			43,
			19,
			2,
			44,
			20
		],
		[
			3,
			45,
			15,
			13,
			46,
			16
		],
		[
			1,
			135,
			107,
			5,
			136,
			108
		],
		[
			10,
			74,
			46,
			1,
			75,
			47
		],
		[
			1,
			50,
			22,
			15,
			51,
			23
		],
		[
			2,
			42,
			14,
			17,
			43,
			15
		],
		[
			5,
			150,
			120,
			1,
			151,
			121
		],
		[
			9,
			69,
			43,
			4,
			70,
			44
		],
		[
			17,
			50,
			22,
			1,
			51,
			23
		],
		[
			2,
			42,
			14,
			19,
			43,
			15
		],
		[
			3,
			141,
			113,
			4,
			142,
			114
		],
		[
			3,
			70,
			44,
			11,
			71,
			45
		],
		[
			17,
			47,
			21,
			4,
			48,
			22
		],
		[
			9,
			39,
			13,
			16,
			40,
			14
		],
		[
			3,
			135,
			107,
			5,
			136,
			108
		],
		[
			3,
			67,
			41,
			13,
			68,
			42
		],
		[
			15,
			54,
			24,
			5,
			55,
			25
		],
		[
			15,
			43,
			15,
			10,
			44,
			16
		],
		[
			4,
			144,
			116,
			4,
			145,
			117
		],
		[
			17,
			68,
			42
		],
		[
			17,
			50,
			22,
			6,
			51,
			23
		],
		[
			19,
			46,
			16,
			6,
			47,
			17
		],
		[
			2,
			139,
			111,
			7,
			140,
			112
		],
		[
			17,
			74,
			46
		],
		[
			7,
			54,
			24,
			16,
			55,
			25
		],
		[
			34,
			37,
			13
		],
		[
			4,
			151,
			121,
			5,
			152,
			122
		],
		[
			4,
			75,
			47,
			14,
			76,
			48
		],
		[
			11,
			54,
			24,
			14,
			55,
			25
		],
		[
			16,
			45,
			15,
			14,
			46,
			16
		],
		[
			6,
			147,
			117,
			4,
			148,
			118
		],
		[
			6,
			73,
			45,
			14,
			74,
			46
		],
		[
			11,
			54,
			24,
			16,
			55,
			25
		],
		[
			30,
			46,
			16,
			2,
			47,
			17
		],
		[
			8,
			132,
			106,
			4,
			133,
			107
		],
		[
			8,
			75,
			47,
			13,
			76,
			48
		],
		[
			7,
			54,
			24,
			22,
			55,
			25
		],
		[
			22,
			45,
			15,
			13,
			46,
			16
		],
		[
			10,
			142,
			114,
			2,
			143,
			115
		],
		[
			19,
			74,
			46,
			4,
			75,
			47
		],
		[
			28,
			50,
			22,
			6,
			51,
			23
		],
		[
			33,
			46,
			16,
			4,
			47,
			17
		],
		[
			8,
			152,
			122,
			4,
			153,
			123
		],
		[
			22,
			73,
			45,
			3,
			74,
			46
		],
		[
			8,
			53,
			23,
			26,
			54,
			24
		],
		[
			12,
			45,
			15,
			28,
			46,
			16
		],
		[
			3,
			147,
			117,
			10,
			148,
			118
		],
		[
			3,
			73,
			45,
			23,
			74,
			46
		],
		[
			4,
			54,
			24,
			31,
			55,
			25
		],
		[
			11,
			45,
			15,
			31,
			46,
			16
		],
		[
			7,
			146,
			116,
			7,
			147,
			117
		],
		[
			21,
			73,
			45,
			7,
			74,
			46
		],
		[
			1,
			53,
			23,
			37,
			54,
			24
		],
		[
			19,
			45,
			15,
			26,
			46,
			16
		],
		[
			5,
			145,
			115,
			10,
			146,
			116
		],
		[
			19,
			75,
			47,
			10,
			76,
			48
		],
		[
			15,
			54,
			24,
			25,
			55,
			25
		],
		[
			23,
			45,
			15,
			25,
			46,
			16
		],
		[
			13,
			145,
			115,
			3,
			146,
			116
		],
		[
			2,
			74,
			46,
			29,
			75,
			47
		],
		[
			42,
			54,
			24,
			1,
			55,
			25
		],
		[
			23,
			45,
			15,
			28,
			46,
			16
		],
		[
			17,
			145,
			115
		],
		[
			10,
			74,
			46,
			23,
			75,
			47
		],
		[
			10,
			54,
			24,
			35,
			55,
			25
		],
		[
			19,
			45,
			15,
			35,
			46,
			16
		],
		[
			17,
			145,
			115,
			1,
			146,
			116
		],
		[
			14,
			74,
			46,
			21,
			75,
			47
		],
		[
			29,
			54,
			24,
			19,
			55,
			25
		],
		[
			11,
			45,
			15,
			46,
			46,
			16
		],
		[
			13,
			145,
			115,
			6,
			146,
			116
		],
		[
			14,
			74,
			46,
			23,
			75,
			47
		],
		[
			44,
			54,
			24,
			7,
			55,
			25
		],
		[
			59,
			46,
			16,
			1,
			47,
			17
		],
		[
			12,
			151,
			121,
			7,
			152,
			122
		],
		[
			12,
			75,
			47,
			26,
			76,
			48
		],
		[
			39,
			54,
			24,
			14,
			55,
			25
		],
		[
			22,
			45,
			15,
			41,
			46,
			16
		],
		[
			6,
			151,
			121,
			14,
			152,
			122
		],
		[
			6,
			75,
			47,
			34,
			76,
			48
		],
		[
			46,
			54,
			24,
			10,
			55,
			25
		],
		[
			2,
			45,
			15,
			64,
			46,
			16
		],
		[
			17,
			152,
			122,
			4,
			153,
			123
		],
		[
			29,
			74,
			46,
			14,
			75,
			47
		],
		[
			49,
			54,
			24,
			10,
			55,
			25
		],
		[
			24,
			45,
			15,
			46,
			46,
			16
		],
		[
			4,
			152,
			122,
			18,
			153,
			123
		],
		[
			13,
			74,
			46,
			32,
			75,
			47
		],
		[
			48,
			54,
			24,
			14,
			55,
			25
		],
		[
			42,
			45,
			15,
			32,
			46,
			16
		],
		[
			20,
			147,
			117,
			4,
			148,
			118
		],
		[
			40,
			75,
			47,
			7,
			76,
			48
		],
		[
			43,
			54,
			24,
			22,
			55,
			25
		],
		[
			10,
			45,
			15,
			67,
			46,
			16
		],
		[
			19,
			148,
			118,
			6,
			149,
			119
		],
		[
			18,
			75,
			47,
			31,
			76,
			48
		],
		[
			34,
			54,
			24,
			34,
			55,
			25
		],
		[
			20,
			45,
			15,
			61,
			46,
			16
		]
	];

	constructor() {
		this.#GF_EXP_TABLE = new Array(256);
		this.#GF_LOG_TABLE = new Array(256);
		for (let i = 0; i < 8; i += 1) this.#GF_EXP_TABLE[i] = 1 << i;
		for (let i = 8; i < 256; i += 1) this.#GF_EXP_TABLE[i] = this.#GF_EXP_TABLE[i - 4] ^ this.#GF_EXP_TABLE[i - 5] ^ this.#GF_EXP_TABLE[i - 6] ^ this.#GF_EXP_TABLE[i - 8];
		for (let i = 0; i < 255; i += 1) this.#GF_LOG_TABLE[this.#GF_EXP_TABLE[i]] = i;
	}

	#gfLog(n) {
		if (n < 1) throw new Error(`glog(${n})`);
		return this.#GF_LOG_TABLE[n];
	}

	#gfExp(n) {
		let num = n;
		while (num < 0) num += 255;
		while (num >= 256) num -= 255;
		return this.#GF_EXP_TABLE[num];
	}

	#getPatternPosition(typeNumber) {
		return this.#PATTERN_POSITION_TABLE[typeNumber - 1];
	}

	#isPositioningElement(row, col, moduleCount) {
		const elemWidth = 7;
		return row <= elemWidth ? col <= elemWidth || col >= moduleCount - elemWidth : col <= elemWidth ? row >= moduleCount - elemWidth : false;
	}

	#getBCHDigit(data) {
		let digit = 0;
		let num = data;
		while (num !== 0) {
			digit += 1;
			num >>>= 1;
		}
		return digit;
	}

	#getBCHTypeInfo(data) {
		let d = data << 10;
		while (this.#getBCHDigit(d) - this.#getBCHDigit(this.#G15) >= 0) d ^= this.#G15 << this.#getBCHDigit(d) - this.#getBCHDigit(this.#G15);
		return (data << 10 | d) ^ this.#G15_MASK;
	}

	#getBCHTypeNumber(data) {
		let d = data << 12;
		while (this.#getBCHDigit(d) - this.#getBCHDigit(this.#G18) >= 0) d ^= this.#G18 << this.#getBCHDigit(d) - this.#getBCHDigit(this.#G18);
		return data << 12 | d;
	}
	#getMaskFunction(maskPattern) {
		switch (maskPattern) {
			case this.#MASK_PATTERN.PATTERN000: return (i, j) => {
				return (i + j) % 2 === 0;
			};
			case this.#MASK_PATTERN.PATTERN001: return (i, _j) => {
				return i % 2 === 0;
			};
			case this.#MASK_PATTERN.PATTERN010: return (i, j) => {
				return j % 3 === 0;
			};
			case this.#MASK_PATTERN.PATTERN011: return (i, j) => {
				return (i + j) % 3 === 0;
			};
			case this.#MASK_PATTERN.PATTERN100: return (i, j) => {
				return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
			};
			case this.#MASK_PATTERN.PATTERN101: return (i, j) => {
				return i * j % 2 + i * j % 3 === 0;
			};
			case this.#MASK_PATTERN.PATTERN110: return (i, j) => {
				return (i * j % 2 + i * j % 3) % 2 === 0;
			};
			case this.#MASK_PATTERN.PATTERN111: return (i, j) => {
				return (i * j % 3 + (i + j) % 2) % 2 === 0;
			};
			default: throw new Error(`bad maskPattern:${maskPattern}`);
		}
	}

	#getLengthInBits(mode, type) {
		if (1 <= type && type < 10) switch (mode) {
			case this.#MODE.MODE_NUMBER: return 10;
			case this.#MODE.MODE_ALPHA_NUM: return 9;
			case this.#MODE.MODE_8BIT_BYTE: return 8;
			case this.#MODE.MODE_KANJI: return 8;
			default: throw new Error(`mode:${mode}`);
		}
		else if (type < 27) switch (mode) {
			case this.#MODE.MODE_NUMBER: return 12;
			case this.#MODE.MODE_ALPHA_NUM: return 11;
			case this.#MODE.MODE_8BIT_BYTE: return 16;
			case this.#MODE.MODE_KANJI: return 10;
			default: throw new Error(`mode:${mode}`);
		}
		else if (type < 41) switch (mode) {
			case this.#MODE.MODE_NUMBER: return 14;
			case this.#MODE.MODE_ALPHA_NUM: return 13;
			case this.#MODE.MODE_8BIT_BYTE: return 16;
			case this.#MODE.MODE_KANJI: return 12;
			default: throw new Error(`mode:${mode}`);
		}
		else throw new Error(`type:${type}`);
	}
	#getErrorCorrectPolynomial(errorCorrectLength) {
		let a = this.#createPolynomial([1], 0);
		for (let i = 0; i < errorCorrectLength; i += 1) a = a.multiply(this.#createPolynomial([1, this.#gfExp(i)], 0));
		return a;
	}

	#getLostPoint(qr) {
		const moduleCount = qr.getModuleCount();
		let lostPoint = 0;
		for (let row = 0; row < moduleCount; row += 1) for (let col = 0; col < moduleCount; col += 1) {
			let sameCount = 0;
			const dark = qr.isDark(row, col);
			for (let r = -1; r <= 1; r += 1) {
				if (row + r < 0 || moduleCount <= row + r) continue;
				for (let c = -1; c <= 1; c += 1) {
					if (col + c < 0 || moduleCount <= col + c) continue;
					if (r === 0 && c === 0) continue;
					if (dark === qr.isDark(row + r, col + c)) sameCount += 1;
				}
			}
			if (sameCount > 5) lostPoint += 3 + sameCount - 5;
		}
		for (let row = 0; row < moduleCount - 1; row += 1) for (let col = 0; col < moduleCount - 1; col += 1) {
			let count = 0;
			if (qr.isDark(row, col)) count += 1;
			if (qr.isDark(row + 1, col)) count += 1;
			if (qr.isDark(row, col + 1)) count += 1;
			if (qr.isDark(row + 1, col + 1)) count += 1;
			if (count === 0 || count === 4) lostPoint += 3;
		}
		for (let row = 0; row < moduleCount; row += 1) for (let col = 0; col < moduleCount - 6; col += 1) if (qr.isDark(row, col) && !qr.isDark(row, col + 1) && qr.isDark(row, col + 2) && qr.isDark(row, col + 3) && qr.isDark(row, col + 4) && !qr.isDark(row, col + 5) && qr.isDark(row, col + 6)) lostPoint += 40;
		for (let col = 0; col < moduleCount; col += 1) for (let row = 0; row < moduleCount - 6; row += 1) if (qr.isDark(row, col) && !qr.isDark(row + 1, col) && qr.isDark(row + 2, col) && qr.isDark(row + 3, col) && qr.isDark(row + 4, col) && !qr.isDark(row + 5, col) && qr.isDark(row + 6, col)) lostPoint += 40;
		let darkCount = 0;
		for (let col = 0; col < moduleCount; col += 1) for (let row = 0; row < moduleCount; row += 1) if (qr.isDark(row, col)) darkCount += 1;
		const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
		lostPoint += ratio * 10;
		return lostPoint;
	}

	#createPolynomial(num, shift) {
		if (typeof num.length === "undefined") throw new Error(`${num.length}/${shift}`);
		const _num = (() => {
			let offset = 0;
			while (offset < num.length && num[offset] === 0) offset += 1;
			const result = new Array(num.length - offset + shift);
			for (let i = 0; i < num.length - offset; i += 1) result[i] = num[i + offset];
			return result;
		})();
		const poly = this;
		return {
			getAt: (index) => {
				return _num[index];
			},
			getLength: () => {
				return _num.length;
			},
			multiply: (e) => {
				const result = new Array(_num.length + e.getLength() - 1);
				for (let i = 0; i < _num.length; i += 1) for (let j = 0; j < e.getLength(); j += 1) result[i + j] ^= poly.#gfExp(poly.#gfLog(_num[i]) + poly.#gfLog(e.getAt(j)));
				return poly.#createPolynomial(result, 0);
			},
			mod: (e) => {
				if (_num.length - e.getLength() < 0) return poly.#createPolynomial(_num, 0);
				const ratio = poly.#gfLog(_num[0]) - poly.#gfLog(e.getAt(0));
				const result = new Array(_num.length);
				for (let i = 0; i < _num.length; i += 1) result[i] = _num[i];
				for (let i = 0; i < e.getLength(); i += 1) result[i] ^= poly.#gfExp(poly.#gfLog(e.getAt(i)) + ratio);
				return poly.#createPolynomial(result, 0).mod(e);
			}
		};
	}

	#createBitBuffer() {
		const _buffer = [];
		let _length = 0;
		const putBit = (bit) => {
			const bufIndex = Math.floor(_length / 8);
			if (_buffer.length <= bufIndex) _buffer.push(0);
			if (bit) _buffer[bufIndex] |= 128 >>> _length % 8;
			_length += 1;
		};
		return {
			getBuffer: () => {
				return _buffer;
			},
			getAt: (index) => {
				return (_buffer[Math.floor(index / 8)] >>> 7 - index % 8 & 1) === 1;
			},
			put: (num, length) => {
				for (let i = 0; i < length; i += 1) putBit((num >>> length - i - 1 & 1) === 1);
			},
			getLengthInBits: () => {
				return _length;
			},
			putBit
		};
	}

	#create8BitByte(data) {
		const _mode = this.#MODE.MODE_8BIT_BYTE;
		const _bytes = (() => {
			const bytes = [];
			for (let i = 0; i < data.length; i += 1) {
				const c = data.charCodeAt(i);
				bytes.push(c & 255);
			}
			return bytes;
		})();
		return {
			getMode: () => {
				return _mode;
			},
			getLength: () => {
				return _bytes.length;
			},
			write: (buffer) => {
				for (let i = 0; i < _bytes.length; i += 1) buffer.put(_bytes[i], 8);
			}
		};
	}
	#getRSBlocks(typeNumber, errorCorrectionLevel) {
		const ecValue = typeof errorCorrectionLevel === "number" ? errorCorrectionLevel : this.#ERROR_CORRECTION[errorCorrectionLevel];
		let rsBlock;
		switch (ecValue) {
			case 1:
				rsBlock = this.#RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
				break;
			case 0:
				rsBlock = this.#RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
				break;
			case 3:
				rsBlock = this.#RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
				break;
			case 2:
				rsBlock = this.#RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
				break;
			default: throw new Error(`bad rs block @ typeNumber:${typeNumber}/errorCorrectionLevel:${errorCorrectionLevel}`);
		}
		const length = rsBlock.length / 3;
		const list = [];
		for (let i = 0; i < length; i += 1) {
			const count = rsBlock[i * 3 + 0];
			const totalCount = rsBlock[i * 3 + 1];
			const dataCount = rsBlock[i * 3 + 2];
			for (let j = 0; j < count; j += 1) list.push({
				totalCount,
				dataCount
			});
		}
		return list;
	}

	#renderPositionPattern(svg, x, y, margin, ringColor, centerColor, backgroundColor, positionMarkerRadius) {
		const ns = "http://www.w3.org/2000/svg";
		const baseRadius = positionMarkerRadius > 0 ? 1 + positionMarkerRadius / 100 * 4 : 0;
		const outerRadius = baseRadius > 0 ? Math.min(baseRadius, 3.5) : 0;
		const outerRect = document.createElementNS(ns, "rect");
		outerRect.setAttribute("x", x + margin);
		outerRect.setAttribute("y", y + margin);
		outerRect.setAttribute("width", 7);
		outerRect.setAttribute("height", 7);
		outerRect.setAttribute("fill", ringColor);
		if (outerRadius > 0) {
			outerRect.setAttribute("rx", outerRadius);
			outerRect.setAttribute("ry", outerRadius);
		}
		svg.appendChild(outerRect);
		const innerRect = document.createElementNS(ns, "rect");
		innerRect.setAttribute("x", x + margin + 1);
		innerRect.setAttribute("y", y + margin + 1);
		innerRect.setAttribute("width", 5);
		innerRect.setAttribute("height", 5);
		innerRect.setAttribute("fill", backgroundColor);
		if (outerRadius > 0) {
			innerRect.setAttribute("rx", outerRadius);
			innerRect.setAttribute("ry", outerRadius);
		}
		svg.appendChild(innerRect);
		const centerRadius = baseRadius > 0 ? Math.min(baseRadius, 1.5) : 0;
		const centerRect = document.createElementNS(ns, "rect");
		centerRect.setAttribute("x", x + margin + 2);
		centerRect.setAttribute("y", y + margin + 2);
		centerRect.setAttribute("width", 3);
		centerRect.setAttribute("height", 3);
		centerRect.setAttribute("fill", centerColor);
		if (centerRadius > 0) {
			centerRect.setAttribute("rx", centerRadius);
			centerRect.setAttribute("ry", centerRadius);
		}
		svg.appendChild(centerRect);
	}

	#createQRCodeInstance(typeNumber, errorCorrectionLevel) {
		const generator = this;
		let version = typeNumber;
		const ecLevel = this.#ERROR_CORRECTION[errorCorrectionLevel];
		let modules = null;
		let moduleCount = 0;
		let dataCache = null;
		const dataList = [];
		const qrInstance = {};
		const makeImpl = (test, maskPattern) => {
			moduleCount = version * 4 + 17;
			modules = (() => {
				const moduleArray = new Array(moduleCount);
				for (let row = 0; row < moduleCount; row += 1) {
					moduleArray[row] = new Array(moduleCount);
					for (let col = 0; col < moduleCount; col += 1) moduleArray[row][col] = null;
				}
				return moduleArray;
			})();
			setupPositionProbePattern(0, 0);
			setupPositionProbePattern(moduleCount - 7, 0);
			setupPositionProbePattern(0, moduleCount - 7);
			setupPositionAdjustPattern();
			setupTimingPattern();
			setupTypeInfo(test, maskPattern);
			if (version >= 7) setupTypeNumber(test);
			if (dataCache === null) dataCache = createData(version, ecLevel, dataList);
			mapData(dataCache, maskPattern);
		};
		const setupPositionProbePattern = (row, col) => {
			for (let r = -1; r <= 7; r += 1) {
				if (row + r <= -1 || moduleCount <= row + r) continue;
				for (let c = -1; c <= 7; c += 1) {
					if (col + c <= -1 || moduleCount <= col + c) continue;
					if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) modules[row + r][col + c] = true;
					else modules[row + r][col + c] = false;
				}
			}
		};
		const getBestMaskPattern = () => {
			let minLostPoint = 0;
			let pattern = 0;
			for (let i = 0; i < 8; i += 1) {
				makeImpl(true, i);
				const lostPoint = generator.#getLostPoint(qrInstance);
				if (i === 0 || minLostPoint > lostPoint) {
					minLostPoint = lostPoint;
					pattern = i;
				}
			}
			return pattern;
		};
		const setupTimingPattern = () => {
			for (let r = 8; r < moduleCount - 8; r += 1) {
				if (modules[r][6] !== null) continue;
				modules[r][6] = r % 2 === 0;
			}
			for (let c = 8; c < moduleCount - 8; c += 1) {
				if (modules[6][c] !== null) continue;
				modules[6][c] = c % 2 === 0;
			}
		};
		const setupPositionAdjustPattern = () => {
			const pos = generator.#getPatternPosition(version);
			for (let i = 0; i < pos.length; i += 1) for (let j = 0; j < pos.length; j += 1) {
				const row = pos[i];
				const col = pos[j];
				if (modules[row][col] !== null) continue;
				for (let r = -2; r <= 2; r += 1) for (let c = -2; c <= 2; c += 1) if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) modules[row + r][col + c] = true;
				else modules[row + r][col + c] = false;
			}
		};
		const setupTypeNumber = (test) => {
			const bits = generator.#getBCHTypeNumber(version);
			for (let i = 0; i < 18; i += 1) {
				const mod = !test && (bits >> i & 1) === 1;
				modules[Math.floor(i / 3)][i % 3 + moduleCount - 8 - 3] = mod;
			}
			for (let i = 0; i < 18; i += 1) {
				const mod = !test && (bits >> i & 1) === 1;
				modules[i % 3 + moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
			}
		};
		const setupTypeInfo = (test, maskPattern) => {
			const data = ecLevel << 3 | maskPattern;
			const bits = generator.#getBCHTypeInfo(data);
			for (let i = 0; i < 15; i += 1) {
				const mod = !test && (bits >> i & 1) === 1;
				if (i < 6) modules[i][8] = mod;
				else if (i < 8) modules[i + 1][8] = mod;
				else modules[moduleCount - 15 + i][8] = mod;
			}
			for (let i = 0; i < 15; i += 1) {
				const mod = !test && (bits >> i & 1) === 1;
				if (i < 8) modules[8][moduleCount - i - 1] = mod;
				else if (i < 9) modules[8][15 - i - 1 + 1] = mod;
				else modules[8][15 - i - 1] = mod;
			}
			modules[moduleCount - 8][8] = !test;
		};
		const mapData = (data, maskPattern) => {
			let inc = -1;
			let row = moduleCount - 1;
			let bitIndex = 7;
			let byteIndex = 0;
			const maskFunc = generator.#getMaskFunction(maskPattern);
			for (let col = moduleCount - 1; col > 0; col -= 2) {
				if (col === 6) col -= 1;
				while (true) {
					for (let c = 0; c < 2; c += 1) if (modules[row][col - c] === null) {
						let dark = false;
						if (byteIndex < data.length) dark = (data[byteIndex] >>> bitIndex & 1) === 1;
						if (maskFunc(row, col - c)) dark = !dark;
						modules[row][col - c] = dark;
						bitIndex -= 1;
						if (bitIndex === -1) {
							byteIndex += 1;
							bitIndex = 7;
						}
					}
					row += inc;
					if (row < 0 || moduleCount <= row) {
						row -= inc;
						inc = -inc;
						break;
					}
				}
			}
		};
		const createBytes = (buffer, rsBlocks) => {
			let offset = 0;
			let maxDcCount = 0;
			let maxEcCount = 0;
			const dcdata = new Array(rsBlocks.length);
			const ecdata = new Array(rsBlocks.length);
			for (let r = 0; r < rsBlocks.length; r += 1) {
				const dcCount = rsBlocks[r].dataCount;
				const ecCount = rsBlocks[r].totalCount - dcCount;
				maxDcCount = Math.max(maxDcCount, dcCount);
				maxEcCount = Math.max(maxEcCount, ecCount);
				dcdata[r] = new Array(dcCount);
				for (let i = 0; i < dcdata[r].length; i += 1) dcdata[r][i] = 255 & buffer.getBuffer()[i + offset];
				offset += dcCount;
				const rsPoly = generator.#getErrorCorrectPolynomial(ecCount);
				const modPoly = generator.#createPolynomial(dcdata[r], rsPoly.getLength() - 1).mod(rsPoly);
				ecdata[r] = new Array(rsPoly.getLength() - 1);
				for (let i = 0; i < ecdata[r].length; i += 1) {
					const modIndex = i + modPoly.getLength() - ecdata[r].length;
					ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
				}
			}
			let totalCodeCount = 0;
			for (let i = 0; i < rsBlocks.length; i += 1) totalCodeCount += rsBlocks[i].totalCount;
			const data = new Array(totalCodeCount);
			let index = 0;
			for (let i = 0; i < maxDcCount; i += 1) for (let r = 0; r < rsBlocks.length; r += 1) if (i < dcdata[r].length) {
				data[index] = dcdata[r][i];
				index += 1;
			}
			for (let i = 0; i < maxEcCount; i += 1) for (let r = 0; r < rsBlocks.length; r += 1) if (i < ecdata[r].length) {
				data[index] = ecdata[r][i];
				index += 1;
			}
			return data;
		};
		const createData = (typeNumber, errorCorrectionLevel, dataList) => {
			const rsBlocks = generator.#getRSBlocks(typeNumber, errorCorrectionLevel);
			const buffer = generator.#createBitBuffer();
			for (let i = 0; i < dataList.length; i += 1) {
				const data = dataList[i];
				buffer.put(data.getMode(), 4);
				buffer.put(data.getLength(), generator.#getLengthInBits(data.getMode(), typeNumber));
				data.write(buffer);
			}
			let totalDataCount = 0;
			for (let i = 0; i < rsBlocks.length; i += 1) totalDataCount += rsBlocks[i].dataCount;
			if (buffer.getLengthInBits() > totalDataCount * 8) throw new Error(`code length overflow. (${buffer.getLengthInBits()}>${totalDataCount * 8})`);
			if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);
			while (buffer.getLengthInBits() % 8 !== 0) buffer.putBit(false);
			while (true) {
				if (buffer.getLengthInBits() >= totalDataCount * 8) break;
				buffer.put(generator.#PAD0, 8);
				if (buffer.getLengthInBits() >= totalDataCount * 8) break;
				buffer.put(generator.#PAD1, 8);
			}
			return createBytes(buffer, rsBlocks);
		};
		qrInstance.addData = (data, mode) => {
			mode = mode || "Byte";
			let newData = null;
			switch (mode) {
				case "Byte":
					newData = generator.#create8BitByte(data);
					break;
				default: throw new Error(`mode:${mode}`);
			}
			dataList.push(newData);
			dataCache = null;
		};
		qrInstance.isDark = (row, col) => {
			if (row < 0 || moduleCount <= row || col < 0 || moduleCount <= col) throw new Error(`${row},${col}`);
			return modules[row][col];
		};
		qrInstance.getModuleCount = () => {
			return moduleCount;
		};
		qrInstance.make = () => {
			if (version < 1) {
				let typeNumber = 1;
				for (; typeNumber < 40; typeNumber++) {
					const rsBlocks = generator.#getRSBlocks(typeNumber, ecLevel);
					const buffer = generator.#createBitBuffer();
					for (let i = 0; i < dataList.length; i++) {
						const data = dataList[i];
						buffer.put(data.getMode(), 4);
						buffer.put(data.getLength(), generator.#getLengthInBits(data.getMode(), typeNumber));
						data.write(buffer);
					}
					let totalDataCount = 0;
					for (let i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
					if (buffer.getLengthInBits() <= totalDataCount * 8) break;
				}
				version = typeNumber;
			}
			makeImpl(false, getBestMaskPattern());
		};
		return qrInstance;
	}

	generate(url, options = {}) {
		const margin = options.margin !== void 0 ? options.margin : 4;
		const moduleColor = options.moduleColor || "#000000";
		const positionRingColor = options.positionRingColor || "#000000";
		const positionCenterColor = options.positionCenterColor || "#000000";
		const backgroundColor = options.backgroundColor || "#ffffff";
		const positionMarkerRadius = options.positionMarkerRadius !== void 0 ? options.positionMarkerRadius : 0;
		const dataMarkerRadius = options.dataMarkerRadius !== void 0 ? options.dataMarkerRadius : 0;
		const svgSize = options.size !== void 0 ? options.size : 180;
		const qr = this.#createQRCodeInstance(0, "H");
		qr.addData(url);
		qr.make();
		const moduleCount = qr.getModuleCount();
		const viewBoxSize = moduleCount + margin * 2;
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("width", svgSize);
		svg.setAttribute("height", svgSize);
		svg.setAttribute("viewBox", `0 0 ${viewBoxSize} ${viewBoxSize}`);
		svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		svg.setAttribute("class", "qr-code");
		const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		bg.setAttribute("width", viewBoxSize);
		bg.setAttribute("height", viewBoxSize);
		bg.setAttribute("class", "qr-background");
		bg.setAttribute("fill", backgroundColor);
		svg.appendChild(bg);
		this.#renderPositionPattern(svg, 0, 0, margin, positionRingColor, positionCenterColor, backgroundColor, positionMarkerRadius);
		this.#renderPositionPattern(svg, moduleCount - 7, 0, margin, positionRingColor, positionCenterColor, backgroundColor, positionMarkerRadius);
		this.#renderPositionPattern(svg, 0, moduleCount - 7, margin, positionRingColor, positionCenterColor, backgroundColor, positionMarkerRadius);
		const moduleRadius = dataMarkerRadius > 0 ? dataMarkerRadius / 100 * .5 : 0;
		let renderCount = 0;
		for (let col = 0; col < moduleCount; col++) for (let row = 0; row < moduleCount; row++) if (!this.#isPositioningElement(row, col, moduleCount) && qr.isDark(col, row)) {
			renderCount += 1;
			const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			rect.setAttribute("x", col + margin);
			rect.setAttribute("y", row + margin);
			rect.setAttribute("width", 1);
			rect.setAttribute("height", 1);
			rect.setAttribute("class", "qr-module");
			rect.setAttribute("fill", moduleColor);
			if (moduleRadius > 0) {
				rect.setAttribute("rx", moduleRadius);
				rect.setAttribute("ry", moduleRadius);
			}
			svg.appendChild(rect);
		}
		return svg;
	}
};
const QRCode = new QRCodeGenerator();

export { QRCode };