// Size - fixed
// Length - any
// _ size:(bits 16) number:(bits 64)
const padBin = (i, d) => Number(i).toString(2).padStart(d, "0");

let cells = [padBin(256, 16) + padBin(4, 64) + "1000001111011111110101010101001011100110001101110010100110110100011100101111110010111100110010001100010001011110101111001100011001101001000101110000001001010101100010110110100011101100011101010010011111100001101110100100000000111010000011110011000110101000100000111101111111010101010100101110011000110111001010011011010001110010111111001011110011001000110001000101111010111100110001100110100100010111000000100101010110001011011010001110110001110101001001111110000110111010010000000011101000001111001100011010100010000011110111111101010101010010111001100011011100101001101101000111001011111100101111001100100011000100010111101011110011000110011010010001011100000010010101011000101101101000111011000111010100100111111000011011101001000000001110100000111100110001101010001000001111011111110101010101001011100110001101110010100110110100011100101111110010111100110010001100010001011110101111001100011001101001000101110000001001010101100010110110100", "011101100011101010010011111100001101110100100000000111010000011110011000110101000"];
let addr = [];

const strSplice = (s, a, b) => [s.slice(a, b), s.slice(0, a) + s.slice(b)];

// read
let x = cells.shift();
let bytes, num, xsize = 80;
[bytes, x] = strSplice(x, 0, 16);
bytes = parseInt(bytes, 2);
[num, x] = strSplice(x, 0, 64);
num = parseInt(num, 2);


// do {
//     if ((xsize + size) <= 1023) {
//         [a, x] = strSplice(x, 0, size);
//         addr.push(a);
//         xsize += size;
//     } else {
//         [a, x] = strSplice(x, 0, 1023 - xsize);
//         x = cells.shift();
//         [c, x] = strSplice(x, 0, size - (1023 - xsize));
//         [b, a] = strSplice(a + c, 0, 256);
//         addr.push(b);
//         next = a;
//         xsize = 0;
//     }
// } while (next === "1");

// console.log(new Set(addr), addr.length) // 4x Ton donation address
// const is_same = new Set(addr);
// console.log(is_same.size === 1);

// write
cells = [];
xsize = 0;
x = "";
for (let z = 0; z < addr.length; z++) {
    x += addr[z];
    if (z !== (addr.length - 1)) x += "1"
    else x += "0"
    xsize += 257;
    if (xsize > 1023) {
        [a, x] = strSplice(x, 0, 1023);
        cells.push(a);
        xsize -= 1023;
    }
    if (z === (addr.length - 1)) cells.push(x);
}

// console.log(cells)

// console.log(cells.join("") === (addr.join("1") + "0"));
