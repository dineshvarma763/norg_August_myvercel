import { NextApiRequest, NextApiResponse } from 'next';
import { query } from './verceldb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { gaValue, sanitised_path } = req.body;

    try {
      const currentDate = new Date().toISOString(); // Get current date and time in ISO format

      // Insert new row with date and time
      await query('INSERT INTO "useractivity" ("clientid", "visitedpage", "date_added") VALUES ($1, $2, $3)', [gaValue, sanitised_path, currentDate]);
      console.log('User activity inserted successfully - insert Page', sanitised_path);

      // Calculate the page count for the user based on recent date and time
      const recentDays = 7;
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - recentDays);
      const recentDateString = recentDate.toISOString();

      const pageCountQuery = `
        SELECT visitedpage, COUNT(*) as count 
        FROM "useractivity" 
        WHERE "clientid" = $1 AND "date_added" >= $2
        GROUP BY visitedpage 
        ORDER BY count DESC 
        LIMIT 2
      `;

      const pageCountResult = await query(pageCountQuery, [gaValue, recentDateString]);

      console.log(pageCountResult);

      let mostVisitedPage = '';
      let pageVisitedCount = 0;
      if (pageCountResult.length > 0) {
        // Check if the most visited page is "/" and get the second most visited page if so
        if (pageCountResult[0].visitedpage === '/' && pageCountResult.length > 1) {
          mostVisitedPage = pageCountResult[1].visitedpage;
          pageVisitedCount = pageCountResult[1].count;
        } else {
          mostVisitedPage = pageCountResult[0].visitedpage;
          pageVisitedCount = pageCountResult[0].count;
        }
      }

      console.log(mostVisitedPage, pageVisitedCount);

      // Send response after db operations
      res.status(200).json({ mostVisitedPage, pageVisitedCount });
    } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
