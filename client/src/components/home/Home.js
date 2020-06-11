import React from 'react';
import Swiper from "react-id-swiper";
import { Button } from "@material-ui/core"

const Home = (props) => {

  const handleClick = (route) => {
    props.history.push(route)
  }
  
  const params = {
    direction: 'vertical',
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 1500,
      disableOnInteraction: false
    },
    loop: true,
    containerClass: ".swiper-container",
    ContainerEl: "div",
    noSwiping: true,
  }
  
  return (
    <div className="home">
      <div className="big-text-container">
        <div className="big-text">pal up </div>
        <div className="swiper-container">
          <Swiper {...params}>
            <div className="swiper-slide">
              <div className="blue-text">by interest</div>
            </div>
            <div className="swiper-slide">
              <div className="red-text">randomly</div>
            </div>
            <div className="swiper-slide">
              <div className="green-text">worldwide</div>
            </div>
          </Swiper>
        </div>
      </div>
      <div className="home-bottom">
        <div className="app-title">chatterest</div>
        <div className="home-buttons">
          <Button onClick={() => handleClick("/login")} style={{
            color: "#4F4F4F",
            padding: "0.3rem 0.9rem",
            fontSize: "20px"
          }}>Log in</Button>
          <Button 
            onClick={() => handleClick("/register")}
            variant="contained" 
            style={{
              backgroundColor: "#4F4F4F",
              padding: "0.3rem 0.9rem", 
              color: "white",
              margin: "0 0 0 3rem",
              fontSize: "20px"
          }}>Register</Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
