// utils/roadmap.ts

export const getDynamicLinks = (roleTitle: string) => {
  const query = encodeURIComponent(roleTitle);
  return {
    github: `https://github.com/topics/${query.toLowerCase().replace(/ /g, '-')}`,
    linkedin: `https://www.linkedin.com/jobs/search/?keywords=${query}`,
    courses: `https://www.coursera.org/search?query=${query}`,
  };
};

export const ROADMAPS: any = {
  "Software Engineer": {
    weeks: [
      { title: "Mastering Problem Solving", level: "Intermediate", description: "Architecture and advanced usage logic.", resources: "LeetCode, System Design Docs" },
      { title: "SQL & Databases", level: "Intermediate", description: "Query optimization and indexing.", resources: "PostgreSQL Docs, SQLZoo" }
    ]
  },
  "Backend Developer": {
    weeks: [
      { title: "Node.js & APIs", level: "Intermediate", description: "Scalable REST & GraphQL APIs.", resources: "Express, Apollo Docs" }
    ]
  },
  "Frontend Developer": {
    weeks: [
      { title: "Modern UI Frameworks", level: "Expert", description: "State management and performance tuning.", resources: "React Docs, Web.dev" }
    ]
  }
};