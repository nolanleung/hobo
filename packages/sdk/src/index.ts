import path from "node:path";
import { Project } from "ts-morph";
import { findNodeOrThrow } from "./ast";
import { isAppRouterAlias, isContext, isMiddleware, isRouter } from "./guard";
import { getAllTransformers, pruneRouter, redefine } from "./transformer";

const VERBOSE =
  process.env.SDK_VERBOSE === "true" || process.argv.includes("--verbose");

async function main() {
  console.log("Starting SDK generation...");
  console.log(`Working directory: ${process.cwd()}`);

  if (VERBOSE) {
    console.log("Verbose mode enabled (SDK_VERBOSE=true or --verbose)");
  }

  const project = new Project({
    tsConfigFilePath: "../../apps/api/tsconfig.json",
    compilerOptions: {
      declaration: true,
      emitDeclarationOnly: true,
      noEmit: false,
    },
  });

  const srcFiles = project.getSourceFiles();
  console.log(`Found ${srcFiles.length} source files`);

  if (VERBOSE && srcFiles.length > 0) {
    console.log("  First 10 source files:");
    srcFiles.slice(0, 10).forEach((file) => {
      console.log(`    - ${file.getFilePath()}`);
    });
    if (srcFiles.length > 10) {
      console.log(`    ... and ${srcFiles.length - 10} more`);
    }
  }

  const transformers = getAllTransformers(srcFiles, [
    [isContext, redefine("unknown")],
    [isMiddleware, redefine("t.middleware(({ ctx, next }) => next({ ctx }))")],
    [isRouter, pruneRouter()],
  ]);

  console.log(`Applying ${transformers.length} transformations...`);
  for (let i = 0; i < transformers.length; i++) {
    if (VERBOSE && i % 100 === 0 && i > 0) {
      console.log(
        `  Progress: ${i}/${transformers.length} transformations applied`
      );
    }
    transformers[i]();
  }
  if (VERBOSE) {
    console.log(`  Completed all ${transformers.length} transformations`);
  }

  let rootFile;
  try {
    const [_, file] = findNodeOrThrow(srcFiles, isAppRouterAlias("AppRouter"));
    rootFile = file;
    console.log(`Found AppRouter in: ${rootFile.getFilePath()}`);

    if (VERBOSE) {
      console.log("  AppRouter details:");
      console.log(`    Base name: ${rootFile.getBaseName()}`);
      console.log(`    Directory: ${rootFile.getDirectory().getPath()}`);
    }
  } catch (error) {
    console.error("Failed to find AppRouter:", error);
    throw error;
  }

  const sourceFile = project.getSourceFileOrThrow(rootFile.getBaseName());
  console.log(`Emitting output for: ${sourceFile.getFilePath()}`);

  const output = sourceFile.getEmitOutput({ emitOnlyDtsFiles: true });

  const outputFiles = output.getOutputFiles();
  console.log(`Number of output files generated: ${outputFiles.length}`);

  if (VERBOSE && outputFiles.length > 0) {
    outputFiles.forEach((file, index) => {
      console.log(`  Output file ${index + 1}:`);
      console.log(`    Path: ${file.getFilePath()}`);
      console.log(`    Size: ${file.getText().length} bytes`);
      const lines = file.getText().split("\n").length;
      console.log(`    Lines: ${lines}`);
    });
  }

  if (outputFiles.length === 0) {
    // Get diagnostics to understand why emission failed
    const diagnostics = sourceFile.getPreEmitDiagnostics();
    if (diagnostics.length > 0) {
      console.error("TypeScript diagnostics found:");
      diagnostics.forEach((diagnostic) => {
        const messageText = diagnostic.getMessageText();
        const message =
          typeof messageText === "string"
            ? messageText
            : messageText?.getMessageText() || "Unknown error";
        const line = diagnostic.getLineNumber();
        const file =
          diagnostic.getSourceFile()?.getFilePath() || "Unknown file";
        console.error(`  ${file}${line ? `:${line}` : ""}: ${message}`);

        if (VERBOSE) {
          const sourceFile = diagnostic.getSourceFile();
          if (sourceFile && line) {
            const lines = sourceFile.getFullText().split("\n");
            if (lines[line - 1]) {
              console.error(`    Source: ${lines[line - 1].trim()}`);
            }
          }
        }
      });
    }

    // Check if emission was skipped
    const emitResult = output.getEmitSkipped();
    if (emitResult) {
      console.error(
        "Emit was skipped - this usually indicates TypeScript errors"
      );
    }

    throw new Error(
      "Failed to generate output file - no output files were produced"
    );
  }

  const [dstFile] = outputFiles;
  console.log(`Output file path: ${dstFile.getFilePath()}`);
  console.log(`Output file size: ${dstFile.getText().length} bytes`);

  const dstProj = new Project({
    tsConfigFilePath: `./tsconfig.json`,
  });

  const outPath = path.join(".", "dist", "api.d.ts");

  dstProj.createSourceFile(outPath, dstFile.getText(), {
    overwrite: true,
  });

  await dstProj.save();
  console.log(`Successfully saved output to: ${outPath}`);

  return `✅ SDK generation completed successfully! Generated ${outPath}`;
}

main()
  .then((result) => {
    console.log(result);
    if (VERBOSE) {
      console.log(
        "\nVerbose mode: To disable, unset SDK_VERBOSE environment variable"
      );
    }
  })
  .catch((error) => {
    console.error("❌ SDK generation failed:");
    console.error(error);
    if (!VERBOSE) {
      console.error(
        "\nTip: Run with SDK_VERBOSE=true or --verbose for more detailed output"
      );
    }
    process.exit(1);
  });
