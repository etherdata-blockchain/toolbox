import cliProgress from "cli-progress";
import { BlockExporter } from "./blockExporter";

(async () => {
  const bar1 = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );

  bar1.start(100, 0);

  let blockExporter = new BlockExporter(
    "https://debug.etdchain.net/hdkEtd@Themoon",
    undefined,
    "./out.json",
    100
  );
  await blockExporter.check(
    (current, total, blockData) => {
      bar1.update((current / total) * 100);
    },
    (err) => {
      console.log(err);
    }
  );
})();
