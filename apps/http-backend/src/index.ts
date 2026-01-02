import Express from "Express";
import { authMiddleware } from "./middleawares/auth";

const app = Express();

app.get("/api/public", (req, res) => {
    res.json({
        message: "This is a public endpoint."
    })
})

app.get("api/me", authMiddleware,(req, res) => {
    res.json({
        message: "Welcome",
        user: req.user
    });
});


app.listen(3001, () => {
    console.log("The backend is listening on http://localhost:3001");
});