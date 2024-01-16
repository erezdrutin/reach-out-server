from json import load
from db_migration.state import State
from db_migration.utils import add_missing_cols, set_row_state, fix_phone_col, \
    apply_boolean_logic
import pandas as pd
from db_migration.const import *


def normalize_boolean_cols(df: pd.DataFrame) -> pd.DataFrame:
    # Apply booleans translation logic:
    for col in [c for c in BOOLEAN_COLS if c in df.columns]:
        df[col] = df[col].apply(apply_boolean_logic)
    return df


def normalize_df1(df: pd.DataFrame) -> pd.DataFrame:
    # Fix phone column
    df[PHONE_COL] = df[PHONE_COL].apply(lambda x: fix_phone_col(x))
    # Set fixed POTENTIAL_USER state
    df[OUT_STATE_COL] = State.POTENTIAL_USER.value
    # Convert string timestamp to timestamp object:
    df[TIMESTAMP_COL] = pd.to_datetime(df[TIMESTAMP_COL])
    # Apply booleans translation logic:
    normalize_boolean_cols(df=df)
    return df


def normalize_df2(df: pd.DataFrame) -> pd.DataFrame:
    # Replace volunteerName with volunteerId:
    with open(VOLUNTEERS_FILE_PATH, encoding='utf-8') as fp:
        volunteers = load(fp=fp)
    df[OUT_VOLUNTEER_ID_COL] = df[VOLUNTEER_NAME_COL].map(volunteers)

    # Replace state based on comments column
    df[OUT_STATE_COL] = df[STATE_COMMENTS_COL].apply(
        lambda x: set_row_state(x))

    # Merge comments and additionalComments
    df[COMMENTS_COL] = df[STATE_COMMENTS_COL] + " " + df[COMMENTS_COL]

    # Drop columns that are no longer relevant:
    df.drop(columns=[VOLUNTEER_NAME_COL, STATE_COMMENTS_COL], inplace=True)

    # Apply booleans translation logic:
    normalize_boolean_cols(df=df)
    return df


def merge_dfs(df: pd.DataFrame, df2: pd.DataFrame) -> pd.DataFrame:
    # Identify overlapping columns excluding the merge keys
    overlap_columns = [col for col in df.columns if
                       col in df2.columns and col not in MERGE_COLUMNS]

    # Perform a full outer join on the key columns
    merged_df = pd.merge(df, df2, on=MERGE_COLUMNS, how='outer',
                         suffixes=('', '_df2'))

    # For each overlapping column, update w/ df2's value if it's not null/empty
    for column in overlap_columns:
        mask = merged_df[column + '_df2'].notna() & (
                merged_df[column + '_df2'] != '')
        merged_df.loc[mask, column] = merged_df.loc[mask, column + '_df2']

    # Drop the temporary columns from df2
    columns_to_drop = [col + '_df2' for col in overlap_columns]
    merged_df.drop(columns=columns_to_drop, inplace=True)
    return merged_df


def main():
    # Load the CSV file
    df = normalize_df1(pd.read_excel(FIRST_DOC_FILE_PATH, engine='openpyxl'))
    df2 = normalize_df2(pd.read_excel(SECOND_DOC_FILE_PATH, engine='openpyxl'))
    merged_df = merge_dfs(df, df2)
    add_missing_cols(merged_df, COLUMNS_FILE_PATH)
    # Inspect the first few rows of the dataframe
    print(merged_df.head())

    # Save the modified dataframe back to a CSV file if needed
    merged_df.to_excel(OUTPUT_FILE_PATH, index=False, engine='openpyxl')


if __name__ == '__main__':
    main()
