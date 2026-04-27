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

export function generateRoleMatches(userSkills: { name: string; level: number }[]) {
  // Normalize user skills for easier matching
  const normalizedUserSkills = userSkills.map(s => ({
    name: s.name.toLowerCase().trim(),
    level: s.level
  }));

  const matches = ROLE_LIBRARIES.map(role => {
    let totalScore = 0;
    let maxPossibleScore = role.required.length * 100;
    
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    role.required.forEach(reqSkill => {
      const normalizedReq = reqSkill.toLowerCase().trim();
      
      // Look for an exact match or a partial match (e.g., "React" matching "ReactJS")
      const found = normalizedUserSkills.find(s => 
        s.name === normalizedReq || 
        s.name.includes(normalizedReq) || 
        normalizedReq.includes(s.name)
      );

      if (found) {
        totalScore += found.level;
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    // Scoring logic: 
    // We base it on the percentage of skills matched, then factor in the levels.
    let skillMatchRatio = matchedSkills.length / role.required.length;
    let averageLevel = matchedSkills.length > 0 ? (totalScore / (matchedSkills.length * 100)) : 0;
    
    // Final score is a mix of how many skills you have vs how good you are at them
    let score = Math.round(((skillMatchRatio * 0.6) + (averageLevel * 0.4)) * 100);

    return {
      title: role.title,
      match_score: score,
      required_skills: role.required,
      missing_skills: missingSkills,
      matched_skills: matchedSkills,
      reason: getReasonMessage(score)
    };
  })
  // ✅ LOWER THRESHOLD: We show anything above 10% to ensure a long list
  .filter(r => r.match_score > 10) 
  .sort((a, b) => b.match_score - a.match_score)
  // ✅ SLICE: Ensure we get a good amount of roles
  .slice(0, 8); 

  // If we still have very few matches, we show the top 5 closest roles regardless of score
  if (matches.length < 3) {
      return ROLE_LIBRARIES.slice(0, 5).map(r => ({
          title: r.title,
          match_score: 15,
          required_skills: r.required,
          missing_skills: r.required,
          matched_skills: [],
          reason: "Suggested Path"
      }));
  }

  return matches;
}

function getReasonMessage(score: number): string {
  if (score >= 80) return "Top Career Match";
  if (score >= 60) return "Strong Potential";
  if (score >= 40) return "Good Alternative";
  if (score >= 20) return "Related Field";
  return "Exploratory Match";
}