import { BlockExporter } from "./blockExporter";
export { BlockExporter };
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
