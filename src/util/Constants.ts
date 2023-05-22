import { GREL } from "@comake/rmlmapper-js";
import { Functions } from "./TypeUtil";

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



export const functions: Functions = {
  [GREL.array_join]: {
    name: "Array Join",
    params: {
      a: {
        type: "array",
        comment:
          "Array of strings/characters/numbers or object with appropriate toString() defined",
      },
      sep: {
        type: "string",
        comment: "String to separate the items",
      },
    },
    description:
      "Join items in an array of strings/characters/numbers (a) with a separator (sep) between them",
  },
  [GREL.controls_if]: {
    name: "Controls If",
    params: {},
  },
  [GREL.bool_b]: {
    name: "Bool B",
    params: {},
    description: "",
  },
  [GREL.any_true]: {
    name: "Any True",
    params: {},
    description: "",
  },
  [GREL.any_false]: {
    name: "Any False",
    params: {},
    description: "",
  },
  [GREL.array_sum]: {
    name: "Array Sum",
    params: {},
    description: "",
  },
  [GREL.array_product]: {
    name: "Array Product",
    params: {},
    description: "",
  },
  [GREL.p_array_a]: {
    name: "P Array A",
    params: {},
    description: "",
  },
  [GREL.string_endsWith]: {
    name: "Ends with",
    params: {},
    description: "",
  },
  [GREL.valueParameter]: {
    name: "Value Parameter",
    params: {},
    description: "",
  },
  [GREL.valueParameter2]: {
    name: "Value Parameter 2",
    params: {},
    description: "",
  },
  [GREL.string_sub]: {
    name: "String Sub",
    params: {},
    description: "",
  },
  [GREL.string_replace]: {
    name: "String Replace",
    params: {},
    description: "",
  },
  [GREL.p_string_find]: {
    name: "P String Find",
    params: {},
    description: "",
  },
  [GREL.p_string_replace]: {
    name: "P String Replace",
    params: {},
    description: "",
  },
  [GREL.date_now]: {
    name: "Date Now",
    params: {},
    description: "",
  },
  [GREL.boolean_not]: {
    name: "Boolean Not",
    params: {},
    description: "",
  },
  [GREL.array_get]: {
    name: "Array Get",
    params: {},
    description: "",
  },
  [GREL.param_int_i_from]: {
    name: "Param Int I From",
    params: {},
    description: "",
  },
  [GREL.param_int_i_opt_to]: {
    name: "Param Int I Opt To",
    params: {},
    description: "",
  },
  [GREL.string_split]: {
    name: "String Split",
    params: {},
    description: "",
  },
  [GREL.p_string_sep]: {
    name: "P String Sep",
    params: {},
    description: "",
  },
  [GREL.date_inc]: {
    name: "Date Inc",
    params: {},
    description: "",
  },
  [GREL.p_date_d]: {
    name: "P Date D",
    params: {},
    description: "",
  },
  [GREL.p_dec_n]: {
    name: "P Dec N",
    params: {},
    description: "",
  },
  [GREL.param_n2]: {
    name: "Param N 2",
    params: {},
    description: "",
  },
  [GREL.p_string_unit]: {
    name: "P String Unit",
    params: {},
    description: "",
  },
  [GREL.math_max]: {
    name: "Math Max",
    params: {},
    description: "",
  },
  [GREL.math_min]: {
    name: "Math Min",
    params: {},
    description: "",
  },
  [GREL.boolean_and]: {
    name: "Boolean And",
    params: {},
    description: "",
  },
  [GREL.boolean_or]: {
    name: "Boolean Or",
    params: {},
    description: "",
  },
  [GREL.param_rep_b]: {
    name: "Param Rep B",
    params: {},
    description: "",
  },
  [GREL.toUpperCase]: {
    name: "To Upper Case",
    params: {},
    description: "",
  },
  [GREL.string_toString]: {
    name: "String To String",
    params: {},
    description: "",
  },
  [GREL.string_toNumber]: {
    name: "String To Number",
    params: {},
    description: "",
  },
  [GREL.p_any_e]: {
    name: "P Any E",
    params: {},
    description: "",
  },
  [GREL.string_contains]: {
    name: "String Contains",
    params: {},
    description: "",
  },
};