-- The Order Database Schema
-- Implements all core tables for the gamification system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with comprehensive profile data
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
    current_story_arc VARCHAR(100) DEFAULT 'awakening',
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

-- Paths table for skill/growth paths
CREATE TABLE paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    
    -- Progression
    current_level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Requirements
    prerequisites JSONB DEFAULT '[]',
    
    -- Metadata
    difficulty VARCHAR(20) DEFAULT 'beginner',
    estimated_duration INTEGER, -- days
    tags TEXT[] DEFAULT '{}'
);

-- Tasks table with comprehensive tracking
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

-- Chat messages for AI interaction
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message Content
    content TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
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
    achievement_id VARCHAR(100) NOT NULL, -- References achievement definition
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    rarity VARCHAR(20),
    
    -- Unlock Details
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trigger_condition TEXT,
    
    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    title_unlocked VARCHAR(200),
    path_unlocked VARCHAR(100)
);

-- System events for tracking important occurrences
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

-- Narrative state tracking
CREATE TABLE narrative_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Narrative Progress
    current_arc VARCHAR(100) NOT NULL,
    arc_progress INTEGER DEFAULT 0,
    available_choices JSONB DEFAULT '[]',
    completed_milestones TEXT[] DEFAULT '{}',
    
    -- Character Development
    character_traits JSONB DEFAULT '[]',
    
    -- World State
    world_state JSONB DEFAULT '{
        "orderInfluence": 0,
        "chaosLevel": 0,
        "discoveredSecrets": [],
        "unlockedRegions": [],
        "allyRelationships": {}
    }',
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User analytics for pattern recognition
CREATE TABLE user_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Time Period
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Metrics
    task_completion_rate DECIMAL(5,2),
    most_active_categories TEXT[],
    average_session_length INTEGER,
    streak_patterns JSONB,
    engagement_level VARCHAR(20),
    
    -- Insights
    growth_areas TEXT[],
    recommendations TEXT[],
    
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_current_rank ON users(current_rank);
CREATE INDEX idx_users_last_active ON users(last_active);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_completed_at ON tasks(completed_at);

CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX idx_chat_messages_message_type ON chat_messages(message_type);

CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_achievements_unlocked_at ON achievements(unlocked_at);
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_achievement_id ON achievements(achievement_id);

CREATE INDEX idx_system_events_user_id ON system_events(user_id);
CREATE INDEX idx_system_events_event_type ON system_events(event_type);
CREATE INDEX idx_system_events_timestamp ON system_events(timestamp);

CREATE INDEX idx_narrative_states_user_id ON narrative_states(user_id);
CREATE INDEX idx_narrative_states_current_arc ON narrative_states(current_arc);

CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX idx_user_analytics_period ON user_analytics(period_start, period_end);

-- Composite indexes for common queries
CREATE INDEX idx_tasks_user_status_due ON tasks(user_id, status, due_date);
CREATE INDEX idx_chat_messages_user_timestamp ON chat_messages(user_id, timestamp DESC);
CREATE INDEX idx_system_events_user_type_timestamp ON system_events(user_id, event_type, timestamp DESC);

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users SET last_active = NOW() WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_active_on_task
    AFTER INSERT OR UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_user_last_active();

CREATE TRIGGER trigger_update_last_active_on_chat
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_user_last_active();

-- Function to calculate user rank based on stats
CREATE OR REPLACE FUNCTION calculate_user_rank(user_stats JSONB)
RETURNS VARCHAR(50) AS $$
DECLARE
    avg_stat DECIMAL;
BEGIN
    avg_stat := (
        (user_stats->>'spiritual')::INTEGER +
        (user_stats->>'health')::INTEGER +
        (user_stats->>'intelligence')::INTEGER +
        (user_stats->>'physical')::INTEGER +
        (user_stats->>'creativity')::INTEGER +
        (user_stats->>'resilience')::INTEGER
    ) / 6.0;
    
    IF avg_stat >= 80 THEN RETURN 'Transcendent';
    ELSIF avg_stat >= 70 THEN RETURN 'Sage';
    ELSIF avg_stat >= 60 THEN RETURN 'Master';
    ELSIF avg_stat >= 45 THEN RETURN 'Expert';
    ELSIF avg_stat >= 30 THEN RETURN 'Adept';
    ELSIF avg_stat >= 15 THEN RETURN 'Seeker';
    ELSE RETURN 'Initiate';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update rank when stats change
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS TRIGGER AS $$
DECLARE
    new_rank VARCHAR(50);
BEGIN
    new_rank := calculate_user_rank(NEW.stats);
    
    IF new_rank != NEW.current_rank THEN
        NEW.current_rank := new_rank;
        
        -- Create rank up event
        INSERT INTO system_events (user_id, event_type, event_data)
        VALUES (NEW.id, 'rank_up', json_build_object(
            'oldRank', OLD.current_rank,
            'newRank', new_rank,
            'averageStat', (
                (NEW.stats->>'spiritual')::INTEGER +
                (NEW.stats->>'health')::INTEGER +
                (NEW.stats->>'intelligence')::INTEGER +
                (NEW.stats->>'physical')::INTEGER +
                (NEW.stats->>'creativity')::INTEGER +
                (NEW.stats->>'resilience')::INTEGER
            ) / 6.0
        ));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rank_on_stats_change
    BEFORE UPDATE OF stats ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_rank();
