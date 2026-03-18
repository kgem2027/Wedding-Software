import React from 'react'
import venue1 from './images/venue1.jpg'
export default function AboutUs() {
  return (
    <div>
    <div className="ml-40 bg-[#92a5e8]/50 p-10 m-10 mt-20 rounded inline-block">
          <h2 className="info-title-text max-w-md ml-10 pb-5 text-center text-white-100 text-5xl">About Us</h2>        
          <p className = "max-w-lg ml-10 pb-5 text-center text-white-100 text-2xl info-text font-bold">
            We created our wedding planning platform with one simple goal in mind: to make the journey to your big day feel just as special as the day itself. Planning a wedding can be overwhelming, so we built a space where everything you need lives in one place—organized, intuitive, and designed with real couples in mind. From managing guest lists and timelines to tracking budgets and personal details, our platform helps turn big ideas into seamless plans. Whether you’re dreaming of something elegant and traditional or modern and unique, we’re here to support every step, so you can focus on what truly matters—celebrating your story.
        </p>
    </div>
        <img
        src={venue1}
        alt="venue"
        className="w-[400px] h-auto rounded-xl shadow-lg"
      />
    </div>
  )
}
