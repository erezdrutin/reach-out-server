import os
import pandas as pd


def split_csv_fixed_rows(input_file, output_folder='outputs',
                         rows_per_file=100):
    """Split a CSV file into multiple parts, each with a fixed number of rows."""
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Read the input file
    df = pd.read_csv(input_file)

    # Calculate the number of chunks
    num_chunks = len(df) // rows_per_file + (
        1 if len(df) % rows_per_file else 0)

    # Split and save the chunks
    for i in range(num_chunks):
        df_chunk = df.iloc[i * rows_per_file:(i + 1) * rows_per_file]
        chunk_file_path = os.path.join(output_folder, f'chunk_{i}.csv')
        df_chunk.to_csv(chunk_file_path, index=False)

    print(
        f"Split into {num_chunks} files, with {rows_per_file} rows per file.")


if __name__ == '__main__':
    input_csv_file = '../users.csv'
    split_csv_fixed_rows(input_csv_file, rows_per_file=200)
