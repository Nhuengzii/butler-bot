import { Database } from "bun:sqlite";

import { AvailableButlerAction } from "../actions";
import { AvailableEvents } from "../events";

export type StoredCommand = {
  id: string;
  name: string;
  description: string;
  events: AvailableEvents[];
  actions: {
    name: AvailableButlerAction;
    args: string[] | null;
  }[];
};

class CommandStore {
  private _db: Database;

  constructor(dbPath: string = process.env.BUTLER_DB_PATH || "data/butler.sqlite") {
    this._db = new Database(dbPath, { create: true });
    this._db.run("PRAGMA journal_mode = WAL;");
    this._db.run(`
      CREATE TABLE IF NOT EXISTS commands (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        events TEXT NOT NULL,
        actions TEXT NOT NULL
      );
    `);
    this._db.run(`
      CREATE TABLE IF NOT EXISTS guild_commands (
        guild_id TEXT NOT NULL,
        command_id TEXT NOT NULL,
        PRIMARY KEY (guild_id, command_id),
        FOREIGN KEY (command_id) REFERENCES commands(id) ON DELETE CASCADE
      );
    `);
  }

  public getCommandsForGuild(guildId: string): StoredCommand[] {
    const rows = this._db.query(`
      SELECT commands.id, commands.name, commands.description, commands.events, commands.actions
      FROM commands
      INNER JOIN guild_commands ON guild_commands.command_id = commands.id
      WHERE guild_commands.guild_id = $guildId
      ORDER BY commands.name ASC
    `).all({ $guildId: guildId }) as {
      id: string;
      name: string;
      description: string;
      events: string;
      actions: string;
    }[];

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      events: JSON.parse(row.events) as AvailableEvents[],
      actions: JSON.parse(row.actions) as StoredCommand["actions"],
    }));
  }

  public saveCommandForGuild(guildId: string, command: Omit<StoredCommand, "id">): string {
    const existing = this._db.query("SELECT id FROM commands WHERE name = $name").get({
      $name: command.name,
    }) as { id: string } | undefined;

    const id = existing?.id ?? crypto.randomUUID();
    const events = JSON.stringify(command.events);
    const actions = JSON.stringify(command.actions);

    if (existing) {
      this._db.query(`
        UPDATE commands
        SET description = $description, events = $events, actions = $actions
        WHERE id = $id
      `).run({
        $id: id,
        $description: command.description,
        $events: events,
        $actions: actions,
      });
    } else {
      this._db.query(`
        INSERT INTO commands (id, name, description, events, actions)
        VALUES ($id, $name, $description, $events, $actions)
      `).run({
        $id: id,
        $name: command.name,
        $description: command.description,
        $events: events,
        $actions: actions,
      });
    }

    this._db.query(`
      INSERT OR IGNORE INTO guild_commands (guild_id, command_id)
      VALUES ($guildId, $commandId)
    `).run({
      $guildId: guildId,
      $commandId: id,
    });

    return id;
  }

  public removeCommandForGuild(guildId: string, commandName: string): boolean {
    const existing = this._db.query("SELECT id FROM commands WHERE name = $name").get({
      $name: commandName,
    }) as { id: string } | undefined;

    if (!existing) {
      return false;
    }

    const result = this._db.query(`
      DELETE FROM guild_commands
      WHERE guild_id = $guildId AND command_id = $commandId
    `).run({
      $guildId: guildId,
      $commandId: existing.id,
    });

    const remaining = this._db.query(
      "SELECT COUNT(*) as count FROM guild_commands WHERE command_id = $commandId"
    ).get({
      $commandId: existing.id,
    }) as { count: number };

    if (remaining.count === 0) {
      this._db.query("DELETE FROM commands WHERE id = $commandId").run({
        $commandId: existing.id,
      });
    }

    return result.changes > 0;
  }
}

export { CommandStore };
