export const INPUT_TYPES = {
  json: 'json',
  csv: 'csv',
  xml: 'xml',
}

export const DEFAULT_INPUT_FILE_BY_TYPE = {
  [INPUT_TYPES.json]: '[\n  {\n    \n  }\n]',
  [INPUT_TYPES.csv]: '',
  [INPUT_TYPES.xml]: ''
}

export const DEFAULT_MAPPING = {
  "@context": {
    rr: "http://www.w3.org/ns/r2rml#",
    rml: "http://semweb.mmlab.be/ns/rml#",
  },
  "@type": "http://www.w3.org/ns/r2rml#TriplesMap",
  "rml:logicalSource": {
    "@type": "rml:LogicalSource",
    "rml:iterator": "$",
    "rml:referenceFormulation": "http://semweb.mmlab.be/ns/ql#JSONPath",
    "rml:source": "input.json",
  },
  "rr:subject": "https://example.com/mappingSubject",
  "rr:predicateObjectMap": [],
};

export const DEFAULT_INPUT_FILES = [
  {
    name: "input.json",
    contents: DEFAULT_INPUT_FILE_BY_TYPE[INPUT_TYPES.json],
  },
];

export const PANELS = {
  input: 'input',
  editor: 'editor',
  output: 'output'
};

export const PANEL_ORDER = [
  PANELS.input,
  PANELS.editor,
  PANELS.output,
];