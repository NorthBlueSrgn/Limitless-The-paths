-- Initial Database Schema for The Order System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Core Stats (0-100 scale)
    stats JSONB NOT NULL DEFAULT '{
        "spiritual": 0,
        "health": 0,
        "intelligence": 0,
        "physical": 0,
        "creativity": 0,
        "resilience": 0
    }',
    
    -- Progression System
    total_xp INTEGER DEFAULT 0,
    current_rank VARCHAR(50) DEFAULT 'Initiate',
    rank_progress INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    
    -- Streaks and Patterns
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_task_completion TIMESTAMP WITH TIME ZONE,
    
    -- Behavioral Patterns
    preferred_task_types TEXT[] DEFAULT '{}',
    average_session_length INTEGER DEFAULT 0,
    most_active_time_of_day VARCHAR(20),
    weekly_activity_pattern INTEGER[] DEFAULT '{0,0,0,0,0,0,0}',
    
    -- Narrative State
    current_story_arc VARCHAR(100),
    completed_arcs TEXT[] DEFAULT '{}',
    narrative_choices JSONB DEFAULT '{}',
    
    -- Metadata
    timezone VARCHAR(50) DEFAULT 'UTC',
    preferences JSONB DEFAULT '{
        "difficultyPreference": "adaptive",
        "notificationSettings": {
            "dailyReminders": true,
            "achievementAlerts": true,
            "streakWarnings": true,
            "weeklyReports": true
        },
        "themePreference": "dark",
        "aiPersonality": "mentor"
    }'
);

-- Paths table
CREATE TABLE paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    
    -- Progression
    current_level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT false,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Requirements
    prerequisites JSONB DEFAULT '[]',
    
    -- Metadata
    difficulty VARCHAR(20) DEFAULT 'beginner',
    estimated_duration INTEGER, -- days
    tags TEXT[] DEFAULT '{}'
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Core Properties
    title VARCHAR(300) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
    
    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    stat_rewards JSONB DEFAULT '{}',
    
    -- Scheduling
    type VARCHAR(20) DEFAULT 'daily',
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_minutes INTEGER DEFAULT 30,
    
    -- State
    status VARCHAR(20) DEFAULT 'pending',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- AI Generation Context
    generated_by VARCHAR(20) DEFAULT 'system',
    generation_context JSONB DEFAULT '{}',
    
    -- Adaptive Learning
    actual_difficulty INTEGER,
    completion_time INTEGER,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5)
);

-- Chat Messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message Content
    content TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Context
    message_type VARCHAR(50) DEFAULT 'casual',
    context_data JSONB DEFAULT '{}',
    
    -- AI Metadata
    tokens_used INTEGER,
    response_time INTEGER,
    confidence DECIMAL(3,2)
);

-- Achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Achievement Details
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    rarity VARCHAR(20) DEFAULT 'common',
    
    -- Unlock Conditions
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trigger_condition TEXT,
    
    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    title_unlocked VARCHAR(100),
    path_unlocked VARCHAR(100)
);

-- System Events table
CREATE TABLE system_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Event Details
    event_type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Data
    event_data JSONB DEFAULT '{}',
    
    -- AI Response
    ai_response TEXT,
    user_reaction VARCHAR(20)
);

-- Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_current_rank ON users(current_rank);
CREATE INDEX idx_users_last_active ON users(last_active);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_tasks_category ON tasks(category);

CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX idx_chat_messages_type ON chat_messages(message_type);

CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_achievements_unlocked_at ON achievements(unlocked_at);
CREATE INDEX idx_achievements_category ON achievements(category);

CREATE INDEX idx_system_events_user_id ON system_events(user_id);
CREATE INDEX idx_system_events_type ON system_events(event_type);
CREATE INDEX idx_system_events_timestamp ON system_events(timestamp);

CREATE INDEX idx_paths_user_id ON paths(user_id);
CREATE INDEX idx_paths_category ON paths(category);
CREATE INDEX idx_paths_is_active ON paths(is_active);
