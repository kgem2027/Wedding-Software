import React from 'react'
import AboutUs from './pageComponents/AboutUs'
import OurMission from './pageComponents/OurMission'
import WhyChooseUs from './pageComponents/WhyChooseUs'
import Offer from './pageComponents/Offer'

const Home = ({user, error}) => {
  return (
    <div>
      <h1>Welcome to TwoRings</h1>
      <AboutUs />
      <OurMission />
      <WhyChooseUs />
      <Offer />
    </div>
  )
}
export default Home
