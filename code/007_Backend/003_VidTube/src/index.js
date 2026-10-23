import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

const [{ app }, { default: connectDB }] = await Promise.all([
    import("./app.js"),
    import("./db/index.js"),
]);

const PORT = process.env.PORT || 8001;


connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.log("Error connecting to the database:", err);
});
