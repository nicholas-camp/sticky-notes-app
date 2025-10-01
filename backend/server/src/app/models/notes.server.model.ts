import { getPool } from '../../config/db';
import { Note } from '../note_types'; // Adjust the path as necessary

const list = async (): Promise<Note[]> => {
  const pool = getPool(); // Get the database connection
  const [rows]: any[] = await pool.query('SELECT * FROM notes'); // Get query results as `any[]`
  return rows.map((row: any) => {
    let colors = row.colors; // No need to parse, since it's already an object
    let position = row.position ? row.position : { x: 0, y: 0 }; // Use position as is, or set default
    return {
      id: row.id,
      body: row.body,
      colors, // Directly use the colors object
      position, // Directly use the position object
    };
  });
};

const create = async (data: {
  body: string;
  colors: {
    id: string;
    colorHeader: string;
    colorBody: string;
    colorText: string;
  };
  position: { x: number; y: number };
}): Promise<Note> => {
  const pool = getPool(); // Get the database connection
  const query = `
    INSERT INTO notes (body, colors, position)
    VALUES (?, ?, ?)
  `;
  const values = [
    data.body,
    JSON.stringify(data.colors), // Convert colors object to JSON string
    JSON.stringify(data.position), // Convert position object to JSON string
  ];

  // Use `OkPacket` type for the result since it's an insert
  const [result]: any[] = await pool.query(query, values);

  // Result contains `insertId` for newly inserted record
  const insertId = result.insertId;

  // Return the newly inserted Note, with the expected types
  return { id: insertId, ...data };
};

const get = async (id: number): Promise<Note | null> => {
  const pool = getPool(); // Get the database connection
  const query = 'SELECT * FROM notes WHERE id = ?';
  const [rows]: any[] = await pool.query(query, [id]);

  // If no rows returned, return null
  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    body: row.body,
    colors: row.colors,
    position: row.position,
  };
};

const update = async (id: number, data: { body?: string; colors?: object; position?: object }): Promise<{ affectedRows: number }> => {
  const pool = getPool();
  
  // Build dynamic query based on provided fields
  const fieldsToUpdate = [];
  const values = [];
  
  if (data.body !== undefined) {
    fieldsToUpdate.push('body = ?');
    values.push(data.body);
  }
  
  if (data.colors !== undefined) {
    fieldsToUpdate.push('colors = ?');
    values.push(JSON.stringify(data.colors));
  }
  
  if (data.position !== undefined) {
    fieldsToUpdate.push('position = ?');
    values.push(JSON.stringify(data.position));
  }
  
  if (fieldsToUpdate.length === 0) {
    return { affectedRows: 0 };
  }
  
  values.push(id);
  const query = `UPDATE notes SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
  
  const [result]: any[] = await pool.query(query, values);
  
  return { affectedRows: result.affectedRows };
};

const remove = async (id: number): Promise<void> => {
  const pool = getPool(); // Get the database connection
  const query = 'DELETE FROM notes WHERE id = ?';
  // Execute delete query, no result expected
  await pool.query(query, [id]);
};

export { list, create, get, update, remove };