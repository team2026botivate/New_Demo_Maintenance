1. Project Context
You are working on a Maintenance Management System frontend built with React, TypeScript, Tailwind CSS, Zustand, and React Router. The current system (as per the BOTIVATE SYSTEM UPDATE REPORT) implements only the "Current System" features: task-based maintenance, manual tracking, basic checklist, and no prediction/intelligence.

The goal is to upgrade the system into a Predictive Maintenance Platform as outlined in the report. This document defines the tasks required to achieve that upgrade while maintaining industrial standards (data accuracy, scalability, UI simplicity, and mobile‑friendliness).

2. Objectives
Predict machine failures before breakdown using rule‑based logic (Phase 1) and eventually AI (Phase 2).

Automate maintenance planning – create tasks automatically from alerts.

Improve efficiency & reduce downtime through proactive alerts and dashboard insights.

Enable data‑driven decisions with health scores, trends, and cost analysis.

3. Existing Project Structure (Key Files)
text
src/
├── components/
│   ├── Layout.tsx, Header.tsx, Sidebar.tsx, ProtectedRoute.tsx
├── pages/
│   ├── Dashboard.tsx, Machines.tsx, MachineDetails.tsx, Tasks.tsx, TaskDetails.tsx,
│   ├── Dailyreport.tsx, Calendar.tsx, Reports.tsx, Team.tsx, Settings.tsx,
│   ├── Adminapprovel.tsx, AssignTask.tsx, NewMachine.tsx
├── store/
│   ├── authStore.ts
├── types.ts
├── App.tsx, main.tsx, index.css
All data is currently mocked (no backend). The new features must be implemented with the same mock‑data approach initially, but structured to allow easy replacement with real API endpoints later.

4. Implementation Tasks (By Module)
4.1. Machine Data Tracking System
Goal: Extend data capture to support predictive analysis.

4.1.1. Daily Machine Log
Create a new page/component for logging daily machine data.

Fields (from PDF):

machineId (select from existing machines)

date (default today)

runtimeHours (number)

temperature (number, optional sensor/manual)

load (percentage)

operatorName (text)

remarks (text)

UI:

Form to submit daily log.

Table view to see past logs per machine.

Backend considerations:

Add to types.ts: interface DailyMachineLog { ... }

Store in useState or a new Zustand store (e.g., dailyLogStore).

Later can be replaced by API calls.

4.1.2. Breakdown Log
Create a page/component for logging breakdown events.

Fields:

machineId

date (datetime of failure)

failureType (predefined list: Electrical, Mechanical, Software, Operator Error, etc.)

rootCause (text)

downtimeHours (number)

status (Open, In Progress, Resolved, Closed)

Additional fields (industrial standard):

downtimeCost (auto‑calculated: downtimeHours × cost per hour)

technicianAssigned (from HR/team list)

actionTaken (text)

severity (Critical, Major, Minor)

UI:

Form to report breakdown.

List view with filters (by machine, date range, status).

Admin can update status and assign technician.

4.1.3. Update Machine Master
Ensure Machine interface includes fields needed for predictive engine:

runtimeThreshold (number) – hours before maintenance due

temperatureThreshold (number) – max safe temperature

criticality (High/Medium/Low)

Add these fields to the Add/Edit Machine forms.

4.2. Rule‑Based Predictive Engine (Phase 1)
Goal: Generate alerts based on defined rules.

Rules to implement (as per PDF):

Runtime Threshold Alert

Compare total runtime (sum of daily log runtimeHours) against machine's runtimeThreshold.

If runtime >= threshold → trigger alert: "Maintenance Due".

Temperature Threshold Alert

If latest temperature reading (from daily log or task checklist) exceeds machine's temperatureThreshold → alert: "Overheating Risk".

Breakdown Frequency Alert

Count breakdowns in last 10 days. If >=2 → alert: "High Risk Machine".

Maintenance Delay Escalation

Check for scheduled tasks that are overdue (due date < today and status not completed). If any → escalate (alert admin).

Implementation:

Create a new service (e.g., services/ruleEngine.ts) with functions that evaluate rules against stored data.

Run rule evaluation on:

New daily log added

New breakdown logged

Task status change

Scheduled cron (simulated via polling in frontend)

Alerts should be stored in a new Alert store (Zustand) and displayed in UI.

4.3. Machine Health Score System
Goal: Compute a score 0‑100 per machine.

Factors (weighted):

Breakdown frequency (in last 30 days) – high weight

Maintenance delays (overdue tasks) – medium weight

Temperature deviation (recent readings above threshold) – low weight

Runtime overload (runtime vs. expected) – medium weight

Formula example:

text
healthScore = 100 - (breakdownPenalty + delayPenalty + tempPenalty + runtimePenalty)
Where each penalty is calculated based on deviation from ideal.

Implementation:

Create a function calculateHealthScore(machineId) that uses data from daily logs, breakdowns, tasks.

Store health score in machine object (or recompute on the fly).

Display in machine list and machine details.

4.4. Predictive Dashboard Widgets
Goal: Enhance the Dashboard with widgets required in the PDF.

Widgets to add:

Machine Health Overview – summary (healthy/moderate/high risk counts) + list of machines.

High Risk Machines List – machines with health score <50.

Upcoming Maintenance Alerts – list of alerts generated by rule engine.

Downtime Trend Graph – line chart showing total downtime over time (from breakdown logs).

MTBF (Mean Time Between Failures) – computed per machine (total operational time / number of breakdowns).

Maintenance Cost Analysis – existing chart can be expanded to show cost trends.

UI:

Use Recharts for graphs.

Ensure responsive layout.

4.5. Automation & Alerts
Goal: Trigger actions based on alerts.

Actions:

Alert Generation:

Display system notification (toast) when an alert is created.

Store alert in a notifications center (bell icon in header).

(Future) WhatsApp API integration – placeholder for now.

Auto Task Creation:

When an alert is triggered (e.g., "Maintenance Due"), automatically create a maintenance task for that machine with default description, priority, and due date.

Task should be created via a service function that adds to the task list.

Implementation:

Create an Alert store to hold active alerts.

Extend Tasks store with a method createTaskFromAlert(alert).

Update header to show alert count.

4.6. Integration with Other Modules (Placeholders)
Goal: Demonstrate connectivity for future full integration.

Integration points (mock):

Inventory System – when a task is created, check if required spare parts (from machine's maintenance parts) are in stock. If not, generate an alert.

Purchase System – for low‑stock parts, suggest a purchase order (display a modal or notification).

HR System – when assigning a task, suggest technician based on skills (from TeamReport data). For now, just show a list of available technicians.

These can be implemented as simple functions that reference existing mock data.

4.7. AI Layer (Phase 2 – Future Ready)
Goal: Lay groundwork for AI features.

Tasks:

Ensure all data required for training is stored (daily logs, breakdowns, tasks, temperatures, etc.).

Add placeholders for:

"Predict Failure" button on machine details (shows mock prediction).

"Root Cause Analysis" button on breakdown logs.

Document in code comments where AI would be integrated.

4.8. System Flow & UI Updates
Ensure the flow follows the PDF:
Machine Data Input → Daily Logs + Maintenance History → Rule Engine → Health Score Calculation → Alerts & Dashboard → Task Automation → Reports & Insights.

Update sidebar navigation to include new pages (Daily Log, Breakdown Log) under appropriate roles (admin only? both?).

Ensure mobile‑friendly design for all new forms and tables.

5. Technical Guidelines
5.1. Code Structure
Use existing folder structure.

Create new stores in src/store/ for alerts, daily logs, breakdown logs (Zustand with persist as needed).

Create new services in src/services/ for rule engine, health score calculation.

Create new pages in src/pages/.

Use existing components for modals, tables, etc.

5.2. TypeScript
Define all new types/interfaces in types.ts.

Use strict typing; avoid any.

5.3. State Management
Use Zustand stores for data that needs to be shared across components.

For form inputs, use local state.

5.4. Mock Data
For initial implementation, seed stores with mock data (similar to existing mock data patterns).

Ensure mock data covers scenarios for all rules (e.g., machines with high runtime, high temperature, many breakdowns).

5.5. Error Handling & Data Validation
Validate form inputs (required fields, number ranges).

Show user‑friendly error messages.

Prevent duplicate data where appropriate.

5.6. UI/UX
Follow the existing design system (Tailwind, colors, shadows).

Use Lucide icons consistently.

Ensure all new pages have proper titles and breadcrumbs where needed.

6. Phase‑wise Implementation (Optional)
While the agent can implement all features in one go, it may be helpful to follow the PDF's timeline:

Phase 1 (2‑3 weeks):
Data structure, logging system, rule‑based alerts.

Phase 2 (2 weeks):
Dashboard, health score, automation.

But as an AI, implement in logical order: first create data structures (daily log, breakdown log), then implement rule engine, then health score, then dashboard widgets, then automation, and finally integrations.

7. Testing & Validation
Test each rule with mock data to ensure alerts are generated correctly.

Verify health score calculation with sample data.

Check that auto‑task creation works.

Ensure all new pages are accessible and responsive.

8. Deliverables
After completing the tasks, the AI agent should:

Add/modify TypeScript types.

Create new pages and components.

Update existing components (Dashboard, MachineDetails, etc.) to include new features.

Ensure all routes are properly protected (admin/user).

Provide a summary of changes and any notes for future expansion.

9. Final Note
Keep the system scalable for future AI integration. Ensure data accuracy by validating inputs. Maintain simple UI for factory users. All new features must be mobile‑friendly.

Now proceed to implement these enhancements step by step, following the existing code style and patterns.