import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";
import { NavBar } from "../Navigation";
import CookieConsent from "../Cookies";

// eslint-disable-next-line react/prop-types
function Layout({ children, auth }) {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);

  useEffect(() => {
    if (auth) {
      setLeftItems([
        { content: "Home", key: "home", to: "/" },
        { content: "Posts", key: "posts", to: "/posts" },
        { content: "Todos", key: "todos", to: "/todos" },
      ]);
      setRightItems([{ content: "Signout", key: "signout", to: "/signout" }]);
    } else {
      setLeftItems([{ content: "Home", key: "home", to: "/" }]);
      setRightItems([
        { content: "Signin", key: "signin", to: "/signin" },
        { content: "Signup", key: "signup", to: "/signup" },
      ]);
    }
  }, [auth]);
  return (
    <>
      <Container>
        <NavBar leftItems={leftItems} rightItems={rightItems}>
          <CookieConsent style={{ zIndex: "10" }} />
          {children}
        </NavBar>
      </Container>
    </>
  );
}

export default connect(({ auth }) => ({ auth: auth.authenticated }))(Layout);
