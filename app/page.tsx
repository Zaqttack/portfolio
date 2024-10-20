'use client'

import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import Image from 'next/image'
import Link from 'next/link'
import { SectionSolid, SectionClear, RecommendationCard } from './components'
import { skills, projects, contacts } from './data'

export default function Portfolio() {
  const heroRef = useRef(null)
  const skillsRef = useRef(null)
  const [subtitle, setSubtitle] = useState('')
  const fullSubtitle = "Software Engineer at SWIVEL"
  const [scrollY, setScrollY] = useState(0)

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
        <SectionSolid ref={skillsRef} title="Skills">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {skills.map((skill) => (
                <div key={skill.name} className="skill-card bg-gray-700 bg-opacity-50 rounded-lg p-6 text-center shadow-lg hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="skill-icon flex justify-center mb-4 text-orange-400">{skill.icon}</div>
                  <p>{skill.name}</p>
              </div>
            ))}
          </div>
        </SectionSolid>

        {/* Projects Section */}
        <SectionClear title="Projects">
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
        </SectionClear>

        {/* Friends and Coworkers Section */}
        <SectionSolid title="Friends and Coworkers">
          <RecommendationCard />
        </SectionSolid>

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