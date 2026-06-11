const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const initialSchemes = require('./schemesData');

// Paths for JSON storage mode
const DATA_DIR = path.join(__dirname, '..', 'data');
const JSON_DB_PATH = path.join(DATA_DIR, 'db_local.json');

// Initialize local JSON database directory and file if they don't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultJsonStructure = {
  users: [],
  documents: [],
  schemes: [],
  eligibilityResults: [],
  roadmaps: [],
  recommendations: [],
  agentLogs: [],
  notifications: [],
  lifeEvents: []
};

function readJsonDB() {
  if (!fs.existsSync(JSON_DB_PATH)) {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultJsonStructure, null, 2));
    return defaultJsonStructure;
  }
  try {
    const data = fs.readFileSync(JSON_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading JSON database, resetting to default:", err);
    return defaultJsonStructure;
  }
}

function writeJsonDB(data) {
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing JSON database:", err);
  }
}

// Global state for mode
let isPg = false;
let pool = null;

const dbUrl = process.env.DATABASE_URL;

if (dbUrl) {
  try {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });
    isPg = true;
    console.log("Database Status: Connected to PostgreSQL successfully!");
  } catch (err) {
    console.error("PostgreSQL connection failed, falling back to Local JSON DB:", err.message);
    isPg = false;
  }
} else {
  console.log("Database Status: No DATABASE_URL found. Running in Local JSON Database Mode (Zero-Config Hackathon Mode).");
}

// Setup & Seeding Database
async function initDb() {
  if (isPg) {
    try {
      const client = await pool.connect();
      // Create tables for PostgreSQL
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) DEFAULT 'Citizen',
          age INT,
          gender VARCHAR(20),
          income INT,
          state VARCHAR(50),
          education VARCHAR(100),
          occupation VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS schemes (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(50),
          benefits TEXT,
          eligibility_rules JSONB,
          required_documents TEXT[],
          deadline VARCHAR(50),
          application_link TEXT
        );
        CREATE TABLE IF NOT EXISTS documents (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          type VARCHAR(50),
          file_url TEXT,
          ocr_content TEXT,
          verified BOOLEAN DEFAULT FALSE,
          expiry_date VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS eligibility_results (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          scheme_id INT REFERENCES schemes(id) ON DELETE CASCADE,
          match_percentage INT,
          reason JSONB,
          checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS roadmaps (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          scheme_id INT REFERENCES schemes(id) ON DELETE CASCADE,
          steps JSONB,
          status VARCHAR(20) DEFAULT 'Pending',
          percentage INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS recommendations (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255),
          category VARCHAR(50),
          description TEXT,
          difficulty VARCHAR(20),
          reward VARCHAR(100),
          timeline VARCHAR(50),
          status VARCHAR(20) DEFAULT 'Recommended',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS agent_logs (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          agent_name VARCHAR(100),
          log_text TEXT,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS notifications (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255),
          message TEXT,
          read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS life_events (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          current_stage VARCHAR(100),
          history JSONB,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed schemes in PG
      const res = await client.query("SELECT COUNT(*) FROM schemes");
      if (parseInt(res.rows[0].count) === 0) {
        for (const s of initialSchemes) {
          await client.query(
            "INSERT INTO schemes (id, name, description, category, benefits, eligibility_rules, required_documents, deadline, application_link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [s.id, s.name, s.description, s.category, s.benefits, JSON.stringify(s.eligibility_rules), s.required_documents, s.deadline, s.application_link]
          );
        }
        console.log("Database Status: Seeded 30+ schemes in PostgreSQL.");
      }
      client.release();
    } catch (err) {
      console.error("Error setting up PostgreSQL tables, moving to local JSON DB fallback:", err.message);
      isPg = false;
    }
  }

  if (!isPg) {
    const db = readJsonDB();
    // Seed schemes if empty in JSON DB
    if (db.schemes.length === 0) {
      db.schemes = initialSchemes;
      writeJsonDB(db);
      console.log("Database Status: Seeded 30+ schemes in Local JSON DB.");
    }
  }
}

// Repository Methods Wrapper
const db = {
  isPg: () => isPg,
  init: initDb,

  users: {
    create: async (u) => {
      if (isPg) {
        const res = await pool.query(
          "INSERT INTO users (name, email, password, role, age, gender, income, state, education, occupation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
          [u.name, u.email, u.password, u.role || 'Citizen', u.age || null, u.gender || null, u.income || null, u.state || null, u.education || null, u.occupation || null]
        );
        return res.rows[0];
      } else {
        const data = readJsonDB();
        const newUser = {
          id: data.users.length + 1,
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role || 'Citizen',
          age: u.age || null,
          gender: u.gender || null,
          income: u.income || null,
          state: u.state || null,
          education: u.education || null,
          occupation: u.occupation || null,
          created_at: new Date().toISOString()
        };
        data.users.push(newUser);
        writeJsonDB(data);
        return newUser;
      }
    },
    findByEmail: async (email) => {
      if (isPg) {
        const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows[0] || null;
      } else {
        const data = readJsonDB();
        return data.users.find(u => u.email === email) || null;
      }
    },
    findById: async (id) => {
      if (isPg) {
        const res = await pool.query("SELECT * FROM users WHERE id = $1", [parseInt(id)]);
        return res.rows[0] || null;
      } else {
        const data = readJsonDB();
        return data.users.find(u => u.id === parseInt(id)) || null;
      }
    },
    update: async (id, u) => {
      if (isPg) {
        const fields = [];
        const values = [];
        let index = 1;
        for (const [key, val] of Object.entries(u)) {
          fields.push(`${key} = $${index}`);
          values.push(val);
          index++;
        }
        values.push(parseInt(id));
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
        const res = await pool.query(query, values);
        return res.rows[0];
      } else {
        const data = readJsonDB();
        const idx = data.users.findIndex(user => user.id === parseInt(id));
        if (idx !== -1) {
          data.users[idx] = { ...data.users[idx], ...u };
          writeJsonDB(data);
          return data.users[idx];
        }
        return null;
      }
    },
    list: async () => {
      if (isPg) {
        const res = await pool.query("SELECT * FROM users");
        return res.rows;
      } else {
        const data = readJsonDB();
        return data.users;
      }
    }
  },

  schemes: {
    list: async () => {
      if (isPg) {
        const res = await pool.query("SELECT * FROM schemes");
        return res.rows;
      } else {
        const data = readJsonDB();
        return data.schemes;
      }
    },
    findById: async (id) => {
      if (isPg) {
        const res = await pool.query("SELECT * FROM schemes WHERE id = $1", [parseInt(id)]);
        return res.rows[0] || null;
      } else {
        const data = readJsonDB();
        return data.schemes.find(s => s.id === parseInt(id)) || null;
      }
    }
  },

  documents: {
    create: async (d) => {
      if (isPg) {
        const res = await pool.query(
          "INSERT INTO documents (user_id, name, type, file_url, ocr_content, verified, expiry_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
          [parseInt(d.user_id), d.name, d.type, d.file_url || null, d.ocr_content || null, d.verified || false, d.expiry_date || null]
        );
        return res.rows[0];
      } else {
        const data = readJsonDB();
        const newDoc = {
          id: data.documents.length + 1,
          user_id: parseInt(d.user_id),
          name: d.name,
          type: d.type,
          file_url: d.file_url || null,
          ocr_content: d.ocr_content || null,
          verified: d.verified || false,
          expiry_date: d.expiry_date || null,
          created_at: new Date().toISOString()
        };
        data.documents.push(newDoc);
        writeJsonDB(data);
        return newDoc;
      }
    },
    findByUserId: async (userId) => {
      if (isPg) {
        const res = await pool.query("SELECT * FROM documents WHERE user_id = $1", [parseInt(userId)]);
        return res.rows;
      } else {
        const data = readJsonDB();
        return data.documents.filter(d => d.user_id === parseInt(userId));
      }
    },
    findById: async (id) => {
      if (isPg) {
        const res = await pool.query("SELECT * FROM documents WHERE id = $1", [parseInt(id)]);
        return res.rows[0] || null;
      } else {
        const data = readJsonDB();
        return data.documents.find(d => d.id === parseInt(id)) || null;
      }
    },
    update: async (id, updates) => {
      if (isPg) {
        const fields = [];
        const values = [];
        let index = 1;
        for (const [key, val] of Object.entries(updates)) {
          fields.push(`${key} = $${index}`);
          values.push(val);
          index++;
        }
        values.push(parseInt(id));
        const res = await pool.query(`UPDATE documents SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`, values);
        return res.rows[0];
      } else {
        const data = readJsonDB();
        const idx = data.documents.findIndex(d => d.id === parseInt(id));
        if (idx !== -1) {
          data.documents[idx] = { ...data.documents[idx], ...updates };
          writeJsonDB(data);
          return data.documents[idx];
        }
        return null;
      }
    },
    delete: async (id) => {
      if (isPg) {
        await pool.query("DELETE FROM documents WHERE id = $1", [parseInt(id)]);
        return true;
      } else {
        const data = readJsonDB();
        const initialLen = data.documents.length;
        data.documents = data.documents.filter(d => d.id !== parseInt(id));
        writeJsonDB(data);
        return data.documents.length < initialLen;
      }
    }
  },

  eligibilityResults: {
    create: async (er) => {
      if (isPg) {
        const res = await pool.query(
          "INSERT INTO eligibility_results (user_id, scheme_id, match_percentage, reason) VALUES ($1, $2, $3, $4) RETURNING *",
          [parseInt(er.user_id), parseInt(er.scheme_id), er.match_percentage, JSON.stringify(er.reason)]
        );
        return res.rows[0];
      } else {
        const data = readJsonDB();
        const newResult = {
          id: data.eligibilityResults.length + 1,
          user_id: parseInt(er.user_id),
          scheme_id: parseInt(er.scheme_id),
          match_percentage: er.match_percentage,
          reason: er.reason,
          checked_at: new Date().toISOString()
        };
        data.eligibilityResults.push(newResult);
        writeJsonDB(data);
        return newResult;
      }
    },
    findByUserId: async (userId) => {
      if (isPg) {
        const res = await pool.query(
          "SELECT er.*, s.name as scheme_name, s.category as scheme_category, s.benefits as scheme_benefits, s.required_documents as scheme_required_documents, s.deadline as scheme_deadline, s.application_link as scheme_application_link FROM eligibility_results er JOIN schemes s ON er.scheme_id = s.id WHERE er.user_id = $1",
          [parseInt(userId)]
        );
        return res.rows;
      } else {
        const data = readJsonDB();
        const results = data.eligibilityResults.filter(er => er.user_id === parseInt(userId));
        return results.map(er => {
          const scheme = data.schemes.find(s => s.id === er.scheme_id) || {};
          return {
            ...er,
            scheme_name: scheme.name,
            scheme_category: scheme.category,
            scheme_benefits: scheme.benefits,
            scheme_required_documents: scheme.required_documents,
            scheme_deadline: scheme.deadline,
            scheme_application_link: scheme.application_link
          };
        });
      }
    },
    deleteByUserId: async (userId) => {
      if (isPg) {
        await pool.query("DELETE FROM eligibility_results WHERE user_id = $1", [parseInt(userId)]);
      } else {
        const data = readJsonDB();
        data.eligibilityResults = data.eligibilityResults.filter(er => er.user_id !== parseInt(userId));
        writeJsonDB(data);
      }
    }
  },

  roadmaps: {
    create: async (rm) => {
      if (isPg) {
        const res = await pool.query(
          "INSERT INTO roadmaps (user_id, scheme_id, steps, status, percentage) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [parseInt(rm.user_id), parseInt(rm.scheme_id), JSON.stringify(rm.steps), rm.status || 'Pending', rm.percentage || 0]
        );
        return res.rows[0];
      } else {
        const data = readJsonDB();
        const newRm = {
          id: data.roadmaps.length + 1,
          user_id: parseInt(rm.user_id),
          scheme_id: parseInt(rm.scheme_id),
          steps: rm.steps,
          status: rm.status || 'Pending',
          percentage: rm.percentage || 0,
          created_at: new Date().toISOString()
        };
        data.roadmaps.push(newRm);
        writeJsonDB(data);
        return newRm;
      }
    },
    findByUserIdAndSchemeId: async (userId, schemeId) => {
      if (isPg) {
        const res = await pool.query("SELECT * FROM roadmaps WHERE user_id = $1 AND scheme_id = $2", [parseInt(userId), parseInt(schemeId)]);
        return res.rows[0] || null;
      } else {
        const data = readJsonDB();
        return data.roadmaps.find(rm => rm.user_id === parseInt(userId) && rm.scheme_id === parseInt(schemeId)) || null;
      }
    },
    findByUserId: async (userId) => {
      if (isPg) {
        const res = await pool.query(
          "SELECT rm.*, s.name as scheme_name FROM roadmaps rm JOIN schemes s ON rm.scheme_id = s.id WHERE rm.user_id = $1",
          [parseInt(userId)]
        );
        return res.rows;
      } else {
        const data = readJsonDB();
        const filtered = data.roadmaps.filter(rm => rm.user_id === parseInt(userId));
        return filtered.map(rm => {
          const scheme = data.schemes.find(s => s.id === rm.scheme_id) || {};
          return {
            ...rm,
            scheme_name: scheme.name
          };
        });
      }
    },
    update: async (id, updates) => {
      if (isPg) {
        const fields = [];
        const values = [];
        let index = 1;
        for (const [key, val] of Object.entries(updates)) {
          fields.push(`${key} = $${index}`);
          values.push(key === 'steps' ? JSON.stringify(val) : val);
          index++;
        }
        values.push(parseInt(id));
        const res = await pool.query(`UPDATE roadmaps SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`, values);
        return res.rows[0];
      } else {
        const data = readJsonDB();
        const idx = data.roadmaps.findIndex(rm => rm.id === parseInt(id));
        if (idx !== -1) {
          data.roadmaps[idx] = { ...data.roadmaps[idx], ...updates };
          writeJsonDB(data);
          return data.roadmaps[idx];
        }
        return null;
      }
    }
  },

  recommendations: {
    create: async (rec) => {
      if (isPg) {
        const res = await pool.query(
          "INSERT INTO recommendations (user_id, title, category, description, difficulty, reward, timeline, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
          [parseInt(rec.user_id), rec.title, rec.category, rec.description, rec.difficulty, rec.reward, rec.timeline, rec.status || 'Recommended']
        );
        return res.rows[0];
      } else {
        const data = readJsonDB();
        const newRec = {
          id: data.recommendations.length + 1,
          user_id: parseInt(rec.user_id),
          title: rec.title,
          category: rec.category,
          description: rec.description,
          difficulty: rec.difficulty,
          reward: rec.reward,
          timeline: rec.timeline,
          status: rec.status || 'Recommended',
          created_at: new Date().toISOString()
        };
        data.recommendations.push(newRec);
        writeJsonDB(data);
        return newRec;
      }
    },
    findByUserId: async (userId) => {
      if (isPg) {
        const res = await pool.query("SELECT * FROM recommendations WHERE user_id = $1", [parseInt(userId)]);
        return res.rows;
      } else {
        const data = readJsonDB();
        return data.recommendations.filter(rec => rec.user_id === parseInt(userId));
      }
    },
    deleteByUserId: async (userId) => {
      if (isPg) {
        await pool.query("DELETE FROM recommendations WHERE user_id = $1", [parseInt(userId)]);
      } else {
        const data = readJsonDB();
        data.recommendations = data.recommendations.filter(rec => rec.user_id !== parseInt(userId));
        writeJsonDB(data);
      }
    }
  },

  agentLogs: {
    create: async (log) => {
      if (isPg) {
        const res = await pool.query(
          "INSERT INTO agent_logs (user_id, agent_name, log_text) VALUES ($1, $2, $3) RETURNING *",
          [parseInt(log.user_id), log.agent_name, log.log_text]
        );
        return res.rows[0];
      } else {
        const data = readJsonDB();
        const newLog = {
          id: data.agentLogs.length + 1,
          user_id: parseInt(log.user_id),
          agent_name: log.agent_name,
          log_text: log.log_text,
          timestamp: new Date().toISOString()
        };
        data.agentLogs.push(newLog);
        writeJsonDB(data);
        return newLog;
      }
    },
    findByUserId: async (userId) => {
      if (isPg) {
        const res = await pool.query("SELECT * FROM agent_logs WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 50", [parseInt(userId)]);
        return res.rows;
      } else {
        const data = readJsonDB();
        const filtered = data.agentLogs.filter(log => log.user_id === parseInt(userId));
        return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 50);
      }
    },
    deleteByUserId: async (userId) => {
      if (isPg) {
        await pool.query("DELETE FROM agent_logs WHERE user_id = $1", [parseInt(userId)]);
      } else {
        const data = readJsonDB();
        data.agentLogs = data.agentLogs.filter(log => log.user_id !== parseInt(userId));
        writeJsonDB(data);
      }
    }
  },

  notifications: {
    create: async (n) => {
      if (isPg) {
        const res = await pool.query(
          "INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3) RETURNING *",
          [parseInt(n.user_id), n.title, n.message]
        );
        return res.rows[0];
      } else {
        const data = readJsonDB();
        const newNotif = {
          id: data.notifications.length + 1,
          user_id: parseInt(n.user_id),
          title: n.title,
          message: n.message,
          read: false,
          created_at: new Date().toISOString()
        };
        data.notifications.push(newNotif);
        writeJsonDB(data);
        return newNotif;
      }
    },
    findByUserId: async (userId) => {
      if (isPg) {
        const res = await pool.query("SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC", [parseInt(userId)]);
        return res.rows;
      } else {
        const data = readJsonDB();
        return data.notifications
          .filter(n => n.user_id === parseInt(userId))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    },
    markAsRead: async (id) => {
      if (isPg) {
        await pool.query("UPDATE notifications SET read = TRUE WHERE id = $1", [parseInt(id)]);
        return true;
      } else {
        const data = readJsonDB();
        const idx = data.notifications.findIndex(n => n.id === parseInt(id));
        if (idx !== -1) {
          data.notifications[idx].read = true;
          writeJsonDB(data);
          return true;
        }
        return false;
      }
    }
  },

  lifeEvents: {
    createOrUpdate: async (le) => {
      if (isPg) {
        // Check if exists
        const check = await pool.query("SELECT * FROM life_events WHERE user_id = $1", [parseInt(le.user_id)]);
        if (check.rows.length > 0) {
          const res = await pool.query(
            "UPDATE life_events SET current_stage = $1, history = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 RETURNING *",
            [le.current_stage, JSON.stringify(le.history), parseInt(le.user_id)]
          );
          return res.rows[0];
        } else {
          const res = await pool.query(
            "INSERT INTO life_events (user_id, current_stage, history) VALUES ($1, $2, $3) RETURNING *",
            [parseInt(le.user_id), le.current_stage, JSON.stringify(le.history)]
          );
          return res.rows[0];
        }
      } else {
        const data = readJsonDB();
        const idx = data.lifeEvents.findIndex(item => item.user_id === parseInt(le.user_id));
        if (idx !== -1) {
          data.lifeEvents[idx].current_stage = le.current_stage;
          data.lifeEvents[idx].history = le.history;
          data.lifeEvents[idx].updated_at = new Date().toISOString();
          writeJsonDB(data);
          return data.lifeEvents[idx];
        } else {
          const newLe = {
            id: data.lifeEvents.length + 1,
            user_id: parseInt(le.user_id),
            current_stage: le.current_stage,
            history: le.history,
            updated_at: new Date().toISOString()
          };
          data.lifeEvents.push(newLe);
          writeJsonDB(data);
          return newLe;
        }
      }
    },
    findByUserId: async (userId) => {
      if (isPg) {
        const res = await pool.query("SELECT * FROM life_events WHERE user_id = $1", [parseInt(userId)]);
        return res.rows[0] || null;
      } else {
        const data = readJsonDB();
        return data.lifeEvents.find(le => le.user_id === parseInt(userId)) || null;
      }
    }
  }
};

module.exports = db;
