import { Cloud, Code, Database, GitBranch, Github, Globe, Linkedin, Mail, Server } from "lucide-react";

const skills = [
  { name: 'React', icon: <Code className="w-6 h-6" /> },
  { name: 'Node.js', icon: <Server className="w-6 h-6" /> },
  { name: 'AWS', icon: <Cloud className="w-6 h-6" /> },
  { name: 'JavaScript', icon: <Code className="w-6 h-6" /> },
  { name: 'TypeScript', icon: <Code className="w-6 h-6" /> },
  { name: 'HTML/CSS', icon: <Globe className="w-6 h-6" /> },
  { name: 'Git', icon: <GitBranch className="w-6 h-6" /> },
  { name: 'RESTful APIs', icon: <Database className="w-6 h-6" /> },
]

const contacts = [
  { name: 'Github', icon: <Github className="w-6 h-6" />, link: 'https://github.com/Zaqttack' },
  { name: 'LinkedIn', icon: <Linkedin className="w-6 h-6" />, link: 'https://www.linkedin.com/in/zaquariah-holland/' },
  { name: 'Email', icon: <Mail className="w-6 h-6" />, link: 'mailto:zaquariah@gmail.com' },
]

const projects = [
  { 
    title: 'FinTech Dashboard', 
    description: 'A comprehensive dashboard for financial data visualization',
    image: '/placeholder.svg?height=300&width=400'
  },
  { 
    title: 'E-commerce Platform', 
    description: 'Scalable online shopping solution with AWS integration',
    image: '/placeholder.svg?height=300&width=400'
  },
  { 
    title: 'Real-time Chat App', 
    description: 'Secure messaging application built with React and Node.js',
    image: '/placeholder.svg?height=300&width=400'
  },
  { 
    title: 'Portfolio Tracker', 
    description: 'Investment portfolio management tool with real-time updates',
    image: '/placeholder.svg?height=300&width=400'
  }
]

const recommendations = [
  { 
    name: 'Jane Doe', 
    position: 'Senior Developer', 
    text: 'Zaquariah is an exceptional engineer with a keen eye for detail. His ability to solve complex problems and deliver high-quality code consistently impresses me.',
    linkedin: 'https://www.linkedin.com/in/janedoe'
  },
  { 
    name: 'John Smith', 
    position: 'Project Manager', 
    text: 'His ability to tackle complex problems and deliver results is outstanding. Zaquariah\'s technical expertise and leadership skills make him an invaluable asset to any team.',
    linkedin: 'https://www.linkedin.com/in/johnsmith'
  },
  { 
    name: 'Emily Brown', 
    position: 'UX Designer', 
    text: 'Working with Zaquariah has been a pleasure. His technical skills are top-notch, and he has a great understanding of user experience, which makes our collaboration seamless.',
    linkedin: 'https://www.linkedin.com/in/emilybrown'
  },
  { 
    name: 'Michael Johnson', 
    position: 'Tech Lead', 
    text: 'Zaquariah\'s innovative approach to problem-solving and his dedication to staying current with emerging technologies make him a standout engineer.',
    linkedin: 'https://www.linkedin.com/in/michaeljohnson'
  }
]

export {
  skills,
  contacts,
  projects,
  recommendations,
};
