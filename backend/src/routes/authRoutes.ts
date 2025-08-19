import { Router } from "express";
import { register, login } from "../controllers/authControllers";
import { protect } from "../middleware/authMiddleware";
import jwt from "jsonwebtoken";
import User from "../models/user";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Add verify endpoint for token validation
router.get("/verify", protect, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        company: user.company,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
