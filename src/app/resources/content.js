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
    <>
      I occasionally write about design, technology, and share thoughts on the intersection of creativity and engineering.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/Zaqttack",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/zaquariah-holland/",
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
          <>Mentored onboarding developers and conducted internal training sessions, improving team efficiency and onboarding time by 25%.</>,
          <>Co-organized with the Engineering Director and SWIVEL Executive team to host SWIVEL's first engineering-wide hackathon with 40+ participants and 5 projects, leading to a larger event the next year.</>,
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
          <>Implemented Google Analytics in the core application, enabling data-driven decisions for future feature development.</>,
          <>Developed and integrated ADA-compliant components to improve accessibility and ensure compliance with industry standards.</>,
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
          <>Researched and implemented accessibility standards to better improve clients banking experiences.</>,
          <>Focused on cloud infrastructure to build out applications and improve performance.</>,
          <>Practiced agile methodology with scrum teams.</>,
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
  // TODO: add technical skills
  technical: {
    display: false, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Figma",
        description: <>Able to prototype in Figma with Once UI with unnatural speed.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Next.js",
        description: <>Building next gen apps with Next.js + Once UI + Supabase.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-04.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
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
          <>Launched a membership system to fund operations and provide members with exclusive ACM national resources.</>,
          <>Develop and execute strategic advertisement plans to increase community engagement and event attendance.</>,
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
          <>Support the founder, Jesse Hernandez, with administrative tasks, including paperwork and operational processes.</>,
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
