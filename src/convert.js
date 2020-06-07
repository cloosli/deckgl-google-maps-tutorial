const csvToJson = require('convert-csv-to-json');

const input = './your-custom-data.csv';
const output = './public/custom-data.json';

csvToJson.fieldDelimiter(',')
    .formatValueByType()
    .generateJsonFileFromCsv(input, output);
