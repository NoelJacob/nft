// Size - 256
// Length - any
// _ size:256 number:(bits 64) .... = CellData
const bin = (i, d) => Number(i).toString(2).padStart(d, "0");
const split = (s, i) => [s.slice(0, i), s.slice(i)];

let cells, addr, x, num, xnum, size, xsize, a, b;

// write
// addr = Array(27).fill("1000001111011111110101010101001011100110001101110010100110110100011100101111110010111100110010001100010001011110101111001100011001101001000101110000001001010101100010110110100011101100011101010010011111100001101110100100000000111010000011110011000110101000");
addr = Array(27).fill("0A0B0C0D0E0F0G0H0I0J0K0L0M0N0O0P0Q0R0S0T0U0V0W0X0Y0Z1A1B1C1D1E1F1G1H1I1J1K1L1M1N1O1P1Q1R1S1T1U1V1W1X1Y1Z2A2B2C2D2E2F2I2J2K2L2M2N2O2P2Q2R2S2T2U2V2W2X2Y2Z3A3B3C3D3E3F3G3H3I3J3K3L3M3N3O3P3Q3R3S3T3U3V3W3X3Y3Z4A4B4C4D4E4F4G4H4I4J4K4L4M4N4O4P4Q4R4S4T4U4V4W4X4Y4Z5A5B5C5D5E5F5G5H5I5J5K5L5M5N5O5P5Q5R5S5T5U5V5W5X5Y5Z");

cells = [];

const check = [...addr];
num = 27;
size = 256;
xsize = 80;
x = bin(size, 16) + bin(num, 64);

for (let z = 0; z < num; ++z) {
    x += addr[z];
    xsize += 256;
    if (xsize > 1023) {
        [a, x] = split(x, 1023);
        cells.push(a);
        xsize -= 1023;
    }
    if (z === (num - 1)) cells.push(x);
}

console.log(cells.map(x => x.length));

// read
// cells = [bin(256, 16) + bin(4, 64) + "1000001111011111110101010101001011100110001101110010100110110100011100101111110010111100110010001100010001011110101111001100011001101001000101110000001001010101100010110110100011101100011101010010011111100001101110100100000000111010000011110011000110101000100000111101111111010101010100101110011000110111001010011011010001110010111111001011110011001000110001000101111010111100110001100110100100010111000000100101010110001011011010001110110001110101001001111110000110111010010000000011101000001111001100011010100010000011110111111101010101010010111001100011011100101001101101000111001011111100101111001100100011000100010111101011110011000110011010010001011100000010010101011000101101101000111011000111010100100111111000011011101001000000001110100000111100110001101010001000001111011111110101010101001011100110001101110010100110110100011100101111110010111100110010001100010001011110101111001100011001101001000101110000001001010101100010110110100", "011101100011101010010011111100001101110100100000000111010000011110011000110101000"];
addr = [];

// console.log(cells);

x = cells.shift();
xsize = 80;
xnum = 0;
[size, x] = split(x, 16);
size = parseInt(size, 2);
[num, x] = split(x, 64);
num = parseInt(num, 2);

do {
    if ((xsize + size) <= 1023) {
        [a, x] = split(x, size);
        addr.push(a);
        ++xnum;
        xsize += size;
    } else {
        [a, x] = split(x, 1023 - xsize);
        x = cells.shift();
        [b, x] = split(x, size - (1023 - xsize));
        addr.push(a + b);
        ++xnum;
        xsize = 0;
    }
} while (xnum !== num);

console.log(addr.toString()===check.toString());