import HeroSection from "../components/home/HeroSection";
import {
  DescriptionSection,
  AboutSection,
  FeaturesSection,
} from "../components/home/Sections";

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <DescriptionSection />
      <AboutSection />
      <FeaturesSection />
    </>
  );
};

export default Home;
