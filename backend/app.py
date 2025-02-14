from flask import Flask, jsonify, request
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

def get_buses(from_location=None, to_location=None):
    """Fetch buses from the database based on optional 'from' and 'to' locations."""
    try:
        conn = psycopg2.connect(**DATABASE_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = "SELECT * FROM buses"
        conditions = []
        params = {}

        if from_location:
            conditions.append("from_location = %(from_location)s")
            params['from_location'] = from_location
        if to_location:
            conditions.append("to_location = %(to_location)s")
            params['to_location'] = to_location

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        cursor.execute(query, params)
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
    """API endpoint to return buses as JSON, filtering by 'from' and 'to' if provided."""
    from_location = request.args.get('from')
    to_location = request.args.get('to')
    
    bus_data = get_buses(from_location, to_location)
    return jsonify(bus_data)

if __name__ == '__main__':
    app.run(debug=True)