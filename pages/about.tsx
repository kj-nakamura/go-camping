import Box from "../components/box";
import Layout from "../components/layout";

const About: React.FC = () => {
  const title = "goCampingについて";
  return (
    <Layout headTitle={title} secondList={title}>
      <Box title={title}>
      </Box>
    </Layout>
  );
}

export default About;
