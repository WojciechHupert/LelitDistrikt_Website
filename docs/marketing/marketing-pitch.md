# Pitch

## Short Version

`Lelit Distrikt 2` is a local-first narrative social simulation built in Unreal Engine. You speak to residents of a sealed Mediterranean district, those conversations become durable memory, and the simulation can carry information between characters over time.

This is not just NPC dialogue generation. It is a memory-and-continuity architecture for authored worlds.

## The Problem

Open-world games are visually rich and socially thin. Characters often reset between encounters. They do not meaningfully remember what the player said, they rarely develop durable social context, and almost never influence one another through remembered information.

## The Product

`Lelit Distrikt 2` addresses that gap with four integrated layers:

1. `Live NPC conversation`
The game runs player-to-NPC text conversation locally through an Ollama-compatible inference path.

2. `Persistent cognitive state`
Conversations can be distilled into summaries, memories, and follow-up actions stored in SQLite.

3. `Moirai Continuity`
Those records can propagate through the district, mutate in transit, and create later NPC-to-NPC interactions.

4. `Moirai Studio Pro`
Developers can inspect, edit, and moderate identities, transcripts, memories, actions, and autonomous exchanges from a dedicated browser-based studio.

## Why It Matters

- It gives narrative games a stronger notion of consequence.
- It keeps inference and player data local.
- It turns AI characters into part of a social system rather than isolated chat surfaces.
- It is already implemented as a real prototype, not a purely conceptual pitch.

## The Strongest One-Sentence Positioning

`Lelit Distrikt 2 is a local-first Unreal social simulation where conversation creates memory, memory shapes relationships, and relationships change what the world knows.`

## Current Honesty Line

The project already has working conversation, persistence, continuity, and Studio tooling. It should be presented as an advanced prototype moving toward a fuller narrative product, not as a finished commercial release.
