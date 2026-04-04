import Card from '../components/common/Card';
import { Briefcase, ChevronRight, ExternalLink, Code } from 'lucide-react';
import styles from './Projects.module.css';

const projects = [
  {
    title: 'PartyNest',
    linkType: 'live',
    url: 'https://partynest.fun/',
    description: 'A dynamic e-commerce ticketing platform for event booking and management (Freelance Business Project).',
    bullets: [
      'Implemented user authentication (signup, login, OTP verification) with robust session management.',
      'Optimized the main party feed using FlatList virtualization for seamless performance.',
      'Engineered an invite-only booking flow, including dynamic forms with advanced question types.',
      'Developed real-time booking validation and paginated user history for scalable data handling.',
      'Integrated seamless payment gateways to handle high-volume ticket transactions securely.',
      'Developed a scalable admin dashboard for event organizers to track real-time sales and attendee metrics.',
      'Implemented SEO best practices and performance optimizations, resulting in rapid platform adoption.'
    ]
  },
  {
    title: 'Nexmeridian',
    linkType: 'live',
    url: 'https://nexmeridian.com/',
    description: 'Modern business solutions and comprehensive digital experiences (Freelance Business Project).',
    bullets: [
      'Developed responsive, accessible, and highly interactive user interfaces.',
      'Integrated complex frontend state management to deliver a smooth user experience.',
      'Focused on UI/UX best practices and optimized critical rendering paths.',
      'Collaborated directly with business stakeholders to translate complex requirements into intuitive digital products.',
      'Architected a scalable, component-driven frontend to accelerate development and ensure design consistency.',
      'Optimized components and bundle sizes, significantly reducing page load times and bounce rates.'
    ]
  },
  {
    title: 'Paper Trading Indian Options',
    linkType: 'github',
    url: 'https://github.com/mohitsonu/PAPER-trading-Indian-Options',
    description: 'A simulated trading environment for the Indian options stock market.',
    bullets: [
      'Built a realistic simulation platform to practice options trading strategies risk-free.',
      'Handled financial data accurately, focusing on low latency and real-time feel.',
      'Created intuitive dashboards to track P&L, open positions, and margin usage.'
    ]
  },
  {
    title: 'Automated Financial Rules',
    linkType: 'github',
    url: 'https://github.com/mohitsonu/Financial-Dashboard-UI?tab=readme-ov-file',
    description: 'A system for automatically executing conditional financial rules.',
    bullets: [
      'Engineered a scalable rule engine to automatically trigger actions based on predefined financial conditions.',
      'Designed a user-friendly interface for non-technical users to build and deploy logic flows.',
      'Ensured high reliability and safe execution of automated monetary and state-altering workflows.'
    ]
  },
  {
    title: 'Customer Churn Analysis Prediction',
    linkType: 'github',
    url: 'https://github.com/mohitsonu/Customer-Churn-Analysis-Prediction',
    description: 'Machine learning and data analytics project to predict customer retention.',
    bullets: [
      'Analyzed historical customer engagement data to identify early indicators of churn.',
      'Built and evaluated predictive models to forecast at-risk customers with high accuracy.',
      'Visualized findings through actionable dashboards to empower business stakeholders.'
    ]
  }
];

export default function Projects() {
  return (
    <div className="page-enter">
      <div className={styles.container}>
        {projects.map((project, idx) => (
          <Card key={idx} className={styles.projectCard} hoverable>
            <div className={styles.projectHeader}>
              <div className={styles.iconWrap}>
                <Briefcase size={22} />
              </div>
              <div className={styles.headerContent}>
                <div className={styles.headerTitleRow}>
                  <div>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectDesc}>{project.description}</p>
                  </div>
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={project.linkType === 'live' ? styles.btnLive : styles.btnGithub}
                  >
                    {project.linkType === 'live' ? <ExternalLink size={16} /> : <Code size={16} />}
                    {project.linkType === 'live' ? 'Live Demo' : 'View Code'}
                  </a>
                </div>
              </div>
            </div>
            
            <ul className={styles.bulletList}>
              {project.bullets.map((bullet, i) => (
                <li key={i}>
                  <ChevronRight size={14} className={styles.bulletIcon} />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
