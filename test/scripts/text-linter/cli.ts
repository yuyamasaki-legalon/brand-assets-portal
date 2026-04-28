export interface CliArgs {
  fix: boolean;
  help: boolean;
  pattern: string;
  rules: string[] | null;
  hideInfo: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const args = argv.slice(2);

  let rules: string[] | null = null;
  const rulesIndex = args.indexOf("--rules");
  if (rulesIndex !== -1 && args[rulesIndex + 1]) {
    rules = args[rulesIndex + 1].split(",").map((r) => r.trim().toUpperCase());
  }

  return {
    fix: args.includes("--fix"),
    help: args.includes("--help") || args.includes("-h"),
    hideInfo: args.includes("--no-info") || args.includes("--hide-info"),
    pattern: args.find((arg) => !arg.startsWith("-") && args[args.indexOf(arg) - 1] !== "--rules") || "src/**/*.tsx",
    rules,
  };
}
