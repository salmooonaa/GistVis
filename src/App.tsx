import "./style/page.css";
import React, { useRef, useState } from "react";
import HomePage from "./userstudy/homePage";
import InteractivePage from "./userstudy/articlePage";
import PublicityPage from "./demo/Demo"; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button, Flex } from "antd";

const App = () => {
  return (
    <>
      <Flex>
        <Button href="/">Home</Button>
        <Button href="/publicity">Publicity Demo page</Button>
      </Flex>

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/publicity" element={<PublicityPage />} />
          <Route
            path="/interactive/:pageType/:pageId"
            element={<InteractivePage />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
