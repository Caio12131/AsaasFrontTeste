import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "../about/about";
import Services from "../services/services"
import Contact from "../contact/contact";
import Payment from "../payment/payment";
import Thanks from "../thanks/thanks";
import App from "../home/home";

const Root= () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/payment" element={<Payment/>} />
                <Route path="/thanks" element={<Thanks/>} />


            </Routes>
        </Router>
    );
};

export default Root;
