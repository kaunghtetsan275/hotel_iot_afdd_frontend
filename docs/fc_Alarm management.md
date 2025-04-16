```mermaid
graph TD
    A[User Opens Alarm Dashboard] --> B(Frontend Requests Active Alarms from Backend API);
    B --> C(Backend API Retrieves Active Alarms from Supabase);
    C --> D[Frontend Displays Active Alarms];
    E[Supabase Sends Realtime Alarm Updates] --> F[Frontend Updates Alarm Display];
    G[User Acknowledges Alarm] --> H(Frontend Sends Acknowledge Request to Backend API);
    H --> I(Backend API Updates Alarm Status in Supabase);
    I --> J[Supabase Sends Realtime Status Update];
    J --> K[Frontend Updates Alarm Status];