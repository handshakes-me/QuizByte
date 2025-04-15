import { BASEURL } from "@/lib/utils";
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface DropboxResetPasswordEmailProps {
  username?: string;
  resetToken?: string;
}

export const DropboxResetPasswordEmail = ({
  username,
  resetToken,
}: DropboxResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Reset your password</Preview>
        <Container style={container}>
          <Img
            src={`https://img.freepik.com/free-vector/bird-colorful-gradient-design-vector_343694-2506.jpg`}
            width="200"
            height="150"
            alt="Exam Online"
            style={logo}
          />
          <Section>
            <Text style={text}>Hi {username},</Text>
            <Text style={text}>
              Someone recently requested a password change for your exam online
              account. If this was you, you can set a new password here:
            </Text>
            <Button
              style={button}
              href={`${BASEURL}/reset-password/${resetToken}`}
            >
              Reset password
            </Button>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email
              to anyone. See our Help Center for{" "}
              <Link style={anchor} href="">
                more security tips.
              </Link>
            </Text>
            <Text style={text}>Happy Learning!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

DropboxResetPasswordEmail.PreviewProps = {
  username: "Alan",
  resetToken: "https://dropbox.com",
} as DropboxResetPasswordEmailProps;

export default DropboxResetPasswordEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const logo = {
  margin: "0 auto",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

const anchor = {
  textDecoration: "underline",
};
