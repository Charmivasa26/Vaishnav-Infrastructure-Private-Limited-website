require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
    res.send("Vaishnav Backend Running ✅");
});

// ================= DATABASE TEST =================
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            success: true,
            time: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ================= ENQUIRY API =================
app.post("/enquiry", async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;

        const query = `
            INSERT INTO enquiries (name, phone, email, message)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const values = [name, phone, email, message];

        const result = await pool.query(query, values);

        // WhatsApp Message
        const whatsappMessage =
`New Enquiry Received:
Name: ${name}
Phone: ${phone}
Email: ${email}
Message: ${message}`;

    const whatsappLink =
`https://api.whatsapp.com/send?phone=919924245566&text=${encodeURIComponent(whatsappMessage)}`;


        res.json({
            success: true,
            data: result.rows[0],
            whatsapp: whatsappLink
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ================= START SERVER =================
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});
