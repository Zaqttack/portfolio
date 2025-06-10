import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Zaquariah",
  lastName: "Holland",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Software Engineer",
  avatar: "/images/avatar.jpg",
  location: "America/Chicago", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: [], // optional: Leave the array empty if you don't want to display languages
};

const newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>I occasionally write about design, technology, and share thoughts on the intersection of creativity and engineering.</>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/zaquariah-holland/",
  },
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/Zaqttack",
  },
  {
    name: "X",
    icon: "x",
    link: "",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:zaquariah@gmail.com",
  },
  {
    name: "Resume",
    icon: "paperclip",
    link: "https://drive.google.com/file/d/1BaO6_zvsUadRQ8kNX5aBOaWNnBrjAUCs/view",
  },
];

const home = {
  label: "Home",
  title: `${person.name}'s Portfolio`,
  menuIcon: "home",
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Engineer and Community Builder</>,
  subline: (
    <>
      I'm {person.firstName}, a {person.role} at <InlineCode>SWIVEL</InlineCode>, where I build and maintain full-stack fintech applications with AWS.
      I also serve as Chair of <InlineCode>ACM San Antonio</InlineCode>, growing the local tech community through events and education.
    </>
  ),
};

const about = {
  label: "About",
  title: "About me",
  menuIcon: "person",
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://meet.zaquariah.dev",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        {person.firstName} is a San Antonio based {person.role} who designs, develops, and maintains full-stack 
        fintech applications, leveraging front-end frameworks, custom testing tools, and AWS cloud architecture 
        while contributing to team leadership and community engagement.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "SWIVEL",
        timeframe: "Apr 2024 - Present",
        role: "Software Engineer",
        achievements: [
          <>Contributed to full-stack development of fintech applications, shipping 5+ major features that improved transaction processing efficiency and customer engagement.</>,
          <>Built reusable front-end components in React, improving development speed and consistency across multiple internal and client facing products.</>,
          <>Spearheaded community initiatives by organizing 3+ industry events, including hackathons and workshops, expanding SWIVEL’s developer outreach in San Antonio.</>,
          <>Championed and developed multiple new features for SWIVEL's flagship application, designed with a modular deployment strategy to enable a seamless final launch with a single activation switch.</>,
          <>Co-organized with the Engineering Director and SWIVEL Executive team to host SWIVEL's first engineering-wide hackathon with 40+ participants and 5 projects, leading to a larger event the following year.</>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          // {
          //   src: "/images/projects/project-01/cover-01.jpg",
          //   alt: "Once UI Project",
          //   width: 16,
          //   height: 9,
          // },
        ],
      },
      {
        company: "SWIVEL",
        timeframe: "Aug 2021 - Apr 2024",
        role: "Junior Software Engineer",
        achievements: [
          <>Implemented Google Analytics in the core application, enabling data-driven decisions for future feature development that impacts over 1 million monthly active users.</>,
          <>Developed and integrated ADA-compliant components to improve accessibility and ensure compliance with industry standards for hundreds of clients.</>,
          <>Contributed to the growth of our redesigned application by adding support for new clients and implementing new features to enhance functionality.</>,
          <>Assisted in a full application rebuild, modernizing the frontend by migrating to React.js for improved performance and maintainability.</>,
        ],
        images: [],
      },
      {
        company: "SWBC",
        timeframe: "May 2021 - Aug 2021",
        role: "Web Development Intern",
        achievements: [
          <>Audited web components for accessibility issues and recommended improvements, resulting in a more inclusive user experience.          </>,
          <>Enhanced application performance by optimizing cloud-based deployment pipelines and integrating containerization best practices.</>,
          <>Worked in an Agile environment, gaining hands-on experience with sprint cycles, Azure's ticket management, and continuous integration workflows.</>,
          <>Contributed to front-end features using HTML, CSS, and JavaScript, improving visual consistency and maintainability across client portals.</>,
          <>Created technical documentation for deployment and accessibility standards, supporting long-term team adoption.</>
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "The University of Texas at San Antonio 🟠🔵",
        description: <>Dec 22' - Bachelors of Computer Science with a concentration in Software Engineering</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical Skills",
    skills: [
      {
        title: "Programming Languages",
        description: <>JavaScript, TypeScript, Python, HTML/CSS</>,
      },
      {
        title: "Frameworks & Libraries",
        description: <>React, Next.js, Node.js, Express, Tailwind CSS</>,
      },
      {
        title: "Cloud & DevOps",
        description: <>AWS (Lambda, S3, EC2, CloudFormation, etc), Cloudflare, Docker, GitHub Actions, Vercel, Netlify</>,
      },
      {
        title: "Testing & Quality",
        description: <>Jest, Mocha, Cypress</>,
      },
      {
        title: "Tools & Collaboration",
        description: <>Git, Azure, GitHub, Atlassian Products, Figma, Postman, Slack, Notion</>,
      }
    ],
  },
  soft: {
    display: true, // set to false to hide this section
    title: "Soft Skills",
    skills: [
      {
        title: "Development Practices",
        description: <>Agile/Scrum methodology, code reviews, pair programming, CI/CD</>,
      },
      {
        title: "Communication & Leadership",
        description: <>Technical writing, workshop facilitation, mentoring, cross-functional collaboration</>
      },
      {
        title: "Learning & Growth",
        description: <>Self-driven learning, course creation, hackathon participation/organization</>
      },
    ]
  },
  involvement: {
    display: true,
    title: "Involvement",
    experiences: [
      {
        company: "ACM San Antonio",
        timeframe: "Apr 2023 - Present",
        role: "President",
        achievements: [
          <>Co-founded ACM San Antonio, establishing its mission to grow the local tech community through events, networking, and education.</>,
          <>Organize and host meetings ranging from 10 to 30 attendees, ensuring valuable discussions and knowledge sharing.</>,
          <>Designed and implemented a year-long strategic roadmap for two consecutive years, driving growth and scalability.</>,
          <>Leads weekly meetings with the board to align on monthly, quarterly and yearly goals.</>,
          <>Develop and execute strategic advertisement plans to increase community engagement and event attendance while launching a membership system to fund operations.</>,
        ],
        images: [],
      },
      {
        company: "DEV SA",
        timeframe: "Oct 2024 - Present",
        role: "Board Member",
        achievements: [
          <>Maintain and update the organization's event calendar, ensuring alignment with the San Antonio tech community.</>,
          <>Foster cross-organization collaboration by staying engaged with local tech events and initiatives.</>,
          <>Assist in moderating the DEV SA Discord community of 500+ members, ensuring an active, inclusive, and well-managed environment.</>,
        ],
        images: [],
      },
      {
        company: "CU Build",
        timeframe: "Dec 2024 - Present",
        role: "Committee Member",
        achievements: [
          <>Contributed to the strategic restructuring of the CU Build prospectus to better illustrate sponsorship opportunities and event expectations.</>,
          <>Provided insights as an experienced hackathon participant and organizer to enhance event planning and execution.</>,
        ],
        images: [],
      },
      {
        company: "UTSA RowdyHacks",
        timeframe: "Aug 2020 - Mar 2021",
        role: "Logistics Web Developer",
        achievements: [
          <>Worked as part of a team to design, develop, and launch a website for a hackathon.</>,
          <>Utilized HTML, CSS, and JavaScript to create a visually appealing and functional website to coordinate logistics for 300+ participants.</>,
          <>Received positive feedback from users and sponsors for choices on design and implementation of resources for the event.</>,
        ],
        images: [],
      },
    ]
  }
};

const blog = {
  label: "Blog",
  title: "Writing about design and tech...",
  menuIcon: "book",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  label: "Work",
  title: "My projects",
  menuIcon: "grid",
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  label: "Gallery",
  title: "My photo gallery",
  menuIcon: "gallery",
  description: `A photo collection by ${person.name}`,
  // Images from https://pexels.com
  images: [
    {
      src: "/images/gallery/img-01.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-02.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-03.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-04.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-05.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-06.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-07.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-08.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-09.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-10.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-11.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-12.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-13.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-14.jpg",
      alt: "image",
      orientation: "horizontal",
    },
  ],
};

const pageContent = {
  home,
  about,
  blog,
  work,
  gallery,
}

export { person, social, newsletter, home, about, blog, work, gallery, pageContent };
