# Construction ERP UI System

## Overview
This UI system implements a role-based, modular, field-ready interface for the Construction ERP system. It follows the design principles of being desktop-first for Head Office and mobile-first for Site users, with fast data entry and offline-friendly patterns for field roles.

## UI Design Principles
- Role-based UI (users only see what they are allowed to see)
- Desktop-first for Head Office, mobile-first for Site
- Fast data entry (minimal clicks)
- Offline-friendly patterns for field roles
- Audit-visible actions (approve, reject, comment)
- Consistent components across modules

## Global UI Structure
- Top Bar: Company name, Project switcher, Notifications, User profile
- Left Sidebar: Dashboard, Projects, Finance, Procurement, HR, EHS, Technical Docs, Reports, Admin
- Main Content Area: Page content

## Tech Stack
- Frontend: React + TypeScript
- UI Kit: Material-UI (MUI)
- Charts: Recharts
- State: React Query + Redux Toolkit
- Forms: React Hook Form
- Auth: JWT with route guards

## Component System
Reusable components defined once, used everywhere:
- Buttons: Primary / Approve / Reject / Danger
- Status badges: Pending, Approved, Rejected
- Tables: Sort, filter, export
- Forms: Validation, autosave
- Modals: Approval, confirmation
- Charts: Line, bar, donut