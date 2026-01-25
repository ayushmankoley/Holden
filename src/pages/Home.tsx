import HeroSection from "../components/home/HeroSection";
import { DescriptionSection, AboutSection } from "../components/home/Sections";

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <DescriptionSection />
      <AboutSection />
    </>
  );
};

export default Home;
