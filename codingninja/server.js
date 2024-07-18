import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import xlsx from "xlsx";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const filePath = path.join(__dirname, "data", "user_data.xlsx");

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(filePath))) {
  fs.mkdirSync(path.dirname(filePath));
}

app.post("/save-to-excel", (req, res) => {
  const data = req.body;

  let workbook;
  let worksheet;
  if (fs.existsSync(filePath)) {
    workbook = xlsx.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
  } else {
    workbook = xlsx.utils.book_new();
    worksheet = xlsx.utils.aoa_to_sheet([["Name", "WhatsApp", "Email"]]);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  }

  const newRow = [data.name, data.whatsapp, data.email];
  xlsx.utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 });
  xlsx.writeFile(workbook, filePath);

  res.send("Data saved to Excel file");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
