"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockExporter = void 0;
var blockExporter_1 = require("./blockExporter");
Object.defineProperty(exports, "BlockExporter", { enumerable: true, get: function () { return blockExporter_1.BlockExporter; } });
//
// (async () => {
//   let blockExporter = new BlockExporter(
//     "https://debug.etdchain.net/hdkEtd@Themoon",
//     undefined,
//     "./out.json",
//     2
//   );
//   await blockExporter.check(
//     (current, total) => {
//       console.log(current + "/" + total);
//     },
//     (err) => {
//       console.log(err);
//     }
//   );
// })();
