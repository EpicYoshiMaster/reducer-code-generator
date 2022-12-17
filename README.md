# reducer-code-generator

Small tool for generating all of the necessary components of a reducer from input in a JSON file.

Tailored to my specific needs, so it is very likely not general enough for other use cases, but is easily adapted.

# Usage

Input files should have all properties in `snake_case`, see the input folder for examples.

Modify `index.ts` to point to your input file, select an output directory, then use `npm start` to run.

To add or modify the generators, see `generators.ts`.

## License

[GNU GPL v3](LICENSE)