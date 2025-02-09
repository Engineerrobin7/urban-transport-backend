import os
import pdfplumber
import psycopg2
from psycopg2 import Error

# Database connection settings
DATABASE_CONFIG = {
    "dbname": "urban_transport",
    "user": "postgres",
    "password": "robin2007",
    "host": "localhost",
    "port": "5432"
}

# Ensure the script runs from any directory
PDF_PATH = os.path.join(os.path.dirname(__file__), "ambala_depot.pdf")

def connect_to_database():
    """Establish a connection to PostgreSQL."""
    try:
        return psycopg2.connect(**DATABASE_CONFIG)
    except Error as e:
        print(f"❌ Error connecting to PostgreSQL: {e}")
        raise

def extract_table_data(pdf_path):
    """Extract table data from the PDF file."""
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"🚨 PDF file not found: {pdf_path}")

    extracted_data = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                table = page.extract_table()
                if table:
                    for row in table[1:]:  # Skipping header row
                        if row and all(cell is not None and cell.strip() for cell in row):
                            cleaned_row = [str(cell).strip() if cell else None for cell in row]
                            extracted_data.append(cleaned_row)

        if not extracted_data:
            raise ValueError("⚠️ No valid data extracted from the PDF.")

        return extracted_data
    except Exception as e:
        print(f"❌ Error extracting PDF data: {e}")
        raise

def insert_data_into_db(bus_data):
    """Insert extracted bus data into the database."""
    try:
        with connect_to_database() as conn:
            with conn.cursor() as cursor:
                # Clear existing data
                cursor.execute("TRUNCATE TABLE buses RESTART IDENTITY CASCADE;")
                
                for row in bus_data:
                    if len(row) < 8:
                        print(f"⚠️ Skipping row due to missing values: {row}")
                        continue

                    # Convert "UNKNOWN" to NULL for departure_time
                    row = [None if cell == "UNKNOWN" else cell for cell in row]

                    cursor.execute(
                        """
                        INSERT INTO buses (depot, from_location, to_location, via, 
                                         departure_time, type_of_service, operator, service_day)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
                        """,
                        row
                    )

                conn.commit()
                print("✅ Data successfully inserted into the 'buses' table!")

    except Error as e:
        print(f"❌ Database error: {e}")
    except Exception as e:
        print(f"❌ An error occurred: {e}")

def main():
    try:
        bus_data = extract_table_data(PDF_PATH)
        print("🔍 Extracted Data:", bus_data)  # Debugging
        insert_data_into_db(bus_data)
    except Exception as e:
        print(f"⚠️ An error occurred: {e}")

if __name__ == "__main__":
    main()
