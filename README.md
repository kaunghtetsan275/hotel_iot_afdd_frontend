# Hotel IoT  Automatic Fault Detection and Diagnostic (AFDD)
The full-fledged system features the following:
- IoT sensor data simulation agent
- IoT sensor fault detection agent
- Data Management with RabbitMQ, TimescaleDB and Supabase
- Backend with Django + Rest API
- Frontend with React + Vite + Tailwind
- Data Analytics (not implemented yet)

## IoT Sensor Data Simulation And Fault Detection Agent
Sensor data simulation agent is for Indoor Air Quality (IAQ) sensors that generates and publishes simulated sensor data to RabbitMQ and Supabase. This agent supports advanced data generation for temperature, humidity, CO2 levels, occupancy, and power consumption, and provides methods for publishing data to RabbitMQ and Supabase.<br>

Fault detection agent is designed to facilitate fault detection in IoT-based hotel systems. It integrates with various services such as RabbitMQ, Supabase, and TimescaleDB to process sensor data, detect anomalies, and publish alerts. The class provides methods for initializing database connections, managing RabbitMQ exchanges and queues, subscribing to real-time updates, and detecting faults based on predefined or dynamically updated thresholds. <br>

Both of these agents are available as python modules. Their API reference can be found [here](!https://kaunghtetsan275.github.io/hotel_iot_afdd_data_simulation)