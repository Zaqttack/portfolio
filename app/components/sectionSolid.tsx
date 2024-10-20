interface SectionSolidProps {
  ref?: React.RefObject<HTMLDivElement>;
  title: string;
  children: React.ReactNode;
}

const SectionSolid = ({ ref, title, children }: SectionSolidProps) => {
  return (
    <section ref={ref} className="py-20 bg-gray-800 bg-opacity-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">{title}</h2>
        {children}
      </div>
    </section>
  )
};

export default SectionSolid;
