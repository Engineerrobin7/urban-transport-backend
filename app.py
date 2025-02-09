from flask import Flask, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

# Database connection settings
DATABASE_CONFIG = {
    "dbname": "urban_transport",
    "user": "postgres",
    "password": "robin2007",
    "host": "localhost",
    "port": "5432"
}

def get_buses():
    """Fetch all buses from the database and format the time fields as strings."""
    try:
        conn = psycopg2.connect(**DATABASE_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("SELECT * FROM buses;")
        buses = cursor.fetchall()

        # ✅ Convert `time` fields to string format
        for bus in buses:
            if 'departure_time' in bus and isinstance(bus['departure_time'], (str, bytes)) == False:
                bus['departure_time'] = bus['departure_time'].strftime('%H:%M:%S')

        cursor.close()
        conn.close()
        
        return buses

    except Exception as e:
        return {"error": str(e)}

@app.route('/api/buses', methods=['GET'])
def api_get_buses():
    """API endpoint to return buses as JSON."""
    bus_data = get_buses()
    return jsonify(bus_data)

if __name__ == '__main__':
    app.run(debug=True)
