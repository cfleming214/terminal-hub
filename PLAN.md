# TerminalHub

## Overview

TerminalHub is a mobile app built with Expo and React Native that enables users to control and manage all their Mac terminals remotely from their iOS/Android devices. Seamlessly integrate with Claude conversations to execute commands, view outputs, and manage multiple terminal sessions across different machines. Perfect for developers who need quick terminal access without being at their desk.

## Tech Stack

- **Frontend**: React Native + Expo (cross-platform iOS/Android)
- **Backend**: Node.js + Express with WebSocket support for real-time terminal streaming
- **Database**: Firebase Realtime Database for session storage and user management
- **Terminal Access**: SSH protocol with secure key management via Keychain
- **AI Integration**: Claude API for intelligent command suggestions and conversation context

## Features

1. **Multi-Mac Management** — Connect to and switch between multiple Mac devices with saved connection profiles
2. **Real-time Terminal Output** — Stream live terminal output via WebSocket with minimal latency
3. **Command History** — Full searchable history of executed commands across all sessions
4. **Claude Chat Integration** — Send terminal outputs to Claude and receive command suggestions within the app
5. **Session Management** — Create, save, and switch between multiple terminal sessions on each Mac
6. **Secure Authentication** — SSH key-based authentication with encrypted storage in device Keychain
7. **Command Favorites** — Save frequently used commands for quick one-tap execution
8. **Terminal Themes** — Multiple color schemes and customizable font sizes for comfortable mobile viewing

## Key Screens

- **Login/Setup**: Initial authentication and Mac device registration with SSH key configuration
- **Device List**: Overview of all connected Macs with connection status and last activity
- **Terminal Screen**: Main interface with command input, output display, and action buttons
- **Claude Chat**: Split-view showing terminal output and Claude conversation for command suggestions
- **Settings/Profiles**: Manage saved connections, SSH keys, themes, and notification preferences

## Core Components

- **SSHManager**: Handles SSH connections, authentication, and command execution via node-ssh library
- **WebSocketServer**: Real-time bidirectional communication between mobile app and backend
- **ClaudeIntegration**: Interfaces with Claude API to analyze terminal output and suggest commands
- **SecureStorage**: Manages SSH keys and credentials using React Native's secure storage with Keychain

## Roadmap

### Week 1

- Set up Expo project with React Navigation and base UI framework
- Build SSH connection manager and test with local Mac
- Create login flow and device registration screens

### Week 2-3

- Implement real-time terminal output streaming via WebSocket
- Develop Claude API integration for command suggestions
- Build command history and search functionality

### Week 4+

- Add command favorites and quick-access features
- Implement multiple session management per device
- Create comprehensive terminal themes and customization options

## Monetisation

- **Freemium Model**: Free tier with 1 connected Mac and basic features; Premium ($4.99/month) for unlimited Macs and Claude integration
- **Pro Tier** ($9.99/month): Includes advanced analytics, command scheduling, and team collaboration features
- **Enterprise**: Custom pricing for organizations with multiple users and devices
- **In-app Purchases**: Optional theme packs and advanced terminal features