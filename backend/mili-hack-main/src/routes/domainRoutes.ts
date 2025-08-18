import express from "express";
import { 
  checkDomain, 
  whois, 
  bulkCheck, 
  suggestions, 
  registrars 
} from "../controllers/domainController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Single domain availability check
router.get("/check/:domain", protect, checkDomain);

// Detailed WHOIS lookup
router.get("/whois/:domain", protect, whois);

// Bulk domain availability check (max 10 domains)
router.post("/bulk-check", protect, bulkCheck);

// Generate domain suggestions with pricing
router.get("/suggestions/:baseName", protect, suggestions);

// List all accredited registrars
router.get("/registrars", protect, registrars);

export default router;
