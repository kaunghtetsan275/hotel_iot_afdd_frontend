# Hotel IoT  Automatic Fault Detection and Diagnostic (AFDD)
![CI](https://github.com/kaunghtetsan275/hotel_iot_afdd_frontend/actions/workflows/basic_ci.yml/badge.svg)
![Python](https://img.shields.io/badge/language-Python-blue)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/Rabbitmq-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![TimescaleDB](https://avatars.githubusercontent.com/u/8986001?s=48&v=4)

This full-fledged system features the following:
- IoT sensor data simulation agent
- IoT sensor fault detection agent
- Data Management with RabbitMQ, TimescaleDB and Supabase
- Backend with Django + Rest API
- Frontend with React + Vite + Tailwind
- Data Analytics (not implemented yet)

## IoT Sensor Data Simulation And Fault Detection Agent
Sensor data simulation agent is for Indoor Air Quality (IAQ) sensors that generates and publishes simulated sensor data to RabbitMQ and Supabase. This agent supports advanced data generation for temperature, humidity, CO2 levels, occupancy, and power consumption, and provides methods for publishing data to RabbitMQ and Supabase.<br>

Fault detection agent is designed to facilitate fault detection in IoT-based hotel systems. It integrates with various services such as RabbitMQ, Supabase, and TimescaleDB to process sensor data, detect anomalies, and publish alerts. The class provides methods for initializing database connections, managing RabbitMQ exchanges and queues, subscribing to real-time updates, and detecting faults based on predefined or dynamically updated thresholds. <br>

Both of these agents are available as python modules. Their API reference can be found [here](https://kaunghtetsan275.github.io/hotel_iot_afdd_data_simulation)

## Spicy Diagrams
```mermaid
graph LR
    subgraph Agents
        A[IAQ Sensor Agent]
        C[Life Being Sensor Agent]
        D[Power Meter Sensor Agent]
    end
     Agents --> B(RabbitMQ)
     Agents -- Store Latest Data --> G((Supabase))

    subgraph "Data Processing & Storage Layer"
        B -- Publish Sensor Data --> E(Fault Detection Agent);
        E -- Publish Fault Status --> B;
        E -- Store Raw Data --> F((TimescaleDB));
        E -- Fetch Threshold, Store Fault Status --> G;
    end

    subgraph "Backend API Layer (Django)"
        H[RESTful APIs] -- Fetch Data --> G;
        H -- Fetch Record History --> F;
        I[Fault Detection Config APIs] -- Update Threshold --> G;
    end

    subgraph "Frontend Layer (React)"
        J[Alarm Management UI] -- Fetch Data --> H;
        K[AFDD Setting UI] -- Update Threshold --> I;
        J -- Subscribe Realtime Updates --> G;
        K -- Fetch Threshold --> H;
        L[Analytics]
    end

    direction LR
```
<p style="text-align:center;">System Architecture Diagram of Hotel IoT AFDD</p>
<p style="text-align:justify;">
This system architecture consists of four layers: simulated sensor agents (IAQ, Life Being, Power Meter) publish data to RabbitMQ and Supabase in the Agent Layer. In the Data Processing & Storage Layer, RabbitMQ routes data to a Fault Detection Agent for fault detection and receives fault status in return. The agent also stores raw data in TimescaleDB for historical data analysis, fetches threshold from and publishes fault status to Supabase. The Backend API Layer (Django) acts as an API gateway to expose RESTful APIs for fetching data and updating fault detection thresholds between Frontend Layer and Database Storage Layer. The Frontend Layer (React) includes an Dashboard UI for monitoring and an Configuration UI for configuring thresholds, both interacting with Supabase and backend APIs, with real-time updates handled via Supabase subscriptions.
</p>

## Installation And Usage

This project uses **docker-compose** to manage and run multiple services. Configuration values are stored in a `.env` file for easy setup and portability. You can also run each service separately in [django backend](https://github.com/kaunghtetsan275/hotel_iot_afdd_backend) repo and [simulation agent](https://github.com/kaunghtetsan275/hotel_iot_afdd_data_simulation) repo.
## 📦 Prerequisites
---
- [Docker](https://www.docker.com/products/docker-desktop) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- Git installed
- .env file
---
## 📁 Clone the Repository
```bash
git clone https://github.com/kaunghtetsan275/hotel_iot_afdd_frontend.git
cd hotel_iot_afdd_frontend
```
## ⚙️ Environment Configuration
Create a .env file in the root directory with the necessary environment variables.

💡 Customize the values based on your environment.
Go to the cloned repository and start using docker-compose.
🚀 Usage
🛠 Build and Start the Services
```bash
docker-compose build
docker-compose up -d
```
🛑 Stop the Services
```bash
docker-compose down
```
📂 Project Structure
```bash
.
├── docker-compose.yaml
├── .env
├── public
├── src
├── docs
│   └── ...
└── README.md
```

📞 Contact
For further information, reach out to kevin@cattt.space
