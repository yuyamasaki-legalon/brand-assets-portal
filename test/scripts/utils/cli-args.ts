/**
 * CLI引数パーサー
 * 依存関係なしで軽量に実装
 */

export interface CliFlag {
  name: string;
  alias?: string;
  description: string;
  type: "string" | "boolean";
  required?: boolean;
  default?: string | boolean;
  choices?: string[];
}

export interface ParsedArgs {
  [key: string]: string | boolean | undefined;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  config: ParsedArgs | null;
}

/**
 * CLI引数をパースする
 * @example
 * parseCliArgs() // { name: "test", flag: true }
 */
export const parseCliArgs = (): ParsedArgs => {
  const args = process.argv.slice(2);
  const parsed: ParsedArgs = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // --flag=value 形式
    if (arg.startsWith("--") && arg.includes("=")) {
      const [key, ...valueParts] = arg.slice(2).split("=");
      parsed[key] = valueParts.join("=");
      continue;
    }

    // --flag value 形式 または --flag（boolean）
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];

      // 次の引数が存在し、フラグではない場合は値として扱う
      if (nextArg && !nextArg.startsWith("--")) {
        parsed[key] = nextArg;
        i++; // 次の引数をスキップ
      } else {
        // boolean フラグ
        parsed[key] = true;
      }
      continue;
    }

    // -フラグのエイリアス対応（必要に応じて）
    if (arg.startsWith("-") && !arg.startsWith("--")) {
      const key = arg.slice(1);
      const nextArg = args[i + 1];

      if (nextArg && !nextArg.startsWith("-")) {
        parsed[key] = nextArg;
        i++;
      } else {
        parsed[key] = true;
      }
    }
  }

  return parsed;
};

/**
 * CLI引数を検証する
 */
export const validateCliArgs = (args: ParsedArgs, flags: CliFlag[]): ValidationResult => {
  const errors: string[] = [];
  const config: ParsedArgs = {};

  for (const flag of flags) {
    const value = args[flag.name] ?? (flag.alias ? args[flag.alias] : undefined);

    // 必須フラグのチェック
    if (flag.required && value === undefined) {
      errors.push(`--${flag.name} is required`);
      continue;
    }

    // 値が存在しない場合はデフォルト値を使用
    if (value === undefined) {
      if (flag.default !== undefined) {
        config[flag.name] = flag.default;
      }
      continue;
    }

    // 型チェック
    if (flag.type === "boolean") {
      config[flag.name] = value === true || value === "true";
    } else if (flag.type === "string") {
      if (typeof value !== "string") {
        errors.push(`--${flag.name} must be a string`);
        continue;
      }

      // 選択肢のチェック
      if (flag.choices && !flag.choices.includes(value)) {
        errors.push(`--${flag.name} must be one of: ${flag.choices.join(", ")}`);
        continue;
      }

      config[flag.name] = value;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    config: errors.length === 0 ? config : null,
  };
};

/**
 * ヘルプテキストを生成する
 */
export const generateHelpText = (
  commandName: string,
  description: string,
  flags: CliFlag[],
  examples?: string[],
): string => {
  const lines: string[] = [];

  lines.push(`\n${commandName}`);
  lines.push("=".repeat(commandName.length));
  lines.push(`\n${description}\n`);

  lines.push("Usage:");
  lines.push(`  pnpm ${commandName} [options]\n`);

  lines.push("Options:");
  for (const flag of flags) {
    const flagName = `--${flag.name}`;
    const aliasText = flag.alias ? `, -${flag.alias}` : "";
    const requiredText = flag.required ? " (required)" : "";
    const defaultText = flag.default !== undefined ? ` [default: ${flag.default}]` : "";
    const choicesText = flag.choices ? ` [choices: ${flag.choices.join(", ")}]` : "";

    lines.push(`  ${flagName}${aliasText}${requiredText}`);
    lines.push(`    ${flag.description}${defaultText}${choicesText}`);
  }

  if (examples && examples.length > 0) {
    lines.push("\nExamples:");
    for (const example of examples) {
      lines.push(`  ${example}`);
    }
  }

  lines.push("");

  return lines.join("\n");
};

/**
 * --help フラグをチェックし、ヘルプを表示して終了する
 */
export const handleHelpFlag = (
  args: ParsedArgs,
  commandName: string,
  description: string,
  flags: CliFlag[],
  examples?: string[],
): boolean => {
  if (args.help || args.h) {
    console.log(generateHelpText(commandName, description, flags, examples));
    return true;
  }
  return false;
};

/**
 * 非対話モードかどうかを判定する
 * CLI引数が1つでも渡されている場合は非対話モード
 * ただし --help だけの場合は除く
 */
export const isNonInteractiveMode = (args: ParsedArgs): boolean => {
  const keys = Object.keys(args);
  if (keys.length === 0) return false;
  if (keys.length === 1 && (args.help || args.h)) return false;
  return true;
};
