import React from 'react'
import Iridescence from '../components/ui/Iridescence'
import AboutUs from './pageComponents/AboutUs'
import OurMission from './pageComponents/OurMission'
import WhyChooseUs from './pageComponents/WhyChooseUs'
import Offer from './pageComponents/Offer'
import ourMissionPhoto from './pageComponents/images/ourMissionPhoto1.jpg'

const Home = ({user, error}) => {
  return (
    <div style={{ height: "100vh", overflowY: "scroll" }}>

      {/* Iridescence background*/}
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

      {/* Content layer */}
      <div style={{ position: "relative", zIndex: 10 }}>
         <h1 className="text-center text-5xl pt-24">Welcome {user ? user.name : 'Guest'} to TwoRings</h1>

        <AboutUs />
        <div className="flex justify-center mt-20 mx-10">
          <div className="bg-[#92a5e8]/50 p-10 rounded-3xl flex flex-row items-center gap-8 w-fit">
            <OurMission />
            <img
              src={ourMissionPhoto}
              alt="ourMissionPhoto"
              className="w-[400px] h-auto rounded-3xl shadow-lg flex-shrink-0"
            />
            <WhyChooseUs />
          </div>
        </div>
        <Offer />
        <p className="text-center mt-10">Two Rings©</p>
        <p className="text-center text-red-500 mt-10">{error}</p>
      </div>
    </div>
  )
}

export default Home