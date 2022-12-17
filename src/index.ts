import { readFileSync, existsSync, unlinkSync} from 'fs';
import { GenerateTypeValues, GenerateActions, GenerateReducerCases, GeneratePayloads, GenerateHandlers, GenerateInputRows, ReducerTemplate } from './generators';

function GenerateReducerCode(input_file: string, output_path: string)
{
	if(!existsSync(input_file))
	{
		console.log("ERROR: Invalid Input File Path: " + input_file);
		return;
	}

	if(!existsSync(output_path))
	{
		console.log("ERROR: Invalid Output Directory: " + output_path);
		return;
	}

    const raw_input = readFileSync(input_file);
	//@ts-ignore
    const reducer_data: ReducerTemplate = JSON.parse(raw_input);

	let output_file = output_path + "output.txt";

	//Get rid of the file if it exists, we'll be appending to a new one.
	if(existsSync(output_file))
	{
		unlinkSync(output_file);
	}

	GenerateTypeValues(reducer_data, output_file);
	GenerateActions(reducer_data, output_file);
	GenerateReducerCases(reducer_data, output_file);
	GeneratePayloads(reducer_data, output_file);
	GenerateHandlers(reducer_data, output_file);
	GenerateInputRows(reducer_data, output_file);
}

GenerateReducerCode("./input/dungeon_input.json", "output/");