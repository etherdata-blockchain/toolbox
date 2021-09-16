import { BlockExporter } from "./blockExporter";

export { BlockExporter };

// (async () => {
//   let blockExporter = new BlockExporter(
//     "http://etd.sirileepage.com",
//     8547,
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
