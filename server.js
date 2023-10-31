const http = require("http");
const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "data.json");

const server = http.createServer((req, res) => {

  if (req.url === "/" && req.method === "GET") {

    // Serve the index.html file
    fs.readFile(path.join(__dirname, "index.html"), (err, content) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    });

  } else if (req.url === "/create" && req.method === "POST") {
    // Handle the create operation
    let body = "";
    req.on("data", (data) => {
      body += data;
    });


    req.on("end", () => {
      const formData = new URLSearchParams(body);
      const name = formData.get("name");
      const email = formData.get("email");

      // Read existing data from the JSON file
      fs.readFile(dataFilePath, "utf8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }

        let records = [];
        if (data) {
          records = JSON.parse(data);
        }

        // Generate a new ID
        const id = records.length > 0 ? records[records.length - 1].id + 1 : 1;

        // Add the new record
        const newRecord = { id, name, email };
        records.push(newRecord);

        // Write the updated data back to the JSON file
        fs.writeFile(dataFilePath, JSON.stringify(records), "utf8", (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          } else {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Data created successfully");
          }
        });
      });
    });


  } else if (req.url === "/read" && req.method === "GET") {
    // Handle the read operation
    fs.readFile(dataFilePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plai" });
        res.end("Internal Server Error");
      } else {
        const records = data ? JSON.parse(data) : [];

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(records));
      }
    });

  } else if (req.url === "/update" && req.method === "POST") {
    // Handle the update operation
    let body = "";
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", () => {
      const formData = new URLSearchParams(body);
      const id = parseInt(formData.get("id"));
      const name = formData.get("name");
      const email = formData.get("email");

      // Read existing data from the JSON file
      fs.readFile(dataFilePath, "utf8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }

        let records = [];
        if (data) {
          records = JSON.parse(data);
        }

        // Find the record with the matching ID
        const record = records.find((r) => r.id === id);
        if (!record) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Record not found");
          return;
        }

        // Update the record
        record.name = name;
        record.email = email;

        // Write the updated data back to the JSON file
        fs.writeFile(dataFilePath, JSON.stringify(records), "utf8", (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          } else {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Data updated successfully");
          }
        });
      });
    });

  } else if (req.url === "/delete" && req.method === "POST") {
    // Handle the delete operation
    let body = "";
    req.on("data", (data) => {
      body += data;
    });
    
    req.on("end", () => {
      const formData = new URLSearchParams(body);
      const id = parseInt(formData.get("id"));

      // Read existing data from the JSON file
      fs.readFile(dataFilePath, "utf8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }

        let records = [];
        if (data) {
          records = JSON.parse(data);
        }

        // Find the index of the record with the matching ID
        const index = records.findIndex((r) => r.id === id);
        if (index === -1) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Record not found");
          return;
        }

        // Remove the record
        records.splice(index, 1);

        // Write the updated data back to the JSON file
        fs.writeFile(dataFilePath, JSON.stringify(records), "utf8", (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          } else {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Data deleted successfully");
          }
        });
      });
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
