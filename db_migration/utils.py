from json import load
from math import isnan
from typing import Any
from db_migration.state import State

HEB_YES_CONST = 'כן'


def add_missing_cols(df, json_path):
    # Load column specifications from JSON file
    with open(json_path, 'r') as f:
        column_specs = load(f)

    # Ensure each column exists with the correct default value and nullability
    for column, specs in column_specs.items():
        if column not in df.columns:
            df[column] = specs['default'] if specs['required'] else None
        elif specs['required'] and df[column].isnull().any():
            df[column].fillna(specs['default'], inplace=True)

    return df


def set_row_state(x: str) -> str:
    return State.WAITING_APPROVAL.value if x == 'V' else State.PAUSED.value


def fix_phone_col(x: Any) -> str:
    return str(x) if str(x).startswith('0') else '0' + str(x)


def apply_boolean_logic(x: Any) -> bool:
    return (isinstance(x, float) and not isnan(x)) or (isinstance(x, str) and
                                                       HEB_YES_CONST in x)
