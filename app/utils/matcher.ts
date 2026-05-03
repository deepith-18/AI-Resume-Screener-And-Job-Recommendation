export const ROLE_LIBRARIES = [
  // --- WEB & FULL STACK ---
  { title: "Backend Developer", required: ["NodeJS", "Python", "Java", "SQL", "ExpressJS", "Postman", "MongoDB"] },
  { title: "Frontend Developer", required: ["ReactJS", "JavaScript", "HTML5", "CSS3", "Git", "Tailwind CSS", "TypeScript"] },
  { title: "Full Stack Developer", required: ["ReactJS", "NodeJS", "JavaScript", "SQL", "ExpressJS", "MongoDB", "GitHub"] },
  { title: "Software Engineer", required: ["Java", "Python", "C++", "DSA", "Problem Solving", "SQL", "Git"] },
  { title: "MERN Stack Developer", required: ["MongoDB", "ExpressJS", "ReactJS", "NodeJS", "JavaScript", "Redux"] },
  
  // --- MOBILE & APPS ---
  { title: "Mobile App Developer", required: ["Flutter", "Dart", "React Native", "Firebase", "REST APIs", "Git"] },
  { title: "Android Developer", required: ["Kotlin", "Java", "Android SDK", "Firebase", "Retrofit", "SQLite"] },
  { title: "iOS Developer", required: ["Swift", "SwiftUI", "Objective-C", "Xcode", "Core Data"] },

  // --- DATA & AI ---
  { title: "Data Scientist", required: ["Python", "Statistics", "Machine Learning", "Pandas", "NumPy", "SQL", "Scikit-Learn"] },
  { title: "AI/ML Engineer", required: ["Python", "Neural Networks", "PyTorch", "TensorFlow", "Deep Learning", "NLP"] },
  { title: "Data Analyst", required: ["SQL", "Excel", "Tableau", "PowerBI", "Python", "Data Visualization"] },
  { title: "Database Administrator", required: ["SQL", "MySQL", "PostgreSQL", "Database Design", "Performance Tuning"] },

  // --- CLOUD & SECURITY ---
  { title: "DevOps Engineer", required: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "Jenkins"] },
  { title: "Cloud Architect", required: ["AWS", "Azure", "Cloud Computing", "Microservices", "Serverless"] },
  { title: "Cybersecurity Analyst", required: ["Network Security", "Linux", "Ethical Hacking", "Cryptography", "Penetration Testing"] },

  // --- DESIGN & PRODUCT ---
  { title: "UI/UX Designer", required: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping"] },
  { title: "Product Manager", required: ["Agile", "Scrum", "Product Strategy", "Market Research", "Leadership", "Jira"] },

  // --- HARDWARE & CORE ---
  { title: "Embedded Systems Engineer", required: ["C", "C++", "Microcontrollers", "Arduino", "RTOS", "Embedded C"] },
  { title: "IoT Engineer", required: ["Arduino", "Raspberry Pi", "MQTT", "Embedded Systems", "Sensors", "Python"] },
  { title: "Aerospace Engineer", required: ["MATLAB", "CAD", "Thermodynamics", "Aerodynamics", "Simulink"] }
];

/**
 * Generates ranked career matches based on unique user skills and proficiency.
 */
export function generateRoleMatches(userSkills: any[]) {
  if (!Array.isArray(userSkills) || userSkills.length === 0) return [];

  // Normalize user skills safely
  const normalizedUserSkills = userSkills.map(s => {
    let skillName = "";
    if (typeof s === 'string') {
      skillName = s;
    } else if (s && typeof s === 'object') {
      skillName = s.name || "";
    }

    return {
      name: (skillName || "").toLowerCase().trim(),
      level: s?.level || 70 
    };
  }).filter(s => s.name !== "");

  const matches = ROLE_LIBRARIES.map(role => {
    let proficiencySum = 0;
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    role.required.forEach(reqSkill => {
      const req = reqSkill.toLowerCase().trim();
      
      const found = normalizedUserSkills.find(s => {
        const user = s.name;

        // ✅ IMPROVED ALIASING (Prevents "No Matches" for common naming differences)
        return (
          user === req ||
          user.includes(req) || 
          req.includes(user) ||
          (user === "js" && req === "javascript") ||
          (user === "react" && req === "reactjs") ||
          (user === "node" && req === "nodejs") ||
          (user === "mongodb" && req === "mongo") ||
          (user === "sql" && req.includes("sql")) ||
          // ✅ New Engineering Aliases
          (user === "cad" && req === "autocad") ||
          (user === "ml" && req === "machine learning") ||
          (user === "ai" && req === "artificial intelligence")
        );
      });

      if (found) {
        proficiencySum += found.level;
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    // 1. Coverage Score (60% weight - slightly lowered to be more inclusive)
    const coverage = matchedSkills.length / role.required.length;
    
    // 2. Proficiency Score (40% weight)
    const avgProficiency = matchedSkills.length > 0 ? (proficiencySum / matchedSkills.length) : 0;

    let score = Math.round((coverage * 60) + ((avgProficiency / 100) * 40));

    return {
      title: role.title,
      match_score: Math.min(score, 98),
      required_skills: role.required,
      missing_skills: missingSkills,
      matched_skills: matchedSkills,
      reason: getReasonMessage(score)
    };
  })
  // ✅ RELAXED FILTER: Show roles with at least 1 skill so users don't see an empty screen
  .filter(r => r.matched_skills.length >= 1) 
  .sort((a, b) => b.match_score - a.match_score);

  return matches.slice(0, 6);
}

function getReasonMessage(score: number): string {
  if (score >= 80) return "Top Career Match";
  if (score >= 60) return "Strong Potential";
  if (score >= 40) return "Good Alternative";
  return "Exploratory Match";
}