import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const Welcome = ({
  username,
  token,
}: {
  username: string;
  token: string;
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Verify your email address for {username}</Preview>
      <Container style={container}>
        <Img
          src={`https://img.freepik.com/free-vector/bird-colorful-gradient-design-vector_343694-2506.jpg`}
          width="200"
          height="150"
          alt="Exam Online"
          style={logo}
        />
        <Text style={paragraph}>Welcome {username},</Text>
        <Text style={paragraph}>
          Welcome to Exam Online, get started with your account by clicking the
          button below.
        </Text>
        <Section style={btnContainer}>
          <Button
            style={button}
            href={`${process.env.NEXT_BASE_URL}/verify-email?token=${token}`}
          >
            verify email
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The Exam Online Team
        </Text>
      </Container>
    </Body>
  </Html>
);

Welcome.PreviewProps = {
  username: "Abhishek",
} as { username: string };

export default Welcome;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
