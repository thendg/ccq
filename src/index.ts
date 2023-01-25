import { program } from "commander";
import main from "./main";

program
  .version("1.0.0")
  .argument("<abi>", "path to the contract's ABI")
  .argument("<ccq>", "path to the ccq data for the contract call")
  .action(main);