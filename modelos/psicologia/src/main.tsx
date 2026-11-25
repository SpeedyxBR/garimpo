import { createRoot } from "react-dom/client";
import { PsychologyHome } from "@/components/psychology-home";
import "./globals.css";
import "./aurora-v3.css";
import "./lead.css";

createRoot(document.getElementById("app")!).render(<PsychologyHome />);
