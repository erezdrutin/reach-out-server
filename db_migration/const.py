# Files paths:
VOLUNTEERS_FILE_PATH = './volunteers.json'
FIRST_DOC_FILE_PATH = './1st_doc.xlsx'
SECOND_DOC_FILE_PATH = './2nd_doc.xlsx'
COLUMNS_FILE_PATH = './columns.json'
OUTPUT_FILE_PATH = './res.xlsx'

# Columns:
PHONE_COL = 'phone'
STATE_COMMENTS_COL = 'stateComments'
VOLUNTEER_NAME_COL = 'volunteerName'
COMMENTS_COL = 'comments'
OUT_STATE_COL = 'state'
OUT_VOLUNTEER_ID_COL = 'volunteerId'

# Columns that require custom handling
MERGE_COLUMNS = ['firstName', 'lastName', PHONE_COL]
BOOLEAN_COLS = ['evacuated', 'garmin', 'distressMail']
TIMESTAMP_COL = 'timestamp'
