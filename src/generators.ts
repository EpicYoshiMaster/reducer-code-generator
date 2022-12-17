import { appendFileSync } from 'fs';

export interface ReducerTemplate 
{
	root_reducer: string,
	sub_reducer: string,
	properties: {
		[key: string]: string
	}
};

// ToPascalCase("my_cool_property") => "MyCoolProperty"
// ToPascalCase("my_cool_property", true) => "My Cool Property"
function ToPascalCase(string: string, convert_and_leave_spaces: boolean = false): string 
{
	return `${string}`
	  .toLowerCase()
	  .replace(new RegExp(/[-_]+/, 'g'), ' ')
	  .replace(new RegExp(/[^\w\s]/, 'g'), '')
	  .replace(
		new RegExp(/\s+(.)(\w*)/, 'g'),
		($1, $2, $3) => `${((convert_and_leave_spaces) ? " " : "") + $2.toUpperCase() + $3}`
	  )
	  .replace(new RegExp(/\w/), s => s.toUpperCase());
}

export function GenerateTypeValues(reducer_data: ReducerTemplate, output_path: string)
{
	const property_names = Object.keys(reducer_data.properties);

	property_names.forEach((property) => {
		const set_property_string = "SET_" + property.toUpperCase();

		const data_line = "export const " + set_property_string + " = \'" + set_property_string + '\';\n';
		appendFileSync(output_path, data_line);
	});

	appendFileSync(output_path, "\n");
}

export function GenerateActions(reducer_data: ReducerTemplate, output_path: string)
{
	const property_names = Object.keys(reducer_data.properties);
	const property_types = Object.values(reducer_data.properties);

	let combined_action = "export type " + ToPascalCase(reducer_data.sub_reducer) + "Action = \n";

	property_names.forEach((property, index) => {
		const property_action = "Set" + ToPascalCase(property) + "Action";

		let data_line = "type " + property_action + " = {\n";
		data_line += "\ttype: typeof " + "SET_" + property.toUpperCase() + ",\n";
		data_line += "\tpayload: {\n";
		data_line += "\t\t" + property + ": " + property_types[index] + ";\n";
		data_line += "\t};\n};\n\n";

		combined_action += "\t" + property_action + ((index == (property_names.length - 1)) ? ";\n" : " |\n"); 
		appendFileSync(output_path, data_line);
	});

	appendFileSync(output_path, combined_action + "\n");
}

export function GeneratePayloads(reducer_data: ReducerTemplate, output_path: string)
{
	const property_names = Object.keys(reducer_data.properties);
	const property_types = Object.values(reducer_data.properties);

	property_names.forEach((property, index) => {
		const property_function_name = "set" + ToPascalCase(property);

		let data_line = "export function " + property_function_name + "(" + property + ": " + property_types[index] + "): DungeoneerReducerAction {\n" ;
		data_line += "\treturn {\n";
		data_line += "\t\ttype: " + "SET_" + property.toUpperCase() + ",\n";
		data_line += "\t\tpayload: { " + property + " },\n";
		data_line += "\t};\n};\n\n";
		appendFileSync(output_path, data_line);
	});

	appendFileSync(output_path, "\n");
}

export function GenerateReducerCases(reducer_data: ReducerTemplate, output_path: string)
{
	const property_names = Object.keys(reducer_data.properties);

	appendFileSync(output_path, "\tswitch(action.type) {\n");

	property_names.forEach((property) => {

		let data_line = "\t\tcase " + "SET_" + property.toUpperCase() + ":\n";
		data_line += "\t\t\treturn {\n";
		data_line += "\t\t\t\t...state,\n";
		data_line += "\t\t\t\t" + property + ": action.payload." + property + "\n";
		data_line += "\t\t\t};\n"
		appendFileSync(output_path, data_line);
	});

	appendFileSync(output_path, "\t\tdefault:\n\t\t\treturn state;\n\t}\n\n");
}

export function GenerateHandlers(reducer_data: ReducerTemplate, output_path: string)
{
	const property_names = Object.keys(reducer_data.properties);
	const property_types = Object.values(reducer_data.properties);

	property_names.forEach((property, index) => {
		const function_suffix = ToPascalCase(property);

		let data_line = "\tconst handleSet" + function_suffix + " = useCallback(() => dispatch(";
		data_line += "set" + function_suffix;

		if(property_types[index] == "boolean")
		{
			data_line += "(!state." + reducer_data.sub_reducer + "." + property + ")), [state." + reducer_data.sub_reducer;
			data_line += "." + property + ", dispatch]);\n";
		}
		else
		{
			data_line += "(Number(event?.target.value))), [dispatch]);\n";
		}
		appendFileSync(output_path, data_line);
	});

	appendFileSync(output_path, "\n");
}

export function GenerateInputRows(reducer_data: ReducerTemplate, output_path: string)
{
	const property_names = Object.keys(reducer_data.properties);
	const property_types = Object.values(reducer_data.properties);

	property_names.forEach((property, index) => {
		const formal_property_name = ToPascalCase(property, true);
		const function_suffix = ToPascalCase(property);

		let data_line = "\t\t\t\t<InputRow>\n";
		data_line += "\t\t\t\t\t<label htmlFor=\"" + property + "\">" + formal_property_name + "</label>\n";

		if(property_types[index] == "boolean")
		{
			data_line += "\t\t\t\t\t<Checkbox id=\"" + property + "\"" + " data-checked={state." + reducer_data.sub_reducer + "."+ property + "} ";
			data_line += "onClick={handleSet" + function_suffix + "} />\n";
		}
		else
		{
			data_line += "\t\t\t\t\t<input id=\"" + property + "\" type=\"" + property_types[index] + "\" value={state." + reducer_data.sub_reducer + "."+ property + "} ";
			data_line += "onChange={handleSet" + function_suffix + "} />\n";
		}
		data_line += "\t\t\t\t</InputRow>\n\n";
		appendFileSync(output_path, data_line);
	});


	appendFileSync(output_path, "\n");
}