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
  
  interface AdminInvitationMailProps {
    inviteLink: string;
    organizationName: string;
  }
  
  export const AdminInvitationMail = ({
    inviteLink,
    organizationName,
  }: AdminInvitationMailProps) => {
    return (
      <Html>
        <Head />
        <Preview>You’re invited to join {organizationName} as an Admin on QuizByte</Preview>
        <Body style={main}>
          <Container style={container}>
            <Img
              src="https://res.cloudinary.com/dc8ipw43g/image/upload/fl_preserve_transparency/v1748109832/logo_mkfcgw.jpg?_s=public-apps"
              width="200"
              // height="150"
              alt="QuizByte Logo"
              style={logo}
            />
            <Section>
              <Text style={text}>Hi There,</Text>
              <Text style={text}>
                You’ve been invited to become an <strong>Admin</strong> for the organization <strong>{organizationName}</strong> on <strong>QuizByte</strong>.
              </Text>
              <Text style={text}>
                As an Admin, you’ll be able to manage exam groups, organize tests, and help your students succeed.
              </Text>
              <Text style={text}>Click the button below to accept the invitation and complete your registration:</Text>
  
              <Button href={inviteLink} style={button}>
                Accept Invitation
              </Button>
  
              <Text style={text}>
                If you weren’t expecting this invitation, feel free to ignore this email.
              </Text>
  
              <Text style={text}>
                For any questions, reach out to our <Link style={anchor} href="#">Support Team</Link>.
              </Text>
  
              <Text style={text}>Happy Teaching!<br />— The QuizByte Team</Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  AdminInvitationMail.PreviewProps = {
    username: "Alan",
    inviteLink: "https://quizbyte.com/invite/abc123",
    organizationName: "Starlight Public School",
  } as AdminInvitationMailProps;
  
  export default AdminInvitationMail;
  
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
  