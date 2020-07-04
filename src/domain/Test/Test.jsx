import React from "react";
import Head from "../../components/Head";
import { Container } from "./Test.style";
import { Layout } from "../Layout";
// import { NavBar } from "../Navigation";

// const items = [
//   { content: "Home", key: "home", to: "/" },
//   { content: "Posts", key: "posts", to: "/posts" },
//   { content: "Todos", key: "todos", to: "/todos" },
// ];

function Test() {
  return (
    <>
      <Head title="test" />
      <Layout>
        <Container>
          <h1>Test works again with fuck you too!</h1>
        </Container>
      </Layout>
    </>
  );
}

export default Test;
