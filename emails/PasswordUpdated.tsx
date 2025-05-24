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
  }
  
  export const PasswordUpdatedEmail= ({
    username,
  }: DropboxResetPasswordEmailProps) => {
    return (
      <Html>
        <Head />
        <Body style={main}>
          <Preview>Password updated</Preview>
          <Container style={container}>
            <Img
              src="https://res.cloudinary.com/dc8ipw43g/image/upload/fl_preserve_transparency/v1748109832/logo_mkfcgw.jpg?_s=public-apps"
              width="200"
              // height="150"
              alt="Exam Online"
              style={logo}
            />
            <Section>
              <Text style={text}>Hi {username},</Text>
              <Text style={text}>
                Someone recently updated your QuizByte account's password. If this was you,
                you can ignore this email. If not, please reset your password
                immediately.
              </Text>
              <Text style={text}>
                If you have any questions or need help, please visit our{" "}
                <Link style={anchor} href="">
                  Help Center
                </Link>
                .
              </Text>
              <Text style={text}>
                Thanks for using exan online.{" "}
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
  
  export default PasswordUpdatedEmail;
  
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
  
  const anchor = {
    textDecoration: "underline",
  };
  