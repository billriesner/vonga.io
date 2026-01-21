# Agent Learning System Guide

## Overview

All Vonga OS agents can now **learn and remember** facts, preferences, and insights across conversations!

## How It Works

### 1. **Storage System**
- All learned information is stored in a Google Doc: `Vonga_Agent_Learning`
- Organized into three sections:
  - **FACTS**: Objective information
  - **PREFERENCES**: User preferences and settings
  - **INSIGHTS**: Business insights and learnings

### 2. **Automatic Loading**
- When agents start, they automatically load all learned facts
- Learned information is injected into each agent's system prompt
- Agents have access to this information in every conversation

### 3. **Learning Tools**
All agents have access to three tools:
- `store_fact`: Store objective facts
- `store_preference`: Store user preferences
- `store_insight`: Store business insights

## How to Use

### Storing Information

Simply tell any agent to remember something:

**Examples:**
- "Remember that I prefer 7am-6pm EST for meetings"
- "For future reference, always use Aqua as the primary brand color"
- "Note that Acme Corp prefers email over phone calls"
- "Remember that I never schedule meetings on Fridays"
- "Store this: Our Q4 focus is enterprise clients"

### What Gets Stored

**Facts:**
- "User prefers 7am-6pm EST for meetings"
- "User's name is Bill"
- "Company is based in [location]"

**Preferences:**
- "Always use Aqua as primary brand color"
- "Never schedule meetings on Fridays"
- "Prefer email over phone calls"

**Insights:**
- "Acme Corp prefers email over phone calls"
- "Q4 focus is enterprise clients"
- "Sarah prefers morning meetings"

## Agent Behavior

When you ask an agent to remember something:
1. Agent uses the appropriate tool (`store_fact`, `store_preference`, or `store_insight`)
2. Information is saved to `Vonga_Agent_Learning` Google Doc
3. Agent confirms the information was stored
4. **All future conversations** will include this information in the agent's context

## Viewing Learned Information

The `Vonga_Agent_Learning` Google Doc in your Drive contains all stored information, organized by type.

## Benefits

- **Persistent Memory**: Information remembered across all conversations
- **Shared Knowledge**: All agents have access to the same learned information
- **Automatic Application**: Agents automatically follow preferences without being reminded
- **Context-Aware**: Agents use learned facts to provide better, personalized responses

## Examples

**Example 1: Scheduling Preferences**
```
You: "Remember that I prefer 7am-6pm EST for meetings"
Agent: [Uses store_preference tool]
Agent: "Preference stored: I prefer 7am-6pm EST for meetings"

[Later, in a new chat]
You: "Block some focus time"
Agent: [Automatically uses 7am-6pm EST preference when scheduling]
```

**Example 2: Brand Preferences**
```
You: "For future reference, always use Aqua as the primary brand color"
Agent: [Uses store_preference tool]
Agent: "Preference stored successfully"

[Later, when creating content]
Agent: [Automatically uses Aqua as primary color]
```

**Example 3: Business Insights**
```
You: "Note that Acme Corp prefers email over phone calls"
Agent: [Uses store_insight tool]
Agent: "Insight stored: Acme Corp prefers email over phone calls"

[Later, when contacting Acme Corp]
Agent: [Automatically uses email instead of phone]
```

## Technical Details

- **Storage**: Google Doc (`Vonga_Agent_Learning`)
- **Format**: Structured sections (FACTS, PREFERENCES, INSIGHTS)
- **Loading**: Automatic on agent initialization
- **Tools**: Available to all agents (Chief of Staff, Sales, Strategist, CMO, Microsite Builder, Prospector)




