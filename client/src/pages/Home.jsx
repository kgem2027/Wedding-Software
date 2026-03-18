import React from 'react'
import Iridescence from '../components/ui/Iridescence'
import AboutUs from './pageComponents/AboutUs'
import OurMission from './pageComponents/OurMission'
import WhyChooseUs from './pageComponents/WhyChooseUs'
import Offer from './pageComponents/Offer'

const Home = ({user, error}) => {
  return (
    <div style={{ height: "100vh", overflowY: "scroll" }}>

      {/* Iridescence background — fixed behind everything */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none"
      }}>
        <Iridescence
          color={[0.5, 0.6, 0.8]}
          mouseReact
          amplitude={0.1}
          speed={1}
        />
      </div>

      {/* Content layer — scrolls normally on top of background */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <h1>Welcome {user ? user.name : 'Guest'} to TwoRings</h1>

        <AboutUs />
        <OurMission />
        <WhyChooseUs />
        <Offer />
      </div>
    </div>
  )
}

export default Home