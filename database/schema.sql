CREATE TABLE buses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    depot VARCHAR(100) NOT NULL,
    from_location VARCHAR(100) NOT NULL,
    to_location VARCHAR(100) NOT NULL,
    via TEXT NOT NULL,
    departure_time TIME NOT NULL,
    type_of_service VARCHAR(50) NOT NULL,
    operator VARCHAR(100) NOT NULL,
    service_day VARCHAR(50) NOT NULL
);

CREATE TABLE trains (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    depot VARCHAR(100) NOT NULL,
    from_location VARCHAR(100) NOT NULL,
    to_location VARCHAR(100) NOT NULL,
    via TEXT NOT NULL,
    departure_time TIME NOT NULL,
    type_of_service VARCHAR(50) NOT NULL,
    operator VARCHAR(100) NOT NULL,
    service_day VARCHAR(50) NOT NULL
);
