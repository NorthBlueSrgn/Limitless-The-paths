-- The Order: Gamification System Database Schema
-- This schema implements the immutable laws and supports the full system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table - Core user profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Profile Information
    title VARCHAR(100) DEFAULT 'Seeker',
    rank VARCHAR(50) DEFAULT 'Novice',
    hunter_type VARCHAR(50) DEFAULT 'Balanced',
    
    -- Core Progression
    level INTEGER DEFAULT 1,
    total_xp BIGINT DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_level CHECK (level >= 1),
    CONSTRAINT valid_xp CHECK (total_xp >= 0),
    CONSTRAINT valid_streak CHECK (current_streak >= 0)
);

-- User Stats - The six core immutable stats
CREATE TABLE user_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- The Six Core Stats (Immutable Law)
    physical INTEGER DEFAULT 0,
    mental INTEGER DEFAULT 0,
    emotional INTEGER DEFAULT 0,
    social INTEGER DEFAULT 0,
    creative INTEGER DEFAULT 0,
    spiritual INTEGER DEFAULT 0,
    
    -- Metadata
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints (No Punishment Economy - stats never decrease)
    CONSTRAINT valid_physical CHECK (physical >= 0),
    CONSTRAINT valid_mental CHECK (mental >= 0),
    CONSTRAINT valid_emotional CHECK (emotional >= 0),
    CONSTRAINT valid_social CHECK (social >= 0),
    CONSTRAINT valid_creative CHECK (creative >= 0),
    CONSTRAINT valid_spiritual CHECK (spiritual >= 0),
    
    UNIQUE(user_id)
);

-- Tasks table - User tasks and challenges
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Task Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard', 'extreme')),
    
    -- XP and Rewards (Immutable Law: Proportional to difficulty)
    base_xp INTEGER NOT NULL,
    actual_xp INTEGER, -- After bonuses and multipliers
    primary_stat VARCHAR(20),
    secondary_stats TEXT[], -- Array of secondary stats for synergy
    
    -- Status and Timing
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'paused')),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- AI Generation Context
    generated_by_ai BOOLEAN DEFAULT false,
    ai_context JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_base_xp CHECK (base_xp >= 10 AND base_xp <= 1000), -- Immutable Law bounds
    CONSTRAINT valid_actual_xp CHECK (actual_xp >= base_xp) -- No punishment economy
);

-- Achievements table - System achievements
CREATE TABLE achievements (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(10),
    
    -- Requirements (stored as JSONB for flexibility)
    requirements JSONB NOT NULL,
    
    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    title_reward VARCHAR(100),
    unlocks TEXT[],
    
    -- Metadata
    hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements - Junction table
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(50) NOT NULL REFERENCES achievements(id),
    
    -- Achievement context
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress_data JSONB, -- Store progress snapshots
    
    UNIQUE(user_id, achievement_id)
);

-- Paths table - Growth paths and specializations
CREATE TABLE paths (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    
    -- Requirements and unlocks
    required_level INTEGER DEFAULT 1,
    required_achievements TEXT[],
    unlocked_by TEXT[],
    
    -- Path interconnection (Immutable Law)
    primary_stats TEXT[] NOT NULL, -- Must contribute to at least one core stat
    synergy_paths TEXT[], -- Paths that synergize with this one
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Paths - User's active and completed paths
CREATE TABLE user_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    path_id VARCHAR(50) NOT NULL REFERENCES paths(id),
    
    -- Progress
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    xp_invested INTEGER DEFAULT 0,
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(user_id, path_id)
);

-- Story Progress - Narrative system tracking
CREATE TABLE story_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Story tracking
    current_arc VARCHAR(50) NOT NULL,
    completed_chapters TEXT[] DEFAULT '{}',
    current_chapter VARCHAR(50),
    
    -- Choices and consequences
    story_choices JSONB DEFAULT '{}',
    narrative_state JSONB DEFAULT '{}',
    
    -- Timestamps
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- AI Messages - Chat history with The Order
CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message content
    content TEXT NOT NULL,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant')),
    category VARCHAR(50),
    
    -- Context
    user_context JSONB, -- User state when message was sent
    ai_context JSONB, -- AI reasoning and context
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- XP Transactions - Audit trail for all XP changes (Effort Transparency)
CREATE TABLE xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Transaction details
    amount INTEGER NOT NULL,
    source VARCHAR(100) NOT NULL, -- task_completion, achievement, bonus, etc.
    source_id UUID, -- Reference to task, achievement, etc.
    
    -- Transparency (Immutable Law)
    base_amount INTEGER NOT NULL,
    difficulty_multiplier DECIMAL(3,2) DEFAULT 1.00,
    streak_multiplier DECIMAL(3,2) DEFAULT 1.00,
    synergy_bonus DECIMAL(3,2) DEFAULT 0.00,
    explanation TEXT NOT NULL,
    
    -- Validation
    validated_by_laws BOOLEAN DEFAULT true,
    law_violations TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints (No Punishment Economy)
    CONSTRAINT no_negative_xp CHECK (amount >= 0)
);

-- Stat Transactions - Audit trail for stat changes
CREATE TABLE stat_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Stat change details
    stat_name VARCHAR(20) NOT NULL,
    amount INTEGER NOT NULL,
    source VARCHAR(100) NOT NULL,
    source_id UUID,
    
    -- Synergy tracking (Positive Sum Growth)
    primary_stat BOOLEAN DEFAULT false,
    synergy_bonus DECIMAL(3,2) DEFAULT 0.00,
    affected_stats JSONB, -- Other stats that benefited
    
    -- Validation
    explanation TEXT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints (No Punishment Economy)
    CONSTRAINT no_negative_stats CHECK (amount >= 0)
);

-- System Analytics - Track patterns and insights
CREATE TABLE system_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Analytics data
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2),
    dimensions JSONB, -- Additional context
    
    -- Time series
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_bucket VARCHAR(20) -- hourly, daily, weekly, monthly
);

-- Indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_last_active ON users(last_active);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_difficulty ON tasks(difficulty);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked_at ON user_achievements(unlocked_at);

CREATE INDEX idx_user_paths_user_id ON user_paths(user_id);
CREATE INDEX idx_user_paths_status ON user_paths(status);

CREATE INDEX idx_ai_messages_user_id ON ai_messages(user_id);
CREATE INDEX idx_ai_messages_created_at ON ai_messages(created_at);

CREATE INDEX idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX idx_xp_transactions_created_at ON xp_transactions(created_at);

CREATE INDEX idx_stat_transactions_user_id ON stat_transactions(user_id);
CREATE INDEX idx_stat_transactions_stat_name ON stat_transactions(stat_name);

-- Triggers for automatic updates

-- Update user level based on total XP
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.level = GREATEST(1, FLOOR(NEW.total_xp / 1000) + 1);
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_level
    BEFORE UPDATE OF total_xp ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_level();

-- Update user rank based on level and stats
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS TRIGGER AS $$
DECLARE
    user_level INTEGER;
    max_stat INTEGER;
    total_stats INTEGER;
BEGIN
    SELECT level INTO user_level FROM users WHERE id = NEW.user_id;
    
    SELECT GREATEST(NEW.physical, NEW.mental, NEW.emotional, NEW.social, NEW.creative, NEW.spiritual) INTO max_stat;
    SELECT (NEW.physical + NEW.mental + NEW.emotional + NEW.social + NEW.creative + NEW.spiritual) INTO total_stats;
    
    -- Update rank based on progression
    UPDATE users SET 
        rank = CASE 
            WHEN user_level >= 100 AND max_stat >= 75 THEN 'Transcendent'
            WHEN user_level >= 75 AND max_stat >= 50 THEN 'Master'
            WHEN user_level >= 50 AND max_stat >= 35 THEN 'Expert'
            WHEN user_level >= 25 AND max_stat >= 20 THEN 'Adept'
            WHEN user_level >= 10 AND max_stat >= 10 THEN 'Apprentice'
            ELSE 'Novice'
        END,
        hunter_type = CASE
            WHEN NEW.physical = max_stat THEN 'Enhancer'
            WHEN NEW.mental = max_stat THEN 'Specialist'
            WHEN NEW.emotional = max_stat THEN 'Manipulator'
            WHEN NEW.social = max_stat THEN 'Emitter'
            WHEN NEW.creative = max_stat THEN 'Transmuter'
            WHEN NEW.spiritual = max_stat THEN 'Conjurer'
            ELSE 'Balanced'
        END,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_rank
    AFTER UPDATE ON user_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_user_rank();

-- Streak tracking function
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
BEGIN
    -- Update last_active and potentially streak
    NEW.last_active = NOW();
    
    -- If last active was yesterday, increment streak
    -- If last active was today, keep current streak
    -- If last active was more than 1 day ago, reset streak
    IF OLD.last_active::date = (CURRENT_DATE - INTERVAL '1 day')::date THEN
        NEW.current_streak = OLD.current_streak + 1;
        NEW.longest_streak = GREATEST(OLD.longest_streak, NEW.current_streak);
    ELSIF OLD.last_active::date < (CURRENT_DATE - INTERVAL '1 day')::date THEN
        NEW.current_streak = 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_streak
    BEFORE UPDATE OF last_active ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_streak();

-- Insert default data

-- Insert core achievements
INSERT INTO achievements (id, title, description, rarity, category, icon, requirements, xp_reward, title_reward) VALUES
('first_steps', 'First Steps', 'Complete your first task in the system', 'common', 'progress', '👣', '{"tasks": 1}', 50, 'Initiate'),
('week_warrior', 'Week Warrior', 'Maintain a 7-day streak', 'common', 'consistency', '🔥', '{"streak": 7}', 100, null),
('balanced_growth', 'Balanced Growth', 'Reach level 10 in all core stats', 'uncommon', 'mastery', '⚖️', '{"stats": {"all": 10}}', 250, 'Balanced One'),
('specialist', 'Specialist', 'Reach level 25 in any single stat', 'rare', 'mastery', '🎯', '{"stats": {"any": 25}}', 750, 'Specialist'),
('polymath', 'Polymath', 'Reach level 20 in all core stats', 'epic', 'mastery', '🧠', '{"stats": {"all": 20}}', 1500, 'Polymath'),
('master_of_all', 'Master of All', 'Reach level 50 in all core stats', 'legendary', 'mastery', '👑', '{"stats": {"all": 50}}', 5000, 'Grandmaster'),
('transcendent', 'Transcendent', 'Reach the highest level of mastery', 'mythic', 'transcendence', '✨', '{"level": 100, "stats": {"all": 75}, "tasks": 1000}', 10000, 'Transcendent');

-- Insert core paths
INSERT INTO paths (id, name, description, category, required_level, primary_stats) VALUES
('physical_mastery', 'Physical Mastery', 'Develop your physical capabilities and endurance', 'enhancement', 1, ARRAY['physical']),
('mental_fortress', 'Mental Fortress', 'Strengthen your mind and cognitive abilities', 'specialization', 1, ARRAY['mental']),
('emotional_intelligence', 'Emotional Intelligence', 'Master your emotions and develop empathy', 'manipulation', 1, ARRAY['emotional']),
('social_dynamics', 'Social Dynamics', 'Understand and influence social interactions', 'emission', 1, ARRAY['social']),
('creative_expression', 'Creative Expression', 'Unlock your creative potential', 'transmutation', 1, ARRAY['creative']),
('spiritual_awakening', 'Spiritual Awakening', 'Explore the deeper mysteries of existence', 'conjuration', 1, ARRAY['spiritual']),
('balanced_harmony', 'Balanced Harmony', 'Achieve perfect balance across all aspects', 'transcendence', 10, ARRAY['physical', 'mental', 'emotional', 'social', 'creative', 'spiritual']);

-- Create function to initialize new user
CREATE OR REPLACE FUNCTION initialize_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create default stats entry
    INSERT INTO user_stats (user_id) VALUES (NEW.id);
    
    -- Create default story progress
    INSERT INTO story_progress (user_id, current_arc) VALUES (NEW.id, 'awakening');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_initialize_new_user
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION initialize_new_user();

-- Comments for documentation
COMMENT ON TABLE users IS 'Core user profiles with progression tracking';
COMMENT ON TABLE user_stats IS 'The six immutable core stats that define human growth';
COMMENT ON TABLE tasks IS 'User tasks with XP rewards following immutable laws';
COMMENT ON TABLE xp_transactions IS 'Complete audit trail for XP changes (Effort Transparency)';
COMMENT ON TABLE stat_transactions IS 'Complete audit trail for stat changes (No Punishment Economy)';
COMMENT ON COLUMN xp_transactions.explanation IS 'Human-readable explanation of XP award (Immutable Law: Effort Transparency)';
COMMENT ON CONSTRAINT no_negative_xp ON xp_transactions IS 'Immutable Law: No Punishment Economy - XP cannot be removed';
COMMENT ON CONSTRAINT no_negative_stats ON stat_transactions IS 'Immutable Law: No Punishment Economy - Stats cannot decrease';
