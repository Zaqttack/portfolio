'use client'

import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import { Github, Linkedin, Mail, Code, Server, Cloud, Database, Globe, ChevronLeft, ChevronRight } from 'lucide-react'
import { GitBranch } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Portfolio() {
  const heroRef = useRef(null)
  const skillsRef = useRef(null)
  const [subtitle, setSubtitle] = useState('')
  const fullSubtitle = "Software Engineer at SWIVEL"
  const [scrollY, setScrollY] = useState(0)
  const [currentRecommendation, setCurrentRecommendation] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)

    anime({
      targets: heroRef.current,
      opacity: [0, 1],
      translateY: [50, 0],
      easing: 'easeOutExpo',
      duration: 1500
    })

    anime({
      targets: '.hero-text',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100, { start: 300 }),
      easing: 'easeOutExpo',
      duration: 1000
    })

    anime({
      targets: '.skill-card',
      scale: [0.9, 1],
      opacity: [0, 1],
      delay: anime.stagger(100),
      easing: 'easeOutExpo',
      duration: 1000
    })

    anime({
      targets: '.skill-icon',
      rotateY: [0, 360],
      duration: 2000,
      delay: anime.stagger(200),
      easing: 'easeInOutSine',
      loop: true
    })

    anime({
      targets: '.skill-card',
      backgroundColor: ['#1F2937', '#374151'],
      duration: 2000,
      direction: 'alternate',
      easing: 'easeInOutQuad',
      loop: true
    })

    // Project image hover effects
    const projectImages = document.querySelectorAll('.project-image')
    projectImages.forEach((img) => {
      img.addEventListener('mouseenter', () => {
        anime({
          targets: img,
          scale: 1.05,
          brightness: 1.2,
          duration: 300,
          easing: 'easeOutQuad'
        })
      })
      img.addEventListener('mouseleave', () => {
        anime({
          targets: img,
          scale: 1,
          brightness: 1,
          duration: 300,
          easing: 'easeOutQuad'
        })
      })
    })

    let i = 0
    const typingInterval = setInterval(() => {
      setSubtitle(fullSubtitle.slice(0, i))
      i++
      if (i > fullSubtitle.length) {
        clearInterval(typingInterval)
      }
    }, 100)

    return () => {
      clearInterval(typingInterval)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const contacts = [
    { name: 'Github', icon: <Github className="w-6 h-6" />, link: 'https://github.com/Zaqttack' },
    { name: 'LinkedIn', icon: <Linkedin className="w-6 h-6" />, link: 'https://www.linkedin.com/in/zaquariah-holland/' },
    { name: 'Email', icon: <Mail className="w-6 h-6" />, link: 'mailto:zaquariah@gmail.com' },
  ]

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

  const nextRecommendation = () => {
    setCurrentRecommendation((prev) => (prev + 1) % recommendations.length)
  }

  const prevRecommendation = () => {
    setCurrentRecommendation((prev) => (prev - 1 + recommendations.length) % recommendations.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Stars */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `twinkle ${Math.random() * 10 + 10}s infinite`,
            }}
          ></div>
        ))}
      </div>

      {/* Hyper-beam */}
      <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
        <div className="absolute w-1 h-screen bg-gradient-to-b from-transparent via-pink-500 to-transparent opacity-50 blur-sm"
             style={{
               left: '20%',
               animation: 'moveBeam 8s infinite alternate',
               transform: `translateY(${scrollY * -0.2}px)`,
             }}>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-30">
        {/* Hero Section */}
        <section ref={heroRef} className="container mx-auto px-4 py-32 md:py-48 lg:py-64 xl:py-80 flex flex-col justify-center items-center text-center min-h-screen">
          <h1 className="hero-title hero-text text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-gradient">
            Zaquariah Holland
          </h1>
          <p className="hero-text text-2xl mb-8 h-8">{subtitle}</p>
          <div className="hero-text flex justify-center space-x-4">
            {contacts.map((contact) => (
              <a key={contact.name} href={contact.link} className="text-orange-400 hover:text-orange-300 transition-colors">{contact.icon}</a>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section ref={skillsRef} className="py-20 bg-gray-800 bg-opacity-50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {skills.map((skill) => (
                <div key={skill.name} className="skill-card bg-gray-700 bg-opacity-50 rounded-lg p-6 text-center shadow-lg hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="skill-icon flex justify-center mb-4 text-orange-400">{skill.icon}</div>
                  <p>{skill.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {projects.map((project, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-full max-w-md relative overflow-hidden rounded-lg shadow-lg group">
                    <Image 
                      src={project.image} 
                      width={400} 
                      height={300} 
                      alt={project.title} 
                      className="w-full h-auto transition-transform duration-300 project-image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link href="#" className="bg-white text-orange-600 px-4 py-2 rounded-full font-bold hover:bg-orange-100 transition-colors">
                        Learn More
                      </Link>
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mt-4">{project.title}</h3>
                  <p className="text-gray-400 mt-2">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Friends and Coworkers Section */}
        <section className="py-20 bg-gray-800 bg-opacity-50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Friends and Coworkers</h2>
            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentRecommendation * 50}%)` }}>
                  {recommendations.map((rec, index) => (
                    <div key={index} className="w-1/2 flex-shrink-0 px-4">
                      <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6 shadow-lg hover:shadow-orange-500/20 transition-all duration-300 h-64 flex flex-col justify-between">
                        <p className="mb-4 italic text-sm">&ldquo;{rec.text}&rdquo;</p>
                        <div>
                          <p className="font-semibold text-lg">{rec.name}</p>
                          <p className="text-sm text-gray-400 mb-2">{rec.position}</p>
                          <a href={rec.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center">
                
                            <Linkedin className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={prevRecommendation} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextRecommendation} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 bg-opacity-50 py-8 text-center">
          <div className="container mx-auto px-4">
            <div className="flex justify-center space-x-6 mb-4">
              {contacts.map((contact) => (
                <a key={contact.name} href={contact.link} className="text-orange-400 hover:text-orange-300 transition-colors">{contact.icon}</a>
              ))}
            </div>
            <p>&copy; 2024 Zaquariah Holland. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes moveBeam {
          0% { left: 10%; }
          100% { left: 90%; }
        }
        .hero-title {
          display: inline-block;
        }
        .hero-title .letter {
          display: inline-block;
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  )
}