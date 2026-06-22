/**
 * ============================================================
 *  PERSONAL PORTFOLIO — CONFIG FILE
 *  Edit ONLY this file to update your entire website.
 *  All sections pull data from here automatically.
 *
 *  OR use the live Edit panel on the website itself:
 *  click the gold "Edit" button in the top-right nav.
 * ============================================================
 */

const CONFIG = {

  /* ----------------------------------------------------------
     1. PERSONAL INFO
  ---------------------------------------------------------- */
  name:        "Sachin Patel",
  role:        "Data Scientist",
  tagline:     "Open to Internships · Mumbai / Gurugram",
  location:    "New Delhi, India",
  email:       "sp0196118@gmail.com",
  phone:       "+91-6232610569",
  linkedin:    "https://linkedin.com/in/SachinPatel",
  github:      "https://github.com/SachinPatel",   // update with your real GitHub

  /* Place your PDF in the same folder, then enter its filename */
  resumeFile:  "Sachin_Patel_Resume.pdf",

  /* Place your photo in the same folder, or use a URL. Leave "" for initials avatar */
  photoUrl:    "",

  /* Leave "" for default teal accent, or set any hex e.g. "#6366F1" */
  accentColor: "",

  bio: [
    "I'm a Data Scientist and Operations Research professional with an <strong>M.Sc. from IIT Bombay</strong> and a B.Sc. from <strong>Deen Dayal Upadhyaya College, Delhi University</strong>.",
    "My expertise spans <strong>Python automation pipelines</strong>, <strong>advanced SQL</strong>, <strong>ETL engineering</strong>, and <strong>ML-driven analytics</strong> — turning Excel-heavy workflows into scalable, automated reporting systems.",
    "I find the intersection of mathematical rigour and real-world engineering impact particularly motivating — where a well-formulated model directly translates to measurable efficiency gains."
  ],

  /* ----------------------------------------------------------
     2. HERO STATS  (up to 3)
  ---------------------------------------------------------- */
  heroStats: [
    { value: "1.5+",   label: "Years Experience" },
    { value: "10%",    label: "Logistics Cost Cut" },
    { value: "AIR 60", label: "IIT JAM 2022" }
  ],

  /* ----------------------------------------------------------
     3. EDUCATION  (newest first)
  ---------------------------------------------------------- */
  education: [
    {
      degree:      "M.Sc. — Operations Research",
      institution: "Indian Institute of Technology, Bombay",
      grade:       "GPA: 8.6 / 10",
      year:        "2022 – 2024"
    },
    {
      degree:      "B.Sc. — Operational Research",
      institution: "Deen Dayal Upadhyaya College, University of Delhi",
      grade:       "GPA: 8.8 / 10",
      year:        "2019 – 2022"
    },
    {
      degree:      "12th — CBSE",
      institution: "CBSE Board",
      grade:       "91%",
      year:        "2019"
    },
    {
      degree:      "10th — CBSE",
      institution: "CBSE Board",
      grade:       "84%",
      year:        "2017"
    }
  ],

  /* ----------------------------------------------------------
     4. CERTIFICATIONS
  ---------------------------------------------------------- */
  certifications: [
    { issuer: "NPTEL",       title: "Data Science for Engineers · Elite Silver" },
    { issuer: "IBM",         title: "Python for Data Science" },
    { issuer: "Internshala", title: "Machine Learning Training" }
  ],

  /* ----------------------------------------------------------
     5. HOBBIES
  ---------------------------------------------------------- */
  hobbies: ["♟ Chess", "✍ Technical Blogging", "🏃 Running"],

  /* ----------------------------------------------------------
     6. SKILLS  (add/remove cards freely)
  ---------------------------------------------------------- */
  skills: [
    {
      category:   "SQL & Databases",
      highlights: ["Advanced SQL", "MongoDB"],
      others:     ["CTEs", "Window Functions", "Aggregations", "MySQL", "PostgreSQL"]
    },
    {
      category:   "Python & Automation",
      highlights: ["Python", "Pandas"],
      others:     ["NumPy", "Scikit-learn", "ETL Pipelines", "Jupyter Notebooks", "Modular Code Design"]
    },
    {
      category:   "Machine Learning",
      highlights: ["XGBoost", "Scikit-learn"],
      others:     ["Regression", "Classification", "Clustering", "PCA", "Random Forest", "SVM"]
    },
    {
      category:   "Time Series & Forecasting",
      highlights: ["Demand Forecasting"],
      others:     ["MAPE / SMAPE", "Trend Modelling", "Seasonality", "Inventory Optimization"]
    },
    {
      category:   "Optimisation",
      highlights: ["Pyomo", "Gurobi"],
      others:     ["CBC", "GLPK", "MILP", "VRP", "Linear Programming", "BFGS / Newton's"]
    },
    {
      category:   "Analytics & Infra",
      highlights: [],
      others:     ["Financial Report Automation", "Dashboard Analytics", "Matplotlib", "Seaborn", "Git", "AWS (basic)"]
    }
  ],

  /* ----------------------------------------------------------
     7. EXPERIENCE  (newest first)
  ---------------------------------------------------------- */
  experience: [
    {
      period:   "May 2023 – Jan 2025",
      role:     "Operations Research Scientist",
      company:  "Caliper Business Solutions",
      location: "India",
      type:     "Full-time",
      bullets: [
        "Designed and maintained <strong>Python-based ETL pipelines</strong> and <strong>automated data pipelines</strong> for GPS/operational datasets, eliminating manual Excel-heavy workflows with scalable, reusable scripts.",
        "Wrote <strong>advanced SQL queries</strong> — CTEs, window functions, aggregations — against <strong>MongoDB</strong> and relational databases to power financial & operational reporting for stakeholders.",
        "Automated recurring <strong>finance reports</strong> and <strong>stakeholder data delivery</strong>, cutting manual reporting effort by ~40% and improving delivery consistency.",
        "Delivered <strong>optimisation models</strong> integrated into production systems, achieving up to 10% reduction in operational costs.",
        "Collaborated cross-functionally with product and engineering teams following modular design, testing, and documentation standards."
      ]
    },
    {
      period:   "~3 Months (2022)",
      role:     "Operations Research Intern",
      company:  "Caliper Business Solutions",
      location: "India",
      type:     "Internship",
      bullets: [
        "Collected, cleaned, and preprocessed large datasets using <strong>Python and SQL</strong> to improve accuracy of downstream analytics and modelling workflows.",
        "Modelled routing solutions contributing to <strong>~10% reduction in vehicle usage</strong> and improved operational efficiency."
      ]
    }
  ],

  /* ----------------------------------------------------------
     8. PROJECTS
  ---------------------------------------------------------- */
  projects: [
    {
      title:  "Automated Reporting Pipeline",
      desc:   "End-to-end Python automation converting Excel-heavy workflows into parameterised SQL queries and Jupyter notebooks. Enabled real-time trend detection and anomaly identification on large financial datasets.",
      metric: "⚡ ~40% reduction in manual reporting effort",
      tags:   ["Python", "SQL", "ETL", "Automation"],
      link:   ""
    },
    {
      title:  "Demand Forecasting — Walmart / M5",
      desc:   "Product-store level forecast system on the M5 retail dataset. Modelled trends, seasonality, and holiday effects using XGBoost and time-series methods.",
      metric: "📈 15–25% accuracy improvement over baselines (MAPE/SMAPE)",
      tags:   ["Time Series", "Forecasting", "XGBoost", "Python"],
      link:   ""
    },
    {
      title:  "Fraud Detection on Financial Data",
      desc:   "Logistic Regression and tree-based classifiers trained on highly imbalanced transaction data. Model selection driven by ROC-AUC and Precision-Recall curves aligned with business risk thresholds.",
      metric: "🎯 >30% improvement in recall",
      tags:   ["ML Classification", "Imbalanced Data", "Scikit-learn"],
      link:   ""
    },
    {
      title:  "Hospital Shift Scheduling Optimisation",
      desc:   "MILP model to optimise multiday hospital staff scheduling for a 16-staff section, ensuring full coverage and labour-rule constraints while demonstrating scalability.",
      metric: "10% cost reduction vs manual scheduling",
      tags:   ["MILP", "Pyomo", "Scheduling"],
      link:   ""
    },
    {
      title:  "Kernel Method for Canonical Correlation Analysis",
      desc:   "M.Sc. thesis proposing a kernel-based extension of CCA to capture nonlinear correlations, formulated as an optimisation problem. Outperformed traditional CCA in experiments.",
      metric: "🔬 Novel nonlinear CCA formulation",
      tags:   ["Kernel Methods", "CCA", "Research"],
      link:   ""
    }
  ],

  /* ----------------------------------------------------------
     9. ACHIEVEMENTS
  ---------------------------------------------------------- */
  achievements: [
    {
      icon:  "🏆",
      title: "AIR 60 – IIT JAM Mathematics 2022",
      desc:  "Secured All India Rank 60 in IIT JAM Mathematics, earning direct admission to IIT Bombay's M.Sc. programme."
    },
    {
      icon:  "🥈",
      title: "NPTEL Elite Silver – Data Science for Engineers",
      desc:  "Awarded Elite Silver certification by NPTEL for outstanding performance in the Data Science for Engineers course."
    },
    {
      icon:  "🎓",
      title: "Jawahar Navodaya Vidyalaya Admission",
      desc:  "Cleared JNVST in 5th standard, securing admission and participating in school-level academic activities."
    },
    {
      icon:  "📦",
      title: "Department Fest Logistics – IIT Bombay",
      desc:  "Managed food allocation, procurement, certificate printing, and guest arrangements for the IEOR department fest."
    }
  ]

};
