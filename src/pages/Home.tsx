import { Layout, Text } from "@stellar/design-system";

const Home = () => {
  return (
    <Layout.Content>
      <Layout.Inset>
        <Text as="h1" size="xl">
          Holden
        </Text>

        <Text as="p" size="md">
          Hold What Matters
        </Text>

        <Text as="p" size="sm" style={{ marginTop: "1rem" }}>
          Regulated real-world asset issuance on Stellar.
        </Text>
      </Layout.Inset>
    </Layout.Content>
  );
};

export default Home;
